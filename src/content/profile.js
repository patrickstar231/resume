// Public facts only. Review notes and unpublished metrics belong in docs/, not here.
export const profile = {
  name: 'Patrick Pan',
  chineseName: '潘宇龙',
  email: 'patrick_pan410@hotmail.com',
  origin: 'https://resume.datatrade.top',
  title: { en: 'Project Manager, Brand Experiences & Digital Marketing', zh: '品牌活动与数字营销项目经理' },
  intro: { en: 'I manage brand events, enterprise livestreams and cross-functional project delivery.', zh: '我是潘宇龙，负责品牌活动、企业直播与跨团队项目交付。' },
  about: {
    en: 'My experience spans brand events, enterprise livestreams and industry conferences. I turn client requirements into practical plans, coordinate content, design, suppliers and on-site teams, and bring the lessons into the next project.',
    zh: '我的经历覆盖品牌活动、企业直播和行业会议。工作中，我需要把客户需求转成可执行的安排，协调内容、设计、供应商和现场团队，并在项目结束后整理复盘。',
  },
};

export const methods = [
  { title: { en: 'Clarify the brief.', zh: '把需求讲清楚。' }, text: { en: 'Agree on objectives, responsibilities and deliverables before planning budgets and resources.', zh: '先明确目标、职责和交付边界，再安排预算与资源。' } },
  { title: { en: 'Connect the teams.', zh: '把协作安排好。' }, text: { en: 'Bring content, technical teams, suppliers and on-site execution into one working plan.', zh: '把内容、技术、供应商和现场执行放进同一套工作安排。' } },
  { title: { en: 'Carry the learning forward.', zh: '把经验留下来。' }, text: { en: 'Use checklists, operating guides and project reviews to make the next delivery better informed.', zh: '用执行清单、操作手册和复盘，把一次项目的经验带到下一次。' } },
];

export const independentProjects = [
  {
    id: 'cantonese', href: 'https://hk.datatrade.top/', featured: true,
    label: { en: 'Learning product', zh: '学习产品' },
    title: { en: 'Hong Kong Cantonese learning', zh: '香港粤语学习项目' },
    description: {
      en: 'A practical Cantonese learning project built around language used in everyday Hong Kong. I shape the learning structure, content and digital experience.',
      zh: '围绕香港日常真实语境搭建的粤语学习项目，由我持续整理学习结构、内容与数字体验。',
    },
  },
  {
    id: 'xiaohongshu', href: 'https://xhslink.com/m/5DkJLXbYHA4',
    label: { en: 'Lifestyle publishing', zh: '生活内容创作' },
    title: { en: 'Patrick in Hong Kong · Xiaohongshu', zh: 'Patrick在香港 · 小红书' },
    description: {
      en: 'Visual stories about work, daily life and useful discoveries in Hong Kong, developed from topic research through writing and art direction.',
      zh: '记录香港工作、生活与实用发现，从选题研究、文字表达，到视觉策划与发布持续迭代。',
    },
  },
  {
    id: 'csdn', href: 'https://blog.csdn.net/patrickstar231',
    label: { en: 'Technical writing', zh: '技术写作' },
    title: { en: 'Hong Kong data engineering · CSDN', zh: '香港数据工程 · CSDN' },
    description: {
      en: 'Reproducible notes on Python, AI engineering and Hong Kong public data, with emphasis on source semantics, validation and failure cases.',
      zh: '以 Python、AI 工程和香港公开数据为主线，重视来源语义、数据校验与失败案例的可复现技术写作。',
    },
  },
  {
    id: 'zhihu', href: 'https://www.zhihu.com/people/patrick-pan-7',
    label: { en: 'Analysis & commentary', zh: '分析与观点' },
    title: { en: 'Patrick in Hong Kong · Zhihu', zh: 'Patrick在香港 · 知乎' },
    description: {
      en: 'Evidence-led answers about finance, careers and life choices between Hong Kong and mainland China, written to clarify the mechanism behind a headline.',
      zh: '围绕财经、职场与两地生活选择，用数据纠错和机制对比，把热门话题背后的信息差讲清楚。',
    },
  },
];

export const experiences = [
  { id: 'vhall', start: '2022-09', end: '2025-09', company: { en: 'Vhall', zh: '微吼直播' }, role: { en: 'Livestream Project Manager', zh: '直播全案项目经理' }, description: { en: 'Enterprise livestream delivery, technical content and coordination across platforms.', zh: '统筹企业直播项目，协调技术内容、直播执行与多平台协作。' } },
  { id: 'caishi', start: '2020-09', end: '2022-03', company: { en: '财视中国', zh: '财视中国' }, role: { en: 'Sales Director', zh: '销售总监' }, description: { en: 'Conferences, content and client services for the financial industry.', zh: '围绕金融行业客户，组织会议、内容与客户服务。' } },
  { id: 'fengkeda', start: '2019-09', end: '2020-03', company: { en: '峰可达咨询（北京）有限公司上海分公司', zh: '峰可达咨询（北京）有限公司上海分公司' }, role: { en: 'Project Manager', zh: '项目经理' }, description: { en: 'Porsche event projects, coordinating budgets, design and on-site execution.', zh: '统筹保时捷相关活动，协调预算、设计与现场执行。' } },
  { id: 'cyts-linkage', start: '2019-02', end: '2019-08', company: { en: '中青旅联科（深圳）公关顾问有限公司', zh: '中青旅联科（深圳）公关顾问有限公司' }, role: { en: 'Brand Promotion Manager', zh: '品牌推广经理' }, description: { en: 'Brand events, industry forums and corporate content production.', zh: '组织品牌活动、行业论坛与企业内容制作。' } },
  { id: 'ctrip', start: '2017-09', end: '2019-02', company: { en: '上海携程国际旅行社有限公司', zh: '上海携程国际旅行社有限公司' }, role: { en: 'Account Manager', zh: '客户经理' }, description: { en: 'Client events and supplier coordination, including international delivery.', zh: '负责客户活动及供应商协调，参与跨国活动执行。' } },
  { id: 'tongbang', start: '2015-11', end: '2017-08', company: { en: '深圳市同邦国际商务有限公司上海分公司', zh: '深圳市同邦国际商务有限公司上海分公司' }, role: { en: 'Event Project Director', zh: '活动项目总监' }, description: { en: 'Event delivery across industries and countries, supported by execution checklists.', zh: '组织多行业及跨国活动执行，整理项目执行清单。' } },
  { id: 'zhongxin', start: '2013-04', end: '2015-11', company: { en: '众信（北京）国际商务旅行社有限公司上海分公司', zh: '众信（北京）国际商务旅行社有限公司上海分公司' }, role: { en: 'Account Manager', zh: '客户经理' }, description: { en: 'Conference planning and client services for the pharmaceutical industry.', zh: '负责医药行业会议筹备、执行与客户服务。' } },
  { id: 'cyts-meetings', start: '2012-01', end: '2012-11', company: { en: '深圳中青旅国际会议展览有限公司', zh: '深圳中青旅国际会议展览有限公司' }, role: { en: 'Conference & Exhibition Coordinator', zh: '会务 / 会展专员' }, description: { en: 'Conference preparation, budget coordination and event execution.', zh: '参与会议筹备、预算协调与现场执行。' } },
];

export const education = [
  { dates: '2016.09 - 2019.01', school: { en: 'Northwestern Polytechnical University', zh: '西北工业大学' }, course: { en: 'Business Administration, Bachelor’s degree', zh: '工商管理，本科' } },
  { dates: '2006.09 - 2009.07', school: { en: '深圳市职业技术学院', zh: '深圳市职业技术学院' }, course: { en: 'Printing Technology, Associate degree', zh: '印刷技术，大专' } },
];

export const qualifications = {
  en: ['PMP Project Management Certification', 'Internet Marketer, Intermediate', 'Ocean Engine Digital Marketing Certification', 'Google Analytics Certification', 'Industrial Internet Digital Operations', 'Oracle AI Vector Search Professional', 'Public English Test System, Level 2'],
  zh: ['PMP 项目管理认证', '互联网营销师（中级）', '巨量引擎数字营销能力认证', 'Google Analytics 认证', '工业互联网数字化运营', 'Oracle AI 向量搜索专家', '全国英语等级考试 PETS-2'],
};

export const languages = {
  en: ['Mandarin: native / near-native', 'Cantonese: native / near-native', 'English: business discussions', 'Shanghainese: working use'],
  zh: ['普通话：母语 / 近母语', '粤语：母语 / 近母语', '英语：商务洽谈', '上海话：工作应用'],
};

export const period = ({ start, end }) => `${start.replace('-', '.')} - ${end.replace('-', '.')}`;
