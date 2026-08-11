/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-feature
 * Base block: cards
 * Source: https://www.business.att.com/
 *   (div.foyer-comp .foyerComp__standard-card-container)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Library convention (cards): 2 columns; row 1 = block name; each subsequent
 * row = one card: [ icon/image cell | text cell (heading, description, CTA) ].
 *
 * Four compact feature cards (Voice, Security, Networking, IoT). Each card:
 *   - icon: .foyerComp__icon-container img
 *   - heading: dt.standard-card-eyebrow
 *   - description: dd p.standard-card-description (+ optional legal fine print)
 *   - CTA: footer a 'Learn more'
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope .foyerComp__standard-card-item');

  const cells = [];

  cards.forEach((card) => {
    // Icon cell (first column, mandatory).
    const icon = card.querySelector('.foyerComp__icon-container img, img');
    const iconCell = icon || '';

    // Text cell (second column).
    const bodyCell = [];

    // Heading (eyebrow term).
    const titleEl = card.querySelector('dt.standard-card-eyebrow, dt');
    if (titleEl && titleEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      bodyCell.push(h3);
    }

    // Description + any legal fine print (all <p> inside the definition).
    const paras = card.querySelectorAll('dd p, .foyerComp__regular-definition dd p');
    paras.forEach((p) => bodyCell.push(p));

    // 'Learn more' CTA.
    const cta = card.querySelector('footer a[href], a.link-standalone[href]');
    if (cta) bodyCell.push(cta);

    if (bodyCell.length || iconCell) cells.push([iconCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', variants: ['feature'], cells });
  element.replaceWith(block);
}
