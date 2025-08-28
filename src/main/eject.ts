import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { app } from 'electron';

export default async function eject(key: string) {
  if (process.platform === 'darwin') {
    return new Promise<void>((resolve, reject) => {
      execFile('/usr/sbin/diskutil', ['eject', 'force', key], {}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  if (process.platform === 'linux') {
    return new Promise<void>((resolve, reject) => {
      execFile('eject', ['-F', key], {}, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  if (process.platform === 'win32') {
    return new Promise<void>((resolve, reject) => {
      execFile(
        app.isPackaged
          ? path.join(process.resourcesPath, 'assets', 'EjectMedia.exe')
          : path.join(__dirname, '..', '..', 'assets', 'EjectMedia.exe'),
        [key, '-f'],
        {},
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        },
      );
    });
  }
  return Promise.reject(new Error(`unsupported platform: ${process.platform}`));
}
