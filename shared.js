/**
 * Charles Blog - 共享脚本
 * 界面文案注册 / 双语取值工具 / 导航 chips 渲染 / 滚动浮现 / 通用工具
 */
(function () {
  'use strict';

  var I = window.ZineI18n;

  /* ============ 界面文案（繁体中文 / English） ============ */
  I.addAll({
    // 通用导航与页脚
    'footer.tagline': ['DON\'T LEAVE ANY REGRETS.', '不要留下遺憾。'],
    'footer.linksLabel': ['Subject links', '科目連結'],
    'footer.credit': ['© 2026 Charles Blog · Student Designer', '© 2026 Charles Blog · 學生設計師'],
    'footer.edition': ['RETRO ZINE EDITION · EST. 2026', '復古獨立雜誌版 · 創立於 2026'],
    'footer.home': ['← HOME', '← 首頁'],
    'lang.switch': ['繁中', 'EN'],

    // 主页
    'home.metaDesc': ['Charles Blog — student designer zine.', 'Charles Blog — 學生設計師的獨立雜誌。'],
    'home.subtitle': ['Here is my story.', '這是關於我的故事。'],

    // About Me 区块
    'about.ariaLabel': ['About Charles', '關於 Charles'],
    'about.kicker': ['ABOUT ME', '關於我'],
    'about.photoAlt': ['Portrait of Charles', 'Charles 的個人照'],
    'about.photoCaption': ['CHARLES — 2026', 'Charles — 2026'],
    'about.role': ['Creative Technologist · Media & Comm Student', '創意科技工作者 · 傳播與媒體系學生'],
    'about.portfolioBtn': ['VIEW PORTFOLIO', '查看作品集'],
    // About 正文 — 直接引自 CV 原文（英文為 CV 原始文字，中文為對應翻譯）
    'about.p1': [
      'I am a Creative Technologist and Year 3 Communication and Media student. My expertise covers both digital media software and hardware.',
      '我是一名創意科技工作者，也是傳播與媒體系三年級學生。我的專業涵蓋數位媒體的軟體與硬體兩端。',
    ],
    'about.p2': [
      'My core strength is using AI to turn ideas into real products. Using AI tools speeds up the workflow across planning, coding, and visual design. I can independently build web apps, 2D game prototypes, and interactive hardware.',
      '我的核心優勢是用 AI 把想法變成真實產品。借助 AI 工具，我能加速從規劃、寫程式到視覺設計的整條流程。我可以獨立完成網頁應用、2D 遊戲原型與互動硬體。',
    ],

    // 聯絡資訊 / 頁尾
    'contact.heading': ['GET IN TOUCH', '聯絡方式'],
    'contact.phone': ['PHONE', '電話'],
    'contact.email': ['EMAIL', '電郵'],
    'contact.ariaLabel': ['Contact information', '聯絡資訊'],
    'footer.menuHeading': ['MENU', '選單'],
    'footer.sitemap': ['← BACK TO TOP ↑', '← 回到頂部 ↑'],
    'footer.end': ['END OF PAGE', '頁面結束'],

    // 科目分区页
    'subject.heroLabel': ['%s subject introduction', '%s 科目介紹'],
    'subject.kicker': ['SUBJECT / %s · %s', '科目 / %s · %s'],
    'subject.assignmentsLabel': ['Assignment index', '作業索引'],
    'subject.sectionTitle': ['ASSIGNMENTS', '作業索引'],
    'subject.sectionNote': ['click a piece to read →', '點一篇來讀 →'],
    'subject.pieces': ['%s PIECES', '%s 篇'],
    'subject.piecesAria': ['%s assignments', '%s 篇作業'],
    'subject.noAssignments': ['No assignments yet — check back soon.', '還沒有作業——請稍後再來。'],
    'subject.term': ['2026 Aut', '2026 秋'],
    'subject.updating': ['CONTINUOUSLY UPDATING — MORE WORK COMING SOON', '持續更新中 — 更多作品即將上線'],
    'nav.subjectsToggle': ['Browse subjects', '瀏覽科目'],
    'nav.homeShort': ['Home', '首頁'],

    // 作业卡片
    'card.assignment': ['ASSIGNMENT %s', '作業 %s'],
    'card.readPost': ['READ THE POST', '閱讀全文'],
    'card.imageAlt': ['%s — illustration', '%s — 配圖'],

    // 文章页
    'article.postNotFound': ['Post not found', '找不到這篇文章'],
    'article.postNotFoundDesc': ['This post does not exist or has been moved.', '這篇文章不存在或已被移動。'],
    'article.backHome': ['← BACK HOME', '← 返回首頁'],
    'article.metaDesc': ['Charles Blog — assignment post.', 'Charles Blog — 作業文章。'],
    'article.backToSubject': ['Back to %s', '返回 %s'],
    'article.assignmentNo': ['ASSIGNMENT %s', '作業 %s'],
    'article.byline': ['Charles', 'Charles'],
    'article.viewsLabel': ['%s views', '%s 次瀏覽'],
    'article.heroLabel': ['Article cover image', '文章主圖'],

    // 正文区块
    'figure.defaultAlt': ['Illustration', '配圖'],
    'video.placeholderTitle': ['VIDEO PLACEHOLDER', '影片佔位'],
    'video.placeholderHint': [
      'Drop a file into assets/videos/ then set its path in content.js',
      '把影片放進 assets/videos/，然後在 content.js 填入路徑',
    ],

    // 文章页元信息栏（用纯文字标签取代 emoji，贴合复古印刷风）
    'meta.date': ['DATE', '日期'],
    'meta.by': ['BY', '作者'],

    // 幻灯片画廊（简报逐页高清图 + 全屏浏览）
    'gallery.badge': ['DECK', '簡報'],
    'gallery.download': ['OPEN FULL PDF', '開啟完整 PDF'],
    'gallery.prev': ['Previous slide', '上一頁'],
    'gallery.next': ['Next slide', '下一頁'],
    'gallery.close': ['Close full screen', '關閉全螢幕'],
    'gallery.expand': ['click to view full screen', '點擊全螢幕閱讀'],
  });

  /* ============ 双语取值工具 ============ */

  /**
   * 从双语对象里取当前语言的字符串。
   * 兼容纯字符串（id / no / date / 图片路径等技术字段）。
   * @param {string|{en:string,zh:string}} value
   * @returns {string}
   */
  function tr(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    return value[I.get()] || value.en || value.zh || '';
  }

  /** 取双语数组 → 当前语言的字符串数组 */
  function trList(list) {
    if (!Array.isArray(list)) return [];
    return list.map(tr);
  }

  /**
   * 取界面文案并做 %s 替换
   * @param {string} key
   * @param {...string} args
   */
  function t(key) {
    var args = Array.prototype.slice.call(arguments, 1);
    var i = 0;
    var s = I.t(key);
    return s.replace(/%s/g, function () {
      var v = args[i];
      i++;
      return v === undefined ? '' : String(v);
    });
  }

  /* ============ 日期与数字 ============ */

  /** 格式化日期：2026-09-04 → SEP 04, 2026 / 2026 年 09 月 04 日 */
  function formatDate(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return iso;
    if (I.get() === 'zh') {
      return d.getFullYear() + ' 年 ' + String(d.getMonth() + 1).padStart(2, '0')
        + ' 月 ' + String(d.getDate()).padStart(2, '0') + ' 日';
    }
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, '0') + ', ' + d.getFullYear();
  }

  /** 页面路径深度：根目录或 subjects/ 或 articles/ */
  function rootPrefix() {
    var parts = location.pathname.split('/');
    return parts.length > 2 && (parts[parts.length - 2] === 'subjects' || parts[parts.length - 2] === 'articles') ? '../' : '';
  }

  /* ============ 页面渲染 ============ */

  /** 语言切换按钮（所有页面共用同一段结构） */
  function langSwitchHtml() {
    return '<button class="lang-switch-btn" data-lang-switch type="button" '
      + 'data-i18n-attr="aria-label:lang.switch" aria-label="Switch language">'
      + '<span class="lang-text" data-i18n="lang.switch">EN</span></button>';
  }

  /** 渲染导航 chips（当前科目高亮）
   *  窄屏（<=600px）：只显示「当前科目」一格 + 展开按钮，
   *  点击后弹出小导航列（含全部科目 + 首页），避免导航被裁切。
   *  宽屏：维持 4 个科目 chips 横排，交互不变。
   */
  function renderNavbarChips(currentCode) {
    var wrap = document.querySelector('.subject-chips');
    if (!wrap) return;
    var root = rootPrefix();
    var order = ['bcm212', 'bcm241', 'bcm206', 'bcm222'];

    var currentKey = order.filter(function (k) {
      return window.SUBJECTS[k] && window.SUBJECTS[k].code === currentCode;
    })[0];

    // 当前科目（用于窄屏折叠态显示）；无当前科目时退回第一个
    var headKey = currentKey || order[0];
    var head = window.SUBJECTS[headKey];

    var listHtml = order.map(function (key) {
      var s = window.SUBJECTS[key];
      var active = s.code === currentCode ? ' active' : '';
      return '<a class="subject-chip' + active + '" href="' + root + 'subjects/' + key + '.html" '
        + 'aria-label="' + s.code + ' ' + tr(s.name) + '">' + s.code + '</a>';
    }).join('');

    wrap.innerHTML =
      // 窄屏折叠态：当前科目 + 展开按钮
      '<button class="subject-chips-toggle" type="button" aria-expanded="false" '
      + 'data-i18n-attr="aria-label:nav.subjectsToggle" aria-label="Browse subjects">'
      + '<span class="toggle-code">' + head.code + '</span>'
      + '<span class="toggle-caret" aria-hidden="true"></span>'
      + '</button>'
      // 下拉小导航：全部科目 + 首页
      + '<div class="subject-chips-menu" hidden>'
      + '<a class="subject-chip" href="' + root + 'index.html">'
      + t('nav.homeShort') + '</a>'
      + listHtml
      + '</div>'
      // 宽屏态：同一批评分 chips 横排
      + '<div class="subject-chips-row">' + listHtml + '</div>';

    bindChipsToggle(wrap);
  }

  /** 窄屏下拉小导航的展开/收起 */
  function bindChipsToggle(wrap) {
    var toggle = wrap.querySelector('.subject-chips-toggle');
    var menu = wrap.querySelector('.subject-chips-menu');
    if (!toggle || !menu) return;

    // 切换按钮每次重绘都是新节点，直接绑定即可（旧节点随 innerHTML 一起回收）
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      wrap.classList.toggle('is-open', open);
    });
  }

  /** 点击空白处 / 按 Esc 收起下拉 —— 文档级监听只注册一次，
      避免语言切换反复调用 bindChipsToggle 时不断累积监听器 */
  function bindChipsDismissOnce() {
    document.addEventListener('click', function (e) {
      var wrap = document.querySelector('.subject-chips');
      if (!wrap || wrap.contains(e.target)) return;
      var menu = wrap.querySelector('.subject-chips-menu');
      var toggle = wrap.querySelector('.subject-chips-toggle');
      if (!menu || menu.hidden) return;
      menu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var wrap = document.querySelector('.subject-chips');
      if (!wrap) return;
      var menu = wrap.querySelector('.subject-chips-menu');
      var toggle = wrap.querySelector('.subject-chips-toggle');
      if (!menu || menu.hidden) return;
      menu.hidden = true;
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      wrap.classList.remove('is-open');
    });
  }

  /** 渲染页脚科目链接（含首页 + 回到顶部） */
  function renderFooterLinks() {
    var wrap = document.querySelector('.footer-links');
    if (!wrap) return;
    var root = rootPrefix();
    var order = ['bcm212', 'bcm241', 'bcm206', 'bcm222'];
    wrap.innerHTML = '<a href="' + root + 'index.html">' + t('footer.home') + '</a>'
      + order.map(function (key) {
        var s = window.SUBJECTS[key];
        return '<a href="' + root + 'subjects/' + key + '.html">' + s.code + ' ' + tr(s.name) + '</a>';
      }).join('')
      + '<a class="to-top" href="#top">' + t('footer.sitemap') + '</a>';
  }

  /** 滚动浮现观察器（复用单个实例，避免语言切换时反复新建导致 observer 泄漏） */
  var revealIO = null;

  function initReveal() {
    var els = document.querySelectorAll('.reveal:not(.visible)');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    // 首次创建；后续复用（旧目标已在触发时 unobserve）
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    els.forEach(function (el) { revealIO.observe(el); });
  }

  /** 按键物理下压效果（通用委托） */
  function initPressEffect() {
    ['mousedown', 'mouseup', 'mouseleave'].forEach(function (type) {
      document.addEventListener(type, function (e) {
        var btn = e.target.closest('.zine-btn, .subject-chip');
        if (!btn) return;
        btn.classList.toggle('pressed', type === 'mousedown');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNavbarChips(window.CURRENT_SUBJECT || null);
    renderFooterLinks();
    initReveal();
    initPressEffect();
    bindChipsDismissOnce();
  });

  /* 语言切换后：重建导航/页脚（它们含双语内容），再广播给页面渲染器 */
  document.addEventListener('zine:langchange', function () {
    renderNavbarChips(window.CURRENT_SUBJECT || null);
    renderFooterLinks();
  });

  // 导出工具
  window.ZineUtil = {
    tr: tr,
    trList: trList,
    t: t,
    formatDate: formatDate,
    rootPrefix: rootPrefix,
    langSwitchHtml: langSwitchHtml,
  };

  // 供动态生成内容后重新触发浮现动画
  window.ZineReinitReveal = initReveal;
})();
