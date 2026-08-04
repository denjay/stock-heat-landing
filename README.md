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
│       ├── 01-ranking.png
│       ├── 02-ai-pick.png
│       ├── 03-trend.png
│       ├── 04-watchlist.png
│       ├── 05-news.png
│       ├── 06-market.png
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
npm run deploy           # 等价于 wrangler pages deploy . --project-name stock-heat-landing
```

首次运行会要求登录 Cloudflare 并在 Dashboard 创建项目（或用 `wrangler pages project create stock-heat-landing` 提前创建）。

### 方式 C：拖拽部署

把 `stock-heat-landing/` 整个目录拖到 <https://dash.cloudflare.com/?to=/:account/pages> 的 "Direct Upload" 区域即可。

---

## 部署后

- **默认域名**: `https://stock-heat-landing.pages.dev`
- **自定义域名**（可选）：
  - Dashboard → Pages → 项目 → Custom domains → 添加 `landing.stock-heat.com`（或你拥有的域名）
  - Cloudflare 自动签发证书

---

## 截图素材更新

```bash
# 把最新截图拷进来即可（覆盖同名文件）
Copy-Item ..\screenshot\play_store\*.png assets\screenshots\
# 重新部署
npm run deploy
```

文件名约定：

| 文件 | 用途 |
|------|------|
| `01-ranking.png` | 排名预览（Hero 主图） |
| `02-ai-pick.png` | AI 掘金预览 |
| `03-trend.png` | 走势预览 |
| `04-watchlist.png` | 自选预览 |
| `05-news.png` | 资讯预览 |
| `06-market.png` | 行情预览 |
| `feature-graphic.png` | OG / Twitter 分享图 |
| `icon.png` | favicon / 浏览器图标 |

---

## Google Play 商品页跳转

本页**只提供跳转 Google Play 商品页的按钮**（不直接提供 APK 下载）。所有「前往 Google Play」按钮（导航栏 CTA、Hero 按钮、下载区）统一指向：

```
https://play.google.com/store/apps/details?id=com.stockheat.stock_heat_app
```

`com.stockheat.stock_heat_app` 即 App 的 `applicationId`（见 `../stock_heat_app/android/app/build.gradle`）。如需更换应用包名，全局替换 `index.html` 中该 URL 的 `id=` 参数即可（共 3 处）。

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
| App 前端 | `../stock_heat_app/` | Android APK（仅 Android 平台） |

---

## 许可

仅作产品推广与品牌展示用途。截图归原作者所有。