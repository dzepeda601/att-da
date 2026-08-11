/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsBannerParser from './parsers/columns-banner.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsTestimonialParser from './parsers/columns-testimonial.js';
import columnsStoryParser from './parsers/columns-story.js';
import columnsOfferParser from './parsers/columns-offer.js';
import columnsCtaParser from './parsers/columns-cta.js';
import columnsLinksParser from './parsers/columns-links.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/attbusiness-cleanup.js';
import sectionsTransformer from './transformers/attbusiness-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards-product': cardsProductParser,
  'cards-feature': cardsFeatureParser,
  'columns-banner': columnsBannerParser,
  'columns-feature': columnsFeatureParser,
  'columns-testimonial': columnsTestimonialParser,
  'columns-story': columnsStoryParser,
  'columns-offer': columnsOfferParser,
  'columns-cta': columnsCtaParser,
  'columns-links': columnsLinksParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: "AT&T Business homepage: hero with product cards, bundles banner, 'Why choose' feature grid, testimonial, customer-story cards, guarantee feature grid, promotional offer cards, sales-expert CTA, and a link directory.",
  urls: [
    'https://www.business.att.com/',
  ],
  blocks: [
    { name: 'hero', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__brochure'] },
    { name: 'cards-product', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__featured-card-container'] },
    { name: 'cards-feature', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__standard-card-container'] },
    { name: 'columns-banner', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.simple-story'] },
    { name: 'columns-feature', instances: [
      '#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(4)',
      '#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(9)',
    ] },
    { name: 'columns-testimonial', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.text-block'] },
    { name: 'columns-story', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(7)'] },
    { name: 'columns-offer', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(11)'] },
    { name: 'columns-cta', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards'] },
    { name: 'columns-links', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm'] },
  ],
  sections: [
    { id: 'hero_products', name: 'Hero and products', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp'], style: 'brand-blue', blocks: ['hero', 'cards-product', 'cards-feature'], defaultContent: [] },
    { id: 'bundles_banner', name: 'Bundles banner', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.simple-story'], style: null, blocks: ['columns-banner'], defaultContent: [] },
    { id: 'why_choose', name: 'Why choose AT&T Business', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(3)', '#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(4)'], style: null, blocks: ['columns-feature'], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(3)'] },
    { id: 'testimonial', name: 'Testimonial', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.text-block'], style: 'light-blue', blocks: ['columns-testimonial'], defaultContent: [] },
    { id: 'at_work', name: 'AT&T Business at work', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(6)', '#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(7)'], style: null, blocks: ['columns-story'], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(6)'] },
    { id: 'guarantee_banner', name: 'Guarantee banner', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.gradient-banner'], style: 'light-blue', blocks: [], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.gradient-banner'] },
    { id: 'guarantee_features', name: 'Guarantee features', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(9)'], style: null, blocks: ['columns-feature'], defaultContent: [] },
    { id: 'unlock_offers', name: 'Unlock value offers', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(10)', '#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(11)'], style: null, blocks: ['columns-offer'], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(10)'] },
    { id: 'sales_cta', name: 'Sales expert CTA', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards'], style: 'light-grey', blocks: ['columns-cta'], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards .container.rel'] },
    { id: 'looking_for_more', name: 'Looking for more', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm'], style: 'light-grey', blocks: ['columns-links'], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm .container.rel'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first; sections runs after (afterTransform adds <hr> + section-metadata)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all block instances on the page based on the embedded template.
 * IMPORTANT: all elements are resolved up-front (before any parser mutates the
 * DOM) because several blocks (hero, cards-product, cards-feature) share the
 * same `div.foyer-comp` ancestor — resolving lazily would miss siblings once a
 * parser calls element.replaceWith().
 */
// Blocks that must appear at most once on the page. The AT&T source renders a
// duplicate hero (.foyerComp__brochure: one visible desktop copy + one hidden
// mobile copy), so without this guard the hero would be emitted twice.
const SINGLETON_BLOCKS = new Set(['hero']);

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    const single = SINGLETON_BLOCKS.has(blockDef.name);
    let taken = false;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        if (single && taken) return; // keep only the first instance of a singleton block
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
        taken = true;
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform cleanup (remove header/footer/chrome/tracking)
    executeTransformers('beforeTransform', main, payload);

    // 2. Resolve all block targets up-front (shared ancestors — see findBlocksOnPage note)
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block. Order matters for shared subtrees: parse the inner
    //    card grids (cards-product, cards-feature) and the hero within
    //    div.foyer-comp before the ancestor is otherwise mutated. Skip any
    //    element already detached by a previous parser.
    const order = ['cards-product', 'cards-feature', 'hero'];
    const ordered = [
      ...pageBlocks.filter((b) => order.includes(b.name))
        .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name)),
      ...pageBlocks.filter((b) => !order.includes(b.name)),
    ];

    ordered.forEach((block) => {
      if (!block.element || !block.element.parentNode) return; // already replaced
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform cleanup + section breaks/metadata
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path — map root/homepage URL to /index (empty path crashes
    //    the bundled importer's path polyfill via process.cwd()).
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
