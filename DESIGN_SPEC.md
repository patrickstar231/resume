# 潘宇龙 · 3D Video Parallax 简历站 — 设计规范

工程：`resume-parallax/` · 栈：Vite 7 + React 19 + TS + Tailwind v4（`@theme` 单一 token 源）+ three/R3F + Lenis + framer-motion
Token 落地文件：`src/index.css`（下表与代码不一致时以代码为准）
机器可读契约：`DESIGN.md`（frontmatter token/component 表 + 8 个必需章节，供 `design.qa.yaml` 与 `audit-design-md.mjs` 消费）；本文件保留决策理由与实测证据。

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
| Seriousness | 中偏正，留一处荒诞 | Splash 的百叶幕布、切片石膏像、Method 段落的粤语字符雨承担幽默，其余保持工程克制 |

「高级感 / 精致 / 克制」这类词不进入决策，只翻译成上表的可观察值。

## 1.5 信息架构：场刊脊（Programme Spine）

改版前的问题：`Work → About → Contact` 三段里没有任何一段回答招聘方最先问的两个问题——**你在哪家公司、担任什么职务**；同时顶部导航、双排 marquee、WordBand、独立 SocialRail 四个横条元素在抢同一层注意力。

改版后的骨架（方向 A「场刊」+ 方向 B 的表格化履历作为 Experience 实现）：

| 段 | 锚点 | 承担 | 数据来源 |
|---|---|---|---|
| 封面 | `#top` | 定位 + 一处荒诞（切片石膏像） | `profile` |
| 履历 | `#experience` | 四段任职的 `<table>` rundown：年份 / 机构·职务 / 结果 / 硬指标 | `experiences[]` |
| 素材带 | — | 单排现场照片横向滚动（原双排 marquee 去重为一排） | `shots[]` |
| 项目 | `#work` | 三张 sticky 堆叠卡 | `projects[]` |
| 方法 | `#method` | 四轨能力矩阵 + 粤语 App 实证 | `capabilities[]`、`cantoneseProject` |
| 页脚 | `#contact` | 邮件 / PDF / 三个社交 QR | `profile`、`socials` |

- **桌面**：`--spacing-spine`（15rem = 240px）常驻左轨承载元数据 + 目录（`navLinks` 四段）+ 四段任职缩略，正文列整体 `lg:pl-spine` 右移一个脊宽，全页只有一条阅读轴。当前段由 `IntersectionObserver`（`rootMargin: -45% 0px -45% 0px`）判定，写 `aria-current` + brass。
- **移动 / 平板**：脊轨折成顶栏 + `#meta-drawer` 抽屉（`aria-expanded` / `aria-controls` / Escape 关闭 / 点链接后自动收起）。
- **删除**：`WordBand`（与 `label-mono` 重复的文字横带）、独立 `SocialRail` 区块（并入页脚，社交入口全站只出现一次）。
- **保留**：Splash、3D 切片石膏像（从背景层升级为封面主体）、字符雨、页脚倒放视频。
- 文案事实全部来自 `resume-old-ref/src/constants/index.js`（唯一可引用的事实源）：机构名与职务保留英文原文，不做无法溯源的中文化。

## 2. Hero = Tier E（沉浸式），及它凭什么

- tier: `E`；rationale：项目本身卖的就是「3D 视频视差」这一技术能力，WebGL 是内容而非装饰，属于旗舰个人站的一次性发布时刻。
- 可信素材门槛：`/images/hero-bust.jpg`（真实生成的半身像位图，作为真 3D 几何的贴图）+ 真实项目实拍 + 真实生活照。未使用灰块、假 stock、装饰性 SVG 占位。
- primary_action：`给潘宇龙写封邮件`（mailto，动词短语、指名）；secondary：`先看履历表`（纯排版下划线链接 → `#experience`，非第二颗等权重按钮）。次级动作指向招聘方最先要的信息，而不是重复的三项目。
- composition：文案左下角锚定 + 3D 主体右上（桌面 `x=1.8`，避开 `lg:pl-spine` 后右移的正文列），非居中三件套。
- 封面背景保持透明：固定的 WebGL 画布在 `<main>` 之下，任何 `<main>` 上的 `bg-bg` 都会把石膏像整个盖住。不透明底从 `ExperienceSection` 的包装层才开始。
- anti-pattern check：居中堆叠按钮 PASS · 双等权 CTA PASS · stock 矢量小人 PASS · AI 装饰渐变 PASS · 重绘浏览器外壳 PASS。

## 3. Color

| Token | 值 | 用途 |
|---|---|---|
| `--color-ink` | `#0b0a09` | 幕布/遮罩块、实色文字反白底 |
| `--color-bg` | `#121110` | 主背景（暖中性炭黑，**禁止**偏紫） |
| `--color-surface` | `#1a1817` | 卡片底、hover 反白行、3D 切片背面材质（`--color-raised` / `--color-signal` 已随重构删除，代码中无引用） |
| `--color-line` / `--color-line-strong` | cream @12% / @28% | hairline 分隔、描边 |
| `--color-cream` | `#f2efe6` | 正文与主按钮底色 |
| `--color-muted` | `#a29a8d` | eyebrow、说明文字 |
| `--color-brass` | `#c08a3e` | 唯一主强调：斜体词、hover、focus ring、页脚光晕 |
| `--color-verdigris` | `#5e8c7f` | 反向补色：可用状态点、次级 hover、粤语 App 链接，避免单音色 |
| `--canvas-video-dim` | `#555555` | 非颜色 token：WebGL 背景视频 `meshBasicMaterial.color` 的压暗档，由 `themeColor()` 在运行时从 `@theme` 读取 |

3D 侧的材质色、侧光色、视频压暗档一律不写字面量：`HeroCanvas.tsx` 的 `themeColor(name, fallback)` 从 `getComputedStyle(document.documentElement)` 取值，`--color-surface` / `--color-verdigris` / `--canvas-video-dim` 与 CSS 同源。`--color-signal` 在结构级重构后已从 `@theme` 移除（无错误态可承载），3D 侧光改用 `--color-verdigris`。

禁用组合：紫黑底 + 霓虹青发光、渐变文字、渐变按钮。

## 4. Typography

角色阶梯（唯一合法字号来源，任何屏都不允许出现一次性 px/text-[N] 覆盖）：

- `display` `clamp(3.5rem,11vw,9rem)` / lh .92 / ls -.02em — 仅封面 H1（`max-w-title` = 14ch 定长）
- `h1` `clamp(2.25rem,5vw,4rem)` — section 主标题（Experience / Work / Method / Contact 各一）
- `h2` `clamp(1.6rem,3vw,2.4rem)` · `h3` `1.35rem`（项目卡名 / 能力轨名）
- `lede` `clamp(1.05rem,1.5vw,1.25rem)` / lh 1.6 — 正文引导段
- `body` `1rem` / lh 1.65 · `caption` `.8125rem` / ls .14em / uppercase（`label-mono` utility）

