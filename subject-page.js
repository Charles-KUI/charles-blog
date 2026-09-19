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
      + '    <img src="' + root + a.image + '" alt="' + util.t('card.imageAlt', title) + '" loading="lazy">'
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
    document.getElementById('heroImage').src = root + subject.heroImage;
    document.getElementById('heroImage').alt = util.t('card.imageAlt', code + ' ' + sName);
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

    var countBadge = document.getElementById('assignmentCount');
    countBadge.textContent = util.t('subject.pieces', subject.assignments.length);
    countBadge.setAttribute('aria-label', util.t('subject.piecesAria', subject.assignments.length));

    list.innerHTML = subject.assignments.length
      ? subject.assignments.map(function (a) { return renderCard(a, root, util); }).join('')
      : '<p class="assignments-empty">' + util.t('subject.noAssignments') + '</p>';

    // 重新触发浮现动画（列表为动态生成）
    if (window.ZineReinitReveal) window.ZineReinitReveal();
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
