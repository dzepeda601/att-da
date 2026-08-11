/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-story
 * Base block: columns
 * Source: https://www.business.att.com/ (div.modular-card:nth-of-type(7))
 * Generated for AT&T Business homepage migration (da project).
 *
 * Five customer-story items (Dallas Cowboys, Gullo's, Airstream, City of
 * Danville, Wintrust). Library convention (columns): flexible; row 1 = block
 * name; each subsequent row holds N cells = N columns. Each story item is ONE
 * row with two cells: [ photo | text ]. Every row emits the photo first (block
 * CSS alternates the visual side via nth-child).
 *
 * Text cell = uppercase category eyebrow + heading (customer) + description
 *             + 'Products used' list of links.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('article.modular-card-comp, section.modular-card-comp');

  const cells = [];

  items.forEach((item) => {
    // Photo (the media anchor wraps the image) -> image cell.
    const photo = item.querySelector('.modular-card-comp__media img');
    const imageCell = photo || '';

    // Text cell.
    const textCell = [];

    // Category eyebrow (uppercase tag link) -> keep as an emphasized paragraph.
    const tag = item.querySelector('.modular-card-comp__tag');
    if (tag && tag.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = tag.textContent.trim();
      p.append(em);
      textCell.push(p);
    }

    // Heading (customer name).
    const headingEl = item.querySelector('.heading-md, .heading-sm, .heading-lg');
    if (headingEl && headingEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      textCell.push(h3);
    }

    // Description.
    const desc = item.querySelector('.wysiwyg-editor');
    if (desc) textCell.push(desc);

    // 'Products used' block: title + list of links.
    const sponsor = item.querySelector('.modular-card-comp__sponsor');
    if (sponsor) {
      const sponsorTitle = sponsor.querySelector('.modular-card-comp__sponsor-title');
      if (sponsorTitle && sponsorTitle.textContent.trim()) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = sponsorTitle.textContent.trim();
        p.append(strong);
        textCell.push(p);
      }
      const list = sponsor.querySelector('.modular-card-comp__sponsor-list, ul');
      if (list) textCell.push(list);
    }

    if (textCell.length || imageCell) cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['story'], cells });
  element.replaceWith(block);
}
