import { useEffect, useRef, useState } from 'react';
import { List, X, SlidersHorizontal } from '@phosphor-icons/react';
import { ui } from '../content/ui.js';
import { homePath, translatedPath } from '../content/routes.js';
import { usePreferences } from './Preferences.jsx';

export function Header({ route }) {
  const t = ui[route.locale];
  const home = homePath(route.locale);
  const menu = useRef(null), settings = useRef(null);
  const [open, setOpen] = useState(null);
  const [active, setActive] = useState('');
  const { theme, setTheme, motion, setMotion } = usePreferences();
  const trigger = useRef(null);
  const close = () => { menu.current?.close(); settings.current?.close(); setOpen(null); };

  useEffect(() => {
    const dialog = open === 'menu' ? menu.current : open === 'settings' ? settings.current : null;
    if (!dialog) return;
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previous;
      trigger.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (route.kind !== 'home' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const entry = entries.find(item => item.isIntersecting);
      if (entry) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [route.kind]);

  const openDialog = (event, type) => { trigger.current = event.currentTarget; setOpen(type); };
  const links = ['about', 'work', 'contact'].map(id => <a key={id} href={`${home}#${id}`} aria-current={active === id ? 'location' : undefined} onClick={close}>{t[id]}</a>);
  const languageClick = (event) => { if (route.kind === 'home' && window.location.hash) event.currentTarget.href = translatedPath(route) + window.location.hash; };

  return <>
    <a className="skip-link" href="#main">{t.skip}</a>
    <header className="site-header">
      <div className="header-inner container">
        <a className="wordmark" href={home} aria-label={route.locale === 'zh' ? 'Patrick Pan，首页' : 'Patrick Pan, home'}>Patrick Pan</a>
        <nav className="desktop-nav" aria-label={t.navigation}>{links}</nav>
        <div className="header-controls">
          <a className="language-link" href={translatedPath(route)} hrefLang={route.locale === 'en' ? 'zh-Hans' : 'en'} lang={route.locale === 'en' ? 'zh-Hans' : 'en'} onClick={languageClick}>{route.locale === 'en' ? '简体中文' : 'English'}</a>
          <button className="icon-button settings-toggle js-only" aria-label={t.settings} aria-haspopup="dialog" aria-expanded={open === 'settings'} onClick={event => openDialog(event, 'settings')}><SlidersHorizontal size={22} weight="regular" /></button>
          <details className="fallback-menu"><summary className="icon-button" aria-label={t.menu}><List size={25} /></summary><nav aria-label={t.navigation}>{links}<a href={`${home}#projects`}>{t.viewProjects}</a></nav></details>
          <button className="icon-button mobile-menu-button js-only" aria-label={t.menu} aria-haspopup="dialog" aria-expanded={open === 'menu'} onClick={event => openDialog(event, 'menu')}><List size={25} weight="regular" /></button>
        </div>
      </div>
    </header>
    <dialog className="menu-dialog" ref={menu} aria-label={t.navigation} onCancel={close} onClose={() => setOpen(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog-content">
        <div className="dialog-heading"><span>{t.menu}</span><button className="icon-button" aria-label={t.close} onClick={close}><X size={25} /></button></div>
        <nav className="mobile-nav" aria-label={t.navigation}>{links}<a href={`${home}#projects`} onClick={close}>{t.viewProjects}</a></nav>
      </div>
    </dialog>
    <dialog className="settings-dialog" ref={settings} aria-labelledby="settings-title" onCancel={close} onClose={() => setOpen(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="dialog-content">
        <div className="dialog-heading"><h2 id="settings-title">{t.settings}</h2><button className="icon-button" aria-label={t.close} onClick={close}><X size={24} /></button></div>
        <div className="setting-field"><label htmlFor="theme-select">{t.theme}</label><select id="theme-select" value={theme} onChange={e => setTheme(e.target.value)}><option value="system">{t.system}</option><option value="light">{t.light}</option><option value="dark">{t.dark}</option></select></div>
        <div className="setting-field"><label htmlFor="motion-select">{t.motion}</label><select id="motion-select" value={motion} onChange={e => setMotion(e.target.value)}><option value="system">{t.system}</option><option value="reduce">{t.reduce}</option></select></div>
      </div>
    </dialog>
  </>;
}
