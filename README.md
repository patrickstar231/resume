# Patrick Pan / 潘宇龙

品牌活动与数字营销个人作品集。分支 `feat/3d-video-parallax`，方向为 **3D Video Parallax Scrolling**，视觉基调「荒诞高级」。需求与镜头表见 [3D Video Parallax Scrolling 需求文档](../3D%20Video%20Parallax%20Scrolling%20需求文档.md)。

- 网站：[resume.datatrade.top](https://resume.datatrade.top/)
- 仓库：[patrickstar231/resume](https://github.com/patrickstar231/resume)
- 页面截图：[桌面](docs/previews/desktop.webp) / [手机](docs/previews/mobile.webp)
- React 18、Vite 4、Tailwind CSS 3；GSAP 仅用于照片级视差，按需懒加载。视频用 CSS 3D + 滚动 scrub，不用 WebGL。

## 视觉构思：荒诞高级

「高级」和「荒诞」都不是可以直接执行的风格词，先翻译成可观测的量（完整推导见需求文档第一节）：

| 维度 | 取值 | 证据 |
| --- | --- | --- |
| Energy | 6/10，能量靠**尺度**制造，不靠饱和度 | 会展现场高能量，但主轴是 186 项验收清单、0 事故 |
| Finish | 8/10，精密 | 东西越做得一丝不苟，它越不正常，张力才成立 |
| Density | 3/10，分区间距 96-160px | 高端作品集一次只讲一件事 |
| Weight | 7/10，Display 96-260px | 会展是巨物尺度 |
| Seriousness | 4/10，允许失重与不可能的比例 | 用最正经的排版承载它，正经本身就是笑点 |

- **配色三色**：暖黑/纸白、墨青（冷底）、琥珀（唯一高饱和强调，表面占比 <=10%）。上一版的洋红+青属于被禁的 pink+cyan 组合，已剔除
- **字体**：拉丁 Display 用 Bodoni Moda（高对比 Didone），中文 Display 用宋体（Songti SC / SimSun）——中文的高对比衬线就是宋体，两者视觉同源。刻意不用苹方/思源黑体，那是中文 UI 的 AI 默认值；正文仍用黑体保证屏幕可读
- **全站骨架是演出 CUE 表**：左栏常驻 7 幕（黑场/精选项目/工作方法/幕后/场次表/舞台之外/谢幕），经历也按 CUE 表排版
- **发丝细线** 1px 做分隔，按钮纯色无渐变，全站无外发光、无紫调背景

## 3D Video Parallax Scrolling

| 层 | 位置 | 说明 |
| --- | --- | --- |
| 视频播放头 | `src/site/stage.js` | 每个幕的 `<video data-scrub>` 由该幕在视口中的穿越进度驱动 currentTime，seek 阈值一帧（1/25s） |
| 摄像机推进 | `src/site/stage.js` | 首屏滚动把世界沿 Z 轴推进 760px |
| 深度漂移 | `[data-depth]` + 容器 `perspective` | 区块随滚动在 Z 轴漂移 |
| 指针视差 | `src/site/stage.js` | 指针角度旋转舞台；不使用设备陀螺仪 |
| 焦平面 | `[data-focus]` | 区块从虚焦、后退推到实焦 |
| 照片视差 | `src/site/parallax.js` | 图片在自身画框内缓慢平移 |

视频文件尚未提供，当前全部走降级链：视频位就绪（`public/video/`），缺失时用设计出来的空场底色 + 颗粒 + 暗角，页面始终是完整可读的简历。镜头表、alpha 与编码规格、运镜参数见需求文档第四、六节。

## 3D Parallax Scrolling 是怎么实现的

| 层 | 位置 | 说明 |
| --- | --- | --- |
| 摄像机推进 | `src/site/stage.js` | 首屏滚动把整个世界沿 Z 轴推进 760px，远景留驻、前景浮尘掠过镜头 |
| 深度漂移 | `src/site/stage.js` + `[data-depth]` | 每个区块带着自己的深度值随滚动在 Z 轴漂移，容器上的 `perspective` 把它变成真正的景深 |
| 指针视差 | `src/site/stage.js` | 指针角度轻微旋转整个舞台；不使用设备陀螺仪，避免移动端误触 |
| 焦平面 | `index.css` 的 `[data-focus]` | 区块进入视野时从虚焦、后退的状态推到实焦 |
| 照片视差 | `src/site/parallax.js` | 图片在自身画框内缓慢平移，与页面级摄像机互不争抢 transform |

性能取舍：整站不用 WebGL、不用 `<canvas>`，只有 CSS 3D 变换。一个 `requestAnimationFrame` 循环写少量自定义属性，其余全部由 CSS 推导。宽屏且允许动效时才启用摄像机与深度漂移；「减少动态效果」或窄屏退化为静态可读页面。

## 本地运行

建议 Node.js 24（`.nvmrc`），npm 11。无需环境变量或邮件服务密钥。

```bash
git clone https://github.com/patrickstar231/resume.git
cd resume
git checkout feat/3d-parallax-stage
npm ci
npm run dev
```

开发地址为 `http://localhost:5173`。检查部署行为时使用生产构建：

```bash
npm run verify
npm run preview
```

预览地址为 `http://localhost:4173`。`verify` 会构建站点并运行静态内容、链接、资源预算及 HTTP 状态检查。浏览器检查：

```bash
npx playwright install chromium
npm run test:browser
```

测试会启动本地预览服务，将截图与打印样张保存在忽略提交的 `.verification/`。

## 内容与页面

| 修改内容 | 位置 |
| --- | --- |
| 个人介绍、8 段工作经历、教育与证书 | `src/content/profile.js` |
| 三个案例的中英文叙述 | `src/content/projects.js` |
| 导航、按钮、Hero 文案与现场说明 | `src/content/ui.js` |
| 路由、标题、语言对应关系 | `src/content/routes.js` |
| 首页分区与深度标记 | `src/site/Sections.jsx` |
| 颜色、排版、3D 舞台、移动端、打印样式 | `src/index.css` |
| 摄像机、深度漂移、焦平面、时间码 | `src/site/stage.js` |
| 照片响应式版本与画框比例 | `src/site/Media.jsx` |
| 静态 HTML、SEO、站点地图 | `scripts/prerender.mjs` |

中文根路径为 `/`，英文为 `/en/`；案例为 `/projects/porsche-992/`、`/projects/huawei-b2b-live/`、`/projects/tencent-ecosystem/`，英文案例加 `/en` 前缀。简历为 `/resume/` 与 `/en/resume/`。锚点为 `#intro`、`#projects`、`#approach`、`#behind`、`#runsheet`、`#offstage`、`#contact`。每个案例页都带品牌方官网跳转。

修改事实时同步修改两种语言。最新任职记录截止 2025.09，未据此推断当前工作状态。详见 [内容核对说明](docs/content-review.md)。

## 照片

仓库仅包含经过裁切、压缩和去除元数据的公开照片衍生版本。原始照片保留在本人手中，不需部署。全部照片均为本人提供的真实照片，不含生成式素材。

重新导出时，把照片放到一个本地目录（脚本按文件名取值）：

```bash
npm run images -- --source-dir /absolute/path/to/photos
```

脚本从 `--source-dir` 读取 `IMG_7598.jpeg`（团队）、`beauty_1674806609290.JPG`（围餐）、`IMG_4537.JPG`（露营）、`IMG_2216.JPG`（雪地），另从仓库内 `source/cases/` 读取三张项目现场图，生成 WebP / JPEG、多尺寸与 1200 × 630 分享图，并更新 `docs/image-manifest.json`。工作照单版本不超过 220 KiB，案例图不超过 260 KiB。图片参数与 `src/site/Media.jsx`、`scripts/images.mjs` 同步维护。

`IMG_7721.jpeg`（桌前工作）及其全部派生图已按要求从仓库与页面中移除。

案例照片当前为空。确认素材对应项目、场次和使用权后，才在 `projects.js` 设置 `media.publicationStatus: 'approved'`。

## Vercel 部署交接

由仓库所有者自行部署。本次改造不需要后端、数据库、付费服务或新的环境变量。

1. 在 Vercel 关联本仓库。注意 Vercel 的 Production Branch 默认是 `main`，而本次改动在 `feat/3d-video-parallax`。
2. 推送该分支后，Vercel 会自动生成一条 **Preview 部署**，在控制台 Deployments 里拿到预览域名，先在这里验收。
3. 验收通过后，把 `feat/3d-video-parallax` 合并进 `main`，或在 Vercel 里把 Production Branch 指到该分支。中文已是默认语言（`/`），英文在 `/en/`。
4. Framework Preset 使用 Vite，Node.js 使用 24.x，Install Command 为 `npm ci`，Build Command 为 `npm run build`，Output Directory 为 `dist`。仓库 `vercel.json` 已声明构建及输出目录。
5. 清理控制台中旧的 SPA 全路径 rewrite，避免把未知地址改写成首页。构建产物已经为每条路由输出 `index.html`，并生成 `404.html`。
6. 核对域名 `resume.datatrade.top`。如变更域名，先修改 `profile.origin`，重新生成 canonical、hreflang、分享地址与站点地图。
7. 预览部署会自动输出 noindex 和禁止抓取的 robots.txt（`VERCEL_ENV` 非 production 时），不会污染搜索索引。

## 验证记录与素材来源

实际执行结果及尚需真机 / 部署验证的事项见 [验证记录](docs/verification.md)。

个人照片由 Patrick Pan 提供。Manrope 通过 `@fontsource-variable/manrope` 自托管，许可随包分发；图标使用 Phosphor。此仓库原先基于 [JavaScript Mastery 3D Developer Portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio)，现已替换模板正文与 WebGL 展示，保留来源说明。
