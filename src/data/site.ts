export const profile = {
  nameZh: '潘宇龙',
  nameLatin: 'PANYULONG',
  role: '体验工程 · 增长技术',
  tagline: '把发布会、直播与增长链路做成可运行的系统。',
  email: 'patrick_pan410@hotmail.com',
  cvPath: '/resume-panyulong.pdf',
  available: '2026 Q4 可承接项目',
};

export const navLinks = [
  { id: 'station-1', label: '三座站台' },
  { id: 'observation', label: '观景台' },
  { id: 'terminus', label: '终点 · 名片' },
] as const;

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

export const marqueeWords = [
  'cantonese',
  'code',
  'chrome',
  'porsche',
  'huawei cloud',
  'tencent des',
  'repeat',
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

/* ================== 过山车站点文案 ==================
 * 每座站台 = site.ts 里的一个真实项目。以下数字全部可回溯，无虚构。
 */

export type Station = {
  id: 'station-1' | 'station-2' | 'station-3';
  /** 站厅名（站牌大字） */
  hall: string;
  /** 霓虹字牌上的指标——来自 projects[i].metric */
  sign: string;
  /** 下车游览 = 项目官网外链 */
  alight: string;
  /** 首末班时间牌 */
  schedule: string;
};

export const stations: Station[] = [
  {
    id: 'station-1',
    hall: 'PORSCHE · TIME TUNNEL',
    sign: '980M+',
    alight: '下车游览 · 保时捷新闻室',
    schedule: '第一班 · 911 三年展期',
  },
  {
    id: 'station-2',
    hall: 'HUAWEI CLOUD · 快成长',
    sign: '12,000',
    alight: '下车游览 · 快成长直播页',
    schedule: '第二班 · 50+ 场连续播出',
  },
  {
    id: 'station-3',
    hall: 'TENCENT · 生态大会',
    sign: '2.3B+',
    alight: '下车游览 · 腾讯数字生态',
    schedule: '第三班 · 跨平台传播矩阵',
  },
];

/** 观景台三块浮空数据碑。数字来源：
 *  527 = 本人职业生涯承接项目总数（简历正文口径）；
 *  0   = 重大事故数（华为云段：事故率从每 6 场 1 次降到 0）；
 *  2.3B = 腾讯生态大会全网曝光（projects[2].metric）。 */
export const tablets = [
  { value: '527', unit: '个', label: 'PROJECTS DELIVERED', note: '职业生涯承接项目总数' },
  { value: '0', unit: '次', label: 'MAJOR INCIDENTS', note: '直播播出事故：每 6 场 1 次 → 0' },
  { value: '2.3B', unit: '', label: 'TOTAL IMPRESSIONS', note: '单个项目全网曝光峰值' },
];

/** 方法论段——观景台的正文，讲的是同一套工程习惯。 */
export const methodology = [
  {
    title: '把现场当系统交付',
    body: '21 条运营标准、可复用的渠道分发手册、政府级签约仪程 protocol 清单：一次性的东西被我改写成第二次不用想的东西。',
  },
  {
    title: '零差错是设计约束，不是运气',
    body: '彩排与推流清单化、批次放行动线化。排队流失率下降 41% 来自动线设计，不是来自人多。',
  },
  {
    title: '前端能力服务于现场',
    body: 'MR 导览、UGC 回流、跟读评分这些交互，都是我自己写的。这个站本身也是交付物之一。',
  },
];

export const boarding = {
  kicker: 'ADMIT ONE · 单程 · 三站',
  title: '把职业轨迹',
  titleAccent: '做成一条轨道',
  lede:
    '往下滚就是往前开。三座站台是三个真实项目，视频是站台的巨型 billboard，乘坐节奏就是这份简历的阅读顺序。',
};

export const terminus = {
  kicker: 'TERMINUS',
  title: '到站 · 交换名片',
  body: '这一程到此。下一场现场，交给你——邮件、PDF 简历、三条社媒都在出口。',
};
