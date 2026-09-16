import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Copy, Check } from '@phosphor-icons/react';
import { profile, methods, experiences, independentProjects } from '../content/profile.js';
import { projects, approvedMedia } from '../content/projects.js';
import { homePath, projectPath, resumePath } from '../content/routes.js';
import { ui } from '../content/ui.js';
import { Photo } from './Media.jsx';

export function ActionLink({ href, children, secondary = false, className = '', ...props }) {
  return <a className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} href={href} {...props}>{children}<ArrowUpRight size={20} aria-hidden="true" /></a>;
}

export function Hero({ locale }) {
  const t = ui[locale];
  return <section id="intro" className="hero container" aria-labelledby="hero-title">
    <div className="hero-copy" data-parallax="lead">
      <p className="hero-role">{profile.title[locale]}</p>
      <h1 id="hero-title">Patrick<br />Pan<span className="hero-period" aria-hidden="true">.</span></h1>
      <p className="hero-intro">{profile.intro[locale]}</p>
      <div className="actions"><ActionLink href="#projects">{t.viewProjects}</ActionLink><ActionLink href={resumePath(locale)} secondary>{t.viewResume}</ActionLink></div>
    </div>
    <Photo name="desk" locale={locale} priority motionKind="hero" alt={locale === 'zh' ? 'Patrick Pan 坐在桌前使用电脑工作' : 'Patrick Pan working at a desk'} className="hero-photo" />
  </section>;
}

