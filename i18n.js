/**
 * Charles Blog - 语言引擎
 * ====================================
 * 全站统一的「繁体中文 / English」切换。
 *
 * 设计原则：
 *   - 只有一个语言状态源（window.ZineI18n.lang），保存在 localStorage，跨页面保持
 *   - 任何页面、任何渲染时机都能注册文案：ZineI18n.add(key, en, zh)
 *   - 静态 HTML 用 data-i18n="key" 声明，动态渲染内容在渲染后调用 apply()
 *   - 切换语言时：<html lang> / 页面标题 / 所有已注册文案 / 切换按钮 同步更新
 *
 * 为什么不用 data-zh/data-en 并排属性：
 *   并排写法会同时写死两种语言，无法在两个页面上独立切换；
 *   集中到字符串表后，新增页面只需 add() 一行。
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cp:lang';
  var DEFAULT_LANG = 'en';
  var VALID = ['en', 'zh'];

  /* ---------- 文案表 ---------- */
  var dict = {};

  /**
   * 注册文案
   * @param {string} key  唯一键
   * @param {string} en   英文
   * @param {string} zh   繁体中文
   */
  function add(key, en, zh) {
    dict[key] = { en: en, zh: zh };
  }

  /** 批量注册：add({ key: ['en', 'zh'], ... }) */
  function addAll(map) {
    Object.keys(map).forEach(function (k) {
      var pair = map[k];
      add(k, pair[0], pair[1]);
    });
  }

  /** 取当前语言下某个 key 的文案（找不到时回退到 key 本身，便于发现遗漏） */
  function t(key, lang) {
    var entry = dict[key];
    if (!entry) return key;
    var l = lang || current;
    var v = entry[l];
    return (v === undefined || v === null) ? (entry[DEFAULT_LANG] || key) : v;
  }

  /* ---------- 语言状态 ---------- */
  var current = DEFAULT_LANG;

  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v && VALID.indexOf(v) >= 0) return v;
    } catch (e) { /* 隐私模式等，忽略 */ }
    return null;
  }

  function persist(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* 忽略 */ }
  }

  function get() { return current; }

  function set(lang) {
    if (VALID.indexOf(lang) < 0) lang = DEFAULT_LANG;
    current = lang;
    persist(lang);
    apply();
    // 通知订阅者（渲染器需要按语言重绘动态内容）
    document.dispatchEvent(new CustomEvent('zine:langchange', { detail: { lang: lang } }));
    return lang;
  }

  function toggle() { return set(current === 'en' ? 'zh' : 'en'); }

  /* ---------- DOM 应用 ---------- */

  /** 语言对应的 <html lang> 值 */
  function htmlLangTag(lang) {
    return (lang || current) === 'zh' ? 'zh-Hant' : 'en';
  }

  /**
   * 把 data-i18n / data-i18n-attr 声明的文案刷到 DOM
   *   <h2 data-i18n="section.assignments"></h2>
   *   <img data-i18n-attr="alt:hero.alt">
   */
  function applyStatic(rootNode) {
    var scope = rootNode || document;

    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    scope.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key);
    });

    // 形如 data-i18n-attr="alt:key,title:key2"（也可用于 placeholder / aria-label 等）
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var bits = pair.split(':');
        if (bits.length !== 2) return;
        var attr = bits[0].trim();
        var key = bits[1].trim();
        if (attr && key && dict[key]) el.setAttribute(attr, t(key));
      });
    });
  }

  /** 语言切换按钮的文案与可访问名 */
  function paintSwitcher() {
    document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      var label = btn.querySelector('.lang-text');
      if (label) {
        // 显示「将要切到的语言」，点击即可到达
        label.textContent = current === 'en' ? '繁中' : 'EN';
      }
      btn.setAttribute('data-current-lang', current);
      btn.setAttribute('aria-label', current === 'en' ? '切換至繁體中文' : 'Switch to English');
      btn.setAttribute('title', current === 'en' ? '切換至繁體中文' : 'Switch to English');
      btn.setAttribute('aria-pressed', current === 'en' ? 'false' : 'true');
    });
  }

  /** 全量生效：<html lang> + 静态文案 + 切换按钮 */
  function apply() {
    document.documentElement.setAttribute('lang', htmlLangTag());
    applyStatic(document);
    paintSwitcher();
  }

  /* ---------- 切换按钮绑定（事件委托，动态插入也有效） ---------- */
  function initSwitchButtons() {
    if (initSwitchButtons._done) return;
    initSwitchButtons._done = true;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lang-switch]');
      if (!btn) return;
      e.preventDefault();
      toggle();
    });

    // 物理下压效果
    ['mousedown', 'mouseup', 'mouseleave'].forEach(function (type) {
      document.addEventListener(type, function (e) {
        var btn = e.target.closest('[data-lang-switch]');
        if (!btn) return;
        btn.classList.toggle('pressed', type === 'mousedown');
      });
    });
  }

  /* ---------- 启动 ---------- */
  // 尽早读取存储的语言，避免首屏闪烁
  current = readStored() || DEFAULT_LANG;

  function boot() {
    initSwitchButtons();
    apply();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 暴露接口
  window.ZineI18n = {
    add: add,
    addAll: addAll,
    t: t,
    get: get,
    set: set,
    toggle: toggle,
    apply: apply,
    applyStatic: applyStatic,
    htmlLangTag: htmlLangTag,
  };
})();
