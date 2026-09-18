# 潘宇龙 · 3D Video Parallax 简历站 — 设计规范

工程：`resume-parallax/` · 栈：Vite 7 + React 19 + TS + Tailwind v4（`@theme` 单一 token 源）+ three/R3F + Lenis + framer-motion
Token 落地文件：`src/index.css`（下表与代码不一致时以代码为准）

---

## 1. 定位与 Register

Innovation Track / 品牌驱动。方法论：**Material Metaphor = 「Xeroxed 哑光纸 × 剧场黑幕」**，动效原型取 Click（磁吸卡扣）与 Flow（蜂蜜倾倒）两档。

五档旋钮，每档都附证据：

| 旋钮 | 取值 | 证据 |
|---|---|---|
| Energy | 偏静，单点高饱和 | 简历站是阅读场景；强调色只允许出现在 3 处（斜体词、metric、hover） |
| Finish | raw | 「把现场做成系统」的物料感来自布展现场：胶片颗粒、硬边、hairline 描边，不是玻璃卡片 |
| Density | 疏 | 每屏一个信息重点；section 纵向 padding `clamp(6rem,14vh,9rem)` |
| Weight | 重 | Instrument Serif 大字（display 最大 9rem）+ 实色奶油按钮块，无阴影堆叠 |
| Seriousness | 中偏正，留一处荒诞 | Splash 的百叶幕布、切片石膏像、死板重复的 WordBand 承担幽默，其余保持工程克制 |

「高级感 / 精致 / 克制」这类词不进入决策，只翻译成上表的可观察值。

## 2. Hero = Tier E（沉浸式），及它凭什么

- tier: `E`；rationale：项目本身卖的就是「3D 视频视差」这一技术能力，WebGL 是内容而非装饰，属于旗舰个人站的一次性发布时刻。
- 可信素材门槛：`/images/hero-bust.jpg`（真实生成的半身像位图，作为真 3D 几何的贴图）+ 真实项目实拍 + 真实生活照。未使用灰块、假 stock、装饰性 SVG 占位。
- primary_action：`给潘宇龙写封邮件`（mailto，动词短语、指名）；secondary：`看三个落地项目`（纯排版下划线链接，非第二颗等权重按钮）。
- composition：文案左下角锚定 + 3D 主体右上，非居中三件套。
- anti-pattern check：居中堆叠按钮 PASS · 双等权 CTA PASS · stock 矢量小人 PASS · AI 装饰渐变 PASS · 重绘浏览器外壳 PASS。

## 3. Color

| Token | 值 | 用途 |
|---|---|---|
| `--color-ink` | `#0b0a09` | 幕布/遮罩块、实色文字反白底 |
| `--color-bg` | `#121110` | 主背景（暖中性炭黑，**禁止**偏紫） |
| `--color-surface` / `--color-raised` | `#1a1817` / `#232120` | 卡片、3D 切片背面材质 |
| `--color-line` / `--color-line-strong` | cream @12% / @28% | hairline 分隔、描边 |
| `--color-cream` | `#f2efe6` | 正文与主按钮底色 |
| `--color-muted` | `#a29a8d` | eyebrow、说明文字 |
| `--color-brass` | `#c08a3e` | 唯一主强调：斜体词、hover、focus ring、页脚光晕 |
| `--color-verdigris` | `#5e8c7f` | 反向补色：可用状态点、次级 hover，避免单音色 |
| `--color-signal` | `#d9502f` | 预留（错误/强提示），当前仅 3D 侧光 |

禁用组合：紫黑底 + 霓虹青发光、渐变文字、渐变按钮。

## 4. Typography

角色阶梯（唯一合法字号来源，任何屏都不允许出现一次性 px/text-[N] 覆盖）：

- `display` `clamp(3.5rem,11vw,9rem)` / lh .92 / ls -.02em — 仅 Hero H1
- `h1` `clamp(2.25rem,5vw,4rem)` — section 主标题
- `h2` `clamp(1.6rem,3vw,2.4rem)` · `h3` `1.35rem`（项目卡名）
- `lede` `clamp(1.05rem,1.5vw,1.25rem)` / lh 1.6 — 正文引导段
- `body` `1rem` / lh 1.65 · `caption` `.8125rem` / ls .14em / uppercase（`label-mono` utility）

