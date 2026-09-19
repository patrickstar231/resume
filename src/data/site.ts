/* 全站事实层：所有数字、时间、证书、链接均取自真实交付记录（见 DESIGN_SPEC.md 素材与出处清单）。
   话术可以浮夸，参数不许虚构 —— 这里是唯一的真值来源。 */

export const profile = {
  nameZh: '潘宇龙',
  nameLatin: 'PANYULONG',
  role: '活动 / 直播制作 · 体验工程 · 增长技术',
  tagline: '把发布会、直播与增长链路做成可运行的系统。',
  email: 'patrickstar231@gmail.com',
  cvPath: '/resume-panyulong.pdf',
  available: '2026 Q4 可承接项目',
  stock: '库存状态：可预订',
};

export const station = {
  id: 'CHANNEL 潘',
  zh: '午夜购物频道',
  line: '永不打烊的深夜电视购物 · 职业生涯即在售商品',
  intro:
    '欢迎光临。本台不分时段播出三档现场节目，主持人一人兼制作、推流、动线与增长。所有商品参数为本台实测数据，接受回播核对。',
  notice: '本台承诺：话术可以夸张，参数必须真实。',
  countdown: ['5', '4', '3', '2', '1'],
};

/* SMPTE 实色条：一律纯色，禁渐变，禁紫蓝/粉青 */
export const bars = [
  'bg-lemon',
  'bg-cyanbar',
  'bg-phosphor',
  'bg-cream',
  'bg-vermilion',
  'bg-ink',
  'bg-ink-soft',
] as const;

export type Spec = { label: string; value: string; note: string };

export type Program = {
  key: string; // 遥控器数字键
  channel: string; // CH01
  id: string; // 锚点
  solid: string; // 频道识别色（实色块）
  title: string; // 中文商品名
  latin: string;
  category: string;
  status: string; // 在架状态：只用磷光绿
  price: string; // 价格签：只用柠檬黄
  priceNote: string;
  pitch: string; // 主持人串词（浮夸但不虚构）
  summary: string;
  specs: Spec[];
  bullets: string[];
  image: string;
  imageAlt: string;
  clip?: string;
  clipPoster: string;
  url: string;
};

