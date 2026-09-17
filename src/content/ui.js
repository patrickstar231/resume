// 演出 CUE 表是全站骨架：每一幕都有编号，导航、滚动、经历共用同一套语言。
export const cues = [
  { num: '00', id: 'intro', zh: '黑场', en: 'Blackout' },
  { num: '01', id: 'projects', zh: '精选项目', en: 'Selected work' },
  { num: '02', id: 'approach', zh: '工作方法', en: 'Approach' },
  { num: '03', id: 'behind', zh: '幕后', en: 'Behind the work' },
  { num: '04', id: 'runsheet', zh: '场次表', en: 'Run sheet' },
  { num: '05', id: 'offstage', zh: '舞台之外', en: 'Offstage' },
  { num: '06', id: 'contact', zh: '谢幕', en: 'Call' },
];

export const ui = {
  zh: {
    about: '工作方法', behind: '幕后', contact: '谢幕', projects: '精选项目', viewProjects: '看项目', viewResume: '看简历', readCase: '读案例', backProjects: '返回项目', backHome: '返回首页',
    nav: ['projects', 'behind', 'runsheet', 'offstage', 'contact'],
    approachIntro: '十六年里唯一没变的一件事：把一场活动的上千个细节，提前写进一张能被执行的表里。',
    projectsIntro: '三个能对外说的项目。图片来自现场，链接指向品牌方的官方页面。',
    officialSite: '项目官网',
    behindIntro: '没有哪一场是靠自己完成的。空场、人群、散掉之后的那张桌子。',
    runsheetIntro: '8 段任职，一条把场子填满的路。完整时间线在简历页。',
    offstageIntro: '客户项目之外，我自己搭的东西。',
    heroScroll: '往下滚',
    heroRole: '品牌活动与数字营销项目经理',
    heroIntro: '把需求写成可执行的安排，把不同团队放进同一条时间线，散场之后把经验留下来。',
    heroRole: '品牌活动与数字营销项目经理',
    heroIntro: '把需求写成可执行的安排，把不同团队放进同一条时间线，散场之后把经验留下来。',
    heroMeta: ['品牌活动与直播，2012 年起', '累计执行 527 个项目', '中国香港与中国内地之间'],
    offhours1: '收工之后，山里的一个晚上。', offhours2: '雪地上的一天。',
    cueTitle: '场次', cueList: 'CUE 表',
    planning: '方案是在一堆人围着一张桌子时定下来的。', planningCite: '围桌',
    review: '项目真正的结束，是在一张饭桌上。', reviewCite: '散场',
    copy: '复制邮箱', copied: '邮箱已复制。', copyFailed: '暂时无法复制，请选中邮箱手动复制。',
    settings: '设置', close: '关闭', menu: '菜单', theme: '外观', system: '跟随系统', light: '浅色', dark: '深色', motion: '动态效果', reduce: '减少动态效果',
    skip: '跳到主要内容', navigation: '主导航', footer: '回到顶部', resume: '简历', print: '打印 / 保存 PDF',
    education: '教育经历', qualifications: '资格证书', languages: '语言能力', role: '本人角色', brand: '服务品牌', organisation: '服务机构', dates: '项目日期', employment: '相关工作经历', responsibilities: '本人负责内容', delivery: '完成内容',
    missingTitle: '这一页不存在。', missingBody: '地址可能变了。你可以回到作品集，或直接看简历。', photoUnavailable: '照片暂时无法显示。', recording: '录制中',
  },
  en: {
    about: 'Approach', behind: 'Behind the work', contact: 'Call', projects: 'Selected work', viewProjects: 'See the work', viewResume: 'Read the resume', readCase: 'Read the case', backProjects: 'Back to projects', backHome: 'Back to start',
    nav: ['projects', 'behind', 'runsheet', 'offstage', 'contact'],
    approachIntro: 'The one thing that has not changed: every detail of a live event, written down somewhere it can actually be executed.',
    projectsIntro: 'Three projects I can talk about. The photographs are from site; the links go to the brands own pages.',
    officialSite: 'Official site',
    behindIntro: 'No room ever came together alone. The empty hall, the crowd, and the table afterwards.',
    runsheetIntro: 'Eight positions, one long run of rooms to fill. The full timeline lives on the resume page.',
    offstageIntro: 'Things I build and publish outside client delivery.',
    heroScroll: 'Scroll',
    heroRole: 'Brand events and digital marketing',
    heroIntro: 'I turn a brief into something a team can actually run, keep different crews on one timeline, and keep the learning after the doors close.',
    heroRole: 'Brand events and digital marketing',
    heroIntro: 'I turn a brief into something a team can actually run, keep different crews on one timeline, and keep the learning after the doors close.',
    heroMeta: ['Brand events and livestreams since 2012', '527 projects delivered', 'Hong Kong, China and the mainland'],
    offhours1: 'An evening in the hills after the wrap.', offhours2: 'A day on the snow.',
    cueTitle: 'Cue', cueList: 'Cue sheet',
    planning: 'The plan gets settled with everyone around one table.', planningCite: 'Around the table',
    review: 'A project only really ends around a meal.', reviewCite: 'After the wrap',
    copy: 'Copy email', copied: 'Email copied.', copyFailed: 'Copy is unavailable. Select the email address to copy it manually.',
    settings: 'Settings', close: 'Close', menu: 'Menu', theme: 'Appearance', system: 'System', light: 'Light', dark: 'Dark', motion: 'Motion', reduce: 'Reduce motion',
    skip: 'Skip to main content', navigation: 'Main navigation', footer: 'Back to top', resume: 'Resume', print: 'Print / save PDF',
    education: 'Education', qualifications: 'Qualifications', languages: 'Languages', role: 'My role', brand: 'Client brand', organisation: 'Service organisation', dates: 'Project dates', employment: 'Related employment', responsibilities: 'My responsibilities', delivery: 'Delivery',
    missingTitle: 'This page is not here.', missingBody: 'The address may have changed. You can return to the portfolio or open my resume.', photoUnavailable: 'Photo unavailable.', recording: 'Recording',
  },
};

export const navLabel = (locale, id) => {
  const t = ui[locale];
  const map = { projects: 'projects', behind: 'behind', offstage: 'offstage', contact: 'contact', approach: 'about' };
  if (id === 'runsheet') return locale === 'zh' ? '场次表' : 'Run sheet';
  return t[map[id] || id];
};