中文断行两条硬规则（重构后由无头 Chrome 逐屏截图复核）：
1. 所有 section 主标题带 `max-w-heading text-balance`——否则「……的标准件」会在末行掉出一个孤字；
2. brass 斜体强调词一律 `inline-block`（`现场 / 不可复制 / 策划`），否则「策划」会被拆成「策 / 划」两行。

行长上限是 token 而不是裸 `max-w-[Nch]`：`--container-heading` 18ch · `--container-title` 14ch · `--container-lead` 46ch · `--container-body` 42ch · `--container-measure` 52ch · `--container-shot` 30vw。汉字可读行长比拉丁窄，所以单独定标、不用 `ch` 之外的近似值。

家族：`font-display` Instrument Serif（含斜体，用于强调词）· `font-sans` Archivo · `font-mono` JetBrains Mono。第三家 mono 由品牌关键词「前端 / code / 工程」授权，只出现在 label 与数据上。
中文：系统栈 `PingFang SC → Hiragino Sans → Microsoft YaHei`（见 §9 偏差 3）。

## 5. Spacing / Radius / 边缘

`--spacing-section-y` `clamp(6rem,14vh,9rem)` · `--spacing-section-x` `clamp(1.25rem,5vw,5rem)` · stack sm/md/lg/xl = .75 / 1.5 / 3 / 5rem。

重构新增的几何 token（全部在 `@theme` 内，组件不再出现裸值）：

| Token | 值 | 用途 |
|---|---|---|
| `--spacing-spine` | `15rem`（240px） | 桌面左脊宽；正文列 `lg:pl-spine` 右移同一个值，全页只有一条轴 |
| `--spacing-hit` / `--spacing-hit-lg` | `2.75rem` / `3rem` | 触控目标下限（WCAG 2.5.5 44px）与主 CTA 高度；`min-h-hit` / `min-h-hit-lg` |
| `--spacing-band` | `22vh` | 素材带瓦片高 |
| `--spacing-card` | `86vh` | sticky 堆叠卡最小高 |
| `--spacing-card-pad` | `clamp(1.25rem,3vw,2.75rem)` | 卡内边距 |
| `--spacing-slot-1/2/3` | `6rem` / `7.75rem` / `9.5rem`（96 / 124 / 152） | Work 三张 sticky 堆叠卡的 `top-slot-*` 槽位，取代原先的 `96 + index*28` 内联公式（§14.1） |
| `--scale-tap` / `--scale-lift` | `0.98` / `1.02` | `active:scale-tap` 按压卡扣、`hover:scale-lift` 素材微升（`--scale-*` 是 v4 的真实命名空间，见下） |
| `--container-shot` | `30vw` | 素材带瓦片宽（下限用 Tailwind 默认 `--container-xs` = 20rem，避免窄屏出现单图铺不满） |
| `--rule-hairline` | `1px` | 发丝行线宽 |
| `--canvas-video-dim` | `#555555` | 见 §3，canvas 运行时读取 |

Tailwind v4 的命名空间语义决定了这些 key 的可用形态：`--spacing-*` 会生成 `mt-/px-/min-h-/w-/top-` 等工具类，`--container-*` 生成 `max-w-/w-/min-w-`，`--scale-*` 也是真实命名空间（实测 `--scale-tap: 0.98` 编译出 `.active\:scale-tap:active{--tw-scale-x:var(--scale-tap);…;scale:var(--tw-scale-x) var(--tw-scale-y)}`），而 **非命名空间 key（`--rule-hairline`、`--canvas-video-dim`）只输出 CSS 变量、不生成任何工具类**。新增 token 后必须去 `dist/assets/*.css` 里 grep 一次确认真的被 emit——未知类名会被静默丢弃。

`@utility` 层（自定义原子，取代组件内联 style）：`label-mono` · `grain` · `stage-perspective` · `scrim-top` / `scrim-left`(68%) / `scrim-bottom` / `scrim-flat` · `glyph-mask` · `rule-row`（`--rule-hairline` + `--color-line` 的发丝行线，履历表与页脚共用）· `num`（等宽 + `tabular-nums`，年份与指标对齐）。

`--radius-card: 0px`（所有卡与按钮直角）· `--radius-frame: 2px`（图片框）。层次靠 1px hairline + 明度台阶 + `grain`（feTurbulence 噪点，opacity .045）建立，不靠投影。

## 6. 组件配方（8 态）

**Primary button（封面 CTA）**
```
default  inline-flex min-h-hit-lg items-center gap-3 bg-cream px-7 py-3 text-ink
hover    hover:bg-brass                      （提亮+换色，不位移、不阴影）
focus    :focus-visible 2px brass outline, offset 3–4px（outline-offset-4 于本按钮）
active   active:scale-tap                    （卡扣式触觉，≈80ms；= --scale-tap 0.98）
disabled —  本页无禁用态（表单不存在）
loading  —  无异步动作
error    —  同上
success  —  同上
```
整站无表单、无异步提交，因此 disabled / loading / error / success 四态在所有组件中合法缺席——`DESIGN.md` 的 components 表按此记录；`audit-design-md.mjs` 要求 Components 章节点名 hover / focus / disabled / loading / error，措辞用「本页不存在」而不是假装实现。

