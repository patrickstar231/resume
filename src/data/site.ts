export const profile = {
  nameZh: '潘宇龙',
  nameLatin: 'PANYULONG',
  role: '体验工程 · 增长技术',
  tagline: '把发布会、直播与增长链路做成可运行的系统。',
  email: 'patrickstar231@gmail.com',
  cvPath: '/resume-panyulong.pdf',
  available: '2026 Q4 可承接项目',
};

export const navLinks = [
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'method', label: 'Method' },
  { id: 'contact', label: 'Contact' },
];

/* ── Experience ────────────────────────────────────────────────
   事实来源：老站 resume-old-ref/src/constants/index.js 的 experiences，
   指标与时间原样搬运，不做美化、不补写未记录的条目。 */
export type Experience = {
  from: string;
  to: string;
  company: string;
  title: string;
  result: string;
  metrics: string[];
};

export const experiences: Experience[] = [
  {
    from: '2022.09',
    to: '至今',
    company: 'Beijing Weihou Times Technology',
    title: 'Project Supervisor',
    result: '把技术直播从一次性活动改造成可复制栏目，华为云续约率做到 100%。',
    metrics: ['12,000 峰值在线', '21 条运营标准', '50+ 场直播上官网'],
  },
  {
    from: '2020.09',
    to: '2022.03',
    company: 'Shanghai Fengfan Advertising Media',
    title: 'Sales Director',
    result: '活动—内容—资源打包卖，年营收同比 +170%，客户留存率 91%。',
    metrics: ['+170% YoY', '91% 留存（高于行业 35%）', '带出 3 名高级管理'],
  },
  {
    from: '2019.09',
    to: '2020.03',
    company: 'Vokdams Consulting Shanghai',
    title: 'Project Manager',
    result: '保时捷 992「Time Tunnel」沉浸展：MR 动线 + UGC 裂变，停留时长 3 倍于行业。',
    metrics: ['980M+ 微博曝光', '65 分钟人均停留'],
  },
  {
    from: '2019.02',
    to: '2019.08',
    company: 'CYTS Linkage PR Consulting',
    title: 'Strategy Manager',
    result: '3 场 50 万美元级行业论坛 + 15 支企业视频端到端自制，危机响应压到 2 小时内。',
    metrics: ['3 场 500K+ 论坛', '15+ 支视频', '2 小时危机响应'],
  },
];

export const companies = [
  'Huawei',
  'Tencent',
  'Porsche',
  'Mercedes-Benz',
  'Ping An',
  'Ningbo',
  'AstraZeneca',
  'Pfizer',
];

/* 能力轨：老站 services 的四条自我定位，每条配一个可核对的证据指标 */
export type Capability = {
  latin: string;
  zh: string;
  proof: string;
  evidence: string;
};

export const capabilities: Capability[] = [
  {
    latin: 'Campaign Architect',
    zh: '活动策划',
    proof: '3 场 500K+ 预算行业论坛',
    evidence: '含政府级签约仪程，零差错',
  },
  {
    latin: 'Experience Engineer',
    zh: '体验工程',
    proof: '65 分钟人均停留',
    evidence: '约为行业均值 3 倍',
  },
  {
    latin: 'Backend Growth Stack',
    zh: '增长技术',
    proof: '12,000 峰值在线 / 140ms 交互延迟',
    evidence: '推流链路与自建 App 同一套习惯',
  },
  {
    latin: 'Viral Systems Designer',
    zh: '裂变机制',
    proof: '980M+ 曝光 · 2.3B+ 全网',
    evidence: 'UGC 素材回流官方渠道',
  },
];

export type Project = {
  index: string;
  name: string;
  category: string;
  metric: string;
  summary: string;
  bullets: string[];
  image: string;
  hoverVideo?: string;
  url: string;
};

export const projects: Project[] = [
  {
    index: '01',
    name: 'Porsche 911 Legend Exhibition',
    category: 'Immersive Launch · MR',
    metric: '980M+ 微博曝光 · 65 分钟人均停留',
    summary:
      '“Time Tunnel” 沉浸展（992 车型）：MR 导览动线 + UGC 裂变机制，把一场发布会做成了三天的内容工厂。',
    bullets: [
      '观众平均停留 65 分钟，约为行业均值 3 倍',
      '与汽车之家联合直播专场，UGC 素材回流至官方渠道',
      '现场动线按 4 组 / 小时批次放行，排队流失率下降 41%',
    ],
    image: '/images/porsche1.jpg',
    hoverVideo: '/media/hover-porsche.mp4',
    url: 'https://newsroom.porsche.com/en.html',
  },
  {
    index: '02',
    name: 'Huawei Cloud · 快成长直播',
    category: 'B2B Hybrid Streaming',
    metric: '12,000 峰值在线 · 100% 续约',
    summary:
      '把技术直播从“一次性活动”改造成可复制的栏目：21 条运营标准 + 虚拟工厂模块，50+ 场直播上到华为云官网。',
    bullets: [
      '单场峰值 12,000 人同时在线，观众平均留存 32 分钟',
      '标准化彩排与推流清单，事故率从每 6 场 1 次降到 0',
      '渠道分发手册被三个区域团队直接复用',
    ],
    image: '/images/huawei1.jpg',
    hoverVideo: '/media/hover-huawei.mp4',
    url: 'https://activity.huaweicloud.com/kuaichengzhang_live.html',
  },
  {
    index: '03',
    name: 'Tencent Digital Ecosystem Summit',
    category: 'Ecosystem-scale Conference',
    metric: '2.3B+ 全网曝光',
    summary:
      '跨平台传播矩阵：把生态产品本身变成传播物料，签到、议程、展区各自产出一份可分发的内容资产。',
    bullets: [
      '32 家核心媒体 + 短视频二创矩阵联动',
      '现场 15 支企业视频端到端自制，48 小时内全部上线',
      '政府级签约仪程零差错，形成可复用的 protocol 清单',
    ],
    image: '/images/tencent1.jpg',
    hoverVideo: '/media/hover-tencent.mp4',
    url: 'https://des.cloud.tencent.com/',
  },
];

export const socials = [
  { name: '小红书', url: 'https://xhslink.com/m/5DkJLXbYHA4', note: '现场 vlog / 布展拆解' },
  { name: 'CSDN', url: 'https://blog.csdn.net/patrickstar231', note: '推流与前端工程笔记' },
  { name: '知乎', url: 'https://www.zhihu.com/people/patrick-pan-7', note: '活动增长方法论' },
];

/* 现场素材带：每张图只出现一次语义（第二轮仅作滚动填充，alt 置空） */
export const shots = [
  { src: '/images/porsche1.jpg', alt: '保时捷 911 沉浸展现场' },
  { src: '/images/huawei1.jpg', alt: '华为云快成长直播推流台' },
  { src: '/images/tencent1.jpg', alt: '腾讯数字生态大会主视觉' },
  { src: '/images/life/teahouse.jpg', alt: '围炉煮茶现场示意' },
  { src: '/images/life/dinner.jpg', alt: '客户晚宴动线示意' },
];

export const cantoneseProject = {
  name: '粤语 · 学嘢',
  url: 'https://hk.datatrade.top/',
  summary:
    '一个人做完的粤语学习 Web App：词库、跟读评分、滚动式卡片。字符雨那段动画就是这个项目里的组件搬过来的。',
  stats: [
    { label: '词条', value: '8,412' },
    { label: '跟读评分延迟', value: '140ms' },
    { label: '上线时间', value: '2025-11' },
  ],
};
