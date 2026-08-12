/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-bundles.js
  var import_bundles_exports = {};
  __export(import_bundles_exports, {
    default: () => import_bundles_default
  });

  // tools/importer/parsers/bundles-hero.js
  function parse(element, { document }) {
    const heading = element.querySelector("h1, h2");
    const img = element.querySelector("img");
    const contentCell = [];
    const eyebrowEl = heading && heading.previousElementSibling;
    if (eyebrowEl && eyebrowEl.textContent.trim() && !eyebrowEl.querySelector("img")) {
      const p = document.createElement("p");
      const em = document.createElement("em");
      em.textContent = eyebrowEl.textContent.replace(/\s+/g, " ").trim();
      p.append(em);
      contentCell.push(p);
    }
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.replace(/\s+/g, " ").trim();
      contentCell.push(h2);
    }
    const paras = [...element.querySelectorAll("p")].filter((p) => {
      const t = p.textContent.trim();
      if (!t) return false;
      if (/^(price|new customers only|ltd|based on|wireless|at&t may|\*|\d)/i.test(t)) return false;
      return true;
    });
    if (paras[0]) {
      const p = document.createElement("p");
      p.textContent = paras[0].textContent.replace(/\s+/g, " ").trim();
      contentCell.push(p);
    }
    const list = element.querySelector("ul");
    if (list && list.querySelectorAll("li").length) {
      const ul = document.createElement("ul");
      list.querySelectorAll("li").forEach((li) => {
        const item = document.createElement("li");
        item.textContent = li.textContent.replace(/\s+/g, " ").trim();
        ul.append(item);
      });
      contentCell.push(ul);
    }
    element.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      const text = a.textContent.trim();
      if (!text) return;
      if (href === "#" || href.startsWith("#")) return;
      if (/^see details$/i.test(text)) return;
      const link = document.createElement("a");
      link.setAttribute("href", href);
      link.textContent = text;
      const strong = document.createElement("strong");
      strong.append(link);
      const p = document.createElement("p");
      p.append(strong);
      contentCell.push(p);
    });
    if (!heading && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) cells.push([img]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/bundles-columns-offer.js
  function parse2(element, { document }) {
    const img = element.querySelector("img");
    const imageCell = img || "";
    const textCell = [];
    const headingEl = element.querySelector("h1, h2, h3");
    if (headingEl && headingEl.textContent.trim()) {
      const h3 = document.createElement("h3");
      h3.textContent = headingEl.textContent.replace(/\s+/g, " ").trim();
      textCell.push(h3);
    }
    element.querySelectorAll("p").forEach((p) => {
      if (p.textContent.trim()) {
        const para = document.createElement("p");
        para.textContent = p.textContent.replace(/\s+/g, " ").trim();
        textCell.push(para);
      }
    });
    const cta = [...element.querySelectorAll("a[href]")].find((a) => {
      const href = a.getAttribute("href") || "";
      return href && href !== "#" && !/^see details$/i.test(a.textContent.trim());
    });
    if (cta) {
      const link = document.createElement("a");
      link.setAttribute("href", cta.getAttribute("href"));
      link.textContent = cta.textContent.trim();
      const strong = document.createElement("strong");
      strong.append(link);
      const p = document.createElement("p");
      p.append(strong);
      textCell.push(p);
    }
    if (!textCell.length && !imageCell) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["offer"], cells: [[imageCell, textCell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/bundles-cards-feature.js
  function parse3(element, { document }) {
    const headings = [...element.querySelectorAll("h4")];
    let items = [];
    if (headings.length) {
      let lca = headings[0].parentElement;
      while (lca && !headings.every((h) => lca.contains(h))) lca = lca.parentElement;
      if (lca) items = [...lca.children].filter((c) => c.querySelector("h4"));
    }
    const cells = [];
    items.forEach((item) => {
      if (!item) return;
      const icon = item.querySelector("img");
      const iconCell = icon || "";
      const bodyCell = [];
      const titleEl2 = item.querySelector("h4, h3");
      if (titleEl2 && titleEl2.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl2.textContent.replace(/\s+/g, " ").trim();
        bodyCell.push(h3);
      }
      item.querySelectorAll("p").forEach((p) => {
        if (p.textContent.trim()) {
          const para = document.createElement("p");
          para.textContent = p.textContent.replace(/\s+/g, " ").trim();
          bodyCell.push(para);
        }
      });
      const cta = item.querySelector("a[href]");
      if (cta && cta.getAttribute("href") && cta.getAttribute("href") !== "#") {
        const link = document.createElement("a");
        link.setAttribute("href", cta.getAttribute("href"));
        link.textContent = cta.textContent.trim();
        const strong = document.createElement("strong");
        strong.append(link);
        const p = document.createElement("p");
        p.append(strong);
        bodyCell.push(p);
      }
      if (bodyCell.length || iconCell) cells.push([iconCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leading = [];
    const titleEl = [...element.querySelectorAll("h1, h2, h3")].find((h) => !h.closest(".generic-list-icon-vp"));
    if (titleEl && titleEl.textContent.trim()) {
      const eyebrow = titleEl.previousElementSibling;
      if (eyebrow && eyebrow.textContent.trim() && !eyebrow.querySelector("a, img") && !/^h[1-6]$/i.test(eyebrow.tagName)) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = eyebrow.textContent.replace(/\s+/g, " ").trim();
        p.append(em);
        leading.push(p);
      }
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      leading.push(h2);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", variants: ["feature"], cells });
    element.replaceWith(...leading, block);
  }

  // tools/importer/parsers/bundles-cards-bundle.js
  function parse4(element, { document }) {
    const tiles = element.querySelectorAll(".tile-card");
    const cells = [];
    tiles.forEach((tile) => {
      const img = tile.querySelector("img");
      const imageCell = img || "";
      const textCell = [];
      const h3El = tile.querySelector("h3");
      const eyebrow = h3El && h3El.previousElementSibling && h3El.previousElementSibling.tagName === "P" ? h3El.previousElementSibling : null;
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = eyebrow.textContent.replace(/\s+/g, " ").trim();
        p.append(em);
        textCell.push(p);
      }
      if (h3El && h3El.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = h3El.textContent.replace(/\s+/g, " ").trim();
        textCell.push(h3);
      }
      const intro = [...tile.querySelectorAll("p")].find((p) => /start|save|includes|you.ll get|plus/i.test(p.textContent));
      if (intro) {
        const p = document.createElement("p");
        p.textContent = intro.textContent.replace(/\s+/g, " ").trim();
        textCell.push(p);
      }
      const list = tile.querySelector("ul");
      if (list && list.querySelectorAll("li").length) {
        const ul = document.createElement("ul");
        list.querySelectorAll("li").forEach((li) => {
          const item = document.createElement("li");
          item.textContent = li.textContent.replace(/\s+/g, " ").trim();
          ul.append(item);
        });
        textCell.push(ul);
      }
      const cta = [...tile.querySelectorAll("a[href]")].find((a) => {
        const href = a.getAttribute("href") || "";
        return href && href !== "#" && !/^see offer details$/i.test(a.textContent.trim());
      });
      if (cta) {
        const link = document.createElement("a");
        link.setAttribute("href", cta.getAttribute("href"));
        link.textContent = cta.textContent.trim();
        const strong = document.createElement("strong");
        strong.append(link);
        const p = document.createElement("p");
        p.append(strong);
        textCell.push(p);
      }
      if (textCell.length || imageCell) cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leading = [];
    const titleEl = [...element.querySelectorAll("h1, h2, h3")].find((h) => !h.closest(".tile-card"));
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      leading.push(h2);
      const next = titleEl.nextElementSibling;
      if (next && next.tagName === "P" && next.textContent.trim() && !next.closest(".tile-card")) {
        const p = document.createElement("p");
        p.textContent = next.textContent.replace(/\s+/g, " ").trim();
        leading.push(p);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", variants: ["bundle"], cells });
    element.replaceWith(...leading, block);
  }

  // tools/importer/parsers/bundles-accordion.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll('[role="tablist"]');
    const cells = [];
    if (items.length) {
      items.forEach((item) => {
        const q = item.querySelector('[role="tab"], button');
        const question = q ? q.textContent.replace(/\s+/g, " ").trim() : "";
        if (!question) return;
        const answerCell = [];
        item.querySelectorAll("p").forEach((p) => {
          const t = p.textContent.replace(/\s+/g, " ").trim();
          if (t && t !== question) {
            const para = document.createElement("p");
            para.textContent = t;
            answerCell.push(para);
          }
        });
        const summary = document.createElement("p");
        summary.textContent = question;
        cells.push([[summary], answerCell.length ? answerCell : [""]]);
      });
    } else {
      const title = element.querySelector('[role="tab"], button, h2, h3');
      const summaryText = title ? title.textContent.replace(/\s+/g, " ").trim() : "Details";
      const bodyCell = [];
      element.querySelectorAll("p").forEach((p) => {
        const t = p.textContent.replace(/\s+/g, " ").trim();
        if (t && t !== summaryText) {
          const para = document.createElement("p");
          para.textContent = t;
          bodyCell.push(para);
        }
      });
      if (bodyCell.length) {
        const summary = document.createElement("p");
        summary.textContent = summaryText;
        cells.push([[summary], bodyCell]);
      }
    }
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leading = [];
    const titleEl = [...element.querySelectorAll("h1, h2, h3")].find((h) => !h.closest('[role="tablist"]'));
    if (titleEl && titleEl.textContent.trim()) {
      const h2 = document.createElement("h2");
      h2.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
      leading.push(h2);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Accordion", cells });
    element.replaceWith(...leading, block);
  }

  // tools/importer/transformers/attbusiness-bundles-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function norm(s) {
    return (s || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[?.!:]+$/, "");
  }
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#gpc-banner-container",
        ".cookie-disclaimer-component",
        ".att-modal-container",
        ".modal-popup-container",
        "#businessChatDiv",
        "#js-site-nav-overlay",
        ".site-nav-overlay",
        ".video-overlay",
        ".cloudservice.testandtarget",
        "a.skip-link",
        "uws-badge",
        "#db-sync",
        "#db_lr_pixel_ad",
        '[id^="batBeacon"]',
        "iframe",
        "#summaryCost-wrapper",
        ".summary-cost-container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".global-nav",
        "header.site-header",
        "nav.site-nav",
        "div.footer",
        ".footer-main",
        ".footer-page-css-includes",
        "link",
        "noscript",
        "source"
      ]);
      const SECTION_TITLES = [
        "choose the bundle that\u2019s right for your business",
        "choose the bundle that's right for your business",
        "frequently asked questions",
        "talk to an at&t business sales expert"
      ];
      element.querySelectorAll("p, div, span").forEach((el) => {
        if (!SECTION_TITLES.includes(norm(el.textContent))) return;
        if (el.querySelector("a, img")) return;
        if (el.closest("table")) return;
        if ([...el.children].some((c) => SECTION_TITLES.includes(norm(c.textContent)))) return;
        const h2 = element.ownerDocument.createElement("h2");
        h2.textContent = el.textContent.replace(/\s+/g, " ").trim();
        el.replaceWith(h2);
      });
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
    }
  }

  // tools/importer/transformers/attbusiness-bundles-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function norm2(s) {
    return (s || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[?.!:]+$/, "");
  }
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const document = payload && payload.document;
    if (!document) return;
    const root = element || document.body;
    const allEls = [...root.querySelectorAll("*")];
    const orderIdx = /* @__PURE__ */ new Map();
    allEls.forEach((el, i) => orderIdx.set(el, i));
    const tableName = (table) => {
      const cell = table.querySelector("td, th");
      return norm2(cell ? cell.textContent : "");
    };
    const tables = allEls.filter((el) => el.tagName === "TABLE").map((el) => ({ el, idx: orderIdx.get(el), name: tableName(el) }));
    const findBlock = (name, from, occurrence = 1) => {
      const n = norm2(name);
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
      const target = norm2(text);
      let best = null;
      for (const el of allEls) {
        const i = orderIdx.get(el);
        if (i < from) continue;
        if (el.closest("table")) continue;
        if (norm2(el.textContent) !== target) continue;
        const size = el.querySelectorAll("*").length;
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
    add(findBlock("Hero", 0, 1));
    add(findBlock("Columns (offer)", cursor));
    add(earliest(
      findTitle("Give your organization an edge with an AT&T Business bundle", cursor),
      findBlock("Cards (feature)", cursor, 1)
    ));
    add(findBlock("Hero", cursor, 1));
    add(earliest(
      findTitle("Choose the bundle that\u2019s right for your business", cursor),
      findBlock("Cards (bundle)", cursor)
    ));
    add(earliest(
      findTitle("30 days. Your call.", cursor),
      findBlock("Cards (feature)", cursor, 1)
    ));
    add(earliest(
      findTitle("Frequently asked questions", cursor),
      findBlock("Accordion", cursor, 1)
    ));
    add(findBlock("Accordion", cursor, 1));
    add(findTitle("Talk to an AT&T Business sales expert", cursor));
    if (!specs.length) return;
    specs.forEach((s, i) => {
      if (i === 0) return;
      if (!s.el.parentNode) return;
      const hr = document.createElement("hr");
      s.el.parentNode.insertBefore(hr, s.el);
    });
  }

  // tools/importer/import-bundles.js
  var parsers = {
    "hero": parse,
    "columns-offer": parse2,
    "cards-feature": parse3,
    "cards-bundle": parse4,
    "accordion": parse5
  };
  var PAGE_TEMPLATE = {
    name: "bundles",
    description: 'AT&T Business bundles page: fiber-offer hero, reward-card offer, value-prop feature grid, bundle hero, "Choose the bundle" tiles, risk-free feature grid, FAQ + SEO accordions, and a sales-expert form section.',
    urls: [
      "https://www.business.att.com/bundles.html"
    ],
    blocks: [
      { name: "hero", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.hero"] },
      { name: "columns-offer", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.offer"] },
      { name: "cards-feature", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop"] },
      { name: "cards-bundle", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards"] },
      { name: "accordion", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel"] }
    ],
    sections: [
      { id: "hero_fiber", name: "Fiber offer hero", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.hero:nth-of-type(1)"], style: null, blocks: ["hero"], defaultContent: [] },
      { id: "reward_offer", name: "Reward card offer", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.offer"], style: null, blocks: ["columns-offer"], defaultContent: [] },
      { id: "edge_value_props", name: "Bundle value props", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop:nth-of-type(3)"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "bundle_hero", name: "Bundle hero", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.hero:nth-of-type(4)"], style: null, blocks: ["hero"], defaultContent: [] },
      { id: "choose_bundle", name: "Choose the bundle", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards"], style: null, blocks: ["cards-bundle"], defaultContent: [] },
      { id: "risk_free", name: "Risk-free value props", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.generic-list-value-prop:nth-of-type(6)"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "faq", name: "FAQ", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel:nth-of-type(7)"], style: null, blocks: ["accordion"], defaultContent: [] },
      { id: "seo_bundles", name: "SEO bundles", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.accordion-panel:nth-of-type(8)"], style: null, blocks: ["accordion"], defaultContent: [] },
      { id: "sales_form", name: "Sales expert", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.rai-form"], style: null, blocks: [], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.rai-form"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_bundles_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_bundles_exports);
})();