**Secondary / typographic link（封面「先看履历表」）**：`label-mono inline-flex min-h-hit items-center text-cream underline decoration-line-strong underline-offset-8 hover:text-brass`；下划线即其边框，不做 pill 按钮。
**Outline button（项目卡「打开项目现场」/ 粤语 App「打开 hk.datatrade.top」）**：`border border-line-strong text-cream hover:border-brass hover:text-brass active:scale-tap`，`min-h-hit`（粤语 App 用 `min-h-hit-lg` + verdigris hover）。
**Spine 目录项（取代旧顶部 Nav）**：`flex min-h-hit items-baseline gap-3` + `num` 序号 + `label-mono`；当前段 `aria-current="true"` + `text-brass`，非当前 `text-cream/80 hover:text-cream`；行线由 `<li className="rule-row">` 提供。**当前段判定唯一真相源是 `useActiveSection` 的 IntersectionObserver**（`rootMargin:'-45% 0px -45% 0px'`，取 `intersectionRatio` 最大者），高亮与读屏 `aria-current` 取自同一个 state。
**TopBar + 元数据抽屉（`< lg`）**：`fixed inset-x-0 top-0 bg-ink/95 backdrop-blur-sm lg:hidden`；按钮 `aria-expanded` + `aria-controls="meta-drawer"`，Escape 与点选链接都收起，展开用 `height:0→auto` 260ms。脊轨里的 `ContactBlock` 在抽屉内复用同一组件，不复制第二份 DOM。
**履历 rundown `<table>`**：桌面 `md:table-row` / `md:table-cell` 四列（年份 · 机构/职务 · 结果 · 硬指标），`<` md 时整表降级为 `block` 堆叠、每格带 `md:` 前缀还原，`<caption className="sr-only">` 说明表格语义；行 hover 与 `focus-within` 同色（`hover:bg-surface focus-within:bg-surface`），保证键盘走到行内链接时高亮不丢。年份与指标格用 `num` 对齐。
**Project sticky card**：`position: sticky` + `top-slot-1/2/3`（`--spacing-slot-*` = 96 / 124 / 152，见 §5）层叠，`targetScale = 1 - (total-1-index)*0.03`；媒体区 `hover:scale-lift duration-500 ease-out`，有 mp4 时 hover/focus 播放静音循环、leave/blur 归零暂停，无视频保持实拍图。
**ShotBand 素材带（取代旧双排 marquee + WordBand）**：单排 `h-band w-shot` 瓦片，`scrollYProgress → x ['4%','-14%']`；为铺满横向溢出重复第二组，但 **第二组 `alt=""`**，读屏只数到一次。
**页脚社交 QR 块（取代独立 SocialRail）**：`rule-row` 行线上悬 `bg-cream p-2` 的 `QRCodeSVG`（真实 URL、`level="M"`）+ `label-mono` 名称 + `text-caption` 注脚；hover 走 `group-hover:text-brass`。社交入口全站只在页脚出现一次。

## 7. Motion

| 动效 | 目的 | 参数 | reduced-motion |
|---|---|---|---|
| Splash 幕布 | Brand | 2×5 `bg-ink` 块 `rotateX ±92°`，起点 .72s，列 stagger .05s；1450ms 卸载；`aria-hidden` | 整段跳过 |
| Splash 姓名 | Guidance | 逐字 blur→focus，stagger .045s | 直接显示 |
| Hero 3D | Continuity | `heroProgress = clamp(scrollY/innerHeight)`；rotation.y `-0.42 + p*0.9 + pointer.x*0.16`；切片 spread `0.1 + p*0.46`；camera z `5.1 - p*1.5`；阻尼 `1-e^(-5Δ)`；主体位姿按 `size.width<900` 分档——桌面 `x 1.8 / y 0.1 / scale 0.84`，移动 `1.12 / 0.74 / 0.5`，桌面右移是为了避开 `lg:pl-spine` 后右移的正文列 | spread 固定 .16，指针视差归零 |
| CanvasFade | Continuity | `gl.domElement.style.opacity = clamp(1 - (heroProgress-0.2)/0.35)`：不透明的履历段压上来前先把整块画布淡掉，否则固定画布与文档流交界处出现一条横切石膏像的硬边 | 进度仍随滚动；只做全局 CSS 兜底 |
| Magnetic 按钮 | Feedback | 半径 padding 120px，强度 4，spring 320/22/0.6 | 关闭；coarse pointer 亦关闭 |
| 字符级揭示（Method 粤语段） | Guidance | 每字 `opacity [0.55→1]`，区间 `[start, start+0.22]`，offset `['start 0.85','end 0.35']` | 直接全显 |
| GlyphRain | Brand | 2D canvas，9 个真实粵字驱动 46 个下落位（accent 14% 用 verdigris），DPR≤2，离屏 IntersectionObserver 暂停，`opacity-25` + `glyph-mask` 径向淡出保证文字列不被压花 | 不挂载 |
| ShotBand | Brand | 单排 `scrollYProgress [0,1] → x ['4%','-14%']` | `x=0`，静态一排 |
| 元数据抽屉（`< lg`） | Guidance | `height 0→auto` + opacity，260ms `[0.76,0,0.24,1]`，`AnimatePresence initial={false}` | 全局 CSS 把时长压到 0.01ms，功能不变 |
| 视频 UV 偏移 | Brand | `VideoTexture.offset.y` 跟 `heroProgress` | 不加载视频 |

全局：只动画 `transform` / `opacity`；入场 ease-out、出场 ease-in；`prefers-reduced-motion` 有 CSS 兜底 + 组件级判断双保险。

## 8. 素材清单与生成规格

| 路径 | 状态 | 规格 |
|---|---|---|
| `public/images/hero-bust.jpg` | 已就位 | 460×1088 半身像，等分三段可切片，暖灰底 |
| `public/images/{porsche1,huawei1,tencent1}.jpg` | 已就位 | 真实项目现场，16:9 |
| `public/images/life/{dinner,teahouse}.jpg` | 已就位 | 同场景 AI 生成图，画面无人（原实拍本人照片已按 §8.2 下架） |
| `public/resume-panyulong.pdf` | 已就位 | 下载链接；ASCII 文件名避免 URL percent-encode，`download="潘宇龙 · 简历.pdf"` 保留保存时的中文名 |
| `public/media/hero-loop.mp4` | 已就位 | 实测 1215 KiB / 10.04s / 960×528 / 24fps；16:9 横构图（背景平面 30×17，竖构图会被拉伸）、H.264、无声 |
| `public/media/hover-{porsche,huawei,tencent}.mp4` | 已就位 | 实测 318 / 320 / 316 KiB，5.04s；hover 才 `play()`，离开设 `currentTime = 0` 并暂停 |
| `public/media/footer-reverse.mp4` | 已就位 | 实测 527 KiB / 6.04s，由 `raw-media/footer.mp4`（正向撤场）经 `--reverse` 得到；仅在页脚进入视口前 300px 才挂载，`opacity-[0.14]` + `bg-ink/80` 压暗层保证正文对比度不变，reduced-motion 下不挂载 |
| `public/models/*.glb` | 可选 | ≤3MB、Draco、单材质 |

**数据来源（Design QA blocker 的修复处）**：`src/data/site.ts` 里 `experiences[]`（4 段：`from/to/company/title/result/metrics[]`）与 `capabilities[]`（4 轨：`latin/zh/proof/evidence`）全部逐字搬自老站事实源 `resume-old-ref/src/constants/index.js`。PDF 简历在本机不可读，因此**没有**第二条可核对来源——任何机构名、职务名、指标数字都不改写、不中文化、不外推。`shots[]`（5 张）由素材带与 Method 段复用：素材带走全 5 张 × 2 组，**第二组（填充横向溢出的那份）`alt=""`**，所以读屏在带内只数到 5 条；`teahouse` / `dinner` 另在 Method 段以 `shots.slice(3)` 再出现一次并保留 alt——同一张图被朗读两遍是这次复用带来的已知代价，换取的是 Method 段不再需要一批新素材。

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

### 8.2 硬约束：站内不得出现本人照片

