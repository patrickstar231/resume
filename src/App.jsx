import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ArrowLeft, Printer } from '@phosphor-icons/react';
import { routes, resolveRoute, homePath, projectPath, resumePath, DEFAULT_LOCALE } from './content/routes.js';
import { profile, experiences, education, qualifications, languages, period } from './content/profile.js';
import { projects, approvedMedia } from './content/projects.js';
import { ui, cues } from './content/ui.js';
import { PreferencesProvider, usePreferences } from './site/Preferences.jsx';
import { Header } from './site/Header.jsx';
import { Timecode } from './site/Timecode.jsx';
import { CueRail } from './site/CueRail.jsx';
import { Hero, SelectedProjects, Approach, Behind, Experience, Offstage, Contact, Footer, ActionLink } from './site/Sections.jsx';
import { Photo } from './site/Media.jsx';

function Home({ locale }) {
  const root = useRef(null), clock = useRef(null);
  const { motion, ready } = usePreferences();
  useEffect(() => {
    // 舞台引擎是懒加载的叶子：服务端输出的文档在它到达之前已经是完整可读的页面。
    if (!ready || motion === 'reduce' || !root.current) return;
    let disposed = false, instance;
    import('./site/stage.js').then(({ attachStage }) => {
      if (disposed || !root.current) return;
      instance = attachStage(root.current, { timecodeTarget: clock.current });
      document.fonts?.ready.then(() => { if (!disposed) instance.remeasure(); });
      window.addEventListener('load', () => { if (!disposed) instance.remeasure(); }, { once: true });
    }).catch(() => {});
    return () => { disposed = true; instance?.destroy(); };
  }, [motion, ready, locale]);
  return <main id="main" ref={root} className="stage-root" tabIndex={-1}>
    <CueRail locale={locale} />
    <Timecode clockRef={clock} locale={locale} />
    <Hero locale={locale} /><SelectedProjects locale={locale} /><Approach locale={locale} /><Behind locale={locale} /><Experience locale={locale} /><Offstage locale={locale} /><Contact locale={locale} />
  </main>;
}

function Project({ route }) {
  const { locale } = route, t = ui[locale];
  const project = projects.find(item => item.id === route.projectId), copy = project[locale];
  const employer = experiences.find(item => item.id === project.employerId);
  const media = approvedMedia(project);
  const cue = cues.find(item => item.id === 'projects');
  return <main id="main" className="project-page container" tabIndex={-1}>
    <a href={`${homePath(locale)}#projects`} className="text-link back-link"><ArrowLeft size={19} />{t.backProjects}</a>
    <div className="case-heading">
      <p className="cue-tag"><span className="cue-tag-num">{cue.num}</span>{cue[locale]} · {project.brand}</p>
      <h1>{copy.title}</h1>
      <p className="case-intro">{copy.intro}</p>
    </div>
    {media ? <div className="case-hero"><Photo name={media.imageName} locale={locale} priority alt={media.alt[locale]} /></div> : null}
    <div className="case-body">
      <aside className="case-facts" aria-label={locale === 'zh' ? '项目资料' : 'Project information'}><dl>
        <div><dt>{t.role}</dt><dd>{copy.role}</dd></div>
        <div><dt>{t.brand}</dt><dd>{project.brand}</dd></div>
        <div><dt>{t.organisation}</dt><dd>{employer.company[locale]}</dd></div>
        {project.dates ? <div><dt>{t.dates}</dt><dd>{project.dates}</dd></div> : <div><dt>{t.employment}</dt><dd>{period(employer)}</dd></div>}
        {project.site ? <div><dt>{t.officialSite}</dt><dd><a className="text-link" href={project.site} target="_blank" rel="noreferrer">{project.site.replace(/^https?:\/\//, '').replace(/\/$/, '')}</a></dd></div> : null}
      </dl></aside>
      <article className="case-story">
        <section><h2>{t.responsibilities}</h2><ul>{copy.responsibilities.map(text => <li key={text}>{text}</li>)}</ul></section>
        {copy.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.text}</p></section>)}
      </article>
    </div>
    <div className="case-navigation"><ActionLink href={`${homePath(locale)}#projects`} secondary>{t.backProjects}</ActionLink><a className="text-link" href={`${homePath(locale)}#contact`}>{t.contact}</a></div>
  </main>;
}

function Resume({ locale }) {
  const t = ui[locale];
  return <main id="main" className="resume-page container" tabIndex={-1}>
    <div className="resume-toolbar"><a className="text-link" href={homePath(locale)}><ArrowLeft size={19} />{t.backHome}</a><button className="button button-secondary js-only" onClick={() => window.print()}><Printer size={19} />{t.print}</button></div>
    <div className="resume-heading"><h1>{locale === 'zh' ? '潘宇龙' : 'Patrick Pan'}</h1>{locale === 'zh' && <p className="resume-english-name">PAN YULONG</p>}<p className="resume-title">{profile.title[locale]}</p><a className="text-link" href={`mailto:${profile.email}`}>{profile.email}</a></div>
    <p className="resume-about">{profile.about[locale]}</p>
    <Experience locale={locale} full />
    <section className="resume-section"><h2>{t.projects}</h2><div className="resume-projects">{projects.map(project => <article key={project.id}><h3><a href={projectPath(locale, project.id)}>{project[locale].title}</a></h3><p>{project[locale].summary}</p></article>)}</div></section>
    <section className="resume-section"><h2>{t.education}</h2><div className="education-grid">{education.map(item => <article key={item.dates}><p className="experience-slot"><time>{item.dates}</time></p><h3>{item.school[locale]}</h3><p>{item.course[locale]}</p></article>)}</div></section>
    <div className="resume-bottom"><section className="resume-section"><h2>{t.qualifications}</h2><ul>{qualifications[locale].map(q => <li key={q}>{q}</li>)}</ul></section><section className="resume-section"><h2>{t.languages}</h2><ul>{languages[locale].map(q => <li key={q}>{q}</li>)}</ul></section></div>
    <p className="print-site">{profile.origin}</p>
  </main>;
}

function NotFound({ locale }) {
  const t = ui[locale];
  return <main id="main" className="not-found container" tabIndex={-1}><p className="error-code">404</p><h1>{t.missingTitle}</h1><p>{t.missingBody}</p><div className="actions"><ActionLink href={homePath(locale)}>{t.backHome}</ActionLink><ActionLink href={resumePath(locale)} secondary>{t.viewResume}</ActionLink></div></main>;
}

export default function App({ year }) {
  const location = useLocation(), current = resolveRoute(location.pathname);
  return <PreferencesProvider><Header route={current} /><Routes>
    {routes.map(route => <Route key={route.path} path={route.path} element={route.kind === 'home' ? <Home locale={route.locale} /> : route.kind === 'project' ? <Project route={route} /> : <Resume locale={route.locale} />} />)}
    <Route path="*" element={<NotFound locale={current.locale} />} />
  </Routes><Footer locale={current.locale} year={year} /></PreferencesProvider>;
}
