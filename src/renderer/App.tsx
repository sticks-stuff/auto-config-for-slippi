import { Album } from '@mui/icons-material';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  Stack,
  Tooltip,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import SdCards from './SdCards';
import ConfigEl from './Config';
import Version from './Version';

export default function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const openErrorMessage = useCallback((message: string) => {
    setErrorMessage(message);
    setErrorOpen(true);
  }, []);

  const [isoPath, setIsoPath] = useState('');

  useEffect(() => {
    (async () => {
      const isoPathPromise = window.electron.getIsoPath();
      setIsoPath(await isoPathPromise);
    })();
  }, []);

  return (
    <>
      <Stack direction="row">
        <InputBase
          disabled
          size="small"
          value={isoPath || 'Set Melee ISO path...'}
          style={{ flexGrow: 1 }}
        />
        <Tooltip arrow title="Set Melee ISO path">
          <IconButton
            onClick={async () => {
              try {
                setIsoPath(await window.electron.chooseIsoPath());
              } catch (e: unknown) {
                openErrorMessage(
                  e instanceof Error ? e.message : JSON.stringify(e ?? ''),
                );
              }
            }}
          >
            <Album />
          </IconButton>
        </Tooltip>
      </Stack>
      <ConfigEl />
      <SdCards openErrorMessage={openErrorMessage} />
      <Version />
      <Dialog
        open={errorOpen}
        onClose={() => {
          setErrorOpen(false);
        }}
      >
        <DialogTitle>Error!</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