用户明确规则：**个人照片一律不上站**；本人照片只允许作为 AI 生图的参考图，产出不得带水印，且画面里不应再出现可辨识的本人。这条优先级高于「实拍更有说服力」的取舍。

本轮据此替换了 `shots[]` 里最后两张实拍生活照：

| 路径 | 换前 | 换后 | blob |
| --- | --- | --- | --- |
| `public/images/life/teahouse.jpg` | 本人围炉煮茶正面实拍 | 同场景 AI 生成图，画面无人 | `8a4819a2` → `ad247510` |
| `public/images/life/dinner.jpg` | 本人客户晚宴正面实拍 | 同场景 AI 生成图，画面无人 | `08a7fd48` → `c8788e0c` |

文件路径不变，`alt` 由 `围炉煮茶现场记录` / `客户晚宴动线实拍` 改为 `围炉煮茶现场示意` / `客户晚宴动线示意`——图已不是实拍，读屏文案不能替它背书；`alt` 不参与渲染，所以视觉基线不受影响。§6 的 ShotBand 配方、§11 的读屏证据、`audit-a11y` 结论全部原样有效；替代图直接取自 `product-design-0918` 的 `60d8843`（「生活照换成 AI 生成场景图」），不重复生成一份。

**全量素材复查**：站内其余图片引用为 `hero-bust.jpg`（断裂古典石膏像）、`porsche1/huawei1/tencent1.jpg`（舞台 / 主视觉 / 会场空镜）。4 段 mp4 用 AVFoundation 抽帧器（`AVAssetImageGenerator`，与 §8.1 同源）在 0.3 / 2.5 / 5.5s 各抽一帧、拼成 contact sheet 逐帧看过：只出现背影、剪影与操作台手部，无可辨识正脸。`huawei1.jpg` 是公开发布的直播海报，含三位**署名嘉宾**（第三方公开物料，非本人），保留。

**基线影响**：素材带只在 `07-work-1` 顶部露出 46px 条带，是唯一受影响的比对屏（严格逐通道 >8 的差值 19585 px，bbox `(1022,0)-(1439,46)`，全部落在该瓦片内）；`04-experience-table` 与 `16-mobile-experience` 差值恒为 0，其余三屏的差值（`02` 12px、`10` 2751px、`12` 64px、`14` 2578px）都落在 §13 的噪声地板内。因此只刷新 `07-work-1` 的 expected/actual 这一对（内容变更是刻意的，不是放宽阈值），`compare-images.mjs` 重跑 7 屏 `findings:0`，`audit-ui-alignment` 计数不变（`{major:5, minor:4, debt:5}`）。

**残留暴露（未处理，需单独决策）**：两张原片自 `baef578` 起就在版本库里，`main` 与其余分支的历史提交仍含原件 blob，本分支只改了工作树内容、没有改写历史。彻底下架需要 history rewrite + 强推（影响所有已分出的分支与协作者），属破坏性操作，需另行确认；原始文件另存于仓库外的 `../removed-personal-photos/`。

## 9. 与需求文档的偏差（明确记录）

1. **不用 GSAP**：滚动进度由 Lenis + `scrollState` 单一 store 提供，framer-motion 负责 DOM 动画；省一个 30KB 级依赖，行为等价。
2. **不用 drei `ScrollControls`**：它会接管滚动，破坏原生 sticky、锚点与读屏顺序。Hero 进度改为 `clamp(scrollY / innerHeight)`。
3. **中文字体未子集化**：`emfont` 取源技能在本环境不可用，中文走系统栈。上线前建议补一组思源宋体/黑体子集并注册为 `--font-display` 的中文回退。
4. **视频层为「探测式」**：`fetch(..., {method:'HEAD'})` 判断 `/media/*` 是否存在，存在才挂载 `VideoTexture` / hover 播放；探测同时要求响应 `content-type` 以 `video/` 开头——dev/preview 服务器会用 200 + index.html 兜底未知路径，只看 `res.ok` 会把 HTML 当视频纹理挂上去。
5. **依赖清理**：`@react-three/drei` 未被引用，已移除。
6. **WebGL 覆盖层用 `style` 而非 class**：R3F 在容器 div 上写内联 `position: relative; pointer-events: auto`，Tailwind 的 `!fixed / pointer-events-none` 打不过内联样式，会在整个视口拦截点击。改为给 `<Canvas style={{position:'fixed', inset:0, pointerEvents:'none'}}>`，R3F 会把 `style` 合并到基础样式之后，才能覆盖。
7. **`<main>` 不能有底色**：加了脊轨之后本能地给 `main` 铺 `bg-bg`，结果固定的 WebGL 画布（层级在 `main` 之下）被整块盖住，封面石膏像直接消失。现结构是 `Cover` 保持透明 + 从 `ExperienceSection` 起包一层 `div.bg-bg`。透明封面与不透明段的交界处会留下一条横切头像的硬边，用 `CanvasFade` 在 `heroProgress 0.2→0.55` 区间把画布淡出解决——不是加深色遮罩盖住，遮罩只会把问题挪到下一屏。
8. **3D 侧颜色与 `@theme` 同源**：`themeColor('--color-surface')` / `themeColor('--color-verdigris')` / `themeColor('--canvas-video-dim')` 在材质与灯光构造时读取 computed style，替代此前散落在 `HeroCanvas.tsx` 里的 `#1a1817` / `#5e8c7f` / `#555555` 字面量。代价是这三个值必须在首帧前已注入 `:root`（Tailwind v4 的 `@theme` 满足）；因此每个调用都带 fallback 字符串，dev 环境 CSS 未就绪时也不会变成纯黑。

## 10. 性能预算实测（`npm run build`）

