# Patrick Pan / 潘宇龙

品牌活动与数字营销个人作品集，按《个人网站改版 PRD v1.1》实现「幕后与现场」方向。

- 网站：[resume.datatrade.top](https://resume.datatrade.top/)
- 仓库：[patrickstar231/resume](https://github.com/patrickstar231/resume)
- 页面截图：[桌面](docs/previews/desktop.webp) / [手机](docs/previews/mobile.webp)
- React 18、Vite 4、Tailwind CSS 3，GSAP 仅作为桌面端可选视差模块。
- 中英文首页、三个项目详情与打印简历，共 10 个独立静态页面，另含真实 404 页面。
- 支持系统 / 浅色 / 深色主题、系统 / 减少动态效果；禁用 JavaScript 时正文、导航、经历展开与邮箱仍可用。

## 本地运行

建议 Node.js 24（`.nvmrc`），npm 11。无需环境变量或邮件服务密钥。

```bash
git clone https://github.com/patrickstar231/resume.git
cd resume
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

测试会启动本地预览服务，将截图、打印样张保存在忽略提交的 `.verification/`。首次在精简 Linux 环境运行时，可按 Playwright 提示安装浏览器系统依赖。

## 内容与页面

| 修改内容 | 位置 |
| --- | --- |
| 个人介绍、8 段工作经历、教育与证书 | `src/content/profile.js` |
| 三个案例的中英文叙述 | `src/content/projects.js` |
| 导航、按钮和反馈文案 | `src/content/ui.js` |
| 路由、标题、语言对应关系 | `src/content/routes.js` |
| 首页与详情布局 | `src/site/`、`src/App.jsx` |
| 颜色、排版、移动端、打印样式 | `src/index.css` |
| 视差范围与启用条件 | `src/site/parallax.js` |
| 静态 HTML、SEO、站点地图 | `scripts/prerender.mjs` |

英文根路径为 `/`，中文为 `/zh/`；案例为 `/projects/porsche-992/`、`/projects/huawei-b2b-live/`、`/projects/tencent-ecosystem/`，中文案例加 `/zh` 前缀。简历为 `/resume/` 与 `/zh/resume/`。原有 `#about`、`#work`、`#contact` 锚点保留，新增 `#projects` 与 `#life`。

修改事实时同步修改两种语言。最新任职记录截止 2025.09，未据此推断当前工作状态。未经核对的成绩数字和案例照片不进入发布数据。详见 [内容核对说明](docs/content-review.md)。

## 照片

仓库仅包含经过裁切、压缩和去除元数据的公开照片衍生版本。原始照片保留在本人手中，不需部署。

重新导出时，将 `IMG_7721.jpeg`（桌前工作）、`IMG_4537.JPG`（露营）、`IMG_2216.JPG`（雪地）放到一个本地目录：

```bash
npm run images -- --source-dir /absolute/path/to/photos
```

脚本生成 WebP / JPEG、多尺寸与手机构图，以及 1200 × 630 分享图，并更新 `docs/image-manifest.json`。工作照单个版本不超过 250 KiB，生活照不超过 180 KiB；雪地照片采用较小尺寸保留自然质感。图片参数与 `src/site/Media.jsx` 同步维护。

案例照片当前为空。确认素材对应项目、场次和使用权后，才在 `projects.js` 设置 `media.publicationStatus: 'approved'`，准备相应图片版本与中英文替代文本，并检查构图。Porsche 的视差挂载点已预留，在照片获准使用前不启用。

## Vercel 部署交接

由仓库所有者自行部署。本次改造不需要后端、数据库、付费服务或新的环境变量。

1. 在 Vercel 关联本仓库，确认实际 Production Branch；GitHub 默认分支本身不能证明 Vercel 的生产设置。
2. Framework Preset 使用 Vite，Node.js 使用 24.x，Install Command 为 `npm ci`，Build Command 为 `npm run build`，Output Directory 为 `dist`。仓库 `vercel.json` 已声明构建及输出目录。
3. 清理控制台中旧的 SPA 全路径 rewrite，避免把未知地址改写成首页。构建产物已经为每条路由输出 `index.html`，并生成 `404.html`；无需 catch-all rewrite。
4. 核对域名 `resume.datatrade.top`。如变更域名，先修改 `profile.origin`，重新生成 canonical、hreflang、分享地址与站点地图。
5. 在预览部署直接打开中英文详情和简历，刷新页面，检查不存在路径返回 HTTP 404，检查照片、邮件链接、打印及减少动态效果。
6. 预览通过后再按自己的流程合并 / 发布。`VERCEL_ENV` 为非 production 时自动输出 noindex 和禁止抓取的 robots.txt。

旧 EmailJS 表单及依赖已移除，联系入口改为邮箱链接与复制邮箱。可在本人控制台移除不再使用的 EmailJS 环境变量。打印简历使用浏览器「打印 / 另存为 PDF」，不提供过期简历附件。

## 验证记录与素材来源

实际执行结果及尚需真机 / 部署验证的事项见 [验证记录](docs/verification.md)。

个人照片由 Patrick Pan 提供。Manrope 通过 `@fontsource-variable/manrope` 自托管，许可随包分发；图标使用 Phosphor。此仓库原先基于 [JavaScript Mastery 3D Developer Portfolio](https://github.com/adrianhajdin/project_3D_developer_portfolio)，现已替换模板正文与 WebGL 展示，保留来源说明。
