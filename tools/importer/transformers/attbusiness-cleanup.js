/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business (www.business.att.com) site-wide cleanup.
 *
 * SCOPE: keep main authorable content only. Everything outside
 * `#baem-container .segmentationSectionIncluded` (within main) is site shell / chrome
 * and is removed here so the import contains only page-level authorable content.
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (line references note where each was found in the captured DOM).
 * See page-templates.json (template "homepage") for the block/section mapping.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Interactive / blocking chrome + tracking that can interfere with block parsing.
    // Verified in cleaned.html:
    //   #gpc-banner-container (l.3346), .cookie-disclaimer-component (l.3311),
    //   .att-modal-container (l.3332), .modal-popup-container (l.3334),
    //   #businessChatDiv (l.3342), #js-site-nav-overlay / .site-nav-overlay (l.3330),
    //   .video-overlay (l.3297), .cloudservice.testandtarget (l.3326),
    //   a.skip-link (l.7), uws-badge (l.3352), #db-sync (l.3336),
    //   #db_lr_pixel_ad (l.3338), batBeacon* (l.3339-3340), all iframes (l.3328-3354, chrome only).
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
      // Hidden fixed-position price-calculator widget ("Estimated monthly cost
      // for 0") — a JS-driven overlay template, not authorable page content.
      '#summaryCost-wrapper',
      '.summary-cost-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global shell: header/nav and footer (out of scope), plus leftovers.
    // Verified in cleaned.html:
    //   .global-nav (l.5) wraps header.site-header (l.8) > nav.site-nav (l.9);
    //   div.footer (l.2748) wraps .footer-main (l.2749); .footer-page-css-includes (l.2734).
    // Footer selectors are specific class tokens so they do not match authorable
    // content such as .uf-testimonial__footer inside the main grid.
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
      // Leftover DUPLICATE hero: the source renders two .foyerComp__brochure
      // (visible desktop + hidden mobile). The hero parser consumes the first
      // (replacing it with a hero block), so any .foyerComp__brochure still
      // present here is the redundant copy — remove it to avoid a second <h1>.
      '.foyerComp__brochure',
    ]);

    // Promote the standalone section titles to <h2>. On the source these are
    // styled non-heading elements (div.single-title), so the importer would
    // otherwise emit them as paragraphs — breaking the heading hierarchy
    // (H1 → H3 skip) and a11y. Match the exact title text on the innermost
    // (leaf-text) element, tag-agnostic, so it works whether the node is still
    // a source div or already a <p> at this stage.
    const SECTION_TITLES = [
      'why choose at&t business',
      'at&t business at work',
      'unlock value, deals, and growth for your business',
    ];
    const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[?.!:]+$/, '');
    element.querySelectorAll('.single-title, p, div, span').forEach((el) => {
      if (!SECTION_TITLES.includes(norm(el.textContent))) return;
      if (el.querySelector('a, img')) return;
      // Only act on the innermost matching element (no descendant also matches).
      if ([...el.children].some((c) => SECTION_TITLES.includes(norm(c.textContent)))) return;
      const h2 = element.ownerDocument.createElement('h2');
      h2.textContent = el.textContent.replace(/\s+/g, ' ').trim();
      el.replaceWith(h2);
    });

    // Strip non-authorable inline event handlers left on any remaining element.
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
  }
}
