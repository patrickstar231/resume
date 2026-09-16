# 改版验证记录

## 2026-09-16 3D 视差改版验证（`feat/3d-parallax-stage`）

在 `feat/behind-the-work-portfolio` 基础上重建视觉与动效，方向为 3D Parallax Scrolling。`npm run verify` 通过：生产构建成功，10 个内容页面、404、站点地图与 robots.txt 正常；8 项 Node 测试通过；浏览器套件 7 项通过。

| 检查 | 结果 |
| --- | --- |
| 生产构建 | 通过；首路由 JavaScript 72.30 KiB gzip，舞台模块 1.18 KiB gzip，照片视差 45.74 KiB gzip（懒加载），均在 180 KiB 首路由预算内 |
| `npm test` | 8 项通过，新增「舞台引擎为可选增强」与真实照片资源集断言 |
| `npm run test:browser` | 7 项通过，新增舞台测试：开场 `data-at-top` 黑场、`--camz` 与 `--hp` 随滚动推进、时间码前进、`--drift` 写入、`[data-focus]` 进入 `in-focus` |
| 无 JavaScript | 通过；舞台引擎与焦平面状态只在客户端挂载，预渲染 HTML 不含 `focus-ready`，正文与导航完整可读 |
| 减少动态效果 / 触摸平板 | 通过；摄像机、深度漂移与照片视差的 transform 全部清理 |
| 320 / 390 / 768px | 通过；`scrollWidth` 不超视口，首屏操作可见 |
| 明暗主题、中英双语、案例页、简历页、打印 | 桌面 1440 × 900 与手机 390 × 844 逐屏目检；打印样式未受影响 |

本次浏览器套件在以已安装的 Google Chrome 执行的本地配置下运行：本机 Playwright 1.63 无法为 mac13-arm64 下载配套 Chromium（`Playwright does not support chromium on mac13-arm64`）。仓库默认测试配置未改动，仍使用标准 Playwright 安装流程。

已修复的过程问题，供后续参考：`translateZ` 在缺少 `perspective` 祖先的元素上是空操作，区块深度一度完全不可见；Hero 内容在首次滚动后过早淡出，导致黑场出现大片空白；浅色主题下 `.hero h1` 因类名从 `hero` 改为 `stage-hero` 而失效，标题缩回正文尺寸。

尚未执行：Lighthouse 复测、真机浏览器、Vercel 预览域名验收。

## 2026-09-16 增量验证

本次在 `feat/behind-the-work-portfolio` 增加个人项目、三张生成式工作场景照和页面级视差。`npm run verify` 已通过：生产构建成功，10 个内容页面、404、站点地图及 robots.txt 正常；7 项 Node 测试全部通过，覆盖新增外部项目入口与 18 个响应式工作照文件。首路由 JavaScript 为 71.15 KiB gzip，视差模块为 45.93 KiB gzip，仍低于项目设置的 180 KiB 首路由预算。

本次环境无法重新执行 Playwright：标准 Chromium 下载源连续超时后被网络白名单以 403 拒绝，系统中也没有可复用的 Chromium。下方 2026-09-14 浏览器记录属于改动前基线，不能替代本次增量的浏览器复核。合并或发布前应在 GitHub Actions / 本机运行 `npx playwright install chromium && npm run test:browser`，重点检查 320 / 390 / 768px 横向溢出、四项桌面导航宽度，以及开启 / 关闭减少动态效果后的 transform 清理。

验证日期：2026-09-14。对应「幕后与现场」首版实现，基线为 `214e29b5ad64a58d86aaeb406104322ffb89d92d`。

## 已执行

| 检查 | 结果 |
| --- | --- |
| Node 24.19.0 / npm 11.9.0 生产构建 | 通过；10 个内容页面、独立 404、站点地图和 robots.txt |
| `npm test` | 6 项通过：静态内容、语言对应、链接、发布数据与资源、初始 JS、HTTP 状态与压缩 |
| Playwright 1.63.0 / Chromium 153.0.8010.0 | 6 项通过，覆盖下方交互与失败场景 |
| 中英文深浅主题、桌面 1440 × 900、320 / 390 / 768px 布局 | 已检查；没有横向溢出，首屏操作可见 |
| 手机菜单与设置 | 焦点保持在原生对话框内；Escape 关闭后返回触发按钮；标签与选择项关联正确 |
| 视差 | 桌面随滚动移动；手动减少动态效果后清理 transform；系统减少动态效果及 1024px 触摸设备保持静态 |
| 无 JavaScript | 正文预生成；原生菜单、较早经历展开、语言链接、邮箱可用 |
| 图片、存储及剪贴板异常 | 图片在 hydration 前失败也有回退；存储被阻止仍可阅读；复制失败提示手动复制 |
| 案例和简历路由 | 直接打开、刷新及历史返回可用；切换语言保留当前页面 |
| 未知地址 | 本地静态服务返回真实 HTTP 404；共用英文 404 页面，可返回中英文首页 |
| 打印 | 中英文各 2 页 A4；工作经历与项目 / 教育 / 资质分为两页，已逐页检查 |
| Git diff whitespace | `git diff --check` 通过 |

浏览器测试通过本地独立 Chromium 二进制执行；原 Playwright 浏览器下载源在本次环境中不可用。部署依赖和默认测试配置仍使用标准 Playwright 安装流程。

容器的无界面 Chromium 无法发现已安装的中文系统字体，因此中文视觉与打印复核在测试上下文中加载了本地 Noto Sans SC。该测试字体没有加入网站资源；生产仍使用 PRD 要求的中文系统字体栈。不同系统的字形和换行可能略有差异。

## Lighthouse

Lighthouse 13.4.1，Chromium 153.0.8010.0，生产构建、默认移动端模拟，英文首页连续三次。预览服务器支持 gzip 文本压缩；图片和字体使用原有二进制文件。

| 指标 | 第 1 次 | 第 2 次 | 第 3 次 | 中位数 |
| --- | ---: | ---: | ---: | ---: |
| Performance | 99 | 99 | 99 | 99 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| FCP | 1.207 s | 1.215 s | 1.206 s | 1.207 s |
| LCP | 1.807 s | 1.815 s | 1.806 s | 1.807 s |
| TBT | 0 ms | 0 ms | 0 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |

首路由 JavaScript 约 69 KB gzip；GSAP 单独懒加载约 46 KB gzip，仅在符合视差条件的设备启用。24 个响应式照片文件及分享图合计约 2.61 MiB，浏览器按设备选择合适版本，不会一次下载全部版本。工作照单版本 ≤ 250 KiB，生活照单版本 ≤ 180 KiB，尺寸及质量见 `image-manifest.json`。

修复了两项会影响体验的问题：手机导航从静态版切换到交互版时的高度变化，以及 eager 图片在 React 接管前加载失败时没有显示回退。字体预加载进一步减少了布局变化。

这些是本地实验室结果，不能替代上线后的真实用户数据，也未据此声称 INP 或所有用户的 Core Web Vitals 达标。

## 部署前仍需本人检查

- Vercel 控制台中的生产分支、构建覆盖设置、域名及旧 rewrite；本次没有访问或修改控制台。
- Vercel 预览域名上的中英文详情直达与刷新、实际 HTTP 404、canonical / hreflang，以及生产环境允许索引。
- Safari / iOS Safari、Android Chrome、Edge、Firefox 及微信内置浏览器的真机操作；本次未将这些浏览器标记为已通过。
- 保时捷及其他案例照片与场次的对应关系。当前文字版案例可以使用，未确认的照片不发布。

本次不添加埋点和自动发布流程。网站由本人按 README 交接步骤部署。
