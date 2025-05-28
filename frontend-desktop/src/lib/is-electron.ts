export const isElectron = (): boolean => {
    return (
      typeof window !== 'undefined' &&
      window.navigator.userAgent.toLowerCase().includes('electron')
    );
  };
  