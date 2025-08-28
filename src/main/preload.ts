import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Config, SdCard } from '../common/types';

const electronHandler = {
  getIsoPath: (): Promise<string> => ipcRenderer.invoke('getIsoPath'),
  chooseIsoPath: (): Promise<string> => ipcRenderer.invoke('chooseIsoPath'),
  getConfig: (): Promise<Config> => ipcRenderer.invoke('getConfig'),
  setConfig: (config: Config): Promise<void> =>
    ipcRenderer.invoke('setConfig', config),
  getSdCards: (): Promise<SdCard[]> => ipcRenderer.invoke('getSdCards'),
  getSlippiNintendontVersion: (): Promise<string> =>
    ipcRenderer.invoke('getSlippiNintendontVersion'),
  copyIso: (sdCard: SdCard): Promise<void> =>
    ipcRenderer.invoke('copyIso', sdCard),
  copySlippiNintendont: (sdCard: SdCard): Promise<void> =>
    ipcRenderer.invoke('copySlippiNintendont', sdCard),
  writeConfig: (sdCard: SdCard): Promise<void> =>
    ipcRenderer.invoke('writeConfig', sdCard),
  ejectSdCard: (key: string): Promise<void> =>
    ipcRenderer.invoke('ejectSdCard', key),
  onProgress: (
    callback: (
      event: IpcRendererEvent,
      progress: { key: string; percent: number }[],
    ) => void,
  ) => {
    ipcRenderer.removeAllListeners('progress');
    ipcRenderer.on('progress', callback);
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;
