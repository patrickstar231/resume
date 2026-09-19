/* ─────────────────────────────────────────────────────────────
   事实层：全站唯一真实来源。机台标签 / 胶囊编号 / 名录编号
   全部由这里派生，禁止在组件里写死数字。
   ───────────────────────────────────────────────────────────── */

export const profile = {
  nameZh: '潘宇龙',
  nameLatin: 'PANYULONG',
  role: '活动 / 直播制作人 · 体验工程 · 增长技术',
  tagline: '把发布会、直播与增长链路做成可运行的系统。',
  email: 'patrick_pan410@hotmail.com',
  cvPath: '/resume-panyulong.pdf',
  available: '2026 Q4 · 补货中',
};

/** 机台铭牌：编号自洽（527 = 15 年累计执行项目数，PM = Prize Machine） */
export const machine = {
  model: 'PM-527',
  serial: 'NO.0002 / 2026',
  maker: 'PAN YULONG WORKS',
  batch: '2026 Q4',
  coinSlogan: '投入简历 · 开始扭蛋',
  capacity: '本机共 4 颗胶囊：常规 3 颗 + 限定金色 1 颗',
  capsuleCount: 4,
  notice: '本机为第一视角舱内模型。胶囊内页所有数据均为真实履历，编号与机台标签一一对应。',
};

export const navLinks = [
  { id: 'work', label: '胶囊货架', latin: 'CAPSULES' },
  { id: 'roster', label: '中奖名录', latin: 'ROSTER' },
  { id: 'contact', label: '兑奖处', latin: 'REDEEM' },
];

export type CapsuleColor = 'punch' | 'cobalt' | 'capsule' | 'gold';

export type Project = {
  index: string;
  /** 机台标签编号 = PM-序号，与胶囊一一对应 */
  code: string;
  name: string;
  /** 品名（玩具说明书口径） */
  goods: string;
  category: string;
  metric: string;
  summary: string;
  bullets: string[];
  image: string;
  hoverVideo?: string;
  url: string;
  color: CapsuleColor;
};

export const projects: Project[] = [
  {
    index: '01',
    code: 'PM-01',
    name: 'Porsche 911 Legend Exhibition',
    goods: '沉浸展 · 时光隧道',
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
    color: 'punch',
  },
  {
    index: '02',
    code: 'PM-02',
    name: 'Huawei Cloud · 快成长直播',
    goods: '技术直播栏目 · 可复制',
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
    color: 'cobalt',
  },
  {
    index: '03',
    code: 'PM-03',
    name: 'Tencent Digital Ecosystem Summit',
    goods: '生态大会 · 传播矩阵',
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
    color: 'capsule',
  },
];

/** 限定彩蛋：金色胶囊（粤语学习 Web App），编号 PM-00 表示「非常规出货」 */
export const cantoneseProject = {
  index: '00',
  code: 'PM-00',
  color: 'gold' as CapsuleColor,
  name: '粤语 · 学嘢',
  goods: '限定彩蛋 · 粤语学习 App',
  category: 'Solo Frontend · Side Project',
  metric: '8,412 词条 · 跟读评分延迟 140ms',
  url: 'https://hk.datatrade.top/',
  summary:
    '一个人做完的粤语学习 Web App：词库、跟读评分、滚动式卡片。字符雨那段动画就是这个项目里的组件搬过来的。',
  bullets: [
    '词库 8,412 条，全部手工校对与注音（jyutping）',
    '跟读评分端到端延迟压到 140ms，手机麦克风即可用',
    '2025-11 上线，前后端与部署全部独立完成',
  ],
  stats: [
    { label: '词条', value: '8,412' },
    { label: '跟读评分延迟', value: '140ms' },
    { label: '上线时间', value: '2025-11' },
  ],
};

/** 中奖名录：五段在职履历（顺序=在职先后）。
 *  起止年份与完整项目清单以随附 PDF 为准——本页不写没有出处的日期。 */
export const roster = {
  headline: '15 年 · 527 个项目',
  figures: [
    { label: '从业年数', value: '15', unit: '年' },
    { label: '累计执行项目', value: '527', unit: '个' },
    { label: '单次最大并发直播', value: '12,000', unit: '人在线' },
  ],
  note: '名录为在职先后顺序；起止年份、完整项目清单以随附 PDF 简历为准，本页不重复列，避免两处口径不一致。',
  entries: [
    { code: 'NM-01', org: '微吼', kind: '企业级直播技术服务商', line: '直播技术与规模化交付' },
    { code: 'NM-02', org: '财视', kind: '财经视频媒体', line: '视频内容与客户活动' },
    { code: 'NM-03', org: '峰可达', kind: '线下体验营销公司', line: '汽车与品牌线下体验' },
    { code: 'NM-04', org: '中青旅', kind: '旅游与整合营销', line: '大型活动与差旅接待' },
    { code: 'NM-05', org: '携程', kind: 'OTA 出行平台', line: '平台侧活动与增长' },
  ],
};

export const socials = [
  { name: '小红书', url: 'https://xhslink.com/m/5DkJLXbYHA4', note: '现场 vlog / 布展拆解' },
  { name: 'CSDN', url: 'https://blog.csdn.net/patrickstar231', note: '推流与前端工程笔记' },
  { name: '知乎', url: 'https://www.zhihu.com/people/patrick-pan-7', note: '活动增长方法论' },
];

/** 灯箱跑马灯词带：机台丝印词汇 */
export const marqueeWords = [
  'insert resume',
  'turn the knob',
  'porsche',
  'huawei cloud',
  'tencent des',
  'cantonese',
  '527 projects',
  'no re-runs',
];
