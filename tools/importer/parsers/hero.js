/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero
 * Base block: hero
 * Source: https://www.business.att.com/ (div.foyer-comp)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Library convention (hero): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: single cell = background image (optional)
 *   Row 3: single cell = Title (heading) + Subheading + optional CTA
 *
 * The matched element (div.foyer-comp) also contains the product/feature card
 * grids, so extraction is scoped to the hero portion only:
 *   - background image: .foyerComp__mural img
 *   - headline:         the single h1
 *   - supporting text:  copy in .foyerComp__text-content after the h1
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('.foyerComp__mural img, .foyerComp__brochure img');
  const heading = element.querySelector('.foyerComp__text-content h1, h1');

  // Supporting tagline copy sits in a wysiwyg div beside the h1 (not a <p>).
  const textContent = element.querySelector('.foyerComp__text-content');
  let subheading = null;
  if (textContent) {
    const copy = [...textContent.children].find(
      (el) => el !== heading && el.textContent.trim(),
    );
    if (copy) {
      subheading = document.createElement('p');
      subheading.textContent = copy.textContent.trim();
    }
  }

  // Empty-block guard: without heading or image there is no hero to build.
  if (!heading && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (heading + subheading).
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
