# 3D Video Parallax 简历站 · 落地需求与验收文档

实现工程：`resume-parallax/`（独立新建，与老站 `patrickstar231/resume` 仅共享真实素材与事实文案；老源码只作参考，未复用其技术栈）
设计规范：`resume-parallax/DESIGN_SPEC.md`

## 1. 目标

把简历站从「静态作品集」升级为「用工程能力本身当内容」的沉浸站点：滚动驱动的 WebGL 3D + 视频纹理视差，配合荒诞但克制的高级视觉语言，让面试官在前 8 秒内相信「这个人真的做互动现场」。

## 2. 信息架构与实现映射

| 段 | 需求 | 实现 | 状态 |
|---|---|---|---|
| P0 Splash | 幕布揭幕 + 姓名 | `Chrome.tsx / Splash`：2×5 `bg-ink` 块 rotateX 翻离，逐字 blur→focus，1450ms 卸载 | 已实现，待视觉复验 |
| P1 Hero | 视频纹理 + 3D 切片 + 滚动驱动相机/旋转/UV | `canvas/HeroCanvas.tsx`：三段 `BoxGeometry` 切片贴 `images/hero-bust.jpg`，`VideoTexture` 贴 `/media/hero-loop.mp4`，进度 = `clamp(scrollY/innerHeight)` | 已实现；视频层为探测式（素材待投） |
| P1b 文案 | 非居中锚定 + 单一 CTA | `Chrome.tsx / HeroCopy`：左下 display 大字 + mailto CTA + 排版式次链接 + 接单状态点 | 已实现 |
| P2 Marquee | 滚动横向素材带 | `Sections.tsx / WorkMarquee + WordBand`：双排反向 + 死板重复词带 | 已实现 |
| P2b 社媒 | 小红书 / CSDN / 知乎 + 二维码 | `SocialRail`：三枚 pill + `QRCodeSVG`（真实链接） | 已实现 |
| P3 About | 粤语项目 + 字符级滚动揭示 + 实况链接 | `AboutSection`：`Char` 逐字 opacity 进度 + `GlyphRain` canvas + `hk.datatrade.top` | 已实现 |
| P3b Projects | 3 张 sticky 堆叠卡 + hover 视频 | `ProjectsSection`：`top: 96+index*28`，`targetScale = 1-(total-1-index)*0.03`，hover 播 `/media/hover-*.webm`（缺省回落实拍图） | 已实现；hover 素材待投 |
| P4 Footer | 倒放视频 + 邮箱 + 下载简历 | `SiteFooter`：mailto、`download` PDF、社媒列表、brass 光晕；倒放视频归入 `/media/` 待投 | 已实现（视频层待投） |

## 3. 交互与无障碍底线

- 保留原生滚动可访问性：Lenis 只做平滑，不接管滚动容器；sticky、锚点、`PageDown/Home/End`、读屏顺序全部可用。
- `prefers-reduced-motion`：跳过 Splash、指针视差、字符雨、视频纹理；切片保持静态构图。
- 焦点可见：全局 2px brass outline + offset；触控/点击目标 ≥44px。
- 装饰层（canvas、Splash、噪点）一律 `aria-hidden`。
- 文案真实性：职衔、时间、指标全部来自老站 `constants` 与真实项目，无虚构 testimonial、无假头像。

## 4. 性能预算

| 项 | 目标 | 实测 |
|---|---|---|
| 首屏阻塞 JS | ≤300KB gz | 119.29KB gz（WebGL 拆为 `lazy()` 异步块 237.29KB gz） |
| Lighthouse | ≥85 | 待线上复测 |
| CLS | 0 | 0（canvas `position:fixed`，无文档高度抖动） |
| 视频 | ≤15s 循环、≤2MB、无声、带 poster | 素材待投后复测 |
| DPR | ≤2 | `dpr={[1,2]}`，出视口 `frameloop='never'` |

## 5. 待投素材清单（阻塞项）

出片方只负责给原始片段，放进 `resume-parallax/raw-media/`；压缩、倒放、改名、投放由本仓执行。

```
原始片段 → resume-parallax/raw-media/hero.mp4              → public/media/hero-loop.mp4        ≤15s 循环 · ≤2MB · 无声
          → resume-parallax/raw-media/porsche.mp4          → public/media/hover-porsche.mp4    3–5s · ≤600KB
          → resume-parallax/raw-media/huawei.mp4           → public/media/hover-huawei.mp4     3–5s · ≤600KB
          → resume-parallax/raw-media/tencent.mp4          → public/media/hover-tencent.mp4    3–5s · ≤600KB
          → resume-parallax/raw-media/footer.mp4           → public/media/footer-reverse.mp4   5–8s · ≤800KB · 需 -vf reverse 倒放
public/models/*.glb                                        # 可选，≤3MB Draco 压缩
```
hover 素材已从 `.webm` 改为 `.mp4`：手机/剪映原生导出的 H.264 即投即用，不需要 VP9 编码链。
投放即生效：代码用 `fetch(url,{method:'HEAD'})` 探测（并要求响应 `content-type` 以 `video/` 开头），不存在时回落静态图，不会出现空层或 404。页脚倒放层还额外要求页脚进入视口前 300px 才挂载。

## 6. 部署

`vercel.json` 已配置 `/media/*`、`/assets/*`、`/models/*` 一年 immutable 缓存（media 带 `Accept-Ranges: bytes` 以支持视频 seek），`/images/*` 7 天。构建：`npm run build` → `dist/`。

## 7. 验收清单（勾选制）

- [x] Splash → Hero → Marquee → Social → About → Projects → Footer 全链路可滚动、无报错
- [x] Hero 3D 随滚动旋转/展开/推近，指针微视差（无头 Chrome 截图确认三段切片随滚动展开、crown/face/base 齐全）
- [x] 三张项目卡 sticky 堆叠并按 `targetScale` 缩放
- [x] 粤语段落字符级滚动揭示 + 真实可点 `hk.datatrade.top`
- [x] 社媒三链 + 二维码指向真实主页（2026-09-18 由本人浏览器逐条确认可达：小红书 xhslink.com/m/5DkJLXbYHA4、CSDN blog.csdn.net/patrickstar231、知乎 zhihu.com/people/patrick-pan-7；脚本侧探测返回 CSDN 000 / 知乎 403 / 小红书 302 属反爬拦截，不代表死链）
- [x] 邮箱与 PDF 下载可用
- [x] WebGL 覆盖层点击穿透：容器 inline `pointer-events: none`，DOM 命中测试确认导航/正文/页脚链接均可点
- [x] 各屏视觉复验：无头 Chrome（1440×900 / 390×844 / prefers-reduced-motion）三轮截图，console 零报错，`body.scrollWidth === innerWidth` 无横向溢出
- [x] 移动端首屏构图与标题断行：切片下移右移避开导航与正文、h1 改为「把现场／做成系统」两行、页脚标题 `text-balance`
- [x] `tsc --noEmit && vite build` 通过
- [x] 投放 `/media/*` 后复验视频纹理与 hover 播放：HEAD 探测到 `video/mp4` 后挂载；hover 视频 `readyState 4` 且 `currentTime` 走动、离开归零；页脚倒放层时钟 2.46→3.36；首屏媒体 1215 KiB，15 屏截图 console 零报错
- [ ] 中文字体子集化替换（当前为系统栈回退）
- [ ] Lighthouse ≥85 线上复测
