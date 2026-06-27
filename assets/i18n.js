/**
 * Sirat i18n Engine
 * Handles multi-language support using translations from translations.js
 * Supports: Arabic (RTL) and English (LTR)
 */
(function () {
  'use strict';

  var SUPPORTED_LANGS = ['ar', 'en'];
  var DEFAULT_LANG = 'ar';
  var STORAGE_KEY = 'sirat-lang';

  /**
   * Get the current language from localStorage or default
   */
  function getCurrentLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  /**
   * Apply translations to all DOM elements with data-i18n attributes
   */
  function applyTranslations(lang) {
    var data = window.siratI18nData;
    if (!data || !data[lang]) {
      console.error('[i18n] No translation data found for:', lang);
      return;
    }
    var translations = data[lang];

    // Update <html> attributes
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update meta tags
    if (translations['meta.title']) {
      document.title = translations['meta.title'];
    }
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations['meta.description']) {
      metaDesc.setAttribute('content', translations['meta.description']);
    }

    // Apply text translations (textContent)
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      if (translations[key] !== undefined) {
        el.textContent = translations[key];
      }
    }

    // Apply HTML translations (innerHTML)
    var htmlElements = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < htmlElements.length; j++) {
      var elH = htmlElements[j];
      var keyH = elH.getAttribute('data-i18n-html');
      if (translations[keyH] !== undefined) {
        elH.innerHTML = translations[keyH];
      }
    }

    // Apply alt translations
    var altElements = document.querySelectorAll('[data-i18n-alt]');
    for (var k = 0; k < altElements.length; k++) {
      var elA = altElements[k];
      var keyA = elA.getAttribute('data-i18n-alt');
      if (translations[keyA] !== undefined) {
        elA.setAttribute('alt', translations[keyA]);
      }
    }

    // Update language indicator in topbar
    var langIndicators = document.querySelectorAll('[data-lang-indicator]');
    for (var n = 0; n < langIndicators.length; n++) {
      if (lang === 'ar') {
        langIndicators[n].innerHTML = '<b>ع</b> · EN';
      } else {
        langIndicators[n].innerHTML = '<b>EN</b> · ع';
      }
    }

    // Save preference
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    // Add body class for CSS hooks
    document.body.classList.remove('lang-ar', 'lang-en');
    document.body.classList.add('lang-' + lang);
  }

  /**
   * Switch to a specific language
   */
  function loadLanguage(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

    // Add transition class for smooth text change
    document.body.classList.add('i18n-transitioning');
    setTimeout(function () {
      applyTranslations(lang);
      setTimeout(function () {
        document.body.classList.remove('i18n-transitioning');
      }, 50);
    }, 150);
  }

  /**
   * Toggle between languages
   */
  function toggleLanguage() {
    var current = getCurrentLang();
    var next = current === 'ar' ? 'en' : 'ar';
    loadLanguage(next);
  }

  /**
   * Initialize i18n system
   */
  function init() {
    // Bind the topbar language indicator as toggle
    var indicators = document.querySelectorAll('[data-lang-indicator]');
    for (var j = 0; j < indicators.length; j++) {
      indicators[j].style.cursor = 'pointer';
      indicators[j].addEventListener('click', function (e) {
        e.preventDefault();
        toggleLanguage();
      });
    }

    // Load saved or default language (apply immediately without transition)
    var lang = getCurrentLang();
    applyTranslations(lang);
    document.body.classList.add('lang-' + lang);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API globally
  window.siratI18n = {
    loadLanguage: loadLanguage,
    toggleLanguage: toggleLanguage,
    getCurrentLang: getCurrentLang
  };

})();
