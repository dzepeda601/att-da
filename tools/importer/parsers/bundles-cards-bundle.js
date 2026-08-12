/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: cards-bundle (bundles page "Choose the bundle" tiles)
 * Base block: cards
 * Source: https://www.business.att.com/bundles.html (div.multi-tile-cards)
 *
 * Library convention (cards): 2 columns; row 1 = block name; each subsequent
 * row = one card: [ image cell | text cell ].
 *
 * Two large bundle tiles (.tile-card). Each tile:
 *   - image: .tile-card img (lifestyle/product photo)
 *   - eyebrow: leading <p> (e.g. "Fiber + phone bundle")
 *   - heading: <h3>
 *   - price/inclusions: intro <p> + checkmarked <ul>
 *   - fine print + "See offer details" inline link
 *   - primary CTA (Check availability / Learn more)
 * The section heading ("Choose the bundle…") is handled as default content
 * outside the block.
 */
export default function parse(element, { document }) {
  const tiles = element.querySelectorAll('.tile-card');

  const cells = [];

  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    const imageCell = img || '';

    const textCell = [];

    // Eyebrow (first <p> before the heading).
    const h3El = tile.querySelector('h3');
    const eyebrow = h3El && h3El.previousElementSibling
      && h3El.previousElementSibling.tagName === 'P'
      ? h3El.previousElementSibling : null;
    if (eyebrow && eyebrow.textContent.trim()) {
      const p = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = eyebrow.textContent.replace(/\s+/g, ' ').trim();
      p.append(em);
      textCell.push(p);
    }

    // Heading.
    if (h3El && h3El.textContent.trim()) {
      const h3 = document.createElement('h3');
      h3.textContent = h3El.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(h3);
    }

    // Price/intro line: the <p> that introduces the inclusion list.
    const intro = [...tile.querySelectorAll('p')].find((p) => /start|save|includes|you.ll get|plus/i.test(p.textContent));
    if (intro) {
      const p = document.createElement('p');
      p.textContent = intro.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(p);
    }

    // Inclusion checklist.
    const list = tile.querySelector('ul');
    if (list && list.querySelectorAll('li').length) {
      const ul = document.createElement('ul');
      list.querySelectorAll('li').forEach((li) => {
        const item = document.createElement('li');
        item.textContent = li.textContent.replace(/\s+/g, ' ').trim();
        ul.append(item);
      });
      textCell.push(ul);
    }

    // Primary CTA (skip the in-page "See offer details" anchor).
    const cta = [...tile.querySelectorAll('a[href]')].find((a) => {
      const href = a.getAttribute('href') || '';
      return href && href !== '#' && !/^see offer details$/i.test(a.textContent.trim());
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

    if (textCell.length || imageCell) cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section title ("Choose the bundle…") + the "Or call us…" line sit OUTSIDE
  // the tiles → leading default content.
  const leading = [];
  const titleEl = [...element.querySelectorAll('h1, h2, h3')]
    .find((h) => !h.closest('.tile-card'));
  if (titleEl && titleEl.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    leading.push(h2);
    // Supporting line right after the title (e.g. "Or call us at …").
    const next = titleEl.nextElementSibling;
    if (next && next.tagName === 'P' && next.textContent.trim() && !next.closest('.tile-card')) {
      const p = document.createElement('p');
      p.textContent = next.textContent.replace(/\s+/g, ' ').trim();
      leading.push(p);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', variants: ['bundle'], cells });
  element.replaceWith(...leading, block);
}
