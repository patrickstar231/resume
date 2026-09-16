import { projects } from './projects.js';
import { profile } from './profile.js';

export const homePath = (locale) => locale === 'zh' ? '/zh/' : '/';
export const projectPath = (locale, id) => `${homePath(locale)}projects/${id}/`;
export const resumePath = (locale) => `${homePath(locale)}resume/`;
export const routes = ['en', 'zh'].flatMap(locale => [
  { path: homePath(locale), locale, kind: 'home' },
  ...projects.map(project => ({ path: projectPath(locale, project.id), locale, kind: 'project', projectId: project.id })),
  { path: resumePath(locale), locale, kind: 'resume' },
]);

export function resolveRoute(path) {
  const canonical = path === '/' || path.endsWith('/') ? path : `${path}/`;
  return routes.find(route => route.path === canonical) || { path, locale: 'en', kind: '404' };
}

export function translatedPath(route) {
  const locale = route.locale === 'en' ? 'zh' : 'en';
  if (route.kind === 'project') return projectPath(locale, route.projectId);
  if (route.kind === 'resume') return resumePath(locale);
  return homePath(locale);
}

export function pageMeta(route) {
  const zh = route.locale === 'zh';
  const title = route.kind === 'project' ? `${projects.find(p => p.id === route.projectId)[route.locale].title} | Patrick Pan`
    : route.kind === 'resume' ? `${zh ? '潘宇龙｜简历' : 'Resume | Patrick Pan'}`
    : route.kind === '404' ? '404 | Patrick Pan'
    : zh ? '潘宇龙 Patrick Pan｜品牌活动与数字营销项目经理' : 'Patrick Pan | Brand Events & Digital Marketing';
  const description = route.kind === 'project' ? projects.find(p => p.id === route.projectId)[route.locale].summary : profile.intro[route.locale];
  return { title, description, canonical: `${profile.origin}${route.path}`, language: zh ? 'zh-Hans' : 'en', alternate: `${profile.origin}${translatedPath(route)}` };
}
