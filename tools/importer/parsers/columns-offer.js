/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-offer
 * Base block: columns
 * Source: https://www.business.att.com/ (div.modular-card:nth-of-type(11))
 * Generated for AT&T Business homepage migration (da project).
 *
 * Five promotional offer items (Visa Reward Card, Business Unlimited Ultimate
 * 3.0, Switch Assist, iPhone 17 Pro, Samsung Galaxy S26). Library convention
 * (columns): flexible; row 1 = block name; each subsequent row holds N cells =
 * N columns. Each offer is ONE row with two cells: [ image | text ]. Every row
 * emits the image first (block CSS alternates the visual side via nth-child).
 *
 * Text cell = heading + description + optional fine print (with 'See details'
 *             inline link) + CTA button.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('section.modular-card-comp, article.modular-card-comp');

  const cells = [];

  items.forEach((item) => {
    // Large offer image -> image cell.
    const img = item.querySelector('.modular-card-comp__media img');
    const imageCell = img || '';

    // Text cell.
    const textCell = [];

    // Heading.
    const headingEl = item.querySelector('.heading-md, .heading-sm, .heading-lg');
    if (headingEl && headingEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      textCell.push(h3);
    }

    // Description.
    const desc = item.querySelector('.wysiwyg-editor');
    if (desc) textCell.push(desc);

    // Optional fine print, preserving the inline 'See details' link.
    const legal = item.querySelector('.type-legal-wysiwyg-editor');
    if (legal) textCell.push(legal);

    // CTA button.
    const cta = item.querySelector('.modular-card-comp__actions a[href], a.btn[href]');
    if (cta) textCell.push(cta);

    if (textCell.length || imageCell) cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['offer'], cells });
  element.replaceWith(block);
}
