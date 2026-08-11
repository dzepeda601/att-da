/* eslint-disable */
/* global WebImporter, Node */

/**
 * Transformer: AT&T Business (www.business.att.com) section handling.
 *
 * Adds EDS section breaks (<hr>) and Section Metadata blocks for the homepage
 * template (10 delivered sections; 5 carry a `style`).
 *
 * Runs in afterTransform ONLY. CRITICAL: by this point the block parsers have
 * already replaced the original source elements (div.foyer-comp children,
 * div.modular-card, div.simple-story, div.text-block, etc.) with EDS block
 * TABLES via element.replaceWith(). So the original source selectors in
 * payload.template.sections[].selector no longer match for block-bearing
 * sections. This transformer therefore anchors section boundaries on the
 * POST-PARSE DOM:
 *   - block tables, identified by their first-cell block-name text
 *     (e.g. "Columns (feature)"), and
 *   - default-content section titles, identified by exact text
 *     (these are non-semantic elements on this site, not <h2>).
 *
 * Because the block tables and default-content live at differing depths, we
 * work off a single document-order index of every element and insert <hr> /
 * Section Metadata relative to concrete element references (depth-independent:
 * the importer serializes the tree in document order, so an <hr> placed
 * immediately before an element's start reads as a section break there).
 *
 * Delivered sections (in order) with styles:
 *   1 Hero + products    brand-blue   first "Hero" block
 *   2 Bundles banner       -          "Columns (banner)"
 *   3 Why choose           -          title "Why choose AT&T Business?" / "Columns (feature)" #1
 *   4 Testimonial        light-blue   "Columns (testimonial)"
 *   5 AT&T at work          -          title "AT&T Business at work" / "Columns (story)"
 *   6 Guarantee banner   light-blue   title "Your connection, our guarantee" (default content)
 *   7 Guarantee features    -          "Columns (feature)" #2
 *   8 Unlock offers         -          title "Unlock value..." / "Columns (offer)"
 *   9 Sales CTA           light-grey  title "Talk to an AT&T Business sales expert" / "Columns (cta)"
 *  10 Looking for more    light-grey  title "Looking for more?" / "Columns (links)"
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function norm(s) {
  return (s || '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/[?.!:]+$/, '');
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = payload && payload.document;
  if (!document) return;

  const root = element || document.body;

  // Single document-order index of every element in the subtree.
  const allEls = [...root.querySelectorAll('*')];
  const orderIdx = new Map();
  allEls.forEach((el, i) => orderIdx.set(el, i));

  // A block table's first cell holds its block name, e.g. "Columns (feature)".
  const tableName = (table) => {
    const cell = table.querySelector('td, th');
    return norm(cell ? cell.textContent : '');
  };
  const tables = allEls
    .filter((el) => el.tagName === 'TABLE')
    .map((el) => ({ el, idx: orderIdx.get(el), name: tableName(el) }));

  // Find the Nth (1-based) block table whose name starts with `name`, at/after `from` order index.
  const findBlock = (name, from, occurrence = 1) => {
    const n = norm(name);
    let seen = 0;
    for (const t of tables) {
      if (t.idx >= from && t.name.startsWith(n)) {
        seen += 1;
        if (seen === occurrence) return t;
      }
    }
    return null;
  };

  // Find the tightest (smallest-subtree) default-content element whose exact text === `text`,
  // excluding anything inside a block table, at/after `from` order index.
  const findTitle = (text, from) => {
    const target = norm(text);
    let best = null;
    for (const el of allEls) {
      const i = orderIdx.get(el);
      if (i < from) continue;
      if (el.closest('table')) continue; // titles are default content, never inside a block
      if (norm(el.textContent) !== target) continue;
      const size = el.querySelectorAll('*').length;
      if (!best || size < best.size) best = { el, idx: i, size };
    }
    return best;
  };

  // earliest of a title anchor and a block anchor (either may be null).
  const earliest = (a, b) => {
    if (a && b) return a.idx <= b.idx ? a : b;
    return a || b || null;
  };

  // Resolve each section's start anchor sequentially so duplicate blocks
  // (two "Hero", two "Columns (feature)") are disambiguated by position.
  const specs = [];
  let cursor = 0;
  const add = (anchor, style) => {
    if (anchor) {
      specs.push({ el: anchor.el, idx: anchor.idx, style });
      cursor = anchor.idx + 1;
    }
  };

  add(findBlock('Hero', 0, 1), 'brand-blue');                                    // 1
  add(findBlock('Columns (banner)', cursor), null);                             // 2
  add(earliest(findTitle('Why choose AT&T Business', cursor),
    findBlock('Columns (feature)', cursor, 1)), null);                          // 3
  add(findBlock('Columns (testimonial)', cursor), 'light-blue');                // 4
  add(earliest(findTitle('AT&T Business at work', cursor),
    findBlock('Columns (story)', cursor)), null);                               // 5
  add(findTitle('Your connection, our guarantee', cursor), 'light-blue');       // 6
  add(findBlock('Columns (feature)', cursor, 1), null);                         // 7 (next feature after cursor)
  add(earliest(findTitle('Unlock value, deals, and growth for your business', cursor),
    findBlock('Columns (offer)', cursor)), null);                               // 8
  add(earliest(findTitle('Talk to an AT&T Business sales expert', cursor),
    findBlock('Columns (cta)', cursor)), 'light-grey');                         // 9
  add(earliest(findTitle('Looking for more', cursor),
    findBlock('Columns (links)', cursor)), 'light-grey');                       // 10

  if (!specs.length) return;

  // Pass A: Section Metadata for styled sections. Insert immediately before the
  // NEXT section's start element (so it reads as the last thing in the current
  // section); for the final section, append at document end.
  specs.forEach((s, i) => {
    if (!s.style) return;
    const meta = WebImporter.Blocks.createBlock(document, {
      name: 'Section Metadata',
      cells: { style: s.style },
    });
    const next = specs[i + 1];
    if (next && next.el.parentNode) {
      next.el.parentNode.insertBefore(meta, next.el);
    } else {
      root.appendChild(meta);
    }
  });

  // Pass B: Section breaks. Insert <hr> immediately before each section start,
  // except the first. Runs after Pass A so the <hr> sits between a preceding
  // section's metadata and the next section's start.
  specs.forEach((s, i) => {
    if (i === 0) return;
    if (!s.el.parentNode) return;
    const hr = document.createElement('hr');
    s.el.parentNode.insertBefore(hr, s.el);
  });
}
