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

  // 语言切换 → 重绘正文与元信息
  document.addEventListener('zine:langchange', function () {
    if (document.getElementById('articleRoot')) {
      render();
      window.ZineReinitReveal && window.ZineReinitReveal();
    }
  });
})();
