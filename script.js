// 热股推广页 — 轻量交互动效
(function () {
  'use strict';

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