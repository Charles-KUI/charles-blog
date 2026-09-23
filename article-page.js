/**
 * Charles Blog - 文章页渲染器
 * ====================================
 * 通过 ?id=<assignmentId> 定位文章，从 content.js 注册表渲染。
 * 所有文案经 ZineUtil.tr() 取当前语言；切换语言时整体重绘。
 *
 * 本站是纯静态站点：没有点赞、浏览量、留言等需要存储的功能，
 * 文章页只负责「读」——标题、元信息、正文区块与影片。
 */
(function () {
  'use strict';

  // 脚本加载即解析文章 id，提前确定当前科目（导航 chips 高亮需要在 DOMContentLoaded 前就绪）
  const initialId = new URLSearchParams(location.search).get('id') || '';
  if (initialId) {
    window.CURRENT_SUBJECT = initialId.split('-')[0].toUpperCase();
  }

  function findArticle(id) {
    const subjects = window.SUBJECTS;
    for (const key in subjects) {
      const subject = subjects[key];
      const found = subject.assignments.find(function (a) { return a.id === id; });
      if (found) return { subject: subject, assignment: found };
    }
    return null;
  }

  /** 渲染正文区块 */
  function renderBody(blocks, root, util) {
    return blocks.map(function (block) {
      switch (block.type) {
        case 'h2':
          return '<h2>' + util.tr(block.text) + '</h2>';
        case 'quote':
          return '<blockquote>' + util.tr(block.text) + '</blockquote>';
        case 'gallery':
          return renderGallery(block, root, util);
        case 'figure':
          return '<figure class="inline-figure">'
            + '<img src="' + root + block.src + '" alt="' + util.tr(block.caption) + '" loading="lazy">'
            + '<figcaption>' + util.tr(block.caption) + '</figcaption></figure>';
        case 'video':
          return renderVideo(block, root, util);
        case 'p':
        default:
          return '<p>' + util.tr(block.text) + '</p>';
      }
    }).join('');
  }

  /**
   * 幻灯片画廊（type: 'gallery'）
   * ---------------------------------------------------------------
   * 把一份简报的每一页渲染成高清图，按顺序由左到右排成一条可横向滚动的
   * 胶片带：大图、可左右箭头翻页、点任意一页进入全屏浏览。
   *
   * 为何不用 <object type="application/pdf"> 内嵌：
   *   - 各浏览器自带 PDF 阅读器样式突兀，观感与站点风格割裂；
   *   - 手机端多半无法内嵌，只剩一片空白或下载提示；
   *   - 这些是交付给阅卷老师的作业，需要「看得清、能放大、能全屏」，
   *     直接给高清图 + 全屏浏览，比嵌插件可控得多。
   *
   * 图档路径与语言无关 → 本区块不进语言切换的文本刷新队列（整体保持不动），
   * 避免翻页位置被重置。页面标题 / 页码 / 缩略图标签等随语言变化的文字，
   * 由 refreshGalleryText() 单独处理。
   */
  function renderGallery(block, root, util) {
    var title = util.tr(block.title);
    var hint = util.tr(block.hint);
    var total = block.items.length;

    var slides = block.items.map(function (item, i) {
      var src = root + item.src;
      var label = util.tr(item.label) || (i + 1);
      return '<figure class="deck-slide" data-index="' + i + '" tabindex="0" role="button"'
        + ' aria-label="' + label + ' — ' + util.t('gallery.expand') + '">'
        + '  <div class="deck-slide-img">'
        + '    <img src="' + src + '" alt="' + label + '" loading="lazy" draggable="false">'
        + '    <span class="deck-zoom" aria-hidden="true">⤢</span>'
        + '  </div>'
        + '  <figcaption class="deck-slide-cap">'
        + '    <span class="deck-slide-no">' + ('0' + (i + 1)).slice(-2) + '</span>'
        + '    <span class="deck-slide-label">' + label + '</span>'
        + '  </figcaption>'
        + '</figure>';
    }).join('');

    return '<section class="deck-block" data-deck>'
      + '  <header class="deck-head">'
      + '    <span class="deck-badge" aria-hidden="true">' + util.t('gallery.badge') + '</span>'
      + '    <h3 class="deck-title">' + title + '</h3>'
      + '    <span class="deck-count" data-deck-count>1 / ' + total + '</span>'
      + '    <a class="deck-file" href="' + root + block.file + '" download>'
      + util.t('gallery.download') + ' <span aria-hidden="true">↓</span></a>'
      + '  </header>'
      + '  <p class="deck-hint">' + hint + '</p>'
      + '  <div class="deck-stage">'
      + '    <div class="deck-viewport" data-deck-viewport tabindex="0"'
      + '         role="group" aria-roledescription="carousel" aria-label="' + title + '">'
      + '      <div class="deck-track" data-deck-track>' + slides + '</div>'
      + '    </div>'
      + '    <button type="button" class="deck-arrow deck-prev" data-deck-prev aria-label="'
      + util.t('gallery.prev') + '">'
      + '      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20"'
      + ' fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"'
      + ' stroke-linejoin="round"/></svg>'
      + '    </button>'
      + '    <button type="button" class="deck-arrow deck-next" data-deck-next aria-label="'
      + util.t('gallery.next') + '">'
      + '      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 L17 12 L9 20"'
      + ' fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"'
      + ' stroke-linejoin="round"/></svg>'
      + '    </button>'
      + '  </div>'
      + '  <div class="deck-dots" role="tablist" aria-label="' + title + '">'
      + block.items.map(function (item, i) {
        const label = util.tr(item.label) || (i + 1);
        return '<button type="button" class="deck-dot" data-deck-dot="' + i + '"'
          + ' role="tab" aria-label="' + label + '"></button>';
      }).join('')
      + '  </div>'
      + '</section>';
  }

  /** 视频块：有 src 用 <video>，无 src 显示测试卡占位 */
  function renderVideo(block, root, util) {
    const inner = block.src
      ? '<video controls preload="metadata" src="' + root + block.src + '"></video>'
      : '<div class="video-placeholder" role="note">'
        + '  <div class="test-bars" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>'
        + '  <div class="ph-text"><strong>' + util.t('video.placeholderTitle') + '</strong><br>'
        + util.t('video.placeholderHint') + '</div>'
        + '</div>';
    return '<figure class="video-block">'
      + '  <div class="video-frame">' + inner + '</div>'
      + '  <figcaption class="video-caption">' + util.tr(block.caption) + '</figcaption>'
      + '</figure>';
  }

  /** 只重绘会随语言变化的部分 */
  function paintArticleText() {
    const util = window.ZineUtil;
    const found = findArticle(new URLSearchParams(location.search).get('id'));
    if (!found) return;

    const subject = found.subject;
    const a = found.assignment;

    document.title = util.tr(a.title) + ' — ' + subject.code + ' | Charles Blog';
    document.getElementById('subjectLink').textContent =
      util.t('article.backToSubject', subject.code + ' · ' + util.tr(subject.name));
    document.getElementById('articleNo').textContent = util.t('article.assignmentNo', a.no);
    document.getElementById('articleTitle').textContent = util.tr(a.title);
    document.getElementById('postTags').innerHTML = util.trList(a.tags)
      .map(function (t) { return '<span class="tag">' + t + '</span>'; }).join(' ');
    document.getElementById('heroCap').textContent = util.tr(a.figLabel);
    document.getElementById('heroImg').alt = util.t('card.imageAlt', util.tr(a.title));
  }

  function render() {
    const util = window.ZineUtil;
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const found = findArticle(id);

    if (!found) {
      document.getElementById('articleRoot').innerHTML =
        '<div class="zine-container" style="text-align:center; padding:120px 24px;">'
        + '<h1 class="article-title" style="margin:0 auto;">404 — ' + util.t('article.postNotFound') + '</h1>'
        + '<p style="margin-top:20px;">' + util.t('article.postNotFoundDesc') + '</p>'
        + '<a class="zine-btn primary" href="' + util.rootPrefix() + 'index.html" style="margin-top:26px;">'
        + util.t('article.backHome') + '</a>'
        + '</div>';
      document.title = util.t('article.postNotFound') + ' — Charles Blog';
      return;
    }

    const subject = found.subject;
    const a = found.assignment;
    const root = util.rootPrefix();

    window.CURRENT_SUBJECT = subject.code; // 导航 chips 高亮

    document.getElementById('subjectLink').href = root + 'subjects/' + id.split('-')[0] + '.html';
    document.getElementById('postDate').textContent = util.formatDate(a.date);
    document.getElementById('postAuthor').textContent = util.t('article.byline');

    document.getElementById('heroImg').src = root + a.image;

    // 正文区块 + 文章级视频块（最多一个）
    let bodyHtml = renderBody(a.body, root, util);
    if (a.video) bodyHtml += renderVideo(a.video, root, util);
    document.getElementById('articleBody').innerHTML = bodyHtml;

    paintArticleText();
  }

  document.addEventListener('DOMContentLoaded', render);

  /* ================================================================
     幻灯片画廊：横向翻页 + 全屏浏览
     ----------------------------------------------------------------
     · 翻页用 scrollTo（平滑滚动），不重建 DOM —— 图片不重载、滚动位置自然；
     · 全屏用 <dialog>：原生有焦点陷阱 / Esc 关闭 / 顶部层级，比自制定层更稳；
     · 箭头的可用状态（到首/末页变灰）在滚动时实时同步。
     ================================================================ */

  /** 当前画廊的翻页步长（滑动条宽度 + 间距） */
  function deckStep(viewport) {
    const track = viewport.querySelector('[data-deck-track]');
    const first = track && track.querySelector('.deck-slide');
    if (!first) return viewport.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  }

  /** 滚动到第 index 页（0 起） */
  function deckGoTo(viewport, index) {
    const slides = viewport.querySelectorAll('.deck-slide');
    const i = Math.max(0, Math.min(slides.length - 1, index));
    viewport.scrollTo({ left: i * deckStep(viewport), behavior: 'smooth' });
    return i;
  }

  /** 由当前滚动位置反推页码（0 起） */
  function deckCurrent(viewport) {
    const step = deckStep(viewport);
    if (!step) return 0;
    const max = viewport.querySelectorAll('.deck-slide').length - 1;
    return Math.max(0, Math.min(max, Math.round(viewport.scrollLeft / step)));
  }

  /** 同步「页码 / 箭头禁用态 / 缩略指示条」 */
  function deckSync(block) {
    const viewport = block.querySelector('[data-deck-viewport]');
    const slides = viewport.querySelectorAll('.deck-slide');
    const cur = deckCurrent(viewport);
    const last = slides.length - 1;

    const pos = block.querySelector('[data-deck-pos]');
    if (pos) pos.textContent = String(cur + 1);
    const count = block.querySelector('[data-deck-count]');
    if (count) count.textContent = (cur + 1) + ' / ' + slides.length;

    const prev = block.querySelector('[data-deck-prev]');
    const next = block.querySelector('[data-deck-next]');
    if (prev) prev.disabled = cur <= 0;
    if (next) next.disabled = cur >= last;

    block.querySelectorAll('[data-deck-dot]').forEach(function (dot) {
      const on = Number(dot.dataset.deckDot) === cur;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    viewport.setAttribute('aria-label',
      slides.length + ' slides, showing ' + (cur + 1));
  }

  /**
   * 初始化所有画廊（在 render 之后调用）。
   * 用 data-deck-bound 打标记，避免语言切换重绘时重复绑定。
   */
  function initGalleries() {
    const body = document.getElementById('articleBody');
    if (!body) return;

    body.querySelectorAll('[data-deck]').forEach(function (block) {
      if (block.dataset.deckBound === '1') return;
      block.dataset.deckBound = '1';

      const viewport = block.querySelector('[data-deck-viewport]');
      const slides = viewport.querySelectorAll('.deck-slide');

      block.querySelector('[data-deck-prev]').addEventListener('click', function () {
        deckGoTo(viewport, deckCurrent(viewport) - 1);
      });
      block.querySelector('[data-deck-next]').addEventListener('click', function () {
        deckGoTo(viewport, deckCurrent(viewport) + 1);
      });

      // 缩略指示条：点击直接跳到对应页
      block.querySelectorAll('[data-deck-dot]').forEach(function (dot) {
        dot.addEventListener('click', function () {
          deckGoTo(viewport, Number(dot.dataset.deckDot));
        });
      });

      // 滚动时实时同步页码与箭头状态（用 rAF 节流，滚动不抖动）
      let ticking = false;
      viewport.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { deckSync(block); ticking = false; });
      }, { passive: true });

      // 键盘：左右箭头翻页
      viewport.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); deckGoTo(viewport, deckCurrent(viewport) + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); deckGoTo(viewport, deckCurrent(viewport) - 1); }
      });

      // 点任意一页 → 全屏浏览
      slides.forEach(function (slide, i) {
        slide.addEventListener('click', function () { openLightbox(block, i); });
        slide.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(block, i); }
        });
      });

      deckSync(block);
    });
  }

  /* ---------- 全屏浏览（<dialog>） ---------- */
  const LB = {
    el: null,      // <dialog>
    img: null,     // 内部 <img>
    caption: null, // 说明文字
    counter: null, // 页码
    items: [],     // 当前画廊 [{src, label}]
    index: 0,
  };

  function ensureLightbox() {
    if (LB.el) return LB.el;
    const util = window.ZineUtil;
    const dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML =
      '<div class="lb-stage">'
      + '  <button type="button" class="lb-close" data-lb-close aria-label="'
      + util.t('gallery.close') + '">✕</button>'
      + '  <button type="button" class="lb-arrow lb-prev" data-lb-prev aria-label="'
      + util.t('gallery.prev') + '">'
      + '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 L7 12 L15 20"'
      + ' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"'
      + ' stroke-linejoin="round"/></svg></button>'
      + '  <img class="lb-img" alt="">'
      + '  <button type="button" class="lb-arrow lb-next" data-lb-next aria-label="'
      + util.t('gallery.next') + '">'
      + '    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 L17 12 L9 20"'
      + ' fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"'
      + ' stroke-linejoin="round"/></svg></button>'
      + '  <div class="lb-bar">'
      + '    <span class="lb-caption" data-lb-caption></span>'
      + '    <span class="lb-counter" data-lb-counter></span>'
      + '  </div>'
      + '</div>';
    document.body.appendChild(dlg);

    LB.el = dlg;
    LB.img = dlg.querySelector('.lb-img');
    LB.caption = dlg.querySelector('[data-lb-caption]');
    LB.counter = dlg.querySelector('[data-lb-counter]');

    // 点背景关闭（点在 <dialog> 本体而非 .lb-stage 上才算背景）
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) closeLightbox();
    });
    dlg.querySelector('[data-lb-close]').addEventListener('click', closeLightbox);
    dlg.querySelector('[data-lb-prev]').addEventListener('click', function (e) {
      e.stopPropagation(); lbGo(-1);
    });
    dlg.querySelector('[data-lb-next]').addEventListener('click', function (e) {
      e.stopPropagation(); lbGo(1);
    });
    // 键盘：左右翻页（Esc 由 dialog 原生处理 → 触发 close）
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); lbGo(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); lbGo(-1); }
    });
    return dlg;
  }

  function openLightbox(block, index) {
    const util = window.ZineUtil;
    const dlg = ensureLightbox();

    LB.items = Array.prototype.map.call(
      block.querySelectorAll('.deck-slide'),
      function (slide) {
        const img = slide.querySelector('img');
        return { src: img.getAttribute('src'), label: img.getAttribute('alt') || '' };
      });
    LB.index = index;

    // 关闭按钮等文字随语言更新
    dlg.querySelector('[data-lb-close]').setAttribute('aria-label', util.t('gallery.close'));
    dlg.querySelector('[data-lb-prev]').setAttribute('aria-label', util.t('gallery.prev'));
    dlg.querySelector('[data-lb-next]').setAttribute('aria-label', util.t('gallery.next'));

    lbPaint();
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.body.classList.add('lb-open');
  }

  function closeLightbox() {
    if (!LB.el) return;
    if (typeof LB.el.close === 'function' && LB.el.open) LB.el.close();
    else LB.el.removeAttribute('open');
    document.body.classList.remove('lb-open');
  }

  function lbGo(delta) {
    if (!LB.items.length) return;
    LB.index = (LB.index + delta + LB.items.length) % LB.items.length;
    lbPaint();
  }

  function lbPaint() {
    const item = LB.items[LB.index];
    if (!item) return;
    LB.img.src = item.src;
    LB.img.alt = item.label;
    LB.caption.textContent = item.label;
    LB.counter.textContent = (LB.index + 1) + ' / ' + LB.items.length;

    const many = LB.items.length > 1;
    LB.el.querySelector('[data-lb-prev]').hidden = !many;
    LB.el.querySelector('[data-lb-next]').hidden = !many;
  }

  /* ================================================================
     语言切换
     ----------------------------------------------------------------
     只重绘「文本」部分。
     早期版本在此处调用 render() 整篇重建，实测有三个问题：
       1. 正文里的 <img> 每次都被销毁重建 → 图片重新请求、视觉闪烁；
       2. <video> 元素被重建 → 播放进度、音量等状态全部丢失；
       3. 画廊被重建 → 已翻到的页码被重置回第一页。
     图片路径与视频源与语言无关，因此只刷新文字节点即可。
     ================================================================ */
  document.addEventListener('zine:langchange', function () {
    if (!document.getElementById('articleRoot')) return;

    const util = window.ZineUtil;
    const found = findArticle(new URLSearchParams(location.search).get('id'));
    if (!found) { render(); return; } // 404 分支无图片/视频，整体重绘无副作用

    // 仅更新正文内的文字节点（图注 / 视频说明 / 段落 / 小标题 / 引用）
    const body = document.getElementById('articleBody');
    if (body) {
      const a = found.assignment;
      const texts = [];
      a.body.forEach(function (b) {
        if (b.type === 'figure' || b.type === 'video') texts.push(b.caption);
        else if (b.type === 'gallery') texts.push(null); // 画廊文字单独刷新
        else texts.push(b.text);
      });
      if (a.video) texts.push(a.video.caption);

      const nodes = body.querySelectorAll('p, h2, blockquote, figcaption');
      let i = 0;
      nodes.forEach(function (node) {
        // 只替换纯文本、且顺序与数据一致；含子元素的节点保持不动
        if (i < texts.length && node.children.length === 0) {
          if (texts[i] !== null) node.textContent = util.tr(texts[i]);
          i++;
        }
      });

      refreshGalleryText(body, a, util);
    }

    paintArticleText();
  });

  /** 语言切换时只刷新画廊里的文字（标题 / 提示 / 页码标签 / 下载链接） */
  function refreshGalleryText(body, assignment, util) {
    const blocks = assignment.body.filter(function (b) { return b.type === 'gallery'; });
    const decks = body.querySelectorAll('[data-deck]');
    decks.forEach(function (deck, di) {
      const data = blocks[di];
      if (!data) return;
      const title = deck.querySelector('.deck-title');
      if (title) title.textContent = util.tr(data.title);
      const hint = deck.querySelector('.deck-hint');
      if (hint) hint.textContent = util.tr(data.hint);
      const file = deck.querySelector('.deck-file');
      if (file) {
        file.innerHTML = util.t('gallery.download') + ' <span aria-hidden="true">↓</span>';
      }
      const badge = deck.querySelector('.deck-badge');
      if (badge) badge.textContent = util.t('gallery.badge');

      // 每页的标签（figcaption 里的 label span）+ 指示条的无障碍标签
      deck.querySelectorAll('.deck-slide').forEach(function (slide, si) {
        const item = data.items[si];
        if (!item) return;
        const label = slide.querySelector('.deck-slide-label');
        if (label) label.textContent = util.tr(item.label);
        slide.setAttribute('aria-label',
          util.tr(item.label) + ' — ' + util.t('gallery.expand'));
        const img = slide.querySelector('img');
        if (img) img.alt = util.tr(item.label);
      });
      deck.querySelectorAll('[data-deck-dot]').forEach(function (dot, di) {
        const item = data.items[di];
        if (item) dot.setAttribute('aria-label', util.tr(item.label) || ('Page ' + (di + 1)));
      });
    });

    // 全屏层若正开着，同步说明文字
    if (LB.el && LB.el.open && LB.items.length) {
      const data = blocks[0];
      if (data && data.items[LB.index]) {
        LB.items[LB.index].label = util.tr(data.items[LB.index].label);
        lbPaint();
      }
    }
  }

  // 渲染后初始化画廊（render 在 DOMContentLoaded 时同步跑完，这里紧随其后）
  document.addEventListener('DOMContentLoaded', initGalleries);
})();
