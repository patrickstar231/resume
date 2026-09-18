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
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
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
