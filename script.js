// 盘股掘金推广页 — 轻量交互动效
(function () {
  'use strict';

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  下载地址配置：把这里改成你的真实地址即可，无需改动其它代码   ║
  // ╚══════════════════════════════════════════════════════════════╝
  // 后端下载入口（先计数后 302 重定向到 R2 直链）。落地页所有「直装包」
  // 下载按钮都指向此接口，从而在用户点击时精确记录一次下载次数。
  // 统计接口：GET https://denjay.qzz.io/api/download/stats（受鉴权保护）
  var DOWNLOAD_API_BASE = 'https://denjay.qzz.io/api/download';
  // Windows 安装包（后端计数后 302 → R2 直链 stock_heat_app.msix）
  var WINDOWS_DOWNLOAD_URL = DOWNLOAD_API_BASE + '?platform=windows';
  // Android 直装 APK（后端计数后 302 → R2 直链 stock_heat_app.apk）
  var ANDROID_APK_URL = DOWNLOAD_API_BASE + '?platform=android';
  // Android 商店（Google Play 自带下载统计，无需走计数接口）
  var ANDROID_DOWNLOAD_URL = 'https://play.google.com/store/apps/details?id=com.stockheat.stock_heat_app';

  // 应用下载地址
  (function applyDownloadUrls() {
    var win = document.getElementById('windows-download');
    if (win && WINDOWS_DOWNLOAD_URL) win.href = WINDOWS_DOWNLOAD_URL;
    document.querySelectorAll('a.js-cta[data-platform="windows"]').forEach(function (a) {
      if (WINDOWS_DOWNLOAD_URL) a.href = WINDOWS_DOWNLOAD_URL;
    });
    document.querySelectorAll('a.js-cta[data-platform="mobile"]').forEach(function (a) {
      if (ANDROID_DOWNLOAD_URL) a.href = ANDROID_DOWNLOAD_URL;
    });
    var apk = document.getElementById('android-apk-download');
    if (apk && ANDROID_APK_URL) apk.href = ANDROID_APK_URL;
    var apkHero = document.getElementById('android-apk-download-hero');
    if (apkHero && ANDROID_APK_URL) apkHero.href = ANDROID_APK_URL;
  })();

  // 平台切换：根据 Tab 上的 data-* 属性驱动对应元素的显隐
  // attr 为标记属性名（如 'data-platform' / 'data-gallery'），targets 为需联动显隐的元素选择器列表
  function initPlatformTabs(attr, targets) {
    var tabs = document.querySelectorAll('.platform-tab[' + attr + ']');
    function setActive(p) {
      tabs.forEach(function (t) {
        var active = t.getAttribute(attr) === p;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      targets.forEach(function (sel) {
        document.querySelectorAll(sel + '[' + attr + ']').forEach(function (el) {
          el.hidden = el.getAttribute(attr) !== p;
        });
      });
    }
    tabs.forEach(function (t) {
      t.addEventListener('click', function () { setActive(t.getAttribute(attr)); });
    });
  }

  initPlatformTabs('data-platform', ['.js-cta', '.js-visual', '.js-hero-note']);
  initPlatformTabs('data-gallery', ['.js-gallery']);

  // 滚动时导航栏加深背景
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        nav.style.background = 'rgba(7, 4, 4, 0.92)';
        nav.style.boxShadow = '0 1px 0 rgba(255,255,255,0.06)';
      } else {
        nav.style.background = '';
        nav.style.boxShadow = '';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // FAQ 手风琴：默认每次只展开一个（更紧凑）
  const faqItems = document.querySelectorAll('.faq details');
  faqItems.forEach((d) => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        faqItems.forEach((other) => {
          if (other !== d && other.open) other.open = false;
        });
      }
    });
  });

  // 平滑滚动锚点（兼容老浏览器）
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length <= 1) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // 入场动画：卡片轻微淡入
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.style.opacity = '1';
            en.target.style.transform = 'translateY(0)';
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.card, .shot, .steps li').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease, transform .55s ease';
      io.observe(el);
    });
  }

  // 简易访问统计占位（如果未来要接入 GA / Plausible 直接在这里加）
  console.log('%c盘股掘金 Stock Heat', 'color:#e53935;font-weight:bold;font-size:16px');
})();