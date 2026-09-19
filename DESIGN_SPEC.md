# 潘宇龙 · 简历站设计规范 —— 午夜购物频道 CHANNEL 潘

> 分支 `design-review-0919-a-channel` · 基点 `c281396` · 本文件取代 v1「荒诞高级」规范。
> 方法论：narrative-driven —— 整站是一档永不打烊的深夜电视购物节目：职业生涯项目=在售商品，
> 面试官=观众。荒诞来自购物话术的认真劲儿，逻辑来自每个"商品参数"都是真实数据。

## 1. Register（五旋钮，逐档附证据）

| 旋钮 | 取值 | 证据 |
|---|---|---|
| Energy | 响 | 用户要求"浮夸强吸引眼球"；SMPTE 高饱和实色块满屏 |
| Finish | raw-CRT | 扫描线/雪花/塑料按键/走带字幕；无玻璃无软阴影 |
| Density | 中密 | 一屏一档节目 + 底部 teleticker 信息字幕条 |
| Weight | 重 | Bungee 台标大字 + 价格签 5rem 级数字 |
| Seriousness | 戏谑但零差错 | 话术浮夸（"本台成交记录"），数据全部真实可验证 |

## 2. Color（全部实色，禁装饰渐变）

| Token | Hex | 用途 |
|---|---|---|
| ink / ink-soft | `#141210` `#1D1A16` | 暖墨黑底（禁紫调） |
| screen / screen-dim | `#0B0C0A` `#16180F` | 屏幕黑，仅电视机屏幕内部 |
| vermilion | `#E2472E` | 朱红：频道条 / 主 CTA |
| lemon | `#F2C230` | 柠檬黄：价格签 / 成交数字 |
| phosphor | `#38B45C` | 磷光绿：ON AIR / 在架状态 |
| cyanbar | `#2E9AA6` | 青棒：测试卡 / 次级标记 |
| cream | `#F2E9DC` | 米白正文（on ink 对比 ≥4.5:1） |
| muted / line | `#B9AD9B` `#3A342C` | 弱化文字 / hairline 分隔 |

## 3. Typography

- Latin（Google Fonts）：display `Bungee`（台标/频道号/价格签）；正文与数据 `IBM Plex Mono`（电传感）
- CJK：`jfOpenHuninn`（emfont CDN，失败静默回退）→ `PingFang SC` / `Hiragino Sans GB`
- 禁 Noto Sans SC 作 styled 主字体；display `clamp(2.5rem,7.2vw,5.75rem)` / lh 0.94

## 4. 结构与交互

1. **Splash 测试卡**（`TestCard.tsx`）：SMPTE 彩条 + 中央倒计时 5→1 → ON AIR，≤2s，可点击/Esc 跳过；reduced-motion 直接显示内容
2. **电视机主体**（`TvSet.tsx` + `src/crt/CrtLayer.tsx`）：三档节目 CH01 保时捷911传奇展 / CH02 华为快成长直播 / CH03 腾讯生态大会；屏幕内视频（`/media/hover-*.mp4`，HEAD 探测回落静态图）叠 CRT shader（扫描线/桶形畸变/噪点）；屏幕外「商品规格表」：已售台数=980M+ 曝光、单次使用时长=65 分钟、退货率=-41% 排队流失
3. **悬浮遥控器**（`Remote.tsx` + `state/tuner.ts`）：数字键 0-3 换台（120ms 雪花 noise 闪断）、POWER 回测试卡、VOL 旋钮驱动滚动；键盘 1/2/3/Esc/方向键同步；移动端折叠为底部一条 bar
4. **teleticker 字幕条**：跑马承载真实履历（PMP+巨量引擎+互联网营销师、15 年时间线）
5. **热线/下单**：粤语项目 hk.datatrade.top=姊妹栏目；社媒三链+二维码=观众热线；Contact=「限时下单」mailto + PDF 下载；状态做成"库存：2026 Q4 可预订"

## 5. Motion

- 换台：120ms 雪花硬切（linear snap，刻意不用缓动，模拟信号切换）
- 按键：按下 scale 0.96 + 实色凹陷；VOL 旋钮 rotate 跟手
- `prefers-reduced-motion`：CRT 装饰层=0、走带=0、视频 paused，电视机退化为静态实色框，内容完整可读
- 装饰 canvas `aria-hidden`；focus 2px 实线 outline；交互 ≥44px；Lenis 只平滑不劫持

## 6. 素材与红线

- 图片仅 `public/images/*`（life 为无人物版）；视频仅 `public/media/*.mp4`；本人照片绝不上站
- 全部数字/链接来自 `src/data/site.ts`，无虚构 testimonial、无假数据
- 图标 `src/components/icons.tsx` 手绘单色描边 SVG

## 7. 验证

- `tsc --noEmit` + `vite build` 通过
- `tools/verify-headless.mjs`：桌面 1440×900 全频道 / 移动 390×844 换台与遥控器折叠 / reduced-motion 三组
  RESULT: PASS；console 错误 0；无横向溢出；截图存 `.design-qa/`（不入库）