export function SelectedProjects({ locale }) {
  const t = ui[locale], [porsche, huawei, tencent] = projects;
  const media = approvedMedia(porsche);
  return <section className="projects-section container section" id="projects" aria-labelledby="projects-title">
    <h2 id="projects-title" data-parallax="heading">{t.projects}</h2>
    <article className={`project-feature ${media ? 'has-media' : ''}`}>
      {media && <Photo name={media.imageName} locale={locale} alt={media.alt[locale]} motionKind="project" />}
      <div className="porsche-name" aria-hidden="true"><span>Porsche</span><strong>992</strong></div>
      <div className="project-feature-copy">
        <p className="project-category">{porsche[locale].category}</p>
        <h3><a href={projectPath(locale, porsche.id)}>{porsche[locale].title}</a></h3>
        <p>{porsche[locale].summary}</p>
        <p className="project-role">{porsche[locale].role} / {porsche.dates}</p>
        <a className="text-link" href={projectPath(locale, porsche.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a>
      </div>
    </article>
    <article className="project-editorial">
      <h3><a href={projectPath(locale, huawei.id)}>{locale === 'zh' ? <>华为<br />B端直播</> : <>Huawei<br />B2B live.</>}</a></h3>
      <div className="project-editorial-copy"><p className="project-category">{huawei[locale].category}</p><p>{huawei[locale].summary}</p><p className="project-role">{huawei[locale].role}</p><a className="text-link" href={projectPath(locale, huawei.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a></div>
    </article>
    <article className="project-compact">
      <div><p className="project-category">{tencent[locale].category}</p><h3><a href={projectPath(locale, tencent.id)}>{tencent[locale].title}</a></h3><p>{tencent[locale].summary}</p></div>
      <a className="text-link" href={projectPath(locale, tencent.id)}>{t.readCase}<ArrowUpRight size={22} aria-hidden="true" /></a>
    </article>
  </section>;
}

export function About({ locale }) {
  const t = ui[locale];
  return <section className="about-section container section" id="about" aria-labelledby="about-title">
    <h2 id="about-title" data-parallax="heading">{t.approach}</h2>
    <p className="about-intro" data-parallax="lead">{profile.about[locale]}</p>
    <div className="methods">{methods.map((method, i) => <div className={`method method-${i + 1}`} data-parallax="band" key={method.title.en}><h3>{method.title[locale]}</h3><p>{method.text[locale]}</p></div>)}</div>
  </section>;
}

export function IndependentWork({ locale }) {
  const t = ui[locale];
  return <section className="independent-section container section" id="independent" aria-labelledby="independent-title">
    <div className="section-heading-row" data-parallax="heading"><h2 id="independent-title">{t.independent}</h2><p>{t.independentIntro}</p></div>
    <div className="independent-grid">{independentProjects.map((project, index) => <a className={`independent-card ${project.featured ? 'independent-feature' : ''}`} href={project.href} target="_blank" rel="noreferrer" key={project.id} data-parallax="band">
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
  const photographs = [
    { name: 'work-planning', motionKind: 'planning', caption: t.planning },
    { name: 'work-onsite', motionKind: 'onsite', caption: t.onsite },
    { name: 'work-review', motionKind: 'review', caption: t.review },
  ];
  return <section className="behind-section container section" aria-labelledby="behind-title">
    <div className="section-heading-row" data-parallax="heading"><h2 id="behind-title">{t.behind}</h2><p>{t.behindIntro}</p></div>
    <div className="behind-gallery">{photographs.map((photo, index) => <figure className={`behind-figure behind-figure-${index + 1}`} key={photo.name}>
      <Photo name={photo.name} locale={locale} motionKind={photo.motionKind} alt={locale === 'zh' ? `Patrick Pan 的${photo.caption}` : `Patrick Pan at work: ${photo.caption}`} />
      <figcaption><span>0{index + 1}</span>{photo.caption}</figcaption>
    </figure>)}</div>
  </section>;
}

export function ExperienceItem({ item, locale }) {
  return <li className="experience-item">
    <p className="experience-date"><time dateTime={item.start}>{item.start.replace('-', '.')}</time><span aria-hidden="true"> - </span><time dateTime={item.end}>{item.end.replace('-', '.')}</time></p>
    <div className="experience-position"><h3>{item.role[locale]}</h3><p>{item.company[locale]}</p></div>
    <p className="experience-description">{item.description[locale]}</p>
  </li>;
}

export function Experience({ locale, full = false }) {
  const t = ui[locale];
  return <section className={full ? 'resume-section' : 'experience-section container section'} id="work" aria-labelledby="experience-title">
    <h2 id="experience-title" data-parallax="heading">{t.experience}</h2>
    <ol className="experience-list">{experiences.slice(0, full ? undefined : 4).map(item => <ExperienceItem key={item.id} item={item} locale={locale} />)}</ol>
    {!full && <details className="earlier-experience"><summary>{t.earlier}<span className="disclosure-sign" aria-hidden="true">+</span></summary><ol className="experience-list">{experiences.slice(4).map(item => <ExperienceItem key={item.id} item={item} locale={locale} />)}</ol></details>}
  </section>;
}

export function Life({ locale }) {
  const t = ui[locale];
  return <section className="life-section container section" id="life" aria-labelledby="life-title">
    <h2 id="life-title" data-parallax="heading">{t.life}</h2><p className="section-intro">{t.lifeIntro}</p>
    <div className="life-gallery">
      <figure className="camping-figure"><Photo name="camping" locale={locale} motionKind="camping" alt={locale === 'zh' ? 'Patrick Pan 站在夜间露营帐篷旁' : 'Patrick Pan beside a tent at night'} /><figcaption>{t.camping}</figcaption></figure>
      <figure className="snow-figure"><Photo name="snow" locale={locale} motionKind="snow" alt={locale === 'zh' ? '雪地中拿着滑雪板的 Patrick Pan' : 'Patrick Pan holding a snowboard in the snow'} /><figcaption>{t.snow}</figcaption></figure>
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
  return <section className="contact-section container section" id="contact" aria-labelledby="contact-title">
    <h2 id="contact-title">{t.contact}<ArrowUpRight size={50} aria-hidden="true" /></h2>
    <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
    <div className="contact-actions"><button className="text-link js-only" onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{t.copy}</button><a className="text-link" href={resumePath(locale)}>{t.viewResume}<ArrowUpRight size={20} /></a></div>
    <p className="copy-status" role="status" aria-live="polite">{message}</p>
  </section>;
}

export function Footer({ locale, year }) {
  return <footer className="site-footer container"><p>© {year} Patrick Pan</p><a href={homePath(locale)} className="text-link">{ui[locale].backHome}<ArrowRight size={18} /></a></footer>;
}
