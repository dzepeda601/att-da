/* eslint-disable */
/* global WebImporter */
/**
 * Parser for block: accordion (bundles page)
 * Base block: accordion
 * Source: https://www.business.att.com/bundles.html (div.accordion-panel)
 *
 * Content model (Accordion): each row = two cells [ summary/question | answer ].
 *
 * Two shapes share this parser:
 *   1. FAQ panel — multiple [role="tablist"] items, each with a question button
 *      and one or more answer paragraphs.
 *   2. SEO disclosure panel — a single collapsible with a title and a run of
 *      sub-heading/paragraph prose; emitted as one accordion row whose body is
 *      all the prose.
 * The panel's own <h2> ("Frequently asked questions") is left in place for the
 * sections transformer to keep as default content.
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('[role="tablist"]');
  const cells = [];

  if (items.length) {
    // FAQ shape: one row per question.
    items.forEach((item) => {
      const q = item.querySelector('[role="tab"], button');
      const question = q ? q.textContent.replace(/\s+/g, ' ').trim() : '';
      if (!question) return;

      const answerCell = [];
      // Answer = every <p> in the item that is not the question button text.
      item.querySelectorAll('p').forEach((p) => {
        const t = p.textContent.replace(/\s+/g, ' ').trim();
        if (t && t !== question) {
          const para = document.createElement('p');
          para.textContent = t;
          answerCell.push(para);
        }
      });

      const summary = document.createElement('p');
      summary.textContent = question;
      cells.push([[summary], answerCell.length ? answerCell : ['']]);
    });
  } else {
    // Single disclosure panel: title + prose.
    const title = element.querySelector('[role="tab"], button, h2, h3');
    const summaryText = title ? title.textContent.replace(/\s+/g, ' ').trim() : 'Details';
    const bodyCell = [];
    element.querySelectorAll('p').forEach((p) => {
      const t = p.textContent.replace(/\s+/g, ' ').trim();
      if (t && t !== summaryText) {
        const para = document.createElement('p');
        para.textContent = t;
        bodyCell.push(para);
      }
    });
    if (bodyCell.length) {
      const summary = document.createElement('p');
      summary.textContent = summaryText;
      cells.push([[summary], bodyCell]);
    }
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Section title (e.g. "Frequently asked questions") sits OUTSIDE the tablist
  // items → leading default content. The single SEO panel has no such heading
  // (its title becomes the accordion summary), so this only fires for the FAQ.
  const leading = [];
  const titleEl = [...element.querySelectorAll('h1, h2, h3')]
    .find((h) => !h.closest('[role="tablist"]'));
  if (titleEl && titleEl.textContent.trim()) {
    const h2 = document.createElement('h2');
    h2.textContent = titleEl.textContent.replace(/\s+/g, ' ').trim();
    leading.push(h2);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
  element.replaceWith(...leading, block);
}
