import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Copy, Check } from '@phosphor-icons/react';
import { profile, methods, experiences, independentProjects } from '../content/profile.js';
import { projects } from '../content/projects.js';
import { homePath, projectPath, resumePath } from '../content/routes.js';
import { ui } from '../content/ui.js';
import { Photo } from './Media.jsx';

// Foreground dust inside the hero, pushed against the camera at a different rate
// from the rest of the depth layers.
const DUST = [
  { x: '6%', y: '22%', s: 6, p: 24 }, { x: '18%', y: '68%', s: 4, p: 30 }, { x: '27%', y: '14%', s: 3, p: 18 },
  { x: '38%', y: '82%', s: 5, p: 34 }, { x: '46%', y: '34%', s: 3, p: 20 }, { x: '55%', y: '74%', s: 4, p: 28 },
  { x: '63%', y: '18%', s: 7, p: 36 }, { x: '71%', y: '58%', s: 3, p: 22 }, { x: '80%', y: '30%', s: 5, p: 32 },
  { x: '88%', y: '70%', s: 4, p: 26 }, { x: '94%', y: '44%', s: 3, p: 18 }, { x: '14%', y: '46%', s: 3, p: 16 },
];

export function ActionLink({ href, children, secondary = false, className = '', ...props }) {
  return <a className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} href={href} {...props}>{children}<ArrowUpRight size={20} aria-hidden="true" /></a>;
}

export function Hero({ locale }) {
  const t = ui[locale], name = t.heroName;
  return <section id="intro" className="stage stage-hero" aria-labelledby="hero-title">
    <div className="stage-camera" aria-hidden="true">
      <div className="stage-world">
        <div className="depth depth-room" />
        <div className="depth depth-floor" />
        <div className="depth depth-rig" />
        <div className="depth depth-spot"><i className="spot spot-c" /><i className="spot spot-a" /><i className="spot spot-b" /></div>
        <div className="depth depth-dust">{DUST.map(dot => <i key={`${dot.x}-${dot.y}`} style={{ '--x': dot.x, '--y': dot.y, '--s': `${dot.s}px`, '--p': dot.p }} />)}</div>
      </div>
      <div className="depth-glow" />
    </div>
    <div className="hero-inner container">
      <div className="hero-copy">
        <p className="eyebrow"><span className="rec" />{profile.title[locale]}</p>
        <h1 id="hero-title">{name.map((line, index) => <span className="hero-line" key={line}>{line}{index < name.length - 1 && <br />}</span>)}</h1>
        <p className="hero-intro">{profile.intro[locale]}</p>
        <p className="hero-meta">{t.heroMeta.map(item => <span key={item}>{item}</span>)}</p>
        <div className="actions"><ActionLink href="#projects">{t.viewProjects}</ActionLink><ActionLink href={resumePath(locale)} secondary>{t.viewResume}</ActionLink></div>
      </div>
      <div className="hero-portrait" data-focus style={{ '--fd': '260ms' }}>
        <Photo name="desk" locale={locale} priority motionKind="hero" alt={locale === 'zh' ? 'Patrick Pan 坐在桌前工作' : 'Patrick Pan working at a desk'} />
        <p className="portrait-label"><span>01</span>{locale === 'zh' ? '桌前' : 'At the desk'}</p>
      </div>
    </div>
    <p className="hero-scroll" aria-hidden="true">{t.heroScroll}<i /></p>
  </section>;
}

