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

  /**
   * 语言切换 → 只重绘「文本」部分。
   *
   * 早期版本在此处调用 render() 整篇重建，实测有两个性能/体验问题：
   *   1. 正文里的 <img> 每次都被销毁重建 → 图片重新请求、视觉闪烁；
   *   2. <video> 元素被重建 → 播放进度、音量等状态全部丢失。
   * 图片路径与视频源与语言无关，因此只刷新文字节点即可。
   * 注意：正文里「图注 caption / 视频说明」也是双语，需要一并刷新。
   */
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
        else texts.push(b.text);
      });
      if (a.video) texts.push(a.video.caption);

      const nodes = body.querySelectorAll('p, h2, blockquote, figcaption');
      let i = 0;
      nodes.forEach(function (node) {
        // 只替换纯文本、且顺序与数据一致；含子元素的节点保持不动
        if (i < texts.length && node.children.length === 0) {
          node.textContent = util.tr(texts[i]);
          i++;
        }
      });
    }

    paintArticleText();
  });
})();
