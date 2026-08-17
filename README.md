# Stock Heat Landing — 热股推广页

热股（Stock Heat Tracker）的官方推广页面，基于 **Cloudflare Pages** 部署，纯静态站点，无构建步骤。

---

## 文件结构

```
stock-heat-landing/
├── index.html                  # 主页（含 SEO / OG 元数据）
├── styles.css                  # 样式（红黑主题，App 设计语言延续）
├── script.js                   # 轻量交互（导航栏滚动、FAQ 手风琴、入场动画）
├── assets/
│   └── screenshots/            # 截图素材（来自 ../screenshot/）
│       ├── 01-ranking.png       # 移动端：排名
│       ├── 02-ai-pick.png       # 移动端：AI 掘金
│       ├── 03-trend.png         # 移动端：走势
│       ├── 04-watchlist.png     # 移动端：自选
│       ├── 05-news.png          # 移动端：资讯
│       ├── 06-market.png        # 移动端：行情
│       ├── 07-detail.png         # 移动端：个股详情
│       ├── 08-float.png          # 移动端：悬浮盯盘球
│       ├── desktop-01-ranking.png   # 桌面端：排名
│       ├── desktop-02-market.png    # 桌面端：行情
│       ├── desktop-03-trend.png     # 桌面端：走势
│       ├── desktop-04-watchlist.png # 桌面端：自选
│       ├── desktop-05-news.png      # 桌面端：资讯播报
│       ├── desktop-06-detail.png    # 桌面端：个股详情
│       ├── desktop-07-float.png     # 桌面端：悬浮盯盘球
│       ├── feature-graphic.png
│       └── icon.png
├── _headers                    # Cloudflare Pages 缓存策略 + 安全头
├── _redirects                  # /privacy → 后端隐私页
├── wrangler.toml               # Cloudflare Pages 配置
├── package.json                # 部署脚本
└── README.md
```

---

## 本地预览

任意静态服务器即可，例如：

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .

# Wrangler Pages 本地开发（推荐，会应用 _headers/_redirects）
npx wrangler pages dev .
```

打开 <http://localhost:8080>

---

## 部署到 Cloudflare Pages

### 方式 A：Git 集成（推荐）

1. 把 `stock-heat-landing/` 推到独立仓库（或保留在 monorepo 子目录）
2. Cloudflare Dashboard → **Workers & Pages** → Create → Pages → Connect to Git
3. 选择仓库，配置：
   - **Project name**: `stock-heat-landing`
   - **Production branch**: `main`
   - **Build command**: *留空*
   - **Build output directory**: `/`（仓库根目录）
4. 如部署的是 monorepo 子目录，使用 **Root directory** 设置为 `stock-heat-landing`
5. Save and Deploy

### 方式 B：直接上传（Wrangler CLI）

```bash
cd stock-heat-landing
npm install              # 安装 wrangler
npm run deploy           # 部署到 main 分支的 Production 环境，更新根域名 stock-heat-landing.pages.dev
# 等价命令：
#   wrangler pages deploy . --project-name stock-heat-landing --branch main --skip-caching
# 仅部署到预览分支、不更新根域名：
#   npm run deploy:preview
```

首次运行会要求登录 Cloudflare 并在 Dashboard 创建项目（或用 `wrangler pages project create stock-heat-landing` 提前创建）。

> ⚠️ **默认 `npm run deploy` 已带 `--branch main`**：Pages 项目的 Production 环境对应 `main` 分支，根域名 `https://stock-heat-landing.pages.dev` **只跟随 `main` 分支的 Production 部署**。若漏掉 `--branch main`（例如仅 `wrangler pages deploy .`），部署会落到 `master`/预览分支，**根域名不会更新**，表现为改了代码却不生效。如果本地 git 工作在 `master` 分支，请始终用 `npm run deploy`（带 `--branch main`）而非 `npm run deploy:preview`。

> ⚠️ **务必加 `--skip-caching`**：`wrangler pages deploy` 默认会缓存已上传文件的哈希（存在 Cloudflare 端）。在本仓库（git 模式 + `wrangler.toml` 的 `pages_build_output_dir = "."`）下，修改文件后直接部署常会报 `Uploaded 0 files (xx already uploaded)`，而远程实际仍是旧内容——表现为改了代码/配置却不生效。加 `--skip-caching` 可强制重新计算并上传全部文件。`package.json` 里 `deploy` / `deploy:preview` 脚本均已带上该参数。

