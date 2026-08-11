/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-feature
 * Base block: columns
 * Source: https://www.business.att.com/ (div.modular-card, nth-of-type 4 & 9)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Used by BOTH the "Why choose" grid (4 items, .modular-card-comp--reason-to-believe)
 * and the "Guarantee features" grid (3 items, .modular-card-comp--promise).
 *
 * Library convention (columns): flexible; row 1 = block name; each subsequent
 * row holds N cells = N columns. Here each feature item is ONE row with two
 * cells: [ image | text ]. Every row emits image first (block CSS alternates
 * the visual side via nth-child).
 *
 * Text cell = optional line icon + heading + description + optional fine print
 * (which may carry an inline link such as 'See details' or 'att.com/...').
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('section.modular-card-comp, article.modular-card-comp');

  const cells = [];

  items.forEach((item) => {
    // Large media photo -> image cell (fall back to icon if no media photo).
    const media = item.querySelector('.modular-card-comp__media img');
    const icon = item.querySelector('.modular-card-comp__icon img');
    const imageCell = media || icon || '';

    // Text cell.
    const textCell = [];

    // Keep the decorative line icon inline only when a media photo is the main
    // image (so the icon isn't dropped).
    if (media && icon) textCell.push(icon);

    // Heading (source uses a styled div, not a real heading element).
    const headingEl = item.querySelector('.heading-sm, .heading-md, .heading-lg');
    if (headingEl && headingEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      textCell.push(h3);
    }

    // Description (distinct class token, mutually exclusive from fine print).
    const desc = item.querySelector('.wysiwyg-editor');
    if (desc) textCell.push(desc);

    // Optional fine print, preserving any inline link.
    const legal = item.querySelector('.type-legal-wysiwyg-editor');
    if (legal) textCell.push(legal);

    if (textCell.length || imageCell) cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['feature'], cells });
  element.replaceWith(block);
}