家族：`font-display` Instrument Serif（含斜体，用于强调词）· `font-sans` Archivo · `font-mono` JetBrains Mono。第三家 mono 由品牌关键词「前端 / code / 工程」授权，只出现在 label 与数据上。
中文：系统栈 `PingFang SC → Hiragino Sans → Microsoft YaHei`（见 §9 偏差 3）。

## 5. Spacing / Radius / 边缘

`--spacing-section-y` `clamp(6rem,14vh,9rem)` · `--spacing-section-x` `clamp(1.25rem,5vw,5rem)` · stack sm/md/lg/xl = .75 / 1.5 / 3 / 5rem。
`--radius-card: 0px`（所有卡与按钮直角）· `--radius-frame: 2px`（图片框）。层次靠 1px hairline + 明度台阶 + `grain`（feTurbulence 噪点，opacity .045）建立，不靠投影。

## 6. 组件配方（8 态）

**Primary button（Hero CTA / 下载简历）**
```
default  inline-flex min-h-[48px] items-center gap-3 bg-cream px-7 py-3 text-ink
hover    hover:bg-brass                      （提亮+换色，不位移、不阴影）
focus    :focus-visible 2px brass outline, offset 3–4px
active   active:scale-[0.98]                 （卡扣式触觉，≈80ms）
disabled —  本页无禁用态（表单不存在）
loading  —  无异步动作
error    —  同上
success  —  同上
```
**Secondary / typographic link**：`label-mono text-cream underline underline-offset-8 decoration-line-strong hover:text-brass`；下划线即其边框，不做 pill 按钮。
**Outline button（About 实况链接 / 项目卡「打开项目现场」）**：`border border-line-strong text-cream hover:border-brass hover:text-brass active:scale-[0.98]`，min-h 44–48px。
**Nav item**：`label-mono text-muted hover:text-cream transition-colors duration-200`，当前态用 brass（logo 星号）。
**Social pill**：`border border-line bg-surface p-5 hover:border-brass focus-visible:border-brass`，左侧 icon 方块 `bg-cream group-hover:bg-brass`；hover 同时展开 QR（`QRCodeSVG`，真实链接）。
**Project sticky card**：`top: 96 + index*28` 层叠，`targetScale = 1 - (total-1-index)*0.03`；媒体区 `hover:scale-[1.02] duration-500 ease-out`，有 webm 时 hover 播放静音视频，无视频则保持实拍图。
**Marquee**：图片行 `scrollYProgress → x ['6%','-18%']` 与反向双排；WordBand 为 38s linear 无限横移的死板重复条。

## 7. Motion

| 动效 | 目的 | 参数 | reduced-motion |
|---|---|---|---|
| Splash 幕布 | Brand | 2×5 `bg-ink` 块 `rotateX ±92°`，起点 .72s，列 stagger .05s；1450ms 卸载；`aria-hidden` | 整段跳过 |
| Splash 姓名 | Guidance | 逐字 blur→focus，stagger .045s | 直接显示 |
| Hero 3D | Continuity | `heroProgress = clamp(scrollY/innerHeight)`；rotation.y `-0.42 + p*0.9 + pointer.x*0.16`；切片 spread `0.1 + p*0.46`；camera z `5.1 - p*1.5`；阻尼 `1-e^(-5Δ)` | spread 固定 .16，指针视差归零 |
| Magnetic 按钮 | Feedback | 半径 padding 120px，强度 4，spring 320/22/0.6 | 关闭；coarse pointer 亦关闭 |
| 字符级揭示（About） | Guidance | 每字 `opacity [0.18→1]`，区间 `[start, start+0.22]`，offset `['start 0.85','end 0.35']` | 直接全显 |
| GlyphRain | Brand | 2D canvas，46 个真实粵字，DPR≤2，离屏 IntersectionObserver 暂停，radial mask 让文字列保持干净 | 不挂载 |
| 视频 UV 偏移 | Brand | `VideoTexture.offset.y` 跟 `heroProgress` | 不加载视频 |

全局：只动画 `transform` / `opacity`；入场 ease-out、出场 ease-in；`prefers-reduced-motion` 有 CSS 兜底 + 组件级判断双保险。

## 8. 素材清单与生成规格