### 方式 C：拖拽部署

把 `stock-heat-landing/` 整个目录拖到 <https://dash.cloudflare.com/?to=/:account/pages> 的 "Direct Upload" 区域即可。

---

## 部署后

- **默认域名**: `https://stock-heat-landing.pages.dev`
- **自定义域名**（可选）：
  - Dashboard → Pages → 项目 → Custom domains → 添加 `landing.stock-heat.com`（或你拥有的域名）
  - Cloudflare 自动签发证书

---

## APK 发布（Android 直装包）

落地页「下载」区的「下载 APK 直接安装」按钮指向 Cloudflare R2 上的签名 APK，与 Windows 安装包同桶 `stock-heat-downloads`。

```bash
# 1. 构建 Android release 签名 APK（需 ANDROID_HOME 与 JDK）
cd ..\stock_heat_app
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\sdk"
flutter build apk --release
# 产物：build\app\outputs\flutter-apk\app-release.apk

# 2. 上传到 R2（覆盖同名对象，URL 不变）
cd ..\stock-heat-backend
npx --yes wrangler r2 object put stock-heat-downloads/stock_heat_app.apk `
  --file "../stock_heat_app/build/app/outputs/flutter-apk/app-release.apk" `
  --content-type "application/vnd.android.package-archive" --remote

# 3. 重新部署落地页
cd ..\stock-heat-landing
npm run deploy
```

直链：`https://pub-05ca488187064ae4a5e77fdeb2520341.r2.dev/stock_heat_app.apk`

> R2 边缘同步需 30s~几分钟，期间直链可能短暂 401/404，属正常现象。

---

## 截图素材更新

```bash
# 移动端截图（来自 play_store 目录）
Copy-Item ..\screenshot\play_store\*.png assets\screenshots\
# 桌面端截图（来自 screenshot 根目录，手动命名）
Copy-Item "..\screenshot\桌面端-排名.png"   assets\screenshots\desktop-01-ranking.png
Copy-Item "..\screenshot\桌面端-行情.png"   assets\screenshots\desktop-02-market.png
Copy-Item "..\screenshot\桌面端-走势.png"   assets\screenshots\desktop-03-trend.png
Copy-Item "..\screenshot\桌面端-自选股.png" assets\screenshots\desktop-04-watchlist.png
Copy-Item "..\screenshot\桌面端-播报.png"   assets\screenshots\desktop-05-news.png
Copy-Item "..\screenshot\桌面端-详情.png"   assets\screenshots\desktop-06-detail.png
# 重新部署
npm run deploy
```

文件名约定：

| 文件 | 用途 |
|------|------|
| `01-ranking.png` | 移动端排名预览（Hero 主图） |
| `02-ai-pick.png` | 移动端 AI 掘金预览 |
| `03-trend.png` | 移动端走势预览 |
| `04-watchlist.png` | 移动端自选预览 |
| `05-news.png` | 移动端资讯预览 |
| `06-market.png` | 移动端行情预览 |
| `07-detail.png` | 移动端个股详情预览 |
| `08-float.png` | 移动端悬浮盯盘球预览 |
| `desktop-01-ranking.png` | 桌面端排名预览 |
| `desktop-02-market.png` | 桌面端行情预览 |
| `desktop-03-trend.png` | 桌面端走势预览 |
| `desktop-04-watchlist.png` | 桌面端自选预览 |
| `desktop-05-news.png` | 桌面端资讯播报预览 |
| `desktop-06-detail.png` | 桌面端个股详情预览 |
| `desktop-07-float.png` | 桌面端悬浮盯盘球预览 |
| `feature-graphic.png` | OG / Twitter 分享图 |
| `icon.png` | favicon / 浏览器图标 |

---

## 下载地址配置

页面支持 **Windows 桌面端**（下载安装包）与 **Android 移动端**（Google Play / APK 直装）双平台，下载入口通过 `script.js` 顶部的常量统一管理，**改一处即可全局生效**。