| 指标 | 预算 | 实测 |
|---|---|---|
| 首屏阻塞 JS | ≤300KB gz | **123.29KB gz**（381.39 kB raw，`index-*.js`；WebGL 已改 `lazy()` + `manualChunks.webgl`。较重构前 +3.6KB gz，来自 `experiences[]` / `capabilities[]` 数据与两张新组件树） |
| WebGL 异步块 | 非阻塞 | 237.29KB gz（876.60 kB raw，three + R3F，仅首屏并行下载，不挡渲染） |
| HeroCanvas 异步块 | 非阻塞 | 1.74KB gz（3.66 kB raw） |
| CSS | — | 24.90 kB raw / **6.09KB gz**（`scrim-* / rule-row / num / min-h-hit / w-spine` 等 utility 与 token；修掉 §12 的符号链接扫描泄漏后从 25.54 kB 降回 23.27，债务轮的 6 条新命名 utility（`top-slot-1/2/3`、`origin-top/bottom`、`scale-tap/lift`）、22 处比 rgba 更长的 `color-mix()` 表达式与 `@theme` 新 token 声明让它回到 24.90。+1.63 kB raw / +0.26 kB gz 未逐条拆分（实测 `color-mix` 合计 674 B、新 utility 与 token 约 0.9 kB，余量来自契约文档正文类名被扫描——§12 坑 ②），换来的是 §14 台账里少掉 2 条内联样式与 6 条裸值） |
| CLS | 0 | 0（canvas 容器 inline `position:fixed`，sticky 卡不改变文档高度；脊轨 fixed 也不占文档流） |
| DPR | ≤2 | `dpr={[1,2]}`，canvas 离屏 `frameloop='never'` |
| 首屏媒体 | ≤2MB | `hero-loop.mp4` 1215 KiB（`preload='auto'`，作为 VideoTexture 与 WebGL 块并行下载）；3 个 hover 共 954 KiB，只在 hover 时 `play()`；页脚 527 KiB，进入视口前 300px 才挂载 |
| 各屏视觉复验 | — | 已完成（重构后）：无头 Chrome 1440×900 / 390×844 / reduced-motion 三档共 20 屏；**无 `pageerror`、无 console error**（网络日志里有 29 条 `/media/*.mp4` 的 `requestfailed`：headless 下 `<video>` 的 range 请求被中止，5 个文件在 `public/` 与 `dist/` 均存在且 `curl -r 0-1000` 返回 206，属 fixture 噪声；每屏噪声地板见 §13）。`bodyW === innerW`、`overflowX = 0`，文档高 7747（桌面）/ 8575（移动），移动 canvas 缓冲 780×1688（DPR 2），脊轨 `display` 在两档下正确切换 |
| Lighthouse ≥85 | 待线上复测 | 需部署 URL |

## 11. 无障碍实测（债务轮之后复测，日志在 `/tmp/dr0918/{out-shoot,out-contrast,out-a11y,out-hitt}.txt` 与 `/tmp/dr0918/a11y-final2/`）

**axe 扫描**：desktop 1440×900 / mobile 390×844 / `prefers-reduced-motion: reduce` 三档各 **0 violations**。结构证据：landmarks `nav, header, main, section#top, section#experience, section(素材带), section#work, section#method, footer#contact`；唯一 `h1` = 「把现场做成系统」；标题序列 `[1,2,2,3,3,3,2,3,2]`（无跳级）；15 张图 `imgNoAlt = 0`；`lang="zh-Hans"`；21 个可聚焦节点；`overflowX = 0`；`bodyFont 16px`。

**真实渲染上的对比度**（纯色 token 表算不出被视频纹理穿过的文字，也不再需要——测法见 §13）：

| 测量点 | 字号 | 桌面 | 移动 | 阈值 |
|---|---|---|---|---|
| cover h1（cream display） | 144 / 56px | 12.18 | 16.54 | 3:1（large） |
| cover lede（muted） | 20 / 16.8px | 7.10 | 6.25 | 4.5:1 |
| cover programme label | 13px | 7.07 | **5.88** | 4.5:1 |
| cover 次级链接 / 状态行 | 13 / 16px | 17.04 / 16.81 | 16.57 / 16.56 | 4.5:1 |
| spine role / rundown | 13px | 7.11 / 7.11 | — 折叠进抽屉 | 4.5:1 |
| spine nav-inactive（cream 80%） | 13px | 11.01 | — | 4.5:1 |
| spine email | 13px | 17.21 | — | 4.5:1 |
| exp 段标题 / 年份格 / 结果格 / 表头 | 64 / 13 / 16 / 13px | 17.00 / 7.06 / 6.72 / 7.06 | 16.53 / 6.84 / 6.84 / 表头在 `md` 以下 `hidden`（`Sections.tsx:80`），移动端无此节点 | 3:1 · 4.5:1 |
| work 卡名 / metric / 链接 | 38.4 / 64 / 13px | 16.78 / 7.06 / 16.40 | 16.56 / 6.83 / 16.56 | 3:1 · 4.5:1 |
| method 能力轨中文名 | 16px | 16.81 | 16.56 | 4.5:1 |
| footer 社交注脚 | 13px | 7.06 | 6.84 | 4.5:1 |

19 个测量点 × 2 档**全部通过**，无一格需要豁免（移动端脊轨 5 点折叠进抽屉、表头 `md` 以下隐藏，该档实为 13 点）。
最低一档 5.88（移动端 programme label，muted 压在视频暖高光上）。
数值随视频相位有 ±0.05 量级的抖动（与上一轮构建的逐点读数对比：h1 12.17 → 12.18），不影响判定。

**强调色与 hover 态**（`brass.mjs`：hover 态无法用截图取证——注入透明化后按钮自身的 `hover:bg-brass` 底色并不会出现，
所以 hover 前景色改走「取该节点的行走盒 + 用 `var(--color-brass)` 归一化后的前景做逐像素最坏比」）：

| 点 | 桌面 | 移动 | 阈值 |
|---|---|---|---|
| 封面 h1 里的 brass 强调字「做成」（144 / 56px，压在视频上） | 6.49 | 6.42 | 3:1（large） |
| 脊轨当前目录项 / hover 目录项 / Masthead 星号（13px，ink 底） | 6.54 | — | 4.5:1 |
| 脊轨邮箱 hover | 6.54 | — | 4.5:1 |
| work 卡外链 hover / 页脚社交链 hover | 6.24 / 6.19 | 6.30 / 6.29 | 4.5:1 |
| 封面次级链接 hover（压在视频上） | 6.54 | 6.30 | 4.5:1 |
| 主 CTA hover／active（ink 字 on brass 底，纯色对） | 6.54 | 6.54 | 4.5:1 |

铜绿 `{colors.verdigris}` 做文字时的纯色对：bg 上 4.97、surface 上 **4.66**（本站最紧的一格，出现在方法区卡内
「学嘢·」分隔符）、ink 上 5.21；**压到 cream 上只有 3.30 → 禁止**，此约束已写进 `DESIGN.md` 的 Colors 规则。

保住这个结果的两处设计（不是事后遮罩堆砌）：
1. 桌面 `scrim-left` 的墨色压暗纱宽度从 64% **加到 68%**、并把渐变尾段推到 62% 处才透明——脊轨把正文右移后需要多罩住一条，同时不能把右移后的石膏像一起压暗；
2. 移动端 `VideoPlane` 在 `size.width < 900` 时沿 +x 平移 6.5 单位（把视频正中的白色大理石挪出文案区，落到左侧暗走廊）+ `scrim-flat`（`rgba(ink,.55)`，`lg` 以上不渲染）。竖屏视口只采样到 30×17 背景平面中央约 4.3 单位宽的一条，不加位移时等于把大理石放大压在文字上，L≈0.5，再多纱也到不了 4.5:1。