| 路径 | 状态 | 规格 |
|---|---|---|
| `public/images/hero-bust.jpg` | 已就位 | 460×1088 半身像，等分三段可切片，暖灰底 |
| `public/images/{porsche1,huawei1,tencent1}.jpg` | 已就位 | 真实项目现场，16:9 |
| `public/images/life/{dinner,teahouse}.jpg` | 已就位 | 真实生活/现场照 |
| `public/resume-panyulong.pdf` | 已就位 | 下载链接；ASCII 文件名避免 URL percent-encode，`download="潘宇龙 · 简历.pdf"` 保留保存时的中文名 |
| `public/media/hero-loop.mp4` | 已就位 | 实测 1215 KiB / 10.04s / 960×528 / 24fps；16:9 横构图（背景平面 30×17，竖构图会被拉伸）、H.264、无声 |
| `public/media/hover-{porsche,huawei,tencent}.mp4` | 已就位 | 实测 318 / 320 / 316 KiB，5.04s；hover 才 `play()`，离开设 `currentTime = 0` 并暂停 |
| `public/media/footer-reverse.mp4` | 已就位 | 实测 527 KiB / 6.04s，由 `raw-media/footer.mp4`（正向撤场）经 `--reverse` 得到；仅在页脚进入视口前 300px 才挂载，`opacity-[0.14]` + `bg-ink/80` 压暗层保证正文对比度不变，reduced-motion 下不挂载 |
| `public/models/*.glb` | 可选 | ≤3MB、Draco、单材质 |

生成提示词（已按此出片，保留备查/重出）：
- Hero 视频：`horizontal 16:9 seamless loop, dark exhibition hall, slow dolly past a marble bust under a single warm spotlight, dust in the beam, film grain, no people, no text, 12s, muted charcoal and brass palette`
- 项目 hover：`handheld behind-the-scenes clip of a [car launch / live streaming control desk / conference main stage], low light, motion blur, documentary feel, no logos, no captions`
- 页脚：拍**正向撤场**（`late-night teardown of a conference hall: crews carrying rows of chairs out, lighting trusses being lowered, LED panels powering off one by one, static camera, cold teal with lingering warm light`），倒放由 `tools/transcode.swift --reverse` 完成——倒过来才读成「现场自行复原 / 时间倒带」，对应页脚文案「下一场现场，交给你。」

### 8.1 投料与转码（已落地，零安装）

本机事实：`which ffmpeg` 为空；`~/Library/Caches/ms-playwright/ffmpeg-1011/ffmpeg-mac` 是 Playwright 精简构建（`--disable-everything`，只有 libvpx/webm、`scale/crop/pad` 滤镜，**没有** `reverse`、**没有** libx264、**没有** mp4 封装）。
`/usr/bin/avconvert` 可用但**不能指定码率**：实测 5s 素材经 `Preset960x540` 后仍有 1.9–2.8MB，页脚 3.1MB，全部超预算。
最终方案：`tools/transcode.swift`（`swiftc` + AVFoundation `AVAssetReader`/`AVAssetWriter`），可控码率、可倒放、丢音轨，无需安装任何东西。

```bash
swiftc -O tools/transcode.swift -o /tmp/transcode
T=/tmp/transcode
$T --in raw-media/Hero.mp4    --out public/media/hero-loop.mp4        --bitrate 1000000   # 1215 KiB / 241 帧
$T --in raw-media/porshe.mp4  --out public/media/hover-porsche.mp4    --bitrate 500000    # 318 KiB
$T --in raw-media/huawei.mp4  --out public/media/hover-huawei.mp4     --bitrate 500000    # 320 KiB
$T --in raw-media/tencent.mp4 --out public/media/hover-tencent.mp4    --bitrate 500000    # 316 KiB
$T --in raw-media/footer.mp4  --out public/media/footer-reverse.mp4   --reverse --bitrate 700000  # 527 KiB
```

码率按预算反推：`bitrate ≈ 预算字节 × 8 ÷ 时长 × 0.8`。分辨率沿用素材原尺寸 960×528（不做缩放，避免额外的像素转换链）。

三个必须记住的 API 坑：
1. `expectsMediaDataInRealTime = false` 仍会跑赢编码器，队列满时 `appendSampleBuffer` **抛 ObjC 异常**，必须等 `isReadyForMoreMediaData`；
2. `endSession(atSourceTime:)` 只关采样会话、**不写 trailer**，状态永远停在 `.writing` 且产物缺 moov 不可播；收尾要用 `finishWriting {}`（头文件明确说明不必先 endSession）；
3. 倒放需要整段驻留内存（6s@960×528≈110MB），因此 `alwaysCopiesSampleData` 只在 `--reverse` 时打开。

