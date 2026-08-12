/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business bundles page cleanup.
 *
 * SCOPE: keep main authorable content only. Everything outside
 * `#baem-container .segmentationSectionIncluded` (within main) is site shell /
 * chrome and is removed. Modeled on attbusiness-cleanup.js (homepage) but scoped
 * to the bundles page's own leftovers (no .foyerComp__brochure; different
 * section titles).
 *
 * Selectors verified against migration-work/cleaned.html + the live DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function norm(s) {
  return (s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[?.!:]+$/, '');
}

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Interactive / blocking chrome + tracking that can interfere with parsing.
    WebImporter.DOMUtils.remove(element, [
      '#gpc-banner-container',
      '.cookie-disclaimer-component',
      '.att-modal-container',
      '.modal-popup-container',
      '#businessChatDiv',
      '#js-site-nav-overlay',
      '.site-nav-overlay',
      '.video-overlay',
      '.cloudservice.testandtarget',
      'a.skip-link',
      'uws-badge',
      '#db-sync',
      '#db_lr_pixel_ad',
      '[id^="batBeacon"]',
      'iframe',
      '#summaryCost-wrapper',
      '.summary-cost-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global shell: header/nav and footer, plus leftovers.
    WebImporter.DOMUtils.remove(element, [
      '.global-nav',
      'header.site-header',
      'nav.site-nav',
      'div.footer',
      '.footer-main',
      '.footer-page-css-includes',
      'link',
      'noscript',
      'source',
    ]);

    // Promote standalone section titles to <h2>. On the source these are styled
    // non-heading elements, so the importer would otherwise emit them as
    // paragraphs — breaking heading hierarchy + a11y. Match exact title text on
    // the innermost (leaf-text) element, tag-agnostic.
    const SECTION_TITLES = [
      'choose the bundle that’s right for your business',
      "choose the bundle that's right for your business",
      'frequently asked questions',
      'talk to an at&t business sales expert',
    ];
    element.querySelectorAll('p, div, span').forEach((el) => {
      if (!SECTION_TITLES.includes(norm(el.textContent))) return;
      if (el.querySelector('a, img')) return;
      if (el.closest('table')) return; // never touch content already inside a block
      if ([...el.children].some((c) => SECTION_TITLES.includes(norm(c.textContent)))) return;
      const h2 = element.ownerDocument.createElement('h2');
      h2.textContent = el.textContent.replace(/\s+/g, ' ').trim();
      el.replaceWith(h2);
    });

    // Strip non-authorable inline event handlers.
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
  }
}