**触控目标**：脊轨目录项、Masthead、抽屉按钮、邮件与下载行全部由 `min-h-hit`（44px）/ `min-h-hit-lg`（48px）兜底；键盘遍历实测脊轨目录命中框 `175×44`。审计脚本报出的「<44px」全部是**非缺陷读数**，逐条记录以免下次重复调查：`跳到主要内容 1×1`（focus 前视觉隐藏，命中区随聚焦展开）、`潘宇龙* 0×0`（TopBar 在 `lg` 以上 `display:none`，同一组件的另一实例）、移动端的 `0×0` 目录/邮件/下载项（`#meta-drawer` 收起时不占位）、`打开项目现场 145~147×43`（三张 sticky 卡各报一次；瞬时 `scale` 造成的测量缩放，computed style 为 `min-height:44px / height:44px`）。`covered / not hit-testable = 0`。

**焦点与语义**：全局 `:focus-visible` 2px brass + offset 3px（主 CTA `outline-offset-4`）；键盘走查 21 个节点全部有可见 outline 且未出屏。装饰层（canvas、Splash、噪点、箭头、状态点、R3F 容器）全部 `aria-hidden`，`<Canvas>` 另加 `role="presentation"` 以消除 axe `region` 违例。锚点 `#top / #experience / #work / #method / #contact` 与 `navLinks` 一一对应；脊轨 `<nav aria-label="目录">` + `aria-current`，顶栏按钮 `aria-expanded` + `aria-controls="meta-drawer"`，Escape 与点选均可收起（无头复验 `drawer-escape-closed: true`）。履历表带 `<caption class="sr-only">` 与 `scope="col"`。

**测量本身的坑**：Tailwind v4 的颜色透明度修饰符编译成 `color-mix(in oklab, …)`，Chrome 从 `getComputedStyle` 序列化回来的是 `oklch(...)`，按 `rgb()` 数字解析会得到 `rgb(0.95,0.0003,…)` 这类垃圾值。必须经 1×1 canvas `fillStyle` 往返归一化，再自己做 alpha 合成。

## 12. 部署

`vercel.json`：`/media/*`、`/assets/*`、`/models/*` → `public, max-age=31536000, immutable`（media 另加 `Accept-Ranges: bytes`）；`/images/*` → 7 天 + stale-if-error。

版本库：`patrickstar231/resume`。历史线：`main`（老站）→ `feat/3d-video-parallax-standalone`（本站 v1，commit `c281396`）→ **`design-review-0918`**（本次 Design Review 结构级重构，从 `c281396` 切出，三条线互不 merge）。

本次入库新增：`DESIGN.md`（机器可读契约：frontmatter 的 `colors / typography / rounded / spacing / components` 五组 + 8 个必需章节）与 `design.qa.yaml`（`design.designMd` 指向 `DESIGN.md`，screens 列表按重构后的封面/履历/素材带/项目/方法/页脚 + 移动 + reduced 重写）。`.design-qa/` 已加进 `.gitignore`——20 屏截图 8.3MB，比整站还重，基线由 §13 的脚本本机重生成。

`.gitignore` 排除 `node_modules`（154MB）、`dist/`（6.9MB）、`raw-media/`（14MB 原始投料）；入库约 5MB，最大单文件 `hero-loop.mp4` 1.2MB，不需要 Git LFS。

**worktree 的 `node_modules` 是符号链接**（指向主检出目录以复用依赖），而 `node_modules/` 这条 pattern 带斜杠只匹配目录，**不匹配符号链接**，于是 `git status` 会把它列成 `?? node_modules`。因此本分支的 `.gitignore` 用不带斜杠的 `node_modules`；且任何时候都不要 `git add -A`，按路径显式暂存。

**Tailwind v4 自动内容扫描的两个坑（实测）**：① 它遵守 `.gitignore`——在补 `.gitignore` 之前它会扫 `dist/`，把上一次构建产物里的类名当来源，CSS 体积自我放大（26.88 kB → 加 ignore 后 23.60 kB）。本分支又踩到同一个机制的第二次：**worktree 的 `node_modules` 是指向主检出的符号链接**，`node_modules/`（带斜杠）只匹配目录、不匹配符号链接，于是扫描器跟着链接进了 154MB 的依赖树，把包里的类名当来源——改成不带斜杠的 `node_modules` 后 CSS 从 25.54 kB 掉回 **23.27 kB**（5.83 kB gz）。`git check-ignore -v node_modules` 是这一步的判据。② `*.md` 正文里写的类名（如本文档提到的 `bg-ink/55`）也会生成工具类，改文档会让 CSS 漂 160B。要彻底确定化可改成 `@import 'tailwindcss' source(none)` + 显式 `@source`。

## 13. 视觉复验方法（可复现）

内置 Browser 面板处于隐藏态时（`document.visibilityState === 'hidden'`），Chrome 会冻结 `requestAnimationFrame` 与 `ResizeObserver` 派发：R3F 拿不到容器尺寸 → canvas 停在 300×150 → WebGL 一帧都不画，截图工具同时拒绝出图。这是环境限制，不是站点缺陷（同页 `dispatchEvent(new Event('resize'))` 后画布立刻变 2064×1874 可作对照实验）。

因此各屏复验走**无头 Chrome**：

```bash
mkdir -p /tmp/vischeck && cd /tmp/vischeck && npm init -y && npm i puppeteer-core   # 装在项目外，不污染 package.json
# 启动参数必须带 WebGL 软件渲染：
#   --no-sandbox --enable-unsafe-swiftshader --use-gl=angle --use-angle=swiftshader
# executablePath: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
```

脚本按 `1440×900`、`390×844`（`isMobile + deviceScaleFactor 2`，切回桌面需显式 `isMobile:false`）、`emulateMediaFeatures(prefers-reduced-motion: reduce)` 三档截图，并打印 `canvas.width/height`、`spineVisible`、`docH`、`overflowX`、console 与网络错误列表。

五个本机 harness（都在 `/tmp/dr0918/`，依赖装在 `/tmp/vischeck`，`pngjs` 以符号链接复用插件里的包）：

| 脚本 | 产出 | 判据 |
|---|---|---|
| `shoot.mjs` | 20 屏到 `/tmp/dr0918/after`（不是插件基线，基线见下一行）+ 结构探针 + `HIT_AREAS` + `CONSOLE_ISSUES` | 每屏肉眼复验 + `overflowX=0` + 脊轨/抽屉状态 |
| `hitt.mjs` | 交互节点命中区审计（桌面/移动各 21 节点） | `el.contains(document.elementFromPoint(中心))` 而不是 `=== el`（含子 `<span>` 的链接会误判）；`<44px` 与 `covered/not hit-testable` 两张表 |
| `contrast.mjs` | 19 个测量点 × 2 档的真实对比度 | 逐像素 worst-case，非 p50 |
| `capture-actual.mjs` | `.design-qa/actual/*.png`（7 屏，读 `design.qa.yaml` 的 screens） | 喂给 `audit-ui-alignment.mjs` 替代不可用的 Playwright 步骤；方法与基线截图一致，因此**未改视觉时 diff 必须为 0** |
| `brass.mjs` | 强调色与 hover 态的对比度（9 点 × 2 档） | hover 底色无法截图取证，前景走 `var(--color-brass)` 归一化后做逐像素最坏比（§11） |