**下载统计**：直装包（Windows MSIX / Android APK）的下载链接指向后端计数接口 `https://denjay.qzz.io/api/download?platform=windows|android`——用户点击时后端对当天该平台计数 +1，再 302 重定向到 R2 直链。统计接口 `GET /api/download/stats`（受 HMAC 鉴权保护）可查看各平台累计下载次数与按日明细。Google Play 走商店自带统计，不经过计数接口。

```js
// script.js
var DOWNLOAD_API_BASE = 'https://denjay.qzz.io/api/download';
// Windows 安装包（后端计数后 302 → R2 直链 stock_heat_app.msix）
var WINDOWS_DOWNLOAD_URL = DOWNLOAD_API_BASE + '?platform=windows';
// Android 直装 APK（后端计数后 302 → R2 直链 stock_heat_app.apk）
var ANDROID_APK_URL = DOWNLOAD_API_BASE + '?platform=android';
// Android 商店（Google Play 自带下载统计）
var ANDROID_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.stockheat.stock_heat_app';
```

### Windows 安装包的 R2 托管方式

安装包（`.msix`）存放在 Cloudflare R2 桶 **`stock-heat-downloads`**，通过 `r2.dev` 公共直链分发（出口流量免费，不计入带宽计费）。

**首次上传步骤**（R2 需在 Dashboard 先启用）：

```bash
# 1. 建桶（R2 启用后，仅需一次）
npx wrangler r2 bucket create stock-heat-downloads

# 2. 上传安装包（务必加 --remote，否则只写本地模拟）
npx wrangler r2 object put stock-heat-downloads/stock_heat_app.msix `
  --file "../stock_heat_app/build/windows/x64/runner/Release/stock_heat_app.msix" `
  --content-type "application/octet-stream" --remote

# 3. 开启公共访问（获取 r2.dev 直链）
npx wrangler r2 bucket dev-url enable stock-heat-downloads
# 输出形如：Public access enabled at 'https://pub-xxxxx.r2.dev'
# 直链 = 上面域名 + "/stock_heat_app.msix"
```

> ⚠️ 上传时必须加 `--remote`：默认 `wrangler r2 object put` 只写本地模拟，公网访问会 404。
> ⚠️ `r2.dev` 公共访问启用后，边缘节点同步通常需要 30 秒~几分钟，期间公网直链可能返回 401/404，属正常现象。
> 可选：将 R2 绑定到自定义子域（如 `download.denjay.qzz.io`，域名已在 Cloudflare 管理，无需额外备案）以获得更稳定的下载域名，命令见 `wrangler r2 bucket domain --help`。

- `WINDOWS_DOWNLOAD_URL` 会同时应用到 Hero 区 CTA 与下载区「下载 Windows 安装包」按钮。更换版本时，重新上传同名对象覆盖即可，URL 不变。
- `ANDROID_DOWNLOAD_URL`：Google Play 商品页，应用到 Hero 区与下载区「前往 Google Play」按钮。

`com.stockheat.stock_heat_app` 即 App 的 `applicationId`（见 `../stock_heat_app/android/app/build.gradle`）。如需更换应用包名，改 `ANDROID_DOWNLOAD_URL` 中的 `id=` 参数即可。

> Windows 安装包若未代码签名，FAQ 已内置「未知发布者」的安抚文案。

---

## SEO & 性能

- ✅ 完整 Open Graph / Twitter Card 元数据
- ✅ 中文 / 英文双语 meta description
- ✅ 截图 lazy loading（`loading="lazy"`）
- ✅ 截图 7 天 immutable 缓存（`_headers`）
- ✅ 安全头：CSP / HSTS / X-Frame-Options / Referrer-Policy
- ✅ `prefers-reduced-motion` 友好
- ✅ 移动端响应式（980 / 720 两个断点）
- ✅ Lighthouse 预期 95+（无第三方请求、无图片 CDN 依赖）

---

## 与主项目的关联

| 项目 | 仓库路径 | 部署目标 |
|------|---------|---------|
| 后端 API | `../stock-heat-backend/` | Cloudflare Workers（`stock-heat-api`） |
| 隐私政策 | `../privacy-policy/` → 已托管于 `https://denjay.qzz.io/privacy` | Workers 路由 |
| **推广页（本项目）** | `./` | Cloudflare Pages（`stock-heat-landing`） |
| App 前端 | `../stock_heat_app/` | Windows 安装包 + Android APK |

---

## 许可

仅作产品推广与品牌展示用途。截图归原作者所有。