import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
} from 'electron';
import Store from 'electron-store';
import getSdCards, { writeNincfg } from './sd';
import isValidISO from './iso';
import eject from './eject';
import { Config, SdCard } from '../common/types';
import { DEFAULT_CONFIG } from '../common/constants';
import path from 'path';
import { createReadStream, createWriteStream, WriteStream } from 'fs';
import { copyFile, mkdir, readFile, stat } from 'fs/promises';
import { XMLParser } from 'fast-xml-parser';

const highWaterMark = 1024 * 1024;
const slippiNintendontRootPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets', 'slippiNintendont')
  : path.join(__dirname, '..', '..', 'assets', 'slippiNintendont');

export default function setupIPC(mainWindow: BrowserWindow) {
  const store = new Store<{
    config: Config;
    isoPath: string;
  }>();

  let isoPath = store.get('isoPath', '');
  ipcMain.removeAllListeners('getIsoPath');
  ipcMain.handle('getIsoPath', () => isoPath);
  ipcMain.removeAllListeners('chooseIsoPath');
  ipcMain.handle('chooseIsoPath', async () => {
    const openDialogRes = await dialog.showOpenDialog({
      filters: [
        {
          name: 'Melee ISO',
          extensions: ['iso'],
        },
      ],
      properties: ['openFile', 'showHiddenFiles'],
    });
    if (openDialogRes.canceled) {
      return isoPath;
    }
    const [newIsoPath] = openDialogRes.filePaths;
    if (!(await isValidISO(newIsoPath))) {
      throw new Error('ISO game code not GALE01, GALJ01, or GALP01');
    }
    store.set('isoPath', newIsoPath);
    isoPath = newIsoPath;
    return isoPath;
  });

  let config = store.get('config', DEFAULT_CONFIG);
  ipcMain.removeAllListeners('getConfig');
  ipcMain.handle('getConfig', () => config);
  ipcMain.removeAllListeners('setConfig');
  ipcMain.handle(
    'setConfig',
    (event: IpcMainInvokeEvent, newConfig: Config) => {
      config = newConfig;
      store.set('config', config);
    },
  );

  ipcMain.removeAllListeners('getSdCards');
  ipcMain.handle('getSdCards', getSdCards);

  let slippiNintendontVersion = '';
  ipcMain.removeAllListeners('getSlippiNintendontVersion');
  ipcMain.handle('getSlippiNintendontVersion', async () => {
    if (slippiNintendontVersion) {
      return slippiNintendontVersion;
    }

    const metaXmlBuffer = await readFile(
      path.join(slippiNintendontRootPath, 'meta.xml'),
    );
    const metaObj = new XMLParser().parse(metaXmlBuffer);
    if (metaObj?.app?.name !== 'Slippi Nintendont') {
      throw new Error('bundled meta.xml app name');
    }

    const version = metaObj.app.version;
    if (typeof version !== 'string') {
      throw new Error('bundled meta.xml app version');
    }

    slippiNintendontVersion = version;
    return version;
  });

  const keyToProgress = new Map<
    string,
    { size: number; writeStream: WriteStream }
  >();
  ipcMain.removeAllListeners('copyIso');
  ipcMain.handle(
    'copyIso',
    async (event: IpcMainInvokeEvent, sdCard: SdCard) => {
      if (!isoPath) {
        throw new Error('Set Melee ISO path...');
      }

      const { size } = await stat(isoPath);
      const readStream = createReadStream(isoPath, { highWaterMark });
      await mkdir(path.join(sdCard.key, 'games'), { recursive: true });
      const writeStream = createWriteStream(
        path.join(sdCard.key, 'games', 'melee102.iso'),
        { highWaterMark },
      );
      keyToProgress.set(sdCard.key, { size, writeStream });

      return new Promise<void>((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('close', resolve);
        readStream.pipe(writeStream);
      });
    },
  );
  const interval = setInterval(() => {
    const progresses: { key: string; percent: number }[] = [];
    Array.from(keyToProgress.keys()).forEach((key) => {
      const progress = keyToProgress.get(key)!;
      if (progress.writeStream.bytesWritten === progress.size) {
        keyToProgress.delete(key);
      } else {
        progresses.push({
          key,
          percent: progress.writeStream.bytesWritten / progress.size,
        });
      }
    });
    mainWindow.webContents.send('progress', progresses);
  }, 1000);
  app.on('will-quit', () => {
    clearInterval(interval);
  });

  ipcMain.removeAllListeners('copySlippiNintendont');
  ipcMain.handle(
    'copySlippiNintendont',
    async (event: IpcMainInvokeEvent, sdCard: SdCard) => {
      const appsPath = path.join(sdCard.key, 'apps', 'Slippi Nintendont');
      await mkdir(appsPath, { recursive: true });
      await Promise.all([
        copyFile(
          path.join(slippiNintendontRootPath, 'boot.dol'),
          path.join(appsPath, 'boot.dol'),
        ),
        copyFile(
          path.join(slippiNintendontRootPath, 'icon.png'),
          path.join(appsPath, 'icon.png'),
        ),
        copyFile(
          path.join(slippiNintendontRootPath, 'meta.xml'),
          path.join(appsPath, 'meta.xml'),
        ),
      ]);
    },
  );

  ipcMain.removeAllListeners('writeConfig');
  ipcMain.handle(
    'writeConfig',
    async (event: IpcMainInvokeEvent, sdCard: SdCard) => {
      await writeNincfg(sdCard, config);
    },
  );

  ipcMain.removeAllListeners('ejectSdCard');
  ipcMain.handle('ejectSdCard', (event: IpcMainInvokeEvent, key: string) =>
    eject(key),
  );
}
