export const vibrate = (pattern = 50) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors if API is restricted by browser
    }
  }
};

export const hapticLight = () => vibrate(40);
export const hapticMedium = () => vibrate(80);
export const hapticSuccess = () => vibrate([40, 60, 40]);
