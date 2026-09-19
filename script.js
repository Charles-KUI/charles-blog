/**
 * Charles Blog - 主页交互
 * ====================================
 * 科目按钮由 content.js 注册表渲染（双语，随语言切换更新）。
 * 语言切换本身由 i18n.js 统一处理。
 */

/** 科目展示顺序（与导航一致） */
var HOME_SUBJECT_ORDER = ['bcm212', 'bcm241', 'bcm206', 'bcm222'];

/**
 * 渲染主页四个科目按钮
 * 文案取自 content.js 的 subject.name（双语对象），保证与分区页一致
 * @param {boolean} replayIntro 是否播放入场动画（仅首屏为 true）
 */
function renderHomeSubjectButtons(replayIntro) {
    var wrap = document.querySelector('.subject-buttons');
    if (!wrap || !window.SUBJECTS || !window.ZineUtil) return;

    wrap.innerHTML = HOME_SUBJECT_ORDER.map(function (key) {
        var s = window.SUBJECTS[key];
        if (!s) return '';
        var label = s.code + ' ' + window.ZineUtil.tr(s.name);
        return '<a class="subject-btn" href="subjects/' + key + '.html">' + label + '</a>';
    }).join('');

    // 入场动画只在首屏播放：加上 .is-entering 触发，动画结束后移除，
    // 之后语言切换重绘按钮就不会再播一次。
    if (replayIntro) {
        wrap.classList.add('is-entering');
        var first = wrap.querySelector('.subject-btn');
        if (first) {
            first.addEventListener('animationend', function () {
                wrap.classList.remove('is-entering');
            }, { once: true });
        }
    } else {
        wrap.classList.remove('is-entering');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderHomeSubjectButtons(true);
});

// 语言切换 → 只重绘按钮文案，不重播入场动画
document.addEventListener('zine:langchange', function () {
    renderHomeSubjectButtons(false);
});
