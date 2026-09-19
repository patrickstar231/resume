# 潘宇龙 · 简历站设计规范 —— 巨型扭蛋机 THE PRIZE MACHINE

> 分支 `design-review-0919-c-prize` · 基点 `c281396` · 本文件取代 v1「荒诞高级」与「Xeroxed 纸」规范。
> 方法论：Material Metaphor =「注塑塑料 × 游戏厅灯箱」。整站是一台第一视角舱内的巨型扭蛋机：
> 每段职业经历是一颗胶囊，"抓到才算看过简历"；机台标签用玩具说明书式的编号承载全部真实数据。

## 1. Register（五旋钮，逐档附证据）

| 旋钮 | 取值 | 证据 |
|---|---|---|
| Energy | 响 | 用户要求"浮夸且有趣、强吸引眼球"；玩具三原色实块铺满机台 |
| Finish | 注塑玩具 | 2px 巧克力棕硬描边 + 模压 1px 上缘亮线；无玻璃拟态、无装饰渐变 |
| Density | 中高 | 机舱内物件多；DOM 信息集中在胶囊抽屉与机台标签，靠描边分区而非留白 |
| Weight | 重 | Archivo Black 大标 + 粗标签字；层级靠字重与色块，不靠阴影堆叠 |
| Seriousness | 戏谑但零差错 | 荒诞在"简历=抽奖机"的概念，严谨在每颗胶囊开出的都是真实履历数据 |

## 2. Color（全部实色，禁渐变）

| Token | Hex | 用途 |
|---|---|---|
| shell | `#F6F1E7` | 机壳奶白，页面主底（整站浅色，区别于深色作品集默认） |
| plate | `#FFFCF3` | 面板内衬塑料白 |
| ink | `#2B2320` | 描线巧克力棕：全部 2px 硬描边与正文（on shell 对比 ≥ 4.5:1） |
| punch | `#E23B2E` | 大红：主 CTA / 投币 /「扭开这颗」 |
| capsule | `#F5C518` | 明黄：胶囊 / 强调标签，面积 ≤10% |
| cobalt | `#2456C7` | 钴蓝：次级面板（取物盘）/ 链接 hover |
| liner | `#1D2B36` | 机舱内衬深蓝：仅出现在机器玻璃后方 |
| gold | `#C99320` | 限定彩蛋哑光金（粤语项目），非渐变 |

## 3. Typography

- Latin（Google Fonts）：display `Archivo Black`；正文 `Work Sans` 400–700
- CJK：`jfOpenHuninn`（emfont CDN，加载失败静默回退）→ `PingFang SC` / `Hiragino Sans`
- 禁用 Noto Sans SC / 思源黑体作 styled 主字体（AI tell）
- 字阶：display `clamp(2.9rem,8.4vw,7.5rem)` / lh 0.9；正文 16px lh 1.68；机台标签 14px ls 0.05em

## 4. 结构与交互

1. **Splash 投币开机**：2px 描边投币口，CTA「投入简历 · 开始扭蛋」；点击/任意键进入；reduced-motion 直接跳过
2. **主场景 WebGL 舱内**（`src/canvas/PrizeCabin.tsx`）：三原色胶囊堆叠于弧形玻璃仓，滚动+指针弹簧晃动（自写物理，无新依赖）；当期胶囊沿滑道缓降
3. **扭蛋核心**（`CapsuleShelf.tsx`）：胶囊落入取物盘 → 点击两半弹开 → 展开 DOM 项目卡（真实 metric + 官网外链 + hover 视频，HEAD 探测回落静态图）；Enter/Space 可开，aria-live 播报可开项
4. **兜底路径**：每颗胶囊下方机台标签已含"品名+编号+一句话参数"，内容永不被交互隐藏
5. **中奖名录**（`Roster.tsx`）：旋转木马滚轮承载 15 年履历时间线；金色限定彩蛋 = 粤语项目 hk.datatrade.top
6. **兑奖处**（`Redeem.tsx`）：mailto + PDF 下载 + 状态「2026 Q4 · 补货中」；社媒三链+二维码 = 粉丝俱乐部贴纸区
7. **移动端 390×844**：不挂 WebGL，退化为静态机台插画（CSS 实色块拼合）；取物盘改段内铭牌（in-flow），不悬浮压标签

## 5. Motion

- 开蛋：framer-motion 两半壳 rotateX 分离 + 内页 y 弹出（stiffness 260 / damping 24）
- 胶囊沉降：指针驱动弹簧，阻尼 0.85，静止 300ms 归位
- `prefers-reduced-motion`：胶囊静止陈列、全部胶囊卡默认展开、无滚动驱动动画
- 装饰 canvas `aria-hidden`；焦点 2px 棕 outline + offset；交互 ≥44px（`--spacing-hit`）

## 6. 素材与红线

- 图片仅 `public/images/*`（porsche1/huawei1/tencent1/life 无人物版）；视频仅 `public/media/*.mp4`
- 本人照片绝不上站；所有数字/链接来自 `src/data/site.ts`，无虚构
- 图标：`src/components/icons.tsx` 手绘单色 2px 描边 SVG，24×24 网格

## 7. 验证

- `tsc --noEmit` + `vite build` 通过（首屏 JS 126KB gz，WebGL 异步块 237KB gz）
- `tools/verify-headless.mjs`：桌面 1440×900 / 移动 390×844 / reduced-motion 三组，
  console 零报错、无横向溢出、命中区违例 0，RESULT: PASS；截图存 `.design-qa/`（不入库）