export const programs: Program[] = [
  {
    key: '1',
    channel: 'CH01',
    id: 'ch01',
    solid: 'bg-vermilion',
    title: '保时捷 911 传奇沉浸展',
    latin: 'Porsche 911 Legend Exhibition',
    category: '沉浸式发布 · MR 导览',
    status: '在架 · 循环在售',
    price: '980M+',
    priceNote: '微博曝光量 · 本台成交记录',
    pitch:
      '各位观众不要走开——这不是一台摆在展厅里的 911，这是一台把 992「Time Tunnel」沉浸展开成三天内容工厂的 911。MR 导览动线加 UGC 裂变，一场发布会播出 980M+ 次曝光。现在它正在本台循环在售。',
    summary:
      '“Time Tunnel” 沉浸展（992 车型）：MR 导览动线 + UGC 裂变机制，把一场发布会做成了三天的内容工厂。',
    specs: [
      { label: '已售台数', value: '980M+', note: '微博曝光量，UGC 素材回流官方渠道' },
      { label: '单次使用时长', value: '65 分钟', note: '观众平均停留，约行业均值 3 倍' },
      { label: '出厂批次', value: '4 组 / 小时', note: '现场动线按批次放行' },
      { label: '退货率', value: '-41%', note: '排队流失率同比下降' },
      { label: '标配内容', value: '汽车之家联合直播专场', note: '展期同步开播' },
      { label: '生产周期', value: '2019.09 — 2020.03', note: 'Vokdams Consulting · Project Manager' },
    ],
    bullets: [
      '观众平均停留 65 分钟，约为行业均值 3 倍',
      '与汽车之家联合直播专场，UGC 素材回流至官方渠道',
      '现场动线按 4 组 / 小时批次放行，排队流失率下降 41%',
    ],
    image: '/images/porsche1.jpg',
    imageAlt: '保时捷 911 沉浸展现场',
    clip: '/media/hover-porsche.mp4',
    clipPoster: '/images/porsche1.jpg',
    url: 'https://newsroom.porsche.com/en.html',
  },
  {
    key: '2',
    channel: 'CH02',
    id: 'ch02',
    solid: 'bg-lemon',
    title: '华为云 · 快成长直播',
    latin: 'Huawei Cloud · Kuaichengzhang Live',
    category: 'B2B 混合直播栏目',
    status: '在架 · 50+ 场在播',
    price: '12,000',
    priceNote: '单场峰值同时在线 · 本台成交记录',
    pitch:
      '观众朋友们，市面上最稀缺的是什么？是可复制。本台今日主推：把技术直播从「一次性活动」改造成标准栏目的整套工艺——21 条运营标准、虚拟工厂模块，50 多场直播上架华为云官网，续约率 100%。',
    summary:
      '把技术直播从“一次性活动”改造成可复制的栏目：21 条运营标准 + 虚拟工厂模块，50+ 场直播上到华为云官网。',
    specs: [
      { label: '已售台数', value: '12,000', note: '单场峰值同时在线人数' },
      { label: '单次使用时长', value: '32 分钟', note: '观众平均留存' },
      { label: '装配标准', value: '21 条', note: '彩排与推流清单，可直接复用' },
      { label: '累计播出', value: '50+ 场', note: '上架华为云官网栏目' },
      { label: '故障率', value: '0', note: '由每 6 场 1 次事故降至零' },
      { label: '生产周期', value: '2022.09 — 至今', note: '北京微吼时代 · Project Supervisor' },
    ],
    bullets: [
      '单场峰值 12,000 人同时在线，观众平均留存 32 分钟',
      '标准化彩排与推流清单，事故率从每 6 场 1 次降到 0',
      '渠道分发手册被三个区域团队直接复用',
    ],
    image: '/images/huawei1.jpg',
    imageAlt: '华为云快成长直播推流台',
    clip: '/media/hover-huawei.mp4',
    clipPoster: '/images/huawei1.jpg',
    url: 'https://activity.huaweicloud.com/kuaichengzhang_live.html',
  },
  {
    key: '3',
    channel: 'CH03',
    id: 'ch03',
    solid: 'bg-cyanbar',
    title: '腾讯数字生态大会',
    latin: 'Tencent Digital Ecosystem Summit',
    category: '生态级大会 · 跨平台分发',
    status: '在架 · 母带在库',
    price: '2.3B+',
    priceNote: '全网曝光量 · 本台成交记录',
    pitch:
      '本台镇台之宝：一场把生态产品本身变成传播物料的大会。签到产出一份、议程产出一份、展区再产出一份，32 家核心媒体加短视频二创矩阵同时开火——2.3B+ 曝光，全部由本台一次交付完成。',
    summary:
      '跨平台传播矩阵：把生态产品本身变成传播物料，签到、议程、展区各自产出一份可分发的内容资产。',
    specs: [
      { label: '已售台数', value: '2.3B+', note: '全网曝光量' },
      { label: '联动媒体', value: '32 家', note: '核心媒体 + 短视频二创矩阵' },
      { label: '随箱附件', value: '15 支企业视频', note: '端到端自制，48 小时内全部上线' },
      { label: '内容资产', value: '3 份', note: '签到 / 议程 / 展区各一份可分发物料' },
      { label: '仪程差错', value: '0', note: '政府级签约仪程，形成可复用 protocol 清单' },
      { label: '生产周期', value: '2019.02 — 2019.08', note: '中青旅联科 · Strategy Manager' },
    ],
    bullets: [
      '32 家核心媒体 + 短视频二创矩阵联动',
      '现场 15 支企业视频端到端自制，48 小时内全部上线',
      '政府级签约仪程零差错，形成可复用的 protocol 清单',
    ],
    image: '/images/tencent1.jpg',
    imageAlt: '腾讯数字生态大会主视觉',
    clip: '/media/hover-tencent.mp4',
    clipPoster: '/images/tencent1.jpg',
    url: 'https://des.cloud.tencent.com/',
  },
];

/* 底部信息字幕条：真实履历事实 */
export const tickerFacts = [
  '本台累计成交 527 个项目',
  '15 年 0 播出事故',
  '持证上岗：PMP · 巨量引擎 · 互联网营销师',
  '播出链路 2019 中青旅联科《腾讯数字生态大会》→ 2019-2020 Vokdams《保时捷 911 传奇沉浸展》→ 2020-2022 上海烽范 → 2022.09 起微吼时代《华为云快成长直播》',
  'CH01 980M+ 微博曝光 · CH02 12,000 峰值在线 · CH03 2.3B+ 全网曝光',
  '库存状态：可预订 · 2026 Q4 可承接项目',
];

export const navLinks = [
  { id: 'ch00', label: '导视' },
  { id: 'ch01', label: 'CH01' },
  { id: 'ch02', label: 'CH02' },
  { id: 'ch03', label: 'CH03' },
  { id: 'hotline', label: '热线' },
  { id: 'order', label: '下单' },
];

export const socials = [
  { name: '小红书', url: 'https://xhslink.com/m/5DkJLXbYHA4', note: '现场 vlog / 布展拆解' },
  { name: 'CSDN', url: 'https://blog.csdn.net/patrickstar231', note: '推流与前端工程笔记' },
  { name: '知乎', url: 'https://www.zhihu.com/people/patrick-pan-7', note: '活动增长方法论' },
];

export const sisterShow = {
  name: '粤语 · 学嘢',
  tag: '本台姊妹栏目',
  url: 'https://hk.datatrade.top/',
  summary:
    '一个人做完的粤语学习 Web App：词库、跟读评分、滚动式卡片。字符雨那段动画就是这个项目里的组件搬过来的。',
  stats: [
    { label: '词条', value: '8,412' },
    { label: '跟读评分延迟', value: '140ms' },
    { label: '上线时间', value: '2025-11' },
  ],
};

export const bRoll = [
  { src: '/images/life/teahouse.jpg', alt: '围炉煮茶现场记录' },
  { src: '/images/life/dinner.jpg', alt: '客户晚宴动线实拍' },
];
