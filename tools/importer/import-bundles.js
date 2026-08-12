/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import bundlesHeroParser from './parsers/bundles-hero.js';
import bundlesColumnsOfferParser from './parsers/bundles-columns-offer.js';
import bundlesCardsFeatureParser from './parsers/bundles-cards-feature.js';
import bundlesCardsBundleParser from './parsers/bundles-cards-bundle.js';
import bundlesAccordionParser from './parsers/bundles-accordion.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/attbusiness-bundles-cleanup.js';
import sectionsTransformer from './transformers/attbusiness-bundles-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': bundlesHeroParser,
  'columns-offer': bundlesColumnsOfferParser,
  'cards-feature': bundlesCardsFeatureParser,
  'cards-bundle': bundlesCardsBundleParser,
  'accordion': bundlesAccordionParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json (template "bundles")
const PAGE_TEMPLATE = {
  name: 'bundles',
  description: 'AT&T Business bundles page: fiber-offer hero, reward-card offer, value-prop feature grid, bundle hero, "Choose the bundle" tiles, risk-free feature grid, FAQ + SEO accordions, and a sales-expert form section.',
  urls: [
    'https://www.business.att.com/bundles.html',
  ],
  blocks: [
    { name: 'hero', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.hero'] },
    { name: 'columns-offer', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.offer'] },
    { name: 'cards-feature', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop'] },
    { name: 'cards-bundle', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards'] },
    { name: 'accordion', instances: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel'] },
  ],
  sections: [
    { id: 'hero_fiber', name: 'Fiber offer hero', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.hero:nth-of-type(1)'], style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'reward_offer', name: 'Reward card offer', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.offer'], style: null, blocks: ['columns-offer'], defaultContent: [] },
    { id: 'edge_value_props', name: 'Bundle value props', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop:nth-of-type(3)'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'bundle_hero', name: 'Bundle hero', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.hero:nth-of-type(4)'], style: null, blocks: ['hero'], defaultContent: [] },
    { id: 'choose_bundle', name: 'Choose the bundle', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards'], style: null, blocks: ['cards-bundle'], defaultContent: [] },
    { id: 'risk_free', name: 'Risk-free value props', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop:nth-of-type(6)'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'faq', name: 'FAQ', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel:nth-of-type(7)'], style: null, blocks: ['accordion'], defaultContent: [] },
    { id: 'seo_bundles', name: 'SEO bundles', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel:nth-of-type(8)'], style: null, blocks: ['accordion'], defaultContent: [] },
    { id: 'sales_form', name: 'Sales expert', selector: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.rai-form'], style: null, blocks: [], defaultContent: ['#baem-container .segmentationSectionIncluded .aem-Grid > div.rai-form'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first; sections runs after (afterTransform adds <hr>)
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
 * The two hero bands and the two accordion panels are distinct DOM nodes, so
 * both instances of each selector are collected (no singletons here).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
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

    // 2. Resolve all block targets up-front.
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block. Skip any element already detached by a prior parser.
    pageBlocks.forEach((block) => {
      if (!block.element || !block.element.parentNode) return;
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

    // 4. afterTransform cleanup + section breaks
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path — /bundles.html -> /bundles (guard empty root -> /index).
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
