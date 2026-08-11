/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-product
 * Base block: cards
 * Source: https://www.business.att.com/ (div.foyer-comp .foyerComp__card-container)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Library convention (cards): 2 columns; row 1 = block name; each subsequent
 * row = one card: [ image/icon cell | text cell (heading, description, CTA) ].
 *
 * The matched element (.foyerComp__card-container) contains BOTH the two large
 * product cards (.foyerComp__featured-card-item) AND the four compact feature
 * cards (.foyerComp__standard-card-container). This parser owns ONLY the two
 * product cards; the feature cards are handled by cards-feature.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope .foyerComp__featured-card-item');

  const cells = [];

  cards.forEach((card) => {
    // Image cell (first column, mandatory).
    const img = card.querySelector('.foyerComp__featured-card-asset img, img');
    const imageCell = img || '';

    // Text cell (second column).
    const bodyCell = [];

    // Product name -> heading.
    const titleEl = card.querySelector('.js-title, .heading-lg');
    if (titleEl && titleEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      bodyCell.push(h3);
    }

    // Description.
    const desc = card.querySelector('.js-description, .foyerComp__featured-card-content p');
    if (desc) bodyCell.push(desc);

    // Price line + disclaimer (includes the 'See offer details' link).
    const price = card.querySelector('.foyerComp__featured-card-price');
    if (price) {
      const priceClone = price.cloneNode(true);
      // The amount ($ / 25 / /mo.) is split across inline spans separated by
      // whitespace, which serializes as "$ 25 /mo.". Collapse whitespace on the
      // amount grouping so it reads "$25/mo." without touching the disclaimers.
      priceClone.querySelectorAll('*').forEach((el) => {
        const t = el.textContent.replace(/\s+/g, ' ').trim();
        if (/^\$\s*[\d,.]+\s*\/\s*mo\.?$/i.test(t) && !el.querySelector('a, img')) {
          el.textContent = t.replace(/\s+/g, '');
        }
      });
      bodyCell.push(priceClone);
    }

    // 'Learn more' CTA (direct anchor of the card).
    const cta = card.querySelector(':scope > a[href], a.btn[href]');
    if (cta) bodyCell.push(cta);

    if (bodyCell.length || imageCell) cells.push([imageCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', variants: ['product'], cells });
  element.replaceWith(block);
}
