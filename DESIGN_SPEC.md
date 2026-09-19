# 潘宇龙 · 简历站设计规范 —— 过山车简历 SCROLL COASTER

> 分支 `design-review-0919-b-coaster` · 基点 `c281396` · 本文件取代 v1「荒诞高级」规范。
> 方法论：Material Metaphor + 连续叙事 —— 滚动即乘坐：相机沿 CatmullRom 轨道被滚动 hijack，
> 三大项目是轨道上的三座站台，视频是站台的巨型 billboard 屏。荒诞在"职业轨迹"被字面做成轨迹，
> 逻辑在乘坐节奏=简历阅读顺序、每个数字真实。

## 1. Register（五旋钮，逐档附证据）

| 旋钮 | 取值 | 证据 |
|---|---|---|
| Energy | 响 | 游乐园白昼系配色 + 全程运镜 |
| Finish | 漆面金属+票根纸 | 平涂明暗两面 + 2px 硬边描边 + 半调网点地；禁渐变禁glow |
| Density | 中 | 3D 世界留白，DOM 面板按站点进度区间淡入 |
| Weight | 重 | Alfa Slab One 站牌大字（最大 7rem） |
| Seriousness | 游乐但零差错 | 页面无一处装饰性假数据 |

## 2. Color（全部实色平涂）

| Token | Hex | 用途 |
|---|---|---|
| night / night-lift | `#0F2018` `#16301F` | 深松绿夜空底（禁紫调禁纯黑）/ 丘陵亮面 |
| edge / ink | `#0A1410` | 硬边描边 2px / 票根正文色 |
| candy / candy-shade | `#D93A2B` `#A92A1F` | 糖果苹果红：轨道/主 CTA / 平涂暗面 |
| cream / cream-shade | `#F4EBDD` `#DED2C0` | 正文/票根纸 / 纸面暗面 |
| brass | `#D9A441` | 黄铜金：仅票根齿孔与编号，面积 ≤8% |

## 3. Typography

- Latin（Google Fonts）：display `Alfa Slab One`（站牌/大数字）；正文 `Archivo`
- CJK：`ChironHeiHK`（emfont CDN，失败静默回退）→ `PingFang SC` / `Hiragino Sans`
- 禁 Noto Sans SC 作 styled 主字体；站牌 `clamp(2.6rem,8.4vw,7rem)` / lh 0.9；正文 ≥14px

## 4. 结构与交互

1. **Splash 售票亭**（`TicketBooth.tsx`）：奶油票根（CSS mask 齿孔边）+ PANYULONG / ADMIT ONE + 红印章 0.8s → 闸门开启；可跳过
2. **主场景 WebGL**（`canvas/CoasterCanvas.tsx` + `state/coaster.ts`）：TubeGeometry 红白条纹轨道（螺旋/爬坡/回旋）、半调网点丘陵背景、三座站台 billboard 贴 `/media/hover-*.mp4` 视频纹理（HEAD 探测回落 `/images/*.jpg`）；相机进度 = clamp(scrollY/(总高-视口))；滚动提速 FOV 上限 +6° 做速度感；指针 ±2° 微转向
3. **站点面板**（`Ride.tsx`）：DOM 内容按站点进度区间淡入（framer-motion whileInView + 区间判断）；每站「下车游览 · 官网 ↗」外链
4. **观景台**：关于+方法论 + 三块浮空数据碑（527 项目 / 0 重大事故 / 2.3B 曝光）；粤语项目=「隐藏项目·夜场」小站牌；社媒三链+二维码=「园区地图·出口」
5. **终点站台**：Contact「到站 · 交换名片」+ mailto + PDF
6. **FAST PASS**：导航=程序化平滑滚动到站点区间，不劫持原生 wheel；移动端 390×844：不挂满幅 3D，退化为竖向站点卡流（卡内保留视频纹理），dpr 上限降档、出视口 frameloop=never

## 5. Motion

- 相机推进：滚动驱动，Lenis 平滑 + 阻尼跟随；面板入场 y 30→0 / 0.7s ease-out，退场更快（连续性优先）
- `prefers-reduced-motion`：相机冻结终点全景，站点退化为完整静态卡片流（9 区块全在文档流），内容零隐藏
- 装饰 canvas `aria-hidden`；focus 2px outline；交互 ≥44px；HUD 底部进度条=真实滚动位置读数

## 6. 素材与红线

- 图片仅 `public/images/*`（life 为无人物版）；视频仅 `public/media/*.mp4`；本人照片绝不上站
- 全部数字/链接来自 `src/data/site.ts`；图标单色描边 SVG
- 性能：WebGL 懒加载异步块；`tsc + vite build` 通过

## 7. 验证

- `tools/verify-headless.mjs`：桌面滚动 0/25/50/75/100% 五帧 + FAST PASS 到站 / 移动竖向卡流 / reduced-motion
  RESULT: PASS；三视口 console 错误 0；无横向溢出；正文 ≥14px、命中区全达标；截图存 `.design-qa/`（不入库）
