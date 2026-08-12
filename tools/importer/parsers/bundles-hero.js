/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: hero (bundles page)
 * Base block: hero
 * Source: https://www.business.att.com/bundles.html (div.hero)
 *
 * Library convention (hero): 1 column, up to 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: single cell = background/lifestyle image (optional)
 *   Row 3: single cell = eyebrow + Title (heading) + subhead(s) + inclusion
 *          list + CTA(s)
 *
 * Two hero bands exist on the page (fiber offer + bundle). Both share the same
 * DOM shape: an eyebrow element, an <h2>/<h1> heading, supporting <p> copy,
 * an optional checkmarked inclusion <ul>, and one or more CTA links. Fine-print
 * legal copy and the bare "See details" anchor are dropped (non-authorable).
 */
export default function parse(element, { document }) {
  const heading = element.querySelector('h1, h2');
  const img = element.querySelector('img');

  const contentCell = [];

  // Eyebrow: the styled element immediately before the heading.
  const eyebrowEl = heading && heading.previousElementSibling;
  if (eyebrowEl && eyebrowEl.textContent.trim() && !eyebrowEl.querySelector('img')) {
    const p = document.createElement('p');
    const em = document.createElement('em');
    em.textContent = eyebrowEl.textContent.replace(/\s+/g, ' ').trim();
    p.append(em);
    contentCell.push(p);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(h2);
  }

  // Supporting subhead: first meaningful <p> that is not fine print.
  const paras = [...element.querySelectorAll('p')].filter((p) => {
    const t = p.textContent.trim();
    if (!t) return false;
    if (/^(price|new customers only|ltd|based on|wireless|at&t may|\*|\d)/i.test(t)) return false;
    return true;
  });
  if (paras[0]) {
    const p = document.createElement('p');
    p.textContent = paras[0].textContent.replace(/\s+/g, ' ').trim();
    contentCell.push(p);
  }

  // Inclusion checklist (bundle hero) — carry the <ul> through.
  const list = element.querySelector('ul');
  if (list && list.querySelectorAll('li').length) {
    const ul = document.createElement('ul');
    list.querySelectorAll('li').forEach((li) => {
      const item = document.createElement('li');
      item.textContent = li.textContent.replace(/\s+/g, ' ').trim();
      ul.append(item);
    });
    contentCell.push(ul);
  }

  // CTAs: real navigational links (skip in-page "#" anchors like "See details").
  element.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const text = a.textContent.trim();
    if (!text) return;
    if (href === '#' || href.startsWith('#')) return;
    if (/^see details$/i.test(text)) return;
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.textContent = text;
    const strong = document.createElement('strong');
    strong.append(link);
    const p = document.createElement('p');
    p.append(strong);
    contentCell.push(p);
  });

  // Empty-block guard.
  if (!heading && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (img) cells.push([img]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
