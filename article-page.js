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

  /**
   * 各区块类型的渲染函数表。
   * 新增一种区块时只在这里加一条，不必再往 switch 里塞分支 ——
   * 表本身就是「本页支持哪些区块」的清单，比 switch 好读也好找。
   */
  const BLOCK_RENDERERS = {
    h2: function (b, root, util) { return '<h2>' + util.tr(b.text) + '</h2>'; },
    h3: function (b, root, util) { return '<h3>' + util.tr(b.text) + '</h3>'; },
    p: function (b, root, util) { return '<p>' + util.tr(b.text) + '</p>'; },
    quote: function (b, root, util) { return '<blockquote>' + util.tr(b.text) + '</blockquote>'; },
    note: function (b, root, util) { return '<p class="inline-note">' + util.tr(b.text) + '</p>'; },
    ref: function (b, root, util) { return renderRef(b, util); },
    gallery: function (b, root, util) { return renderGallery(b, root, util); },
    figure: function (b, root, util) {
      return '<figure class="inline-figure">'
        + '<img src="' + util.imgSrc(root + b.src) + '" alt="' + util.tr(b.caption) + '" loading="lazy" decoding="async">'
        + '<figcaption>' + util.tr(b.caption) + '</figcaption></figure>';
    },
    diagram: function (b, root, util) { return renderDiagram(b, util); },
    video: function (b, root, util) { return renderVideo(b, root, util); },
    // 剪刀虚线必须是 figure 之前的独立流内块，不能做成伪元素（CSS 陷阱 2）
    embed: function (b, root, util) { return embedRule() + renderEmbed(b, util); },
  };

  /** 渲染正文区块 */
  function renderBody(blocks, root, util) {
    return blocks.map(function (block) {
      const fn = BLOCK_RENDERERS[block.type] || BLOCK_RENDERERS.p;
      return fn(block, root, util);
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
  /** 翻页箭头：两个方向只有路径与文案不同，抽出来避免整段 SVG 抄两遍 */
  function deckArrow(dir, util) {
    var d = dir === 'prev' ? 'M15 4 L7 12 L15 20' : 'M9 4 L17 12 L9 20';
    return '<button type="button" class="deck-arrow deck-' + dir + '" data-deck-' + dir
      + ' aria-label="' + util.t('gallery.' + dir) + '">'
      + '  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"'
      + ' fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"'
      + ' stroke-linejoin="round"/></svg>'
      + '</button>';
  }

  function renderGallery(block, root, util) {
    var title = util.tr(block.title);
    var hint = util.tr(block.hint);
    var total = block.items.length;

    var slides = block.items.map(function (item, i) {
      var src = util.imgSrc(root + item.src);
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
      + deckArrow('prev', util)
      + deckArrow('next', util)
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

  /**
   * 环形流程图（type: 'diagram'）
   * ---------------------------------------------------------------
   * 把「一个闭环流程」画成 SVG 环：节点环绕圆周、箭头首尾相接，
   * 并让一枚光点沿环路径循环流动（CSS 动画驱动 offset-path，不依赖 JS）。
   *
   * 为何用内联 SVG 而不是 PNG：
   *   · 文字要随语言切换（中/英），PNG 做不到；
   *   · 任意屏幕尺寸下都锐利，无需多倍图；
   *   · 动画（光点流动 + 节点依次点亮）用 CSS 就能表达。
   *
   * 坐标计算：节点均匀分布在圆周上，从正上方（-90°）开始顺时针排布，
   * 与阅读顺序一致；连线用圆弧路径，箭头方向即顺时针流向。
   */
  /* 视觉宽度估算：CJK 与全角符号按 1em，拉丁字母按 0.55em（Inter 的粗体均值），
     空格与窄标点更窄。用于给每个节点框算出「刚好装下文字」的宽度。
     SVG <text> 没有自动换行，只能靠预留宽度保证不溢出。 */
  function visualWidth(str, fontEm) {
    let w = 0;
    for (const ch of String(str)) {
      const c = ch.codePointAt(0);
      if (c >= 0x2E80) w += 1;                 // CJK / 全角
      else if (ch === ' ') w += 0.28;
      else if ('iljtfr.,:;\'!|'.indexOf(ch) >= 0) w += 0.32;
      else if ('mwMW'.indexOf(ch) >= 0) w += 0.85;
      else w += 0.56;                           // 一般拉丁字母/数字
    }
    return w * fontEm;
  }

  function renderDiagram(block, util) {
    const items = block.items || [];
    const n = items.length;
    if (!n) return '';

    // 视图坐标系：宽 760，圆心居中
    // 宽度上探到 760 是为长副标题留出余量（SVG 文字不能自动换行）
    const W = 760;
    const CX = W / 2;
    const R = 218;          // 节点中心所在圆的半径
    const NODE_H = 62;      // 节点文字框高
    const PAD_X = 13;       // 框内左右留白
    const MIN_W = 150;      // 窄节点的下限，避免小方框显得零碎

    // 每个节点分别量宽：主标题按 15px 粗体、副标题按 11.5px 估算
    // SAFE 是估算误差余量——真实字体渲染比字符数估算更宽，留 3px 兜底
    const SAFE = 3;
    const sizes = items.map(function (item) {
      const label = String(util.tr(item.label));
      const parts = label.split(' / ');
      const main = parts[0] || '';
      const sub = parts[1] || '';
      const w = Math.max(
        visualWidth(main, 15) + (main ? 2 : 0),
        sub ? visualWidth(sub, 11.5) : 0
      ) + PAD_X * 2 + SAFE;
      return { main: main, sub: sub, w: Math.max(MIN_W, Math.ceil(w)) };
    });

    const pts = items.map(function (item, i) {
      const ang = (-90 + (360 / n) * i) * Math.PI / 180;
      return {
        x: CX + R * Math.cos(ang),
        y: CX + R * Math.sin(ang),
        ang: ang,
        item: item,
        w: sizes[i].w,
        main: sizes[i].main,
        sub: sizes[i].sub
      };
    });

    // 顶部/底部留出说明空间
    const topY = pts.reduce(function (m, p) { return Math.min(m, p.y); }, Infinity) - NODE_H / 2 - 26;
    const botY = pts.reduce(function (m, p) { return Math.max(m, p.y); }, -Infinity) + NODE_H / 2 + 30;
    const H = Math.round(botY - topY);
    const dy = -topY;       // 整体下移，使内容顶到 0

    // 环上的弧（每段从当前节点后缘到下一节点前缘，留出节点占位）
    const gapDeg = 30;      // 节点两侧让出的角度
    const segs = pts.map(function (p, i) {
      const a0 = (-90 + (360 / n) * i + gapDeg / 2) * Math.PI / 180;
      const a1 = (-90 + (360 / n) * ((i + 1) % n) - gapDeg / 2) * Math.PI / 180;
      // 逆时针跨越时补正
      const a1n = a1 < a0 ? a1 + Math.PI * 2 : a1;
      const x0 = CX + R * Math.cos(a0), y0 = dy + CX + R * Math.sin(a0);
      const x1 = CX + R * Math.cos(a1n), y1 = dy + CX + R * Math.sin(a1n);
      const large = (a1n - a0) > Math.PI ? 1 : 0;
      return { d: 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + R + ' ' + R + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1), i: i };
    });

    const nodes = pts.map(function (p, i) {
      const x = p.x, y = dy + p.y;
      const label = util.tr(p.item.label);
      const num = p.item.no || ('0' + (i + 1)).slice(-2);
      const nw = p.w;
      const main = p.main;
      const sub = p.sub;
      return '<g class="dg-node" style="--dg-i:' + i + '">'
        + '<rect class="dg-node-bg" x="' + (x - nw / 2).toFixed(1) + '" y="' + (y - NODE_H / 2).toFixed(1) + '" width="' + nw + '" height="' + NODE_H + '" rx="3"></rect>'
        + '<text class="dg-node-no" x="' + (x - nw / 2 + PAD_X).toFixed(1) + '" y="' + (y - NODE_H / 2 + 20).toFixed(1) + '">' + num + '</text>'
        + '<text class="dg-node-main" x="' + (x - nw / 2 + PAD_X).toFixed(1) + '" y="' + (y - NODE_H / 2 + 38).toFixed(1) + '">' + esc(main) + '</text>'
        + (sub ? '<text class="dg-node-sub" x="' + (x - nw / 2 + PAD_X).toFixed(1) + '" y="' + (y - NODE_H / 2 + 53).toFixed(1) + '">' + esc(sub) + '</text>' : '')
        + '</g>';
    }).join('');

    const label = esc(util.tr(block.caption));
    const altText = items.map(function (it) { return util.tr(it.label); }).join('；');

    return '<figure class="dg-block">'
      + '<div class="dg-frame">'
      + '  <svg class="dg-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + label + '：' + esc(altText) + '">'
      + '    <defs>'
      + '      <marker id="dgArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
      + '        <path d="M0 0 L10 5 L0 10 z" class="dg-arrow-head"></path>'
      + '      </marker>'
      + '    </defs>'
      + '    <g class="dg-ring">'
      + segs.map(function (s) {
        return '<path class="dg-seg" d="' + s.d + '" marker-end="url(#dgArrow)" style="--dg-i:' + s.i + '"></path>';
      }).join('')
      + '    </g>'
      + '    <circle class="dg-spark" r="5">'
      + '      <animateMotion dur="9s" repeatCount="indefinite" path="' + ringPath(CX, dy + CX, R) + '"></animateMotion>'
      + '    </circle>'
      + nodes
      + '  </svg>'
      + '</div>'
      + '<figcaption class="dg-caption">' + label + '</figcaption>'
      + '</figure>';
  }

    /**
   * 参考文献条目（type: 'ref'）
   * ---------------------------------------------------------------
   * 作业的 Reference 区块里，每条文献都带一句「为什么引用它」的注解。
   *
   * 排版层次刻意收成两级，避免「分组标题 + 书目 + 裸链接 + 注解竖线」
   * 四层堆叠造成的杂乱感：
   *   第一层 = 书目（正文大小、悬挂缩进，是主体）
   *   第二层 = 注解（小号、左侧一条短竖线，是附属）
   * 链接紧跟在 APA 书目之后单独成行（字号收小、加下划线，悬停变实），
   * 需要跳转的人一眼拿得到地址，又不与书目正文争夺注意力。
   *
   * 文献书目（text）按学术规范保留原文，中英两版一致，不做翻译。
   */
  function renderRef(block, util) {
    const link = block.url
      ? '<p class="ref-link-row">'
        + '<a class="ref-link" href="' + esc(block.url) + '" target="_blank" rel="noopener noreferrer"'
        + ' title="' + esc(block.url) + '" aria-label="' + util.t('ref.open') + '：' + esc(block.url) + '">'
        + '<span class="ref-link-icon" aria-hidden="true">↗</span>'
        + '<span class="ref-link-url">' + esc(block.url) + '</span>'
        + '</a></p>'
      : '';
    return '<div class="ref-item">'
      + '<p class="ref-cite">' + util.tr(block.text) + '</p>'
      + link
      + (block.note ? '<p class="ref-note">' + util.tr(block.note) + '</p>' : '')
      + '</div>';
  }

  /** 生成一个完整闭合圆的路径（供 animateMotion 让光点沿环流动） */
  function ringPath(cx, cy, r) {
    return 'M' + cx + ' ' + (cy - r)
      + ' A' + r + ' ' + r + ' 0 1 1 ' + (cx - 0.01) + ' ' + (cy - r)
      + ' Z';
  }

  /** 极简 HTML 转义 */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * 电视机画框：本地影片与外部嵌入共用同一副外壳，只换内层。
   * head 是画框之上的抬头标签（只有嵌入影片用得到）。
   */
  function mediaFrame(cls, inner, caption, util, head) {
    return '<figure class="' + cls + '">'
      + (head || '')
      + '  <div class="video-frame">' + inner + '</div>'
      + (caption ? '<figcaption class="video-caption">' + util.tr(caption) + '</figcaption>' : '')
      + '</figure>';
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
    return mediaFrame('video-block', inner, block.caption, util);
  }

  /* ── 外部视频嵌入（type: 'embed'） ────────────────────────────────
     YouTube 等平台的播放器一律用 iframe 引入，原生 <video> 无法播放。
     外观与站内 .video-block 完全一致（同一套「复古电视机框」规则），
     只换内层元素：iframe + allowfullscreen，标题作为无障碍名称。

     安全与隐私：只接受 provider 白名单里的 host，视频 id 强制走
     [A-Za-z0-9_-]{6,} 校验 —— 数据虽由本项目 content.js 提供，
     但把「拼 URL」这一步收敛成白名单表，日后接外部数据源也不会
     变成注入口。iframe 属性固定模板，不拼接任何自由文本。        */
  var EMBED_PROVIDERS = {
    youtube: function (id, title) {
      return {
        src: 'https://www.youtube-nocookie.com/embed/' + id,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        name: title,
      };
    },
  };

  function renderEmbed(block, util) {
    var make = EMBED_PROVIDERS[block.provider];
    var vid = String(block.id || '');
    var title = util.tr(block.title) || util.t('embed.videoFallback');
    var ok = !!make && /^[A-Za-z0-9_-]{6,}$/.test(vid);

    var inner = ok
      ? (function () {
        var p = make(vid, title);
        return '<iframe src="' + p.src + '" title="' + esc(p.name) + '"'
          + ' allow="' + p.allow + '" allowfullscreen'
          + ' referrerpolicy="strict-origin-when-cross-origin"'
          + ' loading="lazy" frameborder="0"></iframe>';
      })()
      : '<div class="embed-placeholder" role="note">' + util.t('embed.invalid') + '</div>';

    return mediaFrame('embed-block video-block', inner, block.caption, util,
      '<span class="embed-head">' + util.t('embed.head') + '</span>');
  }

  /* 嵌入区块上方的剪刀虚线：作为 figure 之前的独立流内块返回。
     为什么不写成 figure 的 ::before —— multicol 里绝对定位的伪元素
     会随 break-inside 整栏搬运而被遗留成白块（CSS 陷阱 2）。 */
  function embedRule() {
    return '<span class="embed-rule" aria-hidden="true"></span>';
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

    // 学生 ID：作业署名需要，老师据此对号入座。
    // 没有 ID 的文章连同它前面那条分隔线一起隐藏，避免留下孤立的竖线。
    const idEl = document.getElementById('postStudentId');
    if (idEl) {
      const sid = a.studentId || '';
      idEl.textContent = sid;
      const wrap = idEl.closest('.meta-item');
      const prevDivider = wrap ? wrap.previousElementSibling : null;
      if (wrap) wrap.hidden = !sid;
      if (prevDivider && prevDivider.classList.contains('divider-v')) prevDivider.hidden = !sid;
    }

    const heroImg = document.getElementById('heroImg');
    heroImg.src = util.imgSrc(root + a.image);

    // 正文区块 + 文章级视频块（最多一个）
    let bodyHtml = renderBody(a.body, root, util);
    if (a.video) bodyHtml += renderVideo(a.video, root, util);
    document.getElementById('articleBody').innerHTML = bodyHtml;

    paintArticleText();

    /* 正文里的图（inline-figure / 画廊页）是刚插进来的，补挂显影动画。
       封面 heroImg 是页面自带的静态节点，shared.js 启动时就挂过了，
       这里不需要再管 —— 它自己 load 完会显影。 */
    if (window.ZineReinitImages) window.ZineReinitImages();
  }

  /* 脚本挂在 </body> 之前，此刻 DOM 已解析完整 —— 直接渲染，
     不必再等一轮 DOMContentLoaded 回调，正文能早一帧出现。
     （readyState 判断是为了兼容脚本被挪到 <head> 的意外情况。） */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();

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
        else if (b.type === 'diagram') texts.push(null); // 环形图文字单独刷新
        else if (b.type === 'ref') texts.push(null, null); // 文献引用 + 注解，节点数固定为 2
        // 嵌入影片：字幕 + iframe 的无障碍标题（不是文本节点，单独刷新）
        else if (b.type === 'embed') { texts.push(b.caption || null); }
        else texts.push(b.text);
      });
      if (a.video) texts.push(a.video.caption);

      const nodes = body.querySelectorAll('p, h2, h3, blockquote, figcaption');
      let i = 0;
      nodes.forEach(function (node) {
        // 只替换纯文本、且顺序与数据一致；含子元素的节点保持不动
        if (i < texts.length && node.children.length === 0) {
          if (texts[i] !== null) node.textContent = util.tr(texts[i]);
          i++;
        }
      });

      refreshGalleryText(body, a, util);
      refreshDiagramText(body, a, util);
      refreshRefText(body, a, util);
      refreshEmbedText(body, a, util);
    }

    paintArticleText();
  });

  /**
   * 把「数据区块」与「已渲染节点」按类型一一对齐。
   * 语言切换时四个刷新函数都要做同一件事：按类型过滤数据、按选择器取节点、
   * 按下标配对、跳过对不上的。抽出来省掉四份同样的样板。
   */
  function pairBlocks(assignment, body, type, selector) {
    const data = assignment.body.filter(function (b) { return b.type === type; });
    return Array.prototype.map.call(body.querySelectorAll(selector), function (node, i) {
      return data[i] ? { data: data[i], node: node } : null;
    }).filter(Boolean);
  }

  /**
   * 语言切换时刷新环形图的文字（节点标签 / 编号 / 图注）。
   * SVG 里的 <text> 不是标准 figcaption 文本节点，所以单独重绘：
   * 按节点顺序写回，位置与结构保持不变，动画不中断。
   */
  function refreshDiagramText(body, assignment, util) {
    pairBlocks(assignment, body, 'diagram', '.dg-block').forEach(function (pair) {
      const fig = pair.node;
      const data = pair.data;
      const groups = fig.querySelectorAll('.dg-node');
      groups.forEach(function (g, gi) {
        const item = data.items[gi];
        if (!item) return;
        const label = util.tr(item.label);
        const parts = String(label).split(' / ');
        const main = g.querySelector('.dg-node-main');
        const sub = g.querySelector('.dg-node-sub');
        if (main) main.textContent = parts[0] || '';
        if (sub) sub.textContent = parts[1] || '';
        g.setAttribute('aria-label', label);
      });
      const cap = fig.querySelector('.dg-caption');
      if (cap) cap.textContent = util.tr(data.caption);
      const svg = fig.querySelector('.dg-svg');
      if (svg) {
        svg.setAttribute('aria-label', util.tr(data.caption) + '：'
          + data.items.map(function (it) { return util.tr(it.label); }).join('；'));
      }
    });
  }

    /**
   * 语言切换时刷新文献条目的注解与链接文本。
   * 文献书目本身中英一致（学术规范不翻译），只有「为什么引用」的注解随语言变化。
   * 链接现在独占一行（.ref-link-row），但 aria-label 仍需按当前语言更新。
   */
  function refreshRefText(body, assignment, util) {
    pairBlocks(assignment, body, 'ref', '.ref-item').forEach(function (pair) {
      const item = pair.node;
      const data = pair.data;
      const cite = item.querySelector('.ref-cite');
      if (cite) cite.textContent = util.tr(data.text);
      const link = item.querySelector('.ref-link');
      if (link) link.setAttribute('aria-label', util.t('ref.open') + '：' + link.getAttribute('href'));
      const note = item.querySelector('.ref-note');
      if (note) note.textContent = util.tr(data.note);
    });
  }

  /**
   * 语言切换时刷新嵌入影片的文字。
   * iframe 本身与语言无关（不应重建 —— 重建会中断播放），只更新两处：
   *   · figcaption（文本节点，但它是 .video-caption，已在 texts 队列里跳过 null
   *     之外的情况，这里交给主队列处理）；
   *   · iframe 的 title 属性（无障碍名称，不是文本节点，必须单独写）。
   */
  function refreshEmbedText(body, assignment, util) {
    pairBlocks(assignment, body, 'embed', '.embed-block').forEach(function (pair) {
      const fig = pair.node;
      const data = pair.data;
      const iframe = fig.querySelector('iframe');
      if (iframe) iframe.setAttribute('title', util.tr(data.title) || util.t('embed.videoFallback'));
      const head = fig.querySelector('.embed-head');
      if (head) head.textContent = util.t('embed.head'); // span 不在主文本队列里
      const ph = fig.querySelector('.embed-placeholder');
      if (ph) ph.textContent = util.t('embed.invalid');
    });
  }

  /** 语言切换时只刷新画廊里的文字（标题 / 提示 / 页码标签 / 下载链接） */
  function refreshGalleryText(body, assignment, util) {
    const blocks = assignment.body.filter(function (b) { return b.type === 'gallery'; });
    pairBlocks(assignment, body, 'gallery', '[data-deck]').forEach(function (pair) {
      const deck = pair.node;
      const data = pair.data;
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