## 9. 与需求文档的偏差（明确记录）

1. **不用 GSAP**：滚动进度由 Lenis + `scrollState` 单一 store 提供，framer-motion 负责 DOM 动画；省一个 30KB 级依赖，行为等价。
2. **不用 drei `ScrollControls`**：它会接管滚动，破坏原生 sticky、锚点与读屏顺序。Hero 进度改为 `clamp(scrollY / innerHeight)`。
3. **中文字体未子集化**：`emfont` 取源技能在本环境不可用，中文走系统栈。上线前建议补一组思源宋体/黑体子集并注册为 `--font-display` 的中文回退。
4. **视频层为「探测式」**：`fetch(..., {method:'HEAD'})` 判断 `/media/*` 是否存在，存在才挂载 `VideoTexture` / hover 播放；探测同时要求响应 `content-type` 以 `video/` 开头——dev/preview 服务器会用 200 + index.html 兜底未知路径，只看 `res.ok` 会把 HTML 当视频纹理挂上去。
5. **依赖清理**：`@react-three/drei` 未被引用，已移除。
6. **WebGL 覆盖层用 `style` 而非 class**：R3F 在容器 div 上写内联 `position: relative; pointer-events: auto`，Tailwind 的 `!fixed / pointer-events-none` 打不过内联样式，会在整个视口拦截点击。改为给 `<Canvas style={{position:'fixed', inset:0, pointerEvents:'none'}}>`，R3F 会把 `style` 合并到基础样式之后，才能覆盖。

## 10. 性能预算实测（`npm run build`）

| 指标 | 预算 | 实测 |
|---|---|---|
| 首屏阻塞 JS | ≤300KB gz | **119.73KB gz**（`index-*.js`，WebGL 已改 `lazy()` + `manualChunks.webgl`） |
| WebGL 异步块 | 非阻塞 | 237.29KB gz（three + R3F，仅首屏并行下载，不挡渲染） |
| HeroCanvas 异步块 | 非阻塞 | 1.50KB gz |
| CSS | — | 5.90KB gz |
| CLS | 0 | 0（canvas 容器 inline `position:fixed`，sticky 卡不改变文档高度） |
| DPR | ≤2 | `dpr={[1,2]}`，canvas 离屏 `frameloop='never'` |
| 首屏媒体 | ≤2MB | `hero-loop.mp4` 1215 KiB（`preload='auto'`，作为 VideoTexture 与 WebGL 块并行下载）；3 个 hover 共 954 KiB，只在 hover 时 `play()`；页脚 527 KiB，进入视口前 300px 才挂载 |
| 各屏视觉复验 | — | 已完成（素材接入后）：无头 Chrome 1440×900 / 390×844 / reduced-motion 三轮共 15 屏，console 零报错，`bodyW === innerW`，hover 视频 `readyState 4` 且 `currentTime` 推进、页脚倒放层时钟 2.46→3.36 |
| Lighthouse ≥85 | 待线上复测 | 需部署 URL |

## 11. 无障碍实测

WCAG 相对亮度计算（正文最小字号为 13px uppercase，按 4.5:1 判定）：

| 前景 / 背景 | 比值 | 判定 |
|---|---|---|
| cream `#f2efe6` / bg `#121110` | 16.40 | AAA |
| muted `#a29a8d` / bg | 6.77 | AA |
| brass `#c08a3e` / bg | 6.24 | AA |
| cream 60% 合成 / bg（WordBand） | 6.38 | AA |
| verdigris `#5e8c7f` / bg（最低一档） | 4.97 | AA |
| ink / brass（实色按钮 hover） | 6.54 | AA |

**叠加实时视频纹理后的复测**（上面的表只算纯色背景；接入 `hero-loop.mp4` 后背景亮度不再恒定，必须重测）：

| 文案 | 接入前 | 修复后（桌面 / 移动） |
|---|---|---|
| hero label（muted 13px） | p50 4.38，59.7% 面积 <4.5:1 | **6.97 / 6.88**，0% |
| hero h1（cream display） | worst 1.07（brass 斜体压在视频高光上） | **16.88 / 16.51**，0% |
| hero lede（muted） | p50 6.82，19.0% 面积 <4.5:1 | **7.06 / 6.76**，0% |

