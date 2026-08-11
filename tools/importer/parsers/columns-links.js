/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-links
 * Base block: columns
 * Source: https://www.business.att.com/ (div.link-farm)
 * Generated for AT&T Business homepage migration (da project).
 *
 * A four-column directory of related text links. Library convention (columns):
 * flexible; row 1 = block name; the content row holds N cells = N columns.
 * This is a single row with four cells, one per column; each cell holds that
 * column's <ul> list of links.
 *
 * The source renders the directory TWICE — once in .desktop-view-and-tablet
 * and again in .mobile-view. Scope to the desktop view only so links are not
 * duplicated. The section heading ('Looking for more?') is authored as leading
 * default content by the section transformer, so it is excluded here.
 */
export default function parse(element, { document }) {
  const scope = element.querySelector('.desktop-view-and-tablet') || element;

  // Each accordion-item is one directory column.
  let columns = scope.querySelectorAll('.accordion-item');

  // Fallback: derive columns directly from the link lists.
  if (!columns.length) columns = scope.querySelectorAll('.accordion-panel');

  const rowCells = [];

  columns.forEach((col) => {
    // Prefer the list; fall back to the column's own contents.
    const list = col.querySelector('ul.accordion-panel, ul') || col;
    if (list && list.querySelector('a[href]')) {
      rowCells.push(list);
    }
  });

  // Empty-block guard.
  if (!rowCells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section heading ("Looking for more?") lives inside this block node and
  // would be lost when the block replaces `element`. Emit it as a leading <h2>
  // (default content) before the block to preserve the heading hierarchy.
  // Take the section title, not a column/link — restrict to heading-ish nodes.
  const titleEl = element.querySelector('.link-farm-title, .js-title, h2, .heading-lg');
  let heading = null;
  if (titleEl && titleEl.textContent.trim() && !titleEl.querySelector('a')) {
    heading = document.createElement('h2');
    heading.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
  }

  // Single row, one cell per column.
  const cells = [rowCells];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['links'], cells });
  if (heading) {
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
