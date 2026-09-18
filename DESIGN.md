---
version: 1.1
name: "Programme Spine — 潘宇龙简历站"
description: >
  场刊式沉浸简历站的设计契约。机器可读 token 与 src/index.css 的 @theme 一一对应；
  人类可读的设计动机、偏差与验收记录在 DESIGN_SPEC.md。
colors:
  ink: "#0b0a09"
  bg: "#121110"
  surface: "#1a1817"
  line: "rgba(242, 239, 230, 0.12)"
  line-strong: "rgba(242, 239, 230, 0.28)"
  cream: "#f2efe6"
  muted: "#a29a8d"
  brass: "#c08a3e"
  verdigris: "#5e8c7f"
  canvas-video-dim: "#555555"
typography:
  display-lg:
    fontFamily: "'Instrument Serif', 'PingFang SC', 'Hiragino Sans', serif"
    fontSize: "clamp(3.5rem, 11vw, 9rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  heading-lg:
    fontFamily: "'Instrument Serif', 'PingFang SC', 'Hiragino Sans', serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  heading-md:
    fontFamily: "'Instrument Serif', 'PingFang SC', 'Hiragino Sans', serif"
    fontSize: "clamp(1.6rem, 3vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.15
  heading-sm:
    fontFamily: "'Instrument Serif', 'PingFang SC', 'Hiragino Sans', serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.35
  body-lg:
    fontFamily: "'Archivo', 'PingFang SC', 'Hiragino Sans', 'Microsoft YaHei', sans-serif"
    fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "'Archivo', 'PingFang SC', 'Hiragino Sans', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  caption-md:
    fontFamily: "'Archivo', 'PingFang SC', 'Hiragino Sans', 'Microsoft YaHei', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.14em"
  label-mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.14em"
  code-md:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  none: "0px"
  card: "0px"
  frame: "2px"
  dot: "9999px"
scale:
  tap: "0.98"
  lift: "1.02"
spacing:
  section-y: "clamp(6rem, 14vh, 9rem)"
  section-x: "clamp(1.25rem, 5vw, 5rem)"
  stack-sm: "0.75rem"
  stack-md: "1.5rem"
  stack-lg: "3rem"
  stack-xl: "5rem"
  spine: "15rem"
  hairline: "1px"
  hit: "2.75rem"
  hit-lg: "3rem"
  band: "22vh"
  card: "86vh"
  card-pad: "clamp(1.25rem, 3vw, 2.75rem)"
  slot-1: "6rem"
  slot-2: "7.75rem"
  slot-3: "9.5rem"
components:
  button-primary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.75rem"
    height: "{spacing.hit-lg}"
  button-primary-hover:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
  button-primary-active:
    backgroundColor: "{colors.brass}"
    textColor: "{colors.ink}"
    scale: "0.98"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "{spacing.hit}"
  button-secondary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.brass}"
  link-nav:
    textColor: "{colors.cream}"
    typography: "{typography.label-mono}"
    height: "{spacing.hit}"
  link-nav-current:
    textColor: "{colors.brass}"
  drawer-nav-link:
    textColor: "{colors.cream}"
    typography: "{typography.label-mono}"
    height: "{spacing.hit}"
    borderTop: "{spacing.hairline} solid {colors.line}"
  drawer-nav-link-hover:
    textColor: "{colors.brass}"
  card-project:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.cream}"
    borderColor: "{colors.line}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
    minHeight: "{spacing.card}"
  table-row:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    borderTop: "{spacing.hairline} solid {colors.line}"
  table-row-hover:
    backgroundColor: "{colors.surface}"
  table-row-selected:
    backgroundColor: "{colors.surface}"
  spine-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.muted}"
    width: "{spacing.spine}"
    borderRight: "{spacing.hairline} solid {colors.line}"
  qr-tile:
    backgroundColor: "{colors.cream}"
    width: "72px"
    height: "72px"
---

## Overview

场刊（Programme Spine）。整站读作一份印刷演出场刊：左轨是常驻的元数据脊，右栏是可滚动的正文流。
基底是剧场黑（`{colors.ink}` / `{colors.bg}`），正文奶白（`{colors.cream}`），黄铜只出现在
交互与语义强调点上（`{colors.brass}`），铜绿专管「在线 / 可承接」这一类状态（`{colors.verdigris}`）。
结构标记一律走等宽轨（`{typography.label-mono}`、`{typography.code-md}`），标题与 brass 斜体强调词走衬线轨，散文走 Archivo 无衬线轨。
任何新增区块必须先回答：它在场刊的哪一栏？它是否引入了第二种强调色？

