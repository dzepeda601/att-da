/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-banner
 * Base block: columns
 * Source: https://www.business.att.com/ (div.simple-story)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Library convention (columns): flexible; row 1 = block name; subsequent rows
 * each hold N cells = N visual columns. This banner is a single row, two cells:
 *   [ image | (heading + 'Shop bundles' button) ].
 */
export default function parse(element, { document }) {
  let img = element.querySelector('.promo-image img, img');
  // The banner visual is set via CSS (an inline `--image-desktop: url(...)`
  // custom property on .promo-image, or a background-image), not an <img>. Pull
  // the URL from the inline style and build a real <img> for the picture.
  if (!img) {
    const bgEl = element.querySelector('.promo-image, [style*="url("]');
    const style = bgEl && bgEl.getAttribute('style');
    const match = style
      && style.match(/(?:--image-desktop|--image|background-image)\s*:\s*url\((['"]?)([^'")]+)\1\)/i);
    if (match) {
      let src = match[2];
      // Resolve site-relative URLs against the source origin.
      if (src.startsWith('/')) src = `https://www.business.att.com${src}`;
      img = document.createElement('img');
      img.src = src;
      const heading0 = element.querySelector('.promo-title, h1, h2, h3');
      img.alt = heading0 ? heading0.textContent.trim() : '';
    }
  }
  const heading = element.querySelector('.promo-title, h1, h2, h3');
  const cta = element.querySelector('.cta-container a[href], a.button-cta[href], a[href]');

  // Empty-block guard.
  if (!img && !heading && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left cell: image.
  const imageCell = img || '';

  // Right cell: heading + button.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (cta) contentCell.push(cta);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['banner'], cells });
  element.replaceWith(block);
}