两处修复：
1. 桌面加一层自左向右的墨色压暗纱（`from-ink via-ink/80 to-transparent`，宽 64%，`lg:block`），文案列落在纯墨区，右侧视频与雕塑保持原亮度；
2. 移动端不是遮罩能解决的问题——竖屏视口只采样到 30×17 背景平面中央约 4.3 单位宽的一条，等于把视频正中的石膏像放大压在文案上，白色大理石亮度 L≈0.5，再加纱也到不了 4.5:1。改为 `VideoPlane` 在 `size.width < 900` 时把平面沿 +x 平移 6.5 单位（文案区落到视频左侧暗走廊），并叠一层 `bg-ink/55 lg:hidden` 整屏薄纱。

触控目标：主/次按钮 `min-h-[44~48px]`；导航与页脚文字链用 `before:absolute before:-inset-y-*` 伪元素把命中区扩到 ≥44px 而不改变视觉行高。焦点：全局 `:focus-visible` 2px brass + offset 3px。装饰层（canvas、Splash、噪点、箭头符号）全部 `aria-hidden`。锚点 `#top / #work / #about / #contact` 均有对应 id。

## 12. 部署

`vercel.json`：`/media/*`、`/assets/*`、`/models/*` → `public, max-age=31536000, immutable`（media 另加 `Accept-Ranges: bytes`）；`/images/*` → 7 天 + stale-if-error。

版本库：`patrickstar231/resume` 分支 `feat/3d-video-parallax-standalone`（与老站 `main` 是两条独立历史，不交叉 merge）。`.gitignore` 排除 `node_modules/`（154MB）、`dist/`（6.9MB）、`raw-media/`（14MB 原始投料）；入库 32 个文件约 5MB，最大单文件 `hero-loop.mp4` 1.2MB，不需要 Git LFS。

**Tailwind v4 自动内容扫描的两个坑（实测）**：① 它遵守 `.gitignore`——在补 `.gitignore` 之前它会扫 `dist/`，把上一次构建产物里的类名当来源，CSS 体积自我放大（26.88 kB → 加 ignore 后 23.60 kB）。② `*.md` 正文里写的类名（如本文档提到的 `bg-ink/55`）也会生成工具类，改文档会让 CSS 漂 160B。要彻底确定化可改成 `@import 'tailwindcss' source(none)` + 显式 `@source`。

## 13. 视觉复验方法（可复现）

内置 Browser 面板处于隐藏态时（`document.visibilityState === 'hidden'`），Chrome 会冻结 `requestAnimationFrame` 与 `ResizeObserver` 派发：R3F 拿不到容器尺寸 → canvas 停在 300×150 → WebGL 一帧都不画，截图工具同时拒绝出图。这是环境限制，不是站点缺陷（同页 `dispatchEvent(new Event('resize'))` 后画布立刻变 2064×1874 可作对照实验）。

因此各屏复验走**无头 Chrome**：

```bash
mkdir -p /tmp/vischeck && cd /tmp/vischeck && npm init -y && npm i puppeteer-core   # 装在项目外，不污染 package.json
# 启动参数必须带 WebGL 软件渲染：
#   --no-sandbox --enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader
# executablePath: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

脚本按 `1440×900`、`390×844`（`isMobile + deviceScaleFactor 2`，切回桌面需显式 `isMobile:false`）、`emulateMediaFeatures(prefers-reduced-motion: reduce)` 三档各截一屏，并打印 `canvas.width/height`、`body.scrollWidth vs innerWidth` 与 console 错误列表。

**实时背景上的对比度测法**（纯色 token 算不出被视频纹理穿过的文字）：

1. 取紧贴字形的包围盒——`document.createRange()` + `selectNodeContents` + `getClientRects()`；直接用 `getBoundingClientRect()` 会拿到整块 `<p>` 的宽度（1296px），把无关背景算进去。
2. 截「只剩背景」的一张图：注入 `#top p, #top h1, #top a, #top span { color: transparent !important }`。**不能用 `visibility: hidden`**——那会连按钮自己的米白底一起藏掉，测出「墨色按钮文字 vs 视频」这种无意义的 1.8:1。
3. 用 `python3` + PIL 逐像素算 WCAG 相对亮度，对每个盒子报 `p50 / worst / 低于 4.5:1 的面积占比`。只看 p50 会漏判：label 的 p50 有 4.38 但 59.7% 的面积不达标。
4. 视口尺寸经 `VW/VH/SHOT` 环境变量传入，同一脚本跑桌面与移动端。
