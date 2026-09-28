const ADMIN_SESSION_KEY = 'all_in_one_admin_session_active';
const ADMIN_CUSTOM_PIN_KEY = 'all_in_one_admin_custom_pin';

// Default PINs for All In One Academy Jorhat Staff
const DEFAULT_PINS = ['9365', '9954', '2026', 'allinone', 'admin123'];

export const isAdminAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (status: boolean) => {
  try {
    if (status) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error('Session storage error:', e);
  }
};

export const verifyAdminPin = (enteredPin: string): boolean => {
  const cleanPin = enteredPin.trim().toLowerCase();
  
  // Check custom saved PIN if set
  const savedPin = localStorage.getItem(ADMIN_CUSTOM_PIN_KEY);
  if (savedPin && cleanPin === savedPin.toLowerCase()) {
    setAdminAuthenticated(true);
    return true;
  }

  // Check default accepted PINs
  if (DEFAULT_PINS.includes(cleanPin)) {
    setAdminAuthenticated(true);
    return true;
  }

  return false;
};

export const changeAdminPin = (newPin: string) => {
  if (newPin.trim().length >= 4) {
    localStorage.setItem(ADMIN_CUSTOM_PIN_KEY, newPin.trim());
    return true;
  }
  return false;
};

export const lockAdmin = () => {
  setAdminAuthenticated(false);
};
