import { FileHandle, open } from 'fs/promises';

export default async function isValidISO(isoPath: string) {
  const buf = Buffer.alloc(8);
  let isoFile: FileHandle | undefined;
  try {
    isoFile = await open(isoPath);
    await isoFile.read(buf, 0, 8, 0);
    await isoFile.close();
  } catch {
    if (isoFile) {
      isoFile.close();
    }
    return false;
  }

  const code = buf.readUInt32BE(0);
  const publisher = buf.readUint16BE(4);
  const version = buf.readUint8(7);
  // GALE01 version 1.02
  if (code === 0x47414c45 && publisher === 0x3031 && version === 2) {
    return true;
  }
  return false;
}
