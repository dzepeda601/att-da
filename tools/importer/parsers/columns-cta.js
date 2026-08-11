/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-cta
 * Base block: columns
 * Source: https://www.business.att.com/ (div.multi-tile-cards)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Two equal side-by-side CTA tiles. Library convention (columns): flexible;
 * row 1 = block name; the content row holds N cells = N columns. This is a
 * single row with two cells, one per tile:
 *   Cell 1 (Call an expert): heading + supporting text + hours fine print
 *                            + filled 'Call ...' button.
 *   Cell 2 (Schedule a call): heading + supporting text + outline
 *                             'Contact us' button.
 *
 * The section heading ('Talk to an AT&T Business sales expert') lives in the
 * multi-cta-heading region and is authored as leading default content by the
 * section transformer, so it is intentionally excluded from this block.
 */
export default function parse(element, { document }) {
  // One tile per column. Select only the outer .tile-card wrappers — NOT the
  // inner .card too, or a parent+child pair would double each column.
  const tiles = element.querySelectorAll('.tile-card');

  const rowCells = [];

  tiles.forEach((tile) => {
    const cell = [];

    // Eyebrow (usually empty on this page; include only if it has text).
    const eyebrow = tile.querySelector('.eyebrow-text');
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      cell.push(p);
    }

    // Heading.
    const headingEl = tile.querySelector('.js-heading-section, h3, .heading-md');
    if (headingEl && headingEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      cell.push(h3);
    }

    // Supporting text.
    const body = tile.querySelector('.js-textBody-section, .tileSubheading');
    if (body) cell.push(body);

    // Hours / legal fine print (optional).
    const legal = tile.querySelector('.cardlegal, .type-legal-wysiwyg-editor');
    if (legal) cell.push(legal);

    // CTA button.
    const cta = tile.querySelector('.cta-container a[href], a.tile-anchor[href]');
    if (cta) cell.push(cta);

    if (cell.length) rowCells.push(cell);
  });

  // Empty-block guard.
  if (!rowCells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section heading ("Talk to an AT&T Business sales expert") lives inside this
  // block node, so it would be lost when the block replaces `element`. Emit it
  // as a leading <h2> (default content) before the block to preserve the
  // heading hierarchy.
  const sectionTitleEl = element.querySelector('.multi-cta-heading, .js-title, h2');
  let heading = null;
  if (sectionTitleEl && sectionTitleEl.textContent.trim()) {
    heading = document.createElement('h2');
    heading.textContent = sectionTitleEl.textContent.replace(/\s+/g, ' ').trim();
  }

  // Single row, one cell per tile (two columns).
  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['cta'], cells });
  if (heading) {
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
