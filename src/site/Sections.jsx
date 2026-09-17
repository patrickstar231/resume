import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Copy, Check } from '@phosphor-icons/react';
import { profile, methods, experiences, independentProjects } from '../content/profile.js';
import { projects, approvedMedia } from '../content/projects.js';
import { homePath, projectPath, resumePath } from '../content/routes.js';
import { ui, cues, navLabel } from '../content/ui.js';
import { Photo } from './Media.jsx';
import { Plate } from './Plate.jsx';

// 每一幕都是一个 CUE：编号 + 幕名 + 底板。底板由 Plate 提供，视频就位后由滚动驱动，
// 没有视频时就是设计出来的空场底色。
function Cue({ id, children, tone = 'void', label }) {
  return <section id={id} data-cue={id} data-scene="" className={`cue-section cue-${id}`} aria-labelledby={`${id}-title`}>
    <Plate tone={tone} label={label} />
    <div className="cue-inner container">{children}</div>
  </section>;
}

function CueHead({ id, title, intro, locale }) {
  const cue = cues.find(item => item.id === id);
  return <header className="cue-head" data-focus>
    <p className="cue-tag"><span className="cue-tag-num">{cue.num}</span>{cue[locale || 'zh']}</p>
    <h2 id={`${id}-title`}>{title}</h2>
    {intro ? <p className="cue-head-intro">{intro}</p> : null}
  </header>;
}

export function ActionLink({ href, children, secondary = false, external = false, className = '', ...props }) {
  const rel = external ? { target: '_blank', rel: 'noreferrer' } : {};
  return <a className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} href={href} {...rel} {...props}>
    {children}{external ? <ArrowUpRight size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
  </a>;
}

/* CUE 00 黑场 */
export function Hero({ locale }) {
  const t = ui[locale], name = locale === 'zh' ? ['潘宇龙'] : ['Patrick', 'Pan'];
  return <section id="intro" data-cue="intro" data-scene="" className="stage stage-hero" aria-labelledby="hero-title">
    <Plate tone="void" />
    <div className="hero-inner container">
      <p className="eyebrow" data-focus><span className="rec" />{t.heroRole}</p>
      <h1 id="hero-title" data-focus>{name.map((line, index) => <span className="hero-line" key={line}>{line}{index < name.length - 1 && <br />}</span>)}</h1>
      <p className="hero-intro" data-focus>{t.heroIntro}</p>
      <p className="hero-meta" data-focus>{t.heroMeta.map(item => <span key={item}>{item}</span>)}</p>
      <div className="actions" data-focus><ActionLink href="#projects">{t.viewProjects}</ActionLink><ActionLink href={resumePath(locale)} secondary>{t.viewResume}</ActionLink></div>
    </div>
    <p className="hero-scroll" aria-hidden="true">{t.heroScroll}<i /></p>
  </section>;
}

/* CUE 01 精选项目 —— 三张真实现场图，各带品牌方官网跳转 */
export function SelectedProjects({ locale }) {
  const t = ui[locale];
  return <Cue id="projects" tone="cold">
    <CueHead id="projects" locale={locale} title={t.projects} intro={t.projectsIntro} />
    <div className="cases">{projects.map((project, index) => {
      const copy = project[locale], media = approvedMedia(project);
      return <article className={`case-card case-card-${index + 1}`} key={project.id} data-focus data-depth={index === 0 ? 90 : index === 1 ? 150 : 70}>
        {media ? <a className="case-media" href={projectPath(locale, project.id)} tabIndex={-1} aria-hidden="true">
          <Photo name={media.imageName} locale={locale} motionKind="case" priority={index === 0} alt={media.alt[locale]} />
        </a> : null}
        <div className="case-copy">
          <p className="case-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p>
          <p className="case-brand">{project.brand}</p>
          <h3><a href={projectPath(locale, project.id)}>{copy.title}</a></h3>
          <p className="case-summary">{copy.summary}</p>
          <p className="case-role">{copy.role}{project.dates ? ` · ${project.dates}` : ''}</p>
          <div className="case-links">
            <a className="text-link" href={projectPath(locale, project.id)}>{t.readCase}<ArrowUpRight size={20} aria-hidden="true" /></a>
            <a className="text-link case-site" href={project.site} target="_blank" rel="noreferrer">{t.officialSite}<ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </article>;
    })}</div>
  </Cue>;
}

/* CUE 02 工作方法 */
export function Approach({ locale }) {
  const t = ui[locale];
  return <Cue id="approach" tone="void">
    <CueHead id="approach" locale={locale} title={t.about} intro={t.approachIntro} />
    <p className="approach-lede" data-focus>{profile.about[locale]}</p>
    <div className="methods">{methods.map((method, index) => <div className="method" data-focus data-depth="90" data-step={`0${index + 1}`} key={method.title.en} style={{ '--fd': `${index * 110}ms` }}>
      <h3>{method.title[locale]}</h3><p>{method.text[locale]}</p>
    </div>)}</div>
  </Cue>;
}

