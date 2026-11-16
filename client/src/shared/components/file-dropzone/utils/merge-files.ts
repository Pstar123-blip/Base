import type { FileWithPath } from 'react-dropzone';

// react-dropzone gives each file its path inside the dropped or picked folder,
// so copies in different folders aren't taken for the same file.
const getPath = (file: File) =>
  (file as Partial<FileWithPath>).path ?? file.name;

const isSameFile = (a: File, b: File) =>
  getPath(a) === getPath(b) &&
  a.size === b.size &&
  a.lastModified === b.lastModified;

/** Appends `incoming` to `current`, skipping files that are already present. */
export const mergeFiles = (current: File[], incoming: File[]) => [
  ...current,
  ...incoming.filter(
    (file) => !current.some((existing) => isSameFile(existing, file)),
  ),
];
