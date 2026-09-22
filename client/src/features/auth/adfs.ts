// Replace this adapter with the real ADFS token acquisition flow.
const getToken = (): Promise<string> => Promise.resolve('mock-adfs-token');

export const adfsService = { getToken };
