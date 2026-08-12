/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: AT&T Business bundles page section handling.
 *
 * Adds EDS section breaks (<hr>) between the delivered sections. Runs in
 * afterTransform ONLY — by this point block parsers have replaced the original
 * source elements with EDS block TABLES, so section boundaries are anchored on
 * the POST-PARSE DOM:
 *   - block tables, identified by first-cell block-name text
 *     (e.g. "Cards (feature)"), and
 *   - default-content section titles, identified by exact text.
 *
 * The bundles page is visually all-white, so no Section Metadata styles are
 * emitted — only <hr> breaks so each delivered region becomes its own EDS
 * section. Modeled on attbusiness-sections.js (homepage).
 *
 * Delivered sections (in order):
 *   1 Fiber hero            "Hero" #1
 *   2 Reward offer          "Columns (offer)"
 *   3 Edge value props      title "Give your organization an edge…" / "Cards (feature)" #1
 *   4 Bundle hero           "Hero" #2
 *   5 Choose the bundle     title "Choose the bundle…" / "Cards (bundle)"
 *   6 Risk-free value props  title "30 days. Your call." / "Cards (feature)" #2
 *   7 FAQ                    title "Frequently asked questions" / "Accordion" #1
 *   8 SEO bundles           "Accordion" #2
 *   9 Sales form            title "Talk to an AT&T Business sales expert"
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

function norm(s) {
  return (s || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[?.!:]+$/, '');
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const document = payload && payload.document;
  if (!document) return;
  const root = element || document.body;

  const allEls = [...root.querySelectorAll('*')];
  const orderIdx = new Map();
  allEls.forEach((el, i) => orderIdx.set(el, i));

  const tableName = (table) => {
    const cell = table.querySelector('td, th');
    return norm(cell ? cell.textContent : '');
  };
  const tables = allEls
    .filter((el) => el.tagName === 'TABLE')
    .map((el) => ({ el, idx: orderIdx.get(el), name: tableName(el) }));

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

  const findTitle = (text, from) => {
    const target = norm(text);
    let best = null;
    for (const el of allEls) {
      const i = orderIdx.get(el);
      if (i < from) continue;
      if (el.closest('table')) continue;
      if (norm(el.textContent) !== target) continue;
      const size = el.querySelectorAll('*').length;
      if (!best || size < best.size) best = { el, idx: i, size };
    }
    return best;
  };

  const earliest = (a, b) => {
    if (a && b) return a.idx <= b.idx ? a : b;
    return a || b || null;
  };

  const specs = [];
  let cursor = 0;
  const add = (anchor) => {
    if (anchor) {
      specs.push({ el: anchor.el, idx: anchor.idx });
      cursor = anchor.idx + 1;
    }
  };

  add(findBlock('Hero', 0, 1));                                                   // 1
  add(findBlock('Columns (offer)', cursor));                                     // 2
  add(earliest(findTitle('Give your organization an edge with an AT&T Business bundle', cursor),
    findBlock('Cards (feature)', cursor, 1)));                                   // 3
  add(findBlock('Hero', cursor, 1));                                             // 4
  add(earliest(findTitle("Choose the bundle that’s right for your business", cursor),
    findBlock('Cards (bundle)', cursor)));                                       // 5
  add(earliest(findTitle('30 days. Your call.', cursor),
    findBlock('Cards (feature)', cursor, 1)));                                   // 6
  add(earliest(findTitle('Frequently asked questions', cursor),
    findBlock('Accordion', cursor, 1)));                                         // 7
  add(findBlock('Accordion', cursor, 1));                                        // 8
  add(findTitle('Talk to an AT&T Business sales expert', cursor));               // 9

  if (!specs.length) return;

  // Section breaks: <hr> immediately before each section start except the first.
  specs.forEach((s, i) => {
    if (i === 0) return;
    if (!s.el.parentNode) return;
    const hr = document.createElement('hr');
    s.el.parentNode.insertBefore(hr, s.el);
  });
}
