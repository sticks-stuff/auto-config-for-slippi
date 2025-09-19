import { ChangeEvent, useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputBase,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { Restore, TextSnippet } from '@mui/icons-material';
import {
  Config,
  Frozen,
  Gameplay,
  Lag,
  Mods,
  UCF,
  Widescreen,
} from '../common/types';
import { DEFAULT_CONFIG } from '../common/constants';

export default function ConfigEl() {
  const [codePath, setCodePath] = useState('');
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);

  useEffect(() => {
    (async () => {
      const codePathPromise = window.electron.getCodePath();
      const configPromise = window.electron.getConfig();
      setCodePath(await codePathPromise);
      setConfig(await configPromise);
    })();
  }, []);

  return (
    <>
      <Collapse in={config.cheats}>
        <Stack direction="row">
          <InputBase
            disabled
            size="small"
            value={codePath || 'Default code file: 90/10 Sounds/Music'}
            style={{ flexGrow: 1 }}
          />
          {codePath && (
            <Tooltip arrow title="Reset to default code file">
              <IconButton
                onClick={async () => {
                  setCodePath(await window.electron.resetCodePath());
                }}
              >
                <Restore />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title="Set code file">
            <IconButton
              onClick={async () => {
                setCodePath(await window.electron.chooseCodePath());
              }}
            >
              <TextSnippet />
            </IconButton>
          </Tooltip>
        </Stack>
      </Collapse>
      <Paper elevation={2} style={{ margin: '0 -8px', padding: '0 8px 8px' }}>
        <Stack direction="row" gap="8px">
          <List
            disablePadding
            style={{ width: '244px', display: 'flex', flexDirection: 'column' }}
          >
            <ListItem disablePadding>
              <FormControlLabel
                label="Enable FTP Upload"
                labelPlacement="start"
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '40px',
                  margin: 0,
                  width: '100%',
                }}
                control={
                  <Switch
                    size="small"
                    checked={!!config.ftp_enabled}
                    onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                      const newConfig: Config = {
                        ...config,
                        ftp_enabled: ev.target.checked,
                      };
                      await window.electron.setConfig(newConfig);
                      setConfig(newConfig);
                    }}
                  />
                }
              />
            </ListItem>
            {config.ftp_enabled ? (
              <>  
                <ListItem disablePadding>
                  <FormControl style={{ width: '100%' }}>
                    <Typography>FTP Server</Typography>
                    <InputBase
                      size="small"
                      value={config.ftp_server || ''}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          ftp_server: ev.target.value,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                      placeholder="hostname or IP"
                      fullWidth
                    />
                  </FormControl>
                </ListItem>
                <ListItem disablePadding>
                  <FormControl style={{ width: '100%' }}>
                    <Typography>FTP Port</Typography>
                    <InputBase
                      size="small"
                      type="number"
                      value={config.ftp_port || 21}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          ftp_port: Number(ev.target.value),
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                      placeholder="21"
                      fullWidth
                    />
                  </FormControl>
                </ListItem>
                <ListItem disablePadding>
                  <FormControl style={{ width: '100%' }}>
                    <Typography>FTP Username</Typography>
                    <InputBase
                      size="small"
                      value={config.ftp_username || ''}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          ftp_username: ev.target.value,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                      placeholder="username"
                      fullWidth
                    />
                  </FormControl>
                </ListItem>
                <ListItem disablePadding>
                  <FormControl style={{ width: '100%' }}>
                    <Typography>FTP Password</Typography>
                    <InputBase
                      size="small"
                      type="password"
                      value={config.ftp_password || ''}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          ftp_password: ev.target.value,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                      placeholder="password"
                      fullWidth
                    />
                  </FormControl>
                </ListItem>
                <ListItem disablePadding>
                  <FormControl style={{ width: '100%' }}>
                    <Typography>FTP Directory</Typography>
                    <InputBase
                      size="small"
                      value={config.ftp_directory || ''}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          ftp_directory: ev.target.value,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                      placeholder="/uploads"
                      fullWidth
                    />
                  </FormControl>
                </ListItem>
              </>
            ) : null}
            <ListItem disablePadding>
              <FormControlLabel
                label="Replays"
                labelPlacement="start"
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '40px',
                  margin: 0,
                  width: '100%',
                }}
                control={
                  <Switch
                    size="small"
                    checked={config.replays}
                    onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                      const newConfig: Config = {
                        ...config,
                        replays: ev.target.checked,
                      };
                      await window.electron.setConfig(newConfig);
                      setConfig(newConfig);
                    }}
                  />
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="ucf-label">UCF</Typography>
                <Select
                  size="small"
                  aria-labelledby="ucf-label"
                  margin="dense"
                  value={config.ucf}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      ucf: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={UCF.OFF}>Off</MenuItem>
                  <MenuItem value={UCF.UCF80}>UCF 0.8</MenuItem>
                  <MenuItem value={UCF.STEALTH80}>Stealth 0.8</MenuItem>
                  <MenuItem value={UCF.UCF84}>UCF 0.84</MenuItem>
                  <MenuItem value={UCF.STEALTH84}>Stealth 0.84</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControlLabel
                label="PAL Patch"
                labelPlacement="start"
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '40px',
                  margin: 0,
                  width: '100%',
                }}
                control={
                  <Switch
                    size="small"
                    checked={config.pal}
                    onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                      const newConfig: Config = {
                        ...config,
                        pal: ev.target.checked,
                      };
                      await window.electron.setConfig(newConfig);
                      setConfig(newConfig);
                    }}
                  />
                }
              />
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="mods-label">Mods</Typography>
                <Select
                  size="small"
                  aria-labelledby="mods-label"
                  margin="dense"
                  value={config.mods}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      mods: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={Mods.OFF}>Off</MenuItem>
                  <MenuItem value={Mods.STEALTH}>Stealth</MenuItem>
                  <MenuItem value={Mods.TOURNAMENT}>Tournament</MenuItem>
                  <MenuItem value={Mods.FRIENDLIES}>Friendlies</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="mods-label">Lag</Typography>
                <Select
                  size="small"
                  aria-labelledby="mods-label"
                  margin="dense"
                  value={config.lag}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      lag: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={Lag.OFF}>Off</MenuItem>
                  <MenuItem value={Lag.PDF}>PDF</MenuItem>
                  <MenuItem value={Lag.PDFHALF}>PDF + 1/2F</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="mods-label">Frozen</Typography>
                <Select
                  size="small"
                  aria-labelledby="mods-label"
                  margin="dense"
                  value={config.frozen}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      frozen: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={Frozen.OFF}>Off</MenuItem>
                  <MenuItem value={Frozen.STADIUM}>Stadium</MenuItem>
                  <MenuItem value={Frozen.ALL}>All</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="mods-label">Gameplay</Typography>
                <Select
                  size="small"
                  aria-labelledby="mods-label"
                  margin="dense"
                  value={config.gameplay}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      gameplay: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={Gameplay.OFF}>Off</MenuItem>
                  <MenuItem value={Gameplay.LGL}>LGL</MenuItem>
                  <MenuItem value={Gameplay.WOBBLING}>Wobbling</MenuItem>
                  <MenuItem value={Gameplay.BOTH}>Both</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControl
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography id="mods-label">Screen</Typography>
                <Select
                  size="small"
                  aria-labelledby="mods-label"
                  margin="dense"
                  value={config.widescreen}
                  onChange={async (ev) => {
                    const newConfig: Config = {
                      ...config,
                      widescreen: ev.target.value,
                    };
                    await window.electron.setConfig(newConfig);
                    setConfig(newConfig);
                  }}
                >
                  <MenuItem value={Widescreen.OFF}>Default</MenuItem>
                  <MenuItem value={Widescreen.WIDE_TO_NARROW}>
                    16:9 ➔ 73:60
                  </MenuItem>
                  <MenuItem value={Widescreen.WIDE}>Widescreen</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <ListItem disablePadding>
              <FormControlLabel
                label="Safety"
                labelPlacement="start"
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  height: '40px',
                  margin: 0,
                  width: '100%',
                }}
                control={
                  <Switch
                    size="small"
                    checked={config.safety}
                    onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                      const newConfig: Config = {
                        ...config,
                        safety: ev.target.checked,
                      };
                      await window.electron.setConfig(newConfig);
                      setConfig(newConfig);
                    }}
                  />
                }
              />
            </ListItem>
          </List>
          <Stack justifyContent="space-between">
            <List
              disablePadding
              style={{
                width: '244px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <ListItem disablePadding>
                <FormControlLabel
                  label="Cheats"
                  labelPlacement="start"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '40px',
                    margin: 0,
                    width: '100%',
                  }}
                  control={
                    <Switch
                      size="small"
                      checked={config.cheats}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          cheats: ev.target.checked,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                    />
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <FormControlLabel
                  label="Force Progressive"
                  labelPlacement="start"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '40px',
                    margin: 0,
                    width: '100%',
                  }}
                  control={
                    <Switch
                      size="small"
                      checked={config.forceProgressive}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          forceProgressive: ev.target.checked,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                    />
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <FormControlLabel
                  label="Auto Boot"
                  labelPlacement="start"
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '40px',
                    margin: 0,
                    width: '100%',
                  }}
                  control={
                    <Switch
                      size="small"
                      checked={config.autoBoot}
                      onChange={async (ev: ChangeEvent<HTMLInputElement>) => {
                        const newConfig: Config = {
                          ...config,
                          autoBoot: ev.target.checked,
                        };
                        await window.electron.setConfig(newConfig);
                        setConfig(newConfig);
                      }}
                    />
                  }
                />
              </ListItem>
            </List>
            <Stack direction="row" justifyContent="end" width="100%">
              <Button
                color="error"
                variant="contained"
                onClick={async () => {
                  await window.electron.setConfig(DEFAULT_CONFIG);
                  setConfig(DEFAULT_CONFIG);
                }}
              >
                Reset to default
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
