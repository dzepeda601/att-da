/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-feature (bundles page value-prop grid)
 * Base block: cards
 * Source: https://www.business.att.com/bundles.html
 *   (div.generic-list-value-prop)
 *
 * Library convention (cards): 2 columns; row 1 = block name; each subsequent
 * row = one card: [ icon/image cell | text cell (heading, description, CTA) ].
 *
 * Each value-prop item lives in .generic-list-icon-vp > div and holds an icon
 * <img>, an <h4> heading, and one or more <p> descriptions. A trailing item may
 * carry its own "Learn more" CTA. The section's own <h1>/eyebrow and legal
 * fine print are left in place (promoted to default content by the sections
 * transformer / handled outside the block).
 */
export default function parse(element, { document }) {
  // One card per value-prop item. The items may sit directly under
  // .generic-list-icon-vp OR be wrapped in a .generic-list-icon-vp-row, and one
  // item can carry an extra nesting level. Rather than guess the wrapper, find
  // the lowest common ancestor of every <h4> and treat its heading-bearing
  // children as the items — robust to either layout.
  const headings = [...element.querySelectorAll('h4')];
  let items = [];
  if (headings.length) {
    let lca = headings[0].parentElement;
    while (lca && !headings.every((h) => lca.contains(h))) lca = lca.parentElement;
    if (lca) items = [...lca.children].filter((c) => c.querySelector('h4'));
  }

  const cells = [];

  items.forEach((item) => {
    if (!item) return;
    const icon = item.querySelector('img');
    const iconCell = icon || '';

    const bodyCell = [];

    const titleEl = item.querySelector('h4, h3');
    if (titleEl && titleEl.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
      bodyCell.push(h3);
    }

    item.querySelectorAll('p').forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement('p');
        para.textContent = p.textContent.replace(/\s+/g, ' ').trim();
        bodyCell.push(para);
      }
    });

    // Optional CTA within the item (e.g. the Guarantee "Learn more").
    const cta = item.querySelector('a[href]');
    if (cta && cta.getAttribute('href') && cta.getAttribute('href') !== '#') {
      const link = document.createElement('a');
      link.setAttribute('href', cta.getAttribute('href'));
      link.textContent = cta.textContent.trim();
      const strong = document.createElement('strong');
      strong.append(link);
      const p = document.createElement('p');
      p.append(strong);
      bodyCell.push(p);
    }

    if (bodyCell.length || iconCell) cells.push([iconCell, bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section title (H1/H3 that sits OUTSIDE the item grid) → leading default
  // content, so it survives as an EDS section heading rather than being
  // discarded with the replaced source div.
  const leading = [];
  const titleEl = [...element.querySelectorAll('h1, h2, h3')]
    .find((h) => !h.closest('.generic-list-icon-vp'));
  if (titleEl && titleEl.textContent.trim()) {
    // Optional eyebrow directly before the title.
    const eyebrow = titleEl.previousElementSibling;
    if (eyebrow && eyebrow.textContent.trim() && !eyebrow.querySelector('a, img')
      && !/^h[1-6]$/i.test(eyebrow.tagName)) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = eyebrow.textContent.replace(/\s+/g, ' ').trim();
      p.append(em);
      leading.push(p);
    }
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    leading.push(h2);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', variants: ['feature'], cells });
  element.replaceWith(...leading, block);
}