段落顺序固定为 Cover → Experience →（素材带）→ Work → Method → Contact；目录只列有锚点的四段，
素材带是无锚点的节奏件，不进 `{spacing.spine}` 轨。移动端脊轨折成顶栏 + 目录抽屉，层级与信息密度不变，只是换容器。

## Colors

| Token | 值 | 角色 | 允许用在 |
|---|---|---|---|
| `{colors.ink}` | `#0b0a09` | 幕布 / 脊轨底 | 脊轨、封面压暗层、页脚底 |
| `{colors.bg}` | `#121110` | 正文底 | `main` 与内容列 |
| `{colors.surface}` | `#1a1817` | 抬升面 | 项目卡、行 hover、抽屉面板 |
| `{colors.line}` | cream @ 12% | 发丝分隔 | 行线、卡片描边、网格线 |
| `{colors.line-strong}` | cream @ 28% | 强分隔 | 表头下沿、次级 CTA 描边 |
| `{colors.cream}` | `#f2efe6` | 正文 | 标题、正文、主 CTA 底 |
| `{colors.muted}` | `#a29a8d` | 次要文字 | 元数据、说明、机构名 |
| `{colors.brass}` | `#c08a3e` | 语义强调 | hover、当前目录项、强调字、选中态 |
| `{colors.verdigris}` | `#5e8c7f` | 在线状态 | 状态点、粤语项目 hover |
| `{colors.canvas-video-dim}` | `#555555` | WebGL 背景压暗 | 封面视频纹理的 `meshBasicMaterial.color` 乘数，不参与 DOM 配色 |

规则：一屏内黄铜出现不超过 3 处；除黄铜与铜绿外不引入第三种饱和色。正文散文只在
`{colors.cream}` 与 `{colors.muted}` 之间选择，不用灰阶中间值；`{colors.brass}` 与
`{colors.verdigris}` 只允许承担**强调词、状态字与 hover 字**，且必须落在实测过的深色底上
（`DESIGN_SPEC.md` §11：brass 在 ink / bg / surface / 视频上 6.19–6.54，verdigris 在 bg 4.97、
surface 4.66、ink 5.21）。verdigris **不得压在 `{colors.cream}` 上**（实测 3.30，不达标）。
深色底上的强调色改色即改实测，没有对应实测记录的颜色不得用作文字。

## Typography

拉丁由 Instrument Serif / Archivo / JetBrains Mono 出力，汉字回落到 PingFang SC / Songti 同族，
因此中英混排不会出现字重与基线漂移。汉字禁用合成斜体（需要强调时用 `{colors.brass}` 或下划刻痕）。

- 封面主标：`{typography.display-lg}`，行长压到 `--container-title`（14ch），断行由设计决定而非自动换行。
- 段标题：`{typography.heading-lg}` 或 `{typography.heading-md}`，行长 `--container-heading`（18ch）。
- 导语：`{typography.body-lg}`，行长 `--container-lead`（46ch）/ 正文 `--container-body`（42ch）。
- 表格与指标：`{typography.code-md}` + `tabular-nums`，年份、峰值、曝光量必须可纵向对齐扫读。
- 目录、标签、按钮：`{typography.label-mono}`，全大写仅用于纯拉丁，中文标签不套等宽轨。

## Layout

桌面固定双栏：脊轨 `{spacing.spine}`（240px）常驻且 `position: fixed`，内容列整列右移一个脊宽
（`lg:pl-spine`），因此滚动、sticky、锚点、读屏顺序全部保持原生行为。脊轨内部分三段：
刊头 + 目录（带当前段高亮）、履历缩略、联系方式与状态。

内容列栅格统一 12 栏，不使用任意分数轨道：

- 粤语项目：图片 `lg:col-span-5`，正文 `lg:col-start-6 lg:col-span-7`。
- 页脚：主 CTA 区 `lg:col-span-7`，社媒列表 `lg:col-start-8 lg:col-span-5`。
- 能力矩阵：`md:grid-cols-2`，行线用 `rule-row`。
- 履历表：桌面 `<table>` 四列（年份 / 机构·职务 / 结果 / 硬指标）；窄屏 `block` 化纵向堆叠，
  同一份 DOM、不复制数据、不加重复标签。

