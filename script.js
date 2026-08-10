// 热股推广页 — 轻量交互动效
(function () {
  'use strict';

  // ╔══════════════════════════════════════════════════════════════╗
  // ║  下载地址配置：把这里改成你的真实地址即可，无需改动其它代码   ║
  // ╚══════════════════════════════════════════════════════════════╝
  // Windows 安装包托管于 Cloudflare R2（公共 r2.dev 直链，出口流量免费）
  var WINDOWS_DOWNLOAD_URL = 'https://pub-05ca488187064ae4a5e77fdeb2520341.r2.dev/stock_heat_app.msix';
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
  console.log('%c热股 Stock Heat', 'color:#e53935;font-weight:bold;font-size:16px');
})();