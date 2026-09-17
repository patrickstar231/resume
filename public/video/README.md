# 视频素材位

这个目录存放按《3D Video Parallax Scrolling 需求文档》第四节交付的镜头文件。
文件到位后**不需要改任何代码**，`src/site/Plate.jsx` 会自动挂载并由滚动驱动播放头。

## 命名与幕位对应

| 文件 | 幕 | Alpha |
| --- | --- | --- |
| `blackout-bg.webp`…  → `blackout-bg.webm` / `blackout-bg.mp4` | CUE 00 黑场 | 否 |
| `build-bg.webm` / `build-bg.mp4` | CUE 01 搭建 | 否 |
| `truss-fg.webm` / `truss-fg.mp4` | CUE 01 搭建 前景 | **是** |
| `bulb-bg.webm` / `bulb-bg.mp4` | CUE 02 亮灯 | 否 |
| `stage-bg.webm` / `stage-bg.mp4` | CUE 03 现场 | 否 |
| `strike-bg.webm` / `strike-bg.mp4` | CUE 04 散场 | 否 |
| `wrap-bg.webm` / `wrap-bg.mp4` | CUE 05 收工 | 否 |
| `dust-fg.webm` / `dust-fg.mp4` | 全站前景 | **是** |

## 硬性要求（不符会卡顿或不显示）

- **全 I 帧**：`-g 1`（滚动来回 seek，GOP 长了一定卡）
- 25 fps，静音，6–8 秒
- 背景 1920×1080，前景（alpha）1080×1080
- WebM 用 VP9 + alpha（`-c:v libvpx-vp9 -pix_fmt yuva420p`），另出一份 H.264
- 首帧必须是有内容的画面，作为 poster

## 当前状态

目录为空。`Plate.jsx` 检测不到文件时自动走降级链：设计出来的空场底色 + 颗粒 + 暗角。