纵向节奏只用 `{spacing.stack-*}` 与 `{section-y}`；触控目标最小高度 `{spacing.hit}`（44px），
主 CTA 用 `{spacing.hit-lg}`（48px）。

## Elevation & Depth

本站不用阴影层。深度靠三件事表达：WebGL 切片的真实 Z 轴、发丝描边（`{spacing.hairline}`）、
以及胶片颗粒（`grain`）。抬升只有一档：`{colors.surface}` 相对 `{colors.bg}`。

堆叠感来自 sticky：项目卡按 `top: 96px + index * 28px` 依次落位并按 `1 - 0.03 * 剩余层数`
缩放，形成「一叠被翻过的场刊」。这三个常量是版式事实，改动需同步 `DESIGN_SPEC.md` §8。
视频层永远在内容之下（`opacity-14` 的倒放页脚、封面后的 `VideoTexture`），不做玻璃拟态。

## Shapes

直角为主：`{rounded.none}` 用于卡片、按钮、表格、图片；`{rounded.frame}`（2px）只用于
真正的框线交点；`{rounded.dot}` 只给 8px 状态点。切角、投影、渐变描边都不属于这套语言。

封面压暗层（`scrim-top` / `scrim-left` / `scrim-flat` / `scrim-bottom`）是唯一的形状性装饰，
几何写在 `src/index.css` 的 `@utility` 里，组件不得再写内联渐变或裸百分比。

## Components

组件的状态矩阵必须覆盖 default / hover / focus-visible / active / disabled，涉及数据时覆盖
loading 与 error（本站的 error 等价物是「素材探测失败 → 回落静态图」）。本站无表单、无异步提交，
因此 disabled 与 loading 两态在所有组件中合法缺席——不要为它们声明前端不存在的 token。

- `button-primary`：`{components.button-primary}` → hover/active `{components.button-primary-hover}`，
  focus 用全局 2px `{colors.brass}` outline + 3px offset。
- `button-secondary`：描边按钮，hover 时描边与文字同时转黄铜，不填充背景。
- `link-nav`：目录项，当前段 `{components.link-nav-current}` 且带 `aria-current`；
  命中区用 `min-h-{spacing.hit}` 撑起，不靠伪元素魔法。
- `card-project`：hover / focus 播放 `hover-*.mp4`，离开归零并 pause；键盘聚焦等同 hover。
- `table-row`：hover 与 focus-within 同为 `{components.table-row-hover}`，读作「选中行」。
- `qr-tile`：二维码是装饰，`aria-hidden`，可读名挂在包裹的 `<a>` 上。
- 抽屉（`TopBar`）：链接为 `{components.drawer-nav-link}`（hover `{components.drawer-nav-link-hover}`），
  `<button aria-expanded aria-controls>` + `Escape` 关闭，展开高度动画，reduced-motion 下直接呈现。

## Do's and Don'ts

**Do**

- 新数据先进 `src/data/site.ts`，并且必须能指回老站 constants 或真实项目；文案不编造、不放假证言、不用假头像。
- 新尺寸先进 `@theme`；组件类名只允许 token 化的 utility（`mt-stack-md`、`min-h-hit`、`max-w-heading`），
  不新增 `-[...]` 裸值。
- 视频/大图层保持探测式：`fetch(HEAD)` + `content-type` 以 `video/` 开头才挂载，缺素材就回落静态图。
- WebGL 覆盖层容器用 `style` 写 `pointer-events: none`（Tailwind utility 在 `<Canvas>` 上不可靠）。
- 每次改视觉都跑三档复验：1440×900、390×844、`prefers-reduced-motion`，headless Chrome 截图。

**Don't**

- 不要把封面做成居中大字三件套；不要给卡片加圆角阴影渐变三件套。
- 不要在两处放同一个外链（社媒只在页脚出现一次）。
- 不要同时跑三个以上横向动效层；素材带每张照片只出现一次语义。
- 不要在 canvas / three.js 材质里复制一份十六进制色值，运行时从 `@theme` 变量读取。
- 不要为了让指标好看而放宽阈值：验收项不达标就写「未过」。
