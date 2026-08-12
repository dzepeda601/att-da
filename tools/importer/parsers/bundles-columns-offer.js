/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-offer (bundles page reward-card offer)
 * Base block: columns
 * Source: https://www.business.att.com/bundles.html (div.offer)
 *
 * Library convention (columns): row 1 = block name; each subsequent row holds
 * N cells = N columns. One offer row with two cells: [ image | text ].
 *
 * Single reward-card promo: illustrated Visa reward-card image + heading +
 * supporting line + fine print (with inline "See details") + a "Check
 * availability" CTA.
 */
export default function parse(element, { document }) {
  const img = element.querySelector('img');
  const imageCell = img || '';

  const textCell = [];

  const headingEl = element.querySelector('h1, h2, h3');
  if (headingEl && headingEl.textContent.trim()) {
    const h3 = document.createElement('h3');
    h3.textContent = headingEl.textContent.replace(/\s+/g, ' ').trim();
    textCell.push(h3);
  }

  element.querySelectorAll('p').forEach((p) => {
    if (p.textContent.trim()) {
      const para = document.createElement('p');
      para.textContent = p.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(para);
    }
  });

  // Primary CTA (skip in-page "See details").
  const cta = [...element.querySelectorAll('a[href]')].find((a) => {
    const href = a.getAttribute('href') || '';
    return href && href !== '#' && !/^see details$/i.test(a.textContent.trim());
  });
  if (cta) {
    const link = document.createElement('a');
    link.setAttribute('href', cta.getAttribute('href'));
    link.textContent = cta.textContent.trim();
    const strong = document.createElement('strong');
    strong.append(link);
    const p = document.createElement('p');
    p.append(strong);
    textCell.push(p);
  }

  // Empty-block guard.
  if (!textCell.length && !imageCell) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['offer'], cells: [[imageCell, textCell]] });
  element.replaceWith(block);
}
