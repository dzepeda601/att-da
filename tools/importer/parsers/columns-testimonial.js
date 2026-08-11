/* eslint-disable */
/* global WebImporter */
/**
 * Parser for variant: columns-testimonial
 * Base block: columns
 * Source: https://www.business.att.com/ (div.text-block)
 * Generated for AT&T Business homepage migration (da project).
 *
 * Library convention (columns): flexible; row 1 = block name; the content row
 * holds N cells = N columns. This testimonial is a single row, two cells:
 *   [ portrait photo | (quote + attribution [name, role, org] + UT logo
 *                       + 'Watch the video' link) ].
 *
 * The decorative oversized quotation-mark ornament image is intentionally
 * dropped (presentational only, no informational content).
 */
export default function parse(element, { document }) {
  const portrait = element.querySelector('.uf-testimonial__media img, figure img');
  const quote = element.querySelector('.uf-testimonial__quote, blockquote');

  // Attribution + logo live inside the footer/speaker region.
  const speakerLogo = element.querySelector('.uf-testimonial__speaker-logo');
  const name = element.querySelector('.uf-testimonial__name');
  const role = element.querySelector('.uf-testimonial__title');
  const org = element.querySelector('.uf-testimonial__org');
  const videoLink = element.querySelector('.uf-testimonial__cta[href], a.video-modal[href]');

  // Empty-block guard.
  if (!portrait && !quote) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left cell: portrait photo.
  const imageCell = portrait || '';

  // Right cell: quote + attribution + logo + video link.
  const contentCell = [];
  if (quote) contentCell.push(quote);
  if (speakerLogo) contentCell.push(speakerLogo);
  if (name) contentCell.push(name);
  if (role) contentCell.push(role);
  if (org) contentCell.push(org);
  if (videoLink) contentCell.push(videoLink);

  const cells = [[imageCell, contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', variants: ['testimonial'], cells });
  element.replaceWith(block);
}