/* CUE 03 幕后 —— 工作现场与工作之外，全部真实照片 */
export function Behind({ locale }) {
  const t = ui[locale];
  const plates = [
    { name: 'work-crew', caption: t.planning, cite: t.planningCite, kind: 'crew' },
    { name: 'work-table', caption: t.review, cite: t.reviewCite, kind: 'table' },
  ];
  return <Cue id="behind" tone="warm">
    <CueHead id="behind" locale={locale} title={t.behind} intro={t.behindIntro} />
    <div className="corridor">{plates.map((plate, index) => <figure className="corridor-stop" key={plate.name} data-focus data-depth={index === 0 ? 130 : 90}>
      <div className="frame">
        <Photo name={plate.name} locale={locale} motionKind={plate.kind} alt={locale === 'zh' ? `Patrick Pan 的现场记录：${plate.caption}` : `Patrick Pan at work: ${plate.caption}`} />
        <figcaption><span>0{index + 1}</span>{plate.cite}</figcaption>
      </div>
      <blockquote>{plate.caption}</blockquote>
    </figure>)}</div>
    <div className="offhours">{[
      { name: 'camping', caption: locale === 'zh' ? t.offhours1 : t.offhours1, kind: 'camping' },
      { name: 'snow', caption: t.offhours2, kind: 'snow' },
    ].map((item, index) => <figure className={`offhours-item ${index === 1 ? 'offhours-item-2' : ''}`} key={item.name} data-focus data-depth="110">
      <Photo name={item.name} locale={locale} motionKind={item.kind} alt={locale === 'zh' ? `Patrick Pan：${item.caption}` : `Patrick Pan: ${item.caption}`} />
      <figcaption>{item.caption}</figcaption>
    </figure>)}</div>
  </Cue>;
}

export function ExperienceItem({ item, locale, index }) {
  return <li className="experience-item">
    <p className="experience-slot"><span className="cue-num">{String(index + 1).padStart(2, '0')}</span><time dateTime={item.start}>{item.start.replace('-', '.')}</time><span aria-hidden="true"> - </span><time dateTime={item.end}>{item.end.replace('-', '.')}</time></p>
    <div className="experience-position"><h3>{item.role[locale]}</h3><p>{item.company[locale]}</p></div>
    <p className="experience-description">{item.description[locale]}</p>
  </li>;
}

/* CUE 04 场次表 */
export function Experience({ locale, full = false }) {
  const t = ui[locale];
  const items = experiences.slice(0, full ? undefined : 4);
  return <section id="runsheet" data-cue="runsheet" data-scene="" className={full ? 'resume-section' : 'cue-section cue-runsheet'} aria-labelledby="runsheet-title">
    {!full && <Plate tone="void" />}
    <div className={full ? '' : 'cue-inner container'}>
      <CueHead id="runsheet" locale={locale} title={locale === 'zh' ? '场次表' : 'Run sheet'} intro={full ? null : t.runsheetIntro} />
      <ol className="experience-list">{items.map((item, index) => <ExperienceItem key={item.id} item={item} locale={locale} index={index} />)}</ol>
      {!full && <details className="earlier-experience"><summary>{locale === 'zh' ? '更早的场次' : 'Earlier runs'}<span className="disclosure-sign" aria-hidden="true">+</span></summary><ol className="experience-list">{experiences.slice(4).map((item, index) => <ExperienceItem key={item.id} item={item} locale={locale} index={index + 4} />)}</ol></details>}
    </div>
  </section>;
}

/* CUE 05 舞台之外 */
export function Offstage({ locale }) {
  const t = ui[locale];
  return <Cue id="offstage" tone="cold">
    <CueHead id="offstage" locale={locale} title={t.offstage} intro={t.offstageIntro} />
    <div className="offstage-grid">{independentProjects.map((project, index) => <a className={`offstage-card ${project.featured ? 'offstage-feature' : ''}`} href={project.href} target="_blank" rel="noreferrer" key={project.id} data-focus data-depth={project.featured ? 50 : 100} style={project.featured ? { '--fd': '0ms' } : { '--fd': `${index * 90}ms` }}>
      <span className="offstage-num" aria-hidden="true">0{index + 1}</span>
      <p className="offstage-label">{project.label[locale]}</p>
      <h3>{project.title[locale]}</h3>
      <p>{project.description[locale]}</p>
      <span className="text-link">{t.viewProjects}<ArrowUpRight size={20} aria-hidden="true" /></span>
    </a>)}</div>
  </Cue>;
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
  return <section id="contact" data-cue="contact" data-scene="" className="cue-section cue-contact" aria-labelledby="contact-title">
    <Plate tone="void" />
    <div className="cue-inner container" data-focus>
      <p className="cue-tag"><span className="cue-tag-num">06</span>{cues[6][locale]}</p>
      <h2 id="contact-title">{t.contact}</h2>
      <a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="contact-actions"><button className="text-link js-only" onClick={copy}>{copied ? <Check size={18} /> : <Copy size={18} />}{t.copy}</button><a className="text-link" href={resumePath(locale)}>{t.viewResume}<ArrowUpRight size={20} /></a></div>
      <p className="copy-status" role="status" aria-live="polite">{message}</p>
    </div>
  </section>;
}

export function Footer({ locale, year }) {
  return <footer className="site-footer container"><p>© {year} Patrick Pan</p><a href={homePath(locale)} className="text-link">{ui[locale].backHome}<ArrowRight size={18} /></a></footer>;
}

export { navLabel };
