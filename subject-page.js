/**
 * Charles Blog - 科目分区页渲染器
 * ====================================
 * 页面在 <body data-subject="bcm212"> 上声明科目，
 * 本脚本读取 content.js 注册表并填充整个模版。
 * 所有文案经 ZineUtil.tr() 取当前语言；切换语言时整体重绘。
 */
(function () {
  'use strict';

  var currentKey = null;

  function letterBlocks(code) {
    var rots = [-4, 3, -2, 5, -5, 2, -3, 4];
    var delays = [0.0, 0.12, 0.2, 0.06, 0.26, 0.14, 0.32, 0.1];
    // 内边距用 em：随 clamp() 字号等比缩放，移动端字形不会被 padding 淹没
    return code.split('').map(function (ch, i) {
      var cls = i % 2 === 0 ? 'odd' : 'even';
      var pt = (0.10 + (i % 3) * 0.05).toFixed(2);
      var pr = (0.22 + (i % 2) * 0.08).toFixed(2);
      var pb = (0.14 + ((i + 1) % 3) * 0.05).toFixed(2);
      var pl = (0.16 + ((i + 2) % 2) * 0.08).toFixed(2);
      return '<span class="letter-block ' + cls + '" '
        + 'style="--rot:' + rots[i % rots.length] + 'deg; --delay:' + delays[i % delays.length] + 's;'
        + ' padding:' + pt + 'em ' + pr + 'em ' + pb + 'em ' + pl + 'em;'
        + ' margin-left:' + (i === 0 ? 0 : '-0.16em') + '; z-index:' + (code.length - i) + ';">'
        + ch + '</span>';
    }).join('');
  }

  /** 作业卡片：单条 */
  function renderCard(a, root, util) {
    var dateLabel = util.formatDate(a.date);
    var meta = [
      '<span class="tag">' + util.trList(a.tags).join('</span> <span class="tag">') + '</span>',
      '<span>' + dateLabel + '</span>',
    ].filter(Boolean).join(' <span class="dot">·</span> ');

    var title = util.tr(a.title);
    return '<article class="assignment-card reveal">'
      + '  <div class="assignment-info">'
      + '    <span class="assignment-no">' + util.t('card.assignment', a.no) + '</span>'
      + '    <h3 class="assignment-title"><a href="' + root + 'articles/article.html?id=' + a.id + '" '
      + '       style="color:inherit; text-decoration:none;">' + title + '</a></h3>'
      + '    <p class="assignment-excerpt">' + util.tr(a.excerpt) + '</p>'
      + '    <div class="assignment-meta">' + meta + '</div>'
      + '    <a class="zine-btn primary enter-btn" href="' + root + 'articles/article.html?id=' + a.id + '">'
      + '      ' + util.t('card.readPost') + ' <span aria-hidden="true">→</span></a>'
      + '  </div>'
      + '  <figure class="assignment-figure">'
      + '    <span class="tape tr" aria-hidden="true"></span>'
      + '    <img src="' + util.imgSrc(root + a.image) + '" alt="' + util.t('card.imageAlt', title) + '" loading="lazy" decoding="async">'
      + '    <figcaption class="fig-label">' + util.tr(a.figLabel) + '</figcaption>'
      + '  </figure>'
      + '</article>';
  }

  function renderSubject(key) {
    var subject = window.SUBJECTS[key];
    if (!subject) return;
    var util = window.ZineUtil;
    var root = util.rootPrefix();
    var code = subject.code;
    var sName = util.tr(subject.name);

    // HERO 大标题与文案
    document.getElementById('heroTitle').innerHTML = letterBlocks(code);
    document.getElementById('heroKicker').textContent = util.t('subject.kicker', code, sName);
    document.getElementById('heroTagline').textContent = util.tr(subject.tagline);
    document.getElementById('heroDesc').textContent = util.tr(subject.desc);

    // 图片路径与语言无关：仅在变化时赋值，避免语言切换触发图片重新加载/重绘
    var heroImg = document.getElementById('heroImage');
    var heroSrc = util.imgSrc(root + subject.heroImage);
    if (heroImg.getAttribute('src') !== heroSrc) heroImg.src = heroSrc;
    heroImg.alt = util.t('card.imageAlt', code + ' ' + sName);

    /* HERO 是静态节点，shared.js 启动时已挂好显影；这里不用再管。
       （放在函数中段而非末尾：后面还有 return（索引隐藏／列表缺失），
         写在末尾会被跳过。） */

    document.getElementById('heroCaption').textContent = util.tr(subject.heroCaption);
    document.getElementById('heroSection').setAttribute('aria-label', util.t('subject.heroLabel', code));

    // 页面标题
    document.title = code + ' ' + sName + ' — Charles Blog';

    // 作業索引列表
    // 暫時隱藏模式：資料來源 content.js 完全不動，只是不渲染卡片
    // （還原方式見 更新日志.txt 第九階段）
    var list = document.getElementById('assignmentList');
    if (!list) return;

    if (list.classList.contains('is-placeholder')) return; // 文章索引暫時隱藏

    // 已上線的作品：交付內容尚未到位（占位文案）的條目不上架，
    // 否則索引會把示範內容當成真作業展示。等真實內容寫入 content.js 後，
    // 移除該條目的 placeholder 標記即可自動出現。
    var live = subject.assignments.filter(function (a) { return !a.placeholder; });
    var countBadge = document.getElementById('assignmentCount');
    countBadge.textContent = util.t('subject.pieces', live.length);
    countBadge.setAttribute('aria-label', util.t('subject.piecesAria', live.length));

    list.innerHTML = live.length
      ? live.map(function (a) { return renderCard(a, root, util); }).join('')
      : '<p class="assignments-empty">' + util.t('subject.noAssignments') + '</p>';

    // 索引上線後，首頁原有的「持續更新中」小字改成收尾語：文案換掉、間距收緊。
    // 文案用 JS 設定而非 data-i18n，才不會在語言切換時被 i18n 引擎覆寫回原句。
    var noteSection = document.querySelector('.assignments-note-section');
    if (noteSection) {
      noteSection.classList.add('is-after-list');
      var note = noteSection.querySelector('.assignments-note');
      if (note) {
        note.removeAttribute('data-i18n');
        note.textContent = util.t('subject.moreComing');
      }
    }

    // 重新触发浮现动画（列表为动态生成）
    if (window.ZineReinitReveal) window.ZineReinitReveal();
    // 卡片封面是刚插进来的新节点，补挂显影动画（幂等，已挂过的会跳过）
    if (window.ZineReinitImages) window.ZineReinitImages();
  }

  document.addEventListener('DOMContentLoaded', function () {
    currentKey = document.body.getAttribute('data-subject');
    if (currentKey) renderSubject(currentKey);
  });

  // 语言切换 → 整体重绘（含日期格式）
  document.addEventListener('zine:langchange', function () {
    if (currentKey) renderSubject(currentKey);
  });
})();