export function SelectedProjects({ locale }) {
  const t = ui[locale], [porsche, huawei, tencent] = projects;
  return <section className="section container" id="projects" aria-labelledby="projects-title">
    <div className="section-heading-row" data-focus data-depth="60"><h2 id="projects-title">{t.projects}</h2><p>{t.projectsIntro}</p></div>
    <div className="deck">
      <article className="deck-card deck-major" data-focus data-depth="80" style={{ '--dz': -170 }}>
        <div className="deck-body">
          <div>
            <p className="project-category">{porsche[locale].category}</p>
            <h3><a href={projectPath(locale, porsche.id)}>{porsche[locale].title}</a></h3>
            <p>{porsche[locale].summary}</p>
            <p className="project-role">{porsche[locale].role} · {porsche.dates}</p>
            <a className="text-link" href={projectPath(locale, porsche.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a>
          </div>
          <div className="porsche-name" aria-hidden="true"><span>Porsche</span><strong>992</strong></div>
        </div>
      </article>
      <article className="deck-card deck-wide" data-focus data-depth="150" style={{ '--dz': -320, '--fd': '120ms' }}>
        <div>
          <p className="project-category">{huawei[locale].category}</p>
          <h3><a href={projectPath(locale, huawei.id)}>{huawei[locale].title}</a></h3>
        </div>
        <div>
          <p>{huawei[locale].summary}</p>
          <p className="project-role">{huawei[locale].role}</p>
          <a className="text-link" href={projectPath(locale, huawei.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a>
        </div>
      </article>
      <article className="deck-card deck-slim" data-focus data-depth="70" style={{ '--dz': 60, '--fd': '240ms' }}>
        <div>
          <p className="project-category">{tencent[locale].category}</p>
          <h3><a href={projectPath(locale, tencent.id)}>{tencent[locale].title}</a></h3>
        </div>
        <div>
          <p>{tencent[locale].summary}</p>
          <p className="project-role">{tencent[locale].role}</p>
          <a className="text-link" href={projectPath(locale, tencent.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a>
        </div>
      </article>
    </div>
  </section>;
}

export function About({ locale }) {
  const t = ui[locale];
  return <section className="section container" id="about" aria-labelledby="about-title">
    <div className="section-heading-row" data-focus data-depth="60"><h2 id="about-title">{t.approach}</h2><p>{t.approachIntro}</p></div>
    <p className="about-intro" data-focus>{profile.about[locale]}</p>
    <div className="methods">{methods.map((method, index) => <div className="method" data-focus data-depth="90" data-step={`0${index + 1}`} style={{ '--fd': `${index * 120}ms` }} key={method.title.en}><h3>{method.title[locale]}</h3><p>{method.text[locale]}</p></div>)}</div>
  </section>;
}

export function IndependentWork({ locale }) {
  const t = ui[locale];
  return <section className="section container" id="independent" aria-labelledby="independent-title">
    <div className="section-heading-row" data-focus data-depth="60"><h2 id="independent-title">{t.independent}</h2><p>{t.independentIntro}</p></div>
    <div className="independent-grid">{independentProjects.map((project, index) => <a className={`independent-card ${project.featured ? 'independent-feature' : ''}`} href={project.href} target="_blank" rel="noreferrer" key={project.id} data-focus data-depth={project.featured ? 50 : 100} style={project.featured ? { '--fd': '0ms' } : { '--dz': index % 2 ? -90 : 0, '--fd': `${index * 90}ms` }}>
      <span className="project-number" aria-hidden="true">0{index + 1}</span>
      <p className="project-category">{project.label[locale]}</p>
      <h3>{project.title[locale]}</h3>
      <p>{project.description[locale]}</p>
      <span className="text-link">{t.visitProject}<ArrowUpRight size={20} aria-hidden="true" /></span>
    </a>)}</div>
  </section>;
}

export function BehindWork({ locale }) {
  const t = ui[locale];
  const stops = [
    { name: 'work-crew', caption: t.planning, cite: t.planningCite, motionKind: 'crew' },
    { name: 'desk', caption: t.onsite, cite: t.onsiteCite, motionKind: 'onsite' },
    { name: 'work-table', caption: t.review, cite: t.reviewCite, motionKind: 'table' },
  ];
  return <section className="section container" aria-labelledby="behind-title">
    <div className="section-heading-row" data-focus data-depth="60"><h2 id="behind-title">{t.behind}</h2><p>{t.behindIntro}</p></div>
    <div className="corridor">{stops.map((stop, index) => <article className="corridor-stop" key={stop.name} data-focus data-depth="130">
      <figure className="frame">
        <Photo name={stop.name} locale={locale} motionKind={stop.motionKind} alt={locale === 'zh' ? `Patrick Pan 的现场记录：${stop.caption}` : `Patrick Pan at work: ${stop.caption}`} />
        <figcaption><span>0{index + 1}</span>{stop.cite}</figcaption>
      </figure>
      <blockquote>{stop.caption}<cite>{stop.cite}</cite></blockquote>
    </article>)}</div>
  </section>;
}

export function ExperienceItem({ item, locale }) {
  return <li className="experience-item" data-depth="60">
    <p className="experience-date"><time dateTime={item.start}>{item.start.replace('-', '.')}</time><span aria-hidden="true"> - </span><time dateTime={item.end}>{item.end.replace('-', '.')}</time></p>
    <div className="experience-position"><h3>{item.role[locale]}</h3><p>{item.company[locale]}</p></div>
    <p className="experience-description">{item.description[locale]}</p>
  </li>;
}

export function Experience({ locale, full = false }) {
  const t = ui[locale];
  return <section className={full ? 'resume-section' : 'section container'} id="work" aria-labelledby="experience-title">
    {full ? <h2 id="experience-title">{t.experience}</h2> : <div className="section-heading-row" data-focus data-depth="60"><h2 id="experience-title">{t.experience}</h2><p>{t.experienceIntro}</p></div>}
    {!full && <div className="rail-head" aria-hidden="true"><strong>{experiences[experiences.length - 1].start.slice(0, 4)}<span> - </span>{experiences[0].end.slice(0, 4)}</strong><span>{locale === 'zh' ? `${experiences.length} 段任职` : `${experiences.length} roles`}</span></div>}
    <ol className="experience-list">{experiences.slice(0, full ? undefined : 4).map(item => <ExperienceItem key={item.id} item={item} locale={locale} />)}</ol>
    {!full && <details className="earlier-experience"><summary>{t.earlier}<span className="disclosure-sign" aria-hidden="true">+</span></summary><ol className="experience-list">{experiences.slice(4).map(item => <ExperienceItem key={item.id} item={item} locale={locale} />)}</ol></details>}
  </section>;
}

export function Life({ locale }) {
  const t = ui[locale];
  return <section className="section container" id="life" aria-labelledby="life-title">
    <div className="section-heading-row" data-focus data-depth="60"><h2 id="life-title">{t.life}</h2><p>{t.lifeIntro}</p></div>
    <div className="life-gallery">
      <figure data-focus data-depth="120"><Photo name="camping" locale={locale} motionKind="camping" alt={locale === 'zh' ? 'Patrick Pan 站在夜间露营帐篷旁' : 'Patrick Pan beside a tent at night'} /><figcaption>{t.camping}</figcaption></figure>
      <figure className="snow-figure" data-focus data-depth="120"><Photo name="snow" locale={locale} motionKind="snow" alt={locale === 'zh' ? '雪地中拿着滑雪板的 Patrick Pan' : 'Patrick Pan holding a snowboard in the snow'} /><figcaption>{t.snow}</figcaption></figure>
    </div>
  </section>;
}

export function Contact({ locale }) {
  const t = ui[locale];
  const [message, setMessage] = useState(''), [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(profile.email);
      setCopied(true); setMessage(t.copied);
      timer.current = setTimeout(() => { setCopied(false); setMessage(''); }, 2200);
    } catch { setCopied(false); setMessage(t.copyFailed); }
  };
  return <section className="contact-section section container" id="contact" aria-labelledby="contact-title">
    <div data-focus>
      <h2 id="contact-title">{t.contact}<ArrowUpRight size={50} aria-hidden="true" /></h2>
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="contact-actions"><button className="text-link js-only" onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{t.copy}</button><a className="text-link" href={resumePath(locale)}>{t.viewResume}<ArrowUpRight size={20} /></a></div>
      <p className="copy-status" role="status" aria-live="polite">{message}</p>
    </div>
  </section>;
}

export function Footer({ locale, year }) {
  return <footer className="site-footer container"><p>© {year} Patrick Pan</p><a href={homePath(locale)} className="text-link">{ui[locale].backHome}<ArrowRight size={18} /></a></footer>;
}