**基线已用同一 harness 重生成**（`OUT=…/.design-qa/expected node capture-actual.mjs`），比对两侧从此同源。重生成前逐条查过旧基线的差异，三类噪声记在这里，避免下次重复调查：

| 屏 | 与旧基线的差 | 归因（有实测） |
|---|---|---|
| `02-cover-top` | 17749 px（1.4%），bbox 恰好落在 WebGL 区（x 691-1187 / y 159-831） | `HeroCanvas.tsx:38/106` 的 `useFrame((st, delta) => …)` 用帧间隔做阻尼收敛，软件渲染下帧数不固定 → 切片停在略微不同的位置。证据：任意平移都让 diff 变大（dx=±2 时 17877→35379/33707），且平均亮度 37.44 vs 37.62 相同——不是位移也不是遮罩变化，是内容相位 |
| `07-work-1` | 802 px，只在卡内视频区一角（x 1022-1146 / y 0-46） | `<video>` 解码相位；卡边缘 0 差，说明 `top-slot-*` 与原内联公式像素等值 |
| `16-mobile-experience` | 1208 px，全在顶栏「目录」按钮上 | 旧基线由 `shoot.mjs` 截，它先 `click` 抽屉再 Escape，按钮留着 `:focus-visible` 的 2px brass outline；`capture-actual.mjs` 不点击，所以没有这圈焦点环。属**状态差**，不是渲染差 |
| `10-method-caps` / `12-footer` / `14-mobile-cover` | 2557 / 22 / 100765 px | 同一构建连截三次的 run-to-run 方差就有 3262 / 232 / 19138 px（逐字揭示与跑马灯是时间驱动、页脚视频按 IntersectionObserver 挂载、移动端画布是视频相位），量级同阶 |

重生成后同一构建**独立进程连截 4 次**与基线比对（判据：任一通道差 > 8 记一个像素），得到每屏的噪声地板：

| 屏 | 4 次实测 diff | 地板 | 性质 |
|---|---|---|---|
| `04-experience-table` / `07-work-1` / `16-mobile-experience` | 0 / 0 / 0 / 0 | **0（逐位相同）** | 纯 DOM 屏，是真正的回归信号 |
| `12-footer` | 76 – 330 | 0.03% | 页脚视频按 IntersectionObserver 挂载，帧相位 |
| `10-method-caps` | 1963 – 2771 | 0.21% | 逐字揭示是时间驱动 |
| `02-cover-top` | 349 – 5838 | 0.45% | WebGL delta 阻尼 + 视频纹理 |
| `14-mobile-cover` | 2578 – 30916 | **2.35%** | 移动端画布只采视频中央一条，帧间差被放大 |

**插件自己的 `pixelmatch`（`threshold 0.2`、`includeAA:false`）对同一批图报 7/7 `diffPixels = 0`、全部 passed**——它的逐像素色差阈值比上表宽松，把相位噪声吸收了。所以：`pixelmatch` 的 0 不等于 WebGL/视频屏是确定性的，回归判定应以「三张纯 DOM 屏必须 0」为主判据，时间驱动屏看是否越过上表地板（`14-mobile-cover` 的 2.35% 已经贴着 `maxDiffPixelRatio: 0.02` 这条全局预算，若某次跑超先按噪声复核再判缺陷）。

**实时背景上的对比度测法**（纯色 token 算不出被视频纹理穿过的文字）：

1. **行盒而不是块盒**：`document.createRange()` + `selectNodeContents` + `getClientRects()`，过滤掉 `w/h ≤ 2` 的空盒。用 `getBoundingClientRect()` 会拿到整块 `<p>` 的 1296px 宽度，把文字根本没覆盖到的亮背景算进来（曾因此误报 h1 只有 1.95:1）。
2. **颜色归一化**：`getComputedStyle().color` 对 `text-cream/80` 返回 `oklch(...)`（Tailwind v4 编译成 `color-mix(in oklab, …)`）。填进 1×1 canvas 再 `getImageData` 取回 sRGB，alpha 从序列化字符串或像素第 4 通道取，然后自己做 `fg*a + bg*(1-a)` 合成。
3. **只剩背景的一张图**：注入全局 `*,*::before,*::after{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}`。**不能用 `visibility:hidden`**——那会连按钮自己的米白底一起藏掉，测出「墨色文字 vs 视频」这种无意义的 1.8:1。
4. **逐行盒重滚动**：每个行盒单独 `scrollTo` 到视口中部再 `page.screenshot({clip})`，用 `pngjs` 解出像素做循环；`position:fixed` 的脊轨节点标记 `fixed:true`，坐标不再叠加 `scrollY`。
5. **阈值按 WCAG 分档**：`fontSize ≥ 24` 或 `≥ 18.66px && weight ≥ 700` 走 3:1，其余 4.5:1。报 `worst` 而不是 p50——只看 p50 会漏判（label 的 p50 曾到 4.38 但 59.7% 面积不达标）。

**插件侧审计**（`/tmp/dr0918/plugin` 为运行时根，`$DESIGN_PLUGIN_ROOT` 指过去）：

```bash
P=/tmp/dr0918/plugin
node $P/skills/design-md-review/scripts/audit-design-md.mjs --config design.qa.yaml
node $P/skills/design-debt-review/scripts/audit-design-debt.mjs --config design.qa.yaml
node $P/skills/component-library-alignment/scripts/audit-components.mjs --config design.qa.yaml
node $P/skills/ui-alignment-review/scripts/audit-ui-alignment.mjs --config design.qa.yaml
```

**插件自带截图步骤在本机不可用**：`audit-ui-alignment.mjs` 的 capture 依赖 Playwright，而
`npx playwright install chromium` 在这台机器上直接拒绝——**Playwright does not support chromium on mac13-arm64**
（Darwin 22.6 / arm64 没有对应构建）。因此 `.design-qa/actual/*.png` 由本机 `capture-actual.mjs` 产出：
它读同一份 `design.qa.yaml` 的 `screens`，用与基线一致的方法（`scrollTo(selector, -96px)` → 等 3.1s 让 Lenis 落位 →
再等 1.4s 让 sticky/逐字动画收敛）截图，只是浏览器换成无头 Chrome。**这是取证工具的替换，不是跳过比对**——
比对本身仍由 `compare-images` 逐像素做。

