import { createContext, useContext, useEffect, useState } from 'react';

const Preferences = createContext({ theme: 'system', motion: 'system' });
const read = (key, allowed) => {
  try { const value = localStorage.getItem(key); return allowed.includes(value) ? value : 'system'; }
  catch { return 'system'; }
};

export function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState('system');
  const [motion, setMotion] = useState('system');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setTheme(read('patrick-theme', ['system', 'light', 'dark']));
    setMotion(read('patrick-motion', ['system', 'reduce']));
    setReady(true);
    document.documentElement.dataset.enhanced = 'true';
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.motion = motion;
    try { localStorage.setItem('patrick-theme', theme); localStorage.setItem('patrick-motion', motion); } catch { /* Session preferences still work. */ }
  }, [theme, motion, ready]);
  return <Preferences.Provider value={{ theme, setTheme, motion, setMotion, ready }}>{children}</Preferences.Provider>;
}

export const usePreferences = () => useContext(Preferences);
