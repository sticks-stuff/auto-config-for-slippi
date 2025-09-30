import { Config, Frozen, Gameplay, Lag, Mods, UCF, Widescreen } from './types';

// eslint-disable-next-line import/prefer-default-export
export const DEFAULT_CONFIG: Config = {
  cheats: false,
  forceProgressive: false,
  autoBoot: true,
  replays: true,
  networking: false,
  ucf: UCF.STEALTH84,
  pal: false,
  mods: Mods.STEALTH,
  lag: Lag.PDF,
  frozen: Frozen.OFF,
  gameplay: Gameplay.OFF,
  widescreen: Widescreen.OFF,
  safety: true,

  // FTP upload settings
  ftp_enabled: false,
  ftp_server: '',
  ftp_port: 21,
  ftp_username: '',
  ftp_password: '',
  ftp_directory: '',
};
