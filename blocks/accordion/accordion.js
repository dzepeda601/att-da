import { createTag } from '../../scripts/shared.js';

/*
 * Accordion block — inline authored expandable content.
 *
 * Content model (Block Collection "Accordion"): each authored row is one item
 * with two cells:
 *   | Accordion            |                                   |
 *   | ---------------------|-----------------------------------|
 *   | Question / summary   | Answer / details (rich content)   |
 *
 * Unlike the local "faq" block (which fetches an external /faq-index.json),
 * this block renders the rows the author typed directly, so it works for both
 * a list of Q&A items and a single long-form disclosure panel.
 *
 * Rendered as native <details>/<summary> for built-in keyboard accessibility.
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const summaryCell = cells[0];
    const bodyCell = cells[1];

    // Skip malformed rows (need at least a label).
    if (!summaryCell) return;

    const details = createTag('details', { class: 'accordion-item' });

    const summary = createTag('summary', { class: 'accordion-item-label' });
    // Move the authored label content into the summary (preserve links/markup).
    while (summaryCell.firstChild) summary.append(summaryCell.firstChild);
    // A wrapper lets us style the label text and the chevron independently.
    const labelText = createTag('span', { class: 'accordion-item-title' });
    while (summary.firstChild) labelText.append(summary.firstChild);
    summary.append(labelText);

    const body = createTag('div', { class: 'accordion-item-body' });
    if (bodyCell) {
      while (bodyCell.firstChild) body.append(bodyCell.firstChild);
    }

    details.append(summary, body);
    row.replaceWith(details);
  });
}
