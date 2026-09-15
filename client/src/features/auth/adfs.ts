// Replace this adapter with the real ADFS token acquisition flow.
export const adfsService = {
  getToken: (): Promise<string> => {
    return Promise.resolve('mock-adfs-token');
  },
};