第二个坑：`audit-ui-alignment.mjs` 命中 `.design-qa/reports/visual-comparison.json` 时会**直接复用旧报告**
（`canReuseVisualReport`），不重新比对。补上 actual 截图后若不删掉这份缓存，报告依旧列 7 条
「Missing actual screenshot」blocker。判据：改完截图先 `rm .design-qa/reports/visual-comparison.json` 再跑，
或在配置里开 `forceVisualRefresh: true`。

`.design-qa/`（报告 JSON + 截图，8.3MB）已 gitignore，只本机保留；契约文件 `DESIGN.md` 与 `design.qa.yaml` 入库。

## 14. 债务台账（`audit-design-debt` 14 条逐条）

扫描器读 `src/**/*.{ts,tsx,css}` 的**每一行**，按正则命中；它不剥注释、不判断语义，且
`inline-style` 的严重级是写死的 `major`（`audit-design-debt.mjs:58-63`），唯一的豁免键是
`debt.allowedColorValues`（只作用于色值）。所以 `ok:false` 反映的是工具口径，不等于「有未修缺陷」；
真正的判据是**条数与类型分布不变**——台账如下，多出一条即新增债务。

```bash
node $P/skills/design-debt-review/scripts/audit-design-debt.mjs --config design.qa.yaml
node -e 'console.log(require("./.design-qa/reports/design-debt.json").summary)'
# 期望：{ "inline-style": 5, "px-magic-number": 4, "hard-coded-color": 5 }
```

### 14.1 `inline-style` 5 条（工具判 major，全部为库/运行时约束）

| 位置 | 命中 | 为什么留 |
|---|---|---|
| `src/canvas/HeroCanvas.tsx:165` | `<Canvas style={{position:'fixed',inset:0,pointerEvents:'none'}}>` | §9.6：R3F 在自己的容器 div 上写内联 `position: relative; pointer-events: auto`，Tailwind 的 `fixed` / `pointer-events-none` 赢不了内联样式（会被整页拦截点击），只能走 `style` 通道——R3F 把它合并到基础样式之后。库约束，不可归零 |
| `src/components/Chrome.tsx:92` | `<motion.span style={{x: translate}}>` | framer-motion 的 `MotionValue` 只能经 `style` 通道进 DOM |
| `src/components/Sections.tsx:49` | `<motion.div style={{x}}>` | 同上（素材带跑马灯） |
| `src/components/Sections.tsx:161` | `<motion.article style={{scale}}>` | 同上（堆叠卡缩放随 `useScroll` 连续变化） |
| `src/components/Sections.tsx:243` | `<motion.span style={{opacity}}>` | 同上（逐字揭示，每字一个 MotionValue） |

**MotionValue 若改用 className 或 CSS 变量，就得每帧 `setState`，把合成器线程的 transform 打回主线程**——这不是风格选择，是性能约束。

本轮已消除的 2 条（说明台账不是「一律放过」）：
- Splash 幕布的 `style={{transformOrigin: row===0?'top':'bottom'}}` → `origin-top` / `origin-bottom` 工具类；
- Work 堆叠卡的 `style={{top: `${STACK_TOP_PX + index*STACK_STEP_PX}px`}}` → `--spacing-slot-1/2/3`（6 / 7.75 / 9.5rem = 96 / 124 / 152）+ `STACK_SLOTS[index]` 类名数组。两处的像素结果完全等值：`07-work-1` 与 `04-experience-table`、`16-mobile-experience` 三张纯 DOM 屏在同一构建连截 4 次下 diff 恒为 0（地板见 §13），封面与移动封面的差值全部落在 WebGL/视频区的噪声地板内。

### 14.2 `hard-coded-color` 5 条（工具判 debt）

| 位置 | 命中 | 为什么留 |
|---|---|---|
| `src/canvas/HeroCanvas.tsx:19` | `themeColor('--color-surface', '#1a1817')` | three 的材质构造在 CSS 变量缺失（样式未加载 / 变量改名）时拿到空串会抛错，兜底必须是字面色；值与 `{colors.surface}` 同源 |
| `src/canvas/HeroCanvas.tsx:119` | `themeColor('--canvas-video-dim', '#555555')` | 同上。本轮把 `--canvas-video-dim` 登记成 `{colors.canvas-video-dim}` 后，命中值已进入 token 表，严重级从 major 降为 debt |
| `src/canvas/HeroCanvas.tsx:173` | `themeColor('--color-verdigris', '#5e8c7f')` | 同上，与 `{colors.verdigris}` 同源 |
| `src/components/Sections.tsx:501` | 注释里的 `#0b0a09` | **误报**：扫描器不剥 JSX 注释 |
| `src/components/Sections.tsx:506` | `fgColor="#0b0a09"` | `QRCodeSVG` 输出独立 SVG 文档，`currentColor` 与 CSS 变量不会进 `fill`；扫码要求前景对纯白最大反差，`bgColor="#fff"`（白名单内）+ 字面 ink 是功能约束而非配色漂移 |

### 14.3 `px-magic-number` 4 条（工具判 minor）

| 位置 | 命中 | 判定 |
|---|---|---|
| `src/canvas/HeroCanvas.tsx:46` | 注释「240px 脊轨」 | **误报**（注释；真实值已是 `--spacing-spine`） |
| `src/index.css:43` | 注释「240px 元数据轨」 | **误报**（同一件事的第二条注释；声明行本身被 `tokenDeclaration` 守卫跳过） |
| `src/components/Chrome.tsx:43` | `blur(10px)` | 一次性入场虚化，不参与任何排版/间距比例，收进 token 只会造出单用变量 |
| `src/components/Sections.tsx:432` | `rootMargin: '300px'` | IntersectionObserver 的预取提前量，是行为参数不是视觉值 |

### 14.4 已消除的债务类型

- `tailwind-arbitrary-value` **0 条**：`grep -rn "[a-z]-\[" src` 无命中。原先的 5 处 `active:scale-[0.98]` 与 1 处 `hover:scale-[1.02]` 已收进
  `--scale-tap` / `--scale-lift`（`src/index.css:72-73`，调用点见 `Sections.tsx:180/201/410/472`、`Chrome.tsx:245/311`），
  缩放从此改一处生效；`v4` 的 `--scale-*` 是真实命名空间，`active:scale-tap` 会编译成 `scale: var(--scale-tap)`（在 `dist/assets/*.css` 里可直接 grep 到，见 §5 的命名空间表）。
- `functional-color` **0 条**：四层 scrim 的 `rgba()` 字面量重写成 `color-mix(in srgb, var(--color-ink) N%, transparent)`，纱色从此跟随 `{colors.ink}`。

新增视觉值时的顺序：先问它是不是第 N 次出现的同一个决定 → 是则进 `@theme` 并在 `DESIGN.md` 登记 → 再在组件里用命名 utility。只有单点、一次性、运行时算出来的值才允许留在组件里，并且要在本节留下位置号。

