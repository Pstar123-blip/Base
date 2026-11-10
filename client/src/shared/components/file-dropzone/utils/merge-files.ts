const isSameFile = (a: File, b: File) =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

/** Appends `incoming` to `current`, skipping files that are already present. */
export const mergeFiles = (current: File[], incoming: File[]) => [
  ...current,
  ...incoming.filter(
    (file) => !current.some((existing) => isSameFile(existing, file)),
  ),
];
