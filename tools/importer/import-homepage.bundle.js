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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".foyerComp__mural img, .foyerComp__brochure img");
    const heading = element.querySelector(".foyerComp__text-content h1, h1");
    const textContent = element.querySelector(".foyerComp__text-content");
    let subheading = null;
    if (textContent) {
      const copy = [...textContent.children].find(
        (el) => el !== heading && el.textContent.trim()
      );
      if (copy) {
        subheading = document.createElement("p");
        subheading.textContent = copy.textContent.trim();
      }
    }
    if (!heading && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(":scope .foyerComp__featured-card-item");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".foyerComp__featured-card-asset img, img");
      const imageCell = img || "";
      const bodyCell = [];
      const titleEl = card.querySelector(".js-title, .heading-lg");
      if (titleEl && titleEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        bodyCell.push(h3);
      }
      const desc = card.querySelector(".js-description, .foyerComp__featured-card-content p");
      if (desc) bodyCell.push(desc);
      const price = card.querySelector(".foyerComp__featured-card-price");
      if (price) {
        const priceClone = price.cloneNode(true);
        priceClone.querySelectorAll("*").forEach((el) => {
          const t = el.textContent.replace(/\s+/g, " ").trim();
          if (/^\$\s*[\d,.]+\s*\/\s*mo\.?$/i.test(t) && !el.querySelector("a, img")) {
            el.textContent = t.replace(/\s+/g, "");
          }
        });
        bodyCell.push(priceClone);
      }
      const cta = card.querySelector(":scope > a[href], a.btn[href]");
      if (cta) bodyCell.push(cta);
      if (bodyCell.length || imageCell) cells.push([imageCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", variants: ["product"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const cards = element.querySelectorAll(":scope .foyerComp__standard-card-item");
    const cells = [];
    cards.forEach((card) => {
      const icon = card.querySelector(".foyerComp__icon-container img, img");
      const iconCell = icon || "";
      const bodyCell = [];
      const titleEl = card.querySelector("dt.standard-card-eyebrow, dt");
      if (titleEl && titleEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        bodyCell.push(h3);
      }
      const paras = card.querySelectorAll("dd p, .foyerComp__regular-definition dd p");
      paras.forEach((p) => bodyCell.push(p));
      const cta = card.querySelector("footer a[href], a.link-standalone[href]");
      if (cta) bodyCell.push(cta);
      if (bodyCell.length || iconCell) cells.push([iconCell, bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Cards", variants: ["feature"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-banner.js
  function parse4(element, { document }) {
    let img = element.querySelector(".promo-image img, img");
    if (!img) {
      const bgEl = element.querySelector('.promo-image, [style*="url("]');
      const style = bgEl && bgEl.getAttribute("style");
      const match = style && style.match(/(?:--image-desktop|--image|background-image)\s*:\s*url\((['"]?)([^'")]+)\1\)/i);
      if (match) {
        let src = match[2];
        if (src.startsWith("/")) src = `https://www.business.att.com${src}`;
        img = document.createElement("img");
        img.src = src;
        const heading0 = element.querySelector(".promo-title, h1, h2, h3");
        img.alt = heading0 ? heading0.textContent.trim() : "";
      }
    }
    const heading = element.querySelector(".promo-title, h1, h2, h3");
    const cta = element.querySelector(".cta-container a[href], a.button-cta[href], a[href]");
    if (!img && !heading && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = img || "";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (cta) contentCell.push(cta);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["banner"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse5(element, { document }) {
    const items = element.querySelectorAll("section.modular-card-comp, article.modular-card-comp");
    const cells = [];
    items.forEach((item) => {
      const media = item.querySelector(".modular-card-comp__media img");
      const icon = item.querySelector(".modular-card-comp__icon img");
      const imageCell = media || icon || "";
      const textCell = [];
      if (media && icon) textCell.push(icon);
      const headingEl = item.querySelector(".heading-sm, .heading-md, .heading-lg");
      if (headingEl && headingEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = headingEl.textContent.trim();
        textCell.push(h3);
      }
      const desc = item.querySelector(".wysiwyg-editor");
      if (desc) textCell.push(desc);
      const legal = item.querySelector(".type-legal-wysiwyg-editor");
      if (legal) textCell.push(legal);
      if (textCell.length || imageCell) cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["feature"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-testimonial.js
  function parse6(element, { document }) {
    const portrait = element.querySelector(".uf-testimonial__media img, figure img");
    const quote = element.querySelector(".uf-testimonial__quote, blockquote");
    const speakerLogo = element.querySelector(".uf-testimonial__speaker-logo");
    const name = element.querySelector(".uf-testimonial__name");
    const role = element.querySelector(".uf-testimonial__title");
    const org = element.querySelector(".uf-testimonial__org");
    const videoLink = element.querySelector(".uf-testimonial__cta[href], a.video-modal[href]");
    if (!portrait && !quote) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imageCell = portrait || "";
    const contentCell = [];
    if (quote) contentCell.push(quote);
    if (speakerLogo) contentCell.push(speakerLogo);
    if (name) contentCell.push(name);
    if (role) contentCell.push(role);
    if (org) contentCell.push(org);
    if (videoLink) contentCell.push(videoLink);
    const cells = [[imageCell, contentCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["testimonial"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-story.js
  function parse7(element, { document }) {
    const items = element.querySelectorAll("article.modular-card-comp, section.modular-card-comp");
    const cells = [];
    items.forEach((item) => {
      const photo = item.querySelector(".modular-card-comp__media img");
      const imageCell = photo || "";
      const textCell = [];
      const tag = item.querySelector(".modular-card-comp__tag");
      if (tag && tag.textContent.trim()) {
        const p = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = tag.textContent.trim();
        p.append(em);
        textCell.push(p);
      }
      const headingEl = item.querySelector(".heading-md, .heading-sm, .heading-lg");
      if (headingEl && headingEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = headingEl.textContent.trim();
        textCell.push(h3);
      }
      const desc = item.querySelector(".wysiwyg-editor");
      if (desc) textCell.push(desc);
      const sponsor = item.querySelector(".modular-card-comp__sponsor");
      if (sponsor) {
        const sponsorTitle = sponsor.querySelector(".modular-card-comp__sponsor-title");
        if (sponsorTitle && sponsorTitle.textContent.trim()) {
          const p = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = sponsorTitle.textContent.trim();
          p.append(strong);
          textCell.push(p);
        }
        const list = sponsor.querySelector(".modular-card-comp__sponsor-list, ul");
        if (list) textCell.push(list);
      }
      if (textCell.length || imageCell) cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["story"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-offer.js
  function parse8(element, { document }) {
    const items = element.querySelectorAll("section.modular-card-comp, article.modular-card-comp");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".modular-card-comp__media img");
      const imageCell = img || "";
      const textCell = [];
      const headingEl = item.querySelector(".heading-md, .heading-sm, .heading-lg");
      if (headingEl && headingEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = headingEl.textContent.trim();
        textCell.push(h3);
      }
      const desc = item.querySelector(".wysiwyg-editor");
      if (desc) textCell.push(desc);
      const legal = item.querySelector(".type-legal-wysiwyg-editor");
      if (legal) textCell.push(legal);
      const cta = item.querySelector(".modular-card-comp__actions a[href], a.btn[href]");
      if (cta) textCell.push(cta);
      if (textCell.length || imageCell) cells.push([imageCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["offer"], cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse9(element, { document }) {
    const tiles = element.querySelectorAll(".tile-card");
    const rowCells = [];
    tiles.forEach((tile) => {
      const cell = [];
      const eyebrow = tile.querySelector(".eyebrow-text");
      if (eyebrow && eyebrow.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        cell.push(p);
      }
      const headingEl = tile.querySelector(".js-heading-section, h3, .heading-md");
      if (headingEl && headingEl.textContent.trim()) {
        const h3 = document.createElement("h3");
        h3.textContent = headingEl.textContent.trim();
        cell.push(h3);
      }
      const body = tile.querySelector(".js-textBody-section, .tileSubheading");
      if (body) cell.push(body);
      const legal = tile.querySelector(".cardlegal, .type-legal-wysiwyg-editor");
      if (legal) cell.push(legal);
      const cta = tile.querySelector(".cta-container a[href], a.tile-anchor[href]");
      if (cta) cell.push(cta);
      if (cell.length) rowCells.push(cell);
    });
    if (!rowCells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const sectionTitleEl = element.querySelector(".multi-cta-heading, .js-title, h2");
    let heading = null;
    if (sectionTitleEl && sectionTitleEl.textContent.trim()) {
      heading = document.createElement("h2");
      heading.textContent = sectionTitleEl.textContent.replace(/\s+/g, " ").trim();
    }
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["cta"], cells });
    if (heading) {
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-links.js
  function parse10(element, { document }) {
    const scope = element.querySelector(".desktop-view-and-tablet") || element;
    let columns = scope.querySelectorAll(".accordion-item");
    if (!columns.length) columns = scope.querySelectorAll(".accordion-panel");
    const rowCells = [];
    columns.forEach((col) => {
      const list = col.querySelector("ul.accordion-panel, ul") || col;
      if (list && list.querySelector("a[href]")) {
        rowCells.push(list);
      }
    });
    if (!rowCells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const titleEl = element.querySelector(".link-farm-title, .js-title, h2, .heading-lg");
    let heading = null;
    if (titleEl && titleEl.textContent.trim() && !titleEl.querySelector("a")) {
      heading = document.createElement("h2");
      heading.textContent = titleEl.textContent.replace(/\s+/g, " ").trim();
    }
    const cells = [rowCells];
    const block = WebImporter.Blocks.createBlock(document, { name: "Columns", variants: ["links"], cells });
    if (heading) {
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/attbusiness-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
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
        // Hidden fixed-position price-calculator widget ("Estimated monthly cost
        // for 0") — a JS-driven overlay template, not authorable page content.
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
        "source",
        // Leftover DUPLICATE hero: the source renders two .foyerComp__brochure
        // (visible desktop + hidden mobile). The hero parser consumes the first
        // (replacing it with a hero block), so any .foyerComp__brochure still
        // present here is the redundant copy — remove it to avoid a second <h1>.
        ".foyerComp__brochure"
      ]);
      const SECTION_TITLES = [
        "why choose at&t business",
        "at&t business at work",
        "unlock value, deals, and growth for your business"
      ];
      const norm2 = (s) => (s || "").replace(/\s+/g, " ").trim().toLowerCase().replace(/[?.!:]+$/, "");
      element.querySelectorAll(".single-title, p, div, span").forEach((el) => {
        if (!SECTION_TITLES.includes(norm2(el.textContent))) return;
        if (el.querySelector("a, img")) return;
        if ([...el.children].some((c) => SECTION_TITLES.includes(norm2(c.textContent)))) return;
        const h2 = element.ownerDocument.createElement("h2");
        h2.textContent = el.textContent.replace(/\s+/g, " ").trim();
        el.replaceWith(h2);
      });
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
    }
  }

  // tools/importer/transformers/attbusiness-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function norm(s) {
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
      return norm(cell ? cell.textContent : "");
    };
    const tables = allEls.filter((el) => el.tagName === "TABLE").map((el) => ({ el, idx: orderIdx.get(el), name: tableName(el) }));
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
        if (el.closest("table")) continue;
        if (norm(el.textContent) !== target) continue;
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
    const add = (anchor, style) => {
      if (anchor) {
        specs.push({ el: anchor.el, idx: anchor.idx, style });
        cursor = anchor.idx + 1;
      }
    };
    add(findBlock("Hero", 0, 1), "brand-blue");
    add(findBlock("Columns (banner)", cursor), null);
    add(earliest(
      findTitle("Why choose AT&T Business", cursor),
      findBlock("Columns (feature)", cursor, 1)
    ), null);
    add(findBlock("Columns (testimonial)", cursor), "light-blue");
    add(earliest(
      findTitle("AT&T Business at work", cursor),
      findBlock("Columns (story)", cursor)
    ), null);
    add(findTitle("Your connection, our guarantee", cursor), "light-blue");
    add(findBlock("Columns (feature)", cursor, 1), null);
    add(earliest(
      findTitle("Unlock value, deals, and growth for your business", cursor),
      findBlock("Columns (offer)", cursor)
    ), null);
    add(earliest(
      findTitle("Talk to an AT&T Business sales expert", cursor),
      findBlock("Columns (cta)", cursor)
    ), "light-grey");
    add(earliest(
      findTitle("Looking for more", cursor),
      findBlock("Columns (links)", cursor)
    ), "light-grey");
    if (!specs.length) return;
    specs.forEach((s, i) => {
      if (!s.style) return;
      const meta = WebImporter.Blocks.createBlock(document, {
        name: "Section Metadata",
        cells: { style: s.style }
      });
      const next = specs[i + 1];
      if (next && next.el.parentNode) {
        next.el.parentNode.insertBefore(meta, next.el);
      } else {
        root.appendChild(meta);
      }
    });
    specs.forEach((s, i) => {
      if (i === 0) return;
      if (!s.el.parentNode) return;
      const hr = document.createElement("hr");
      s.el.parentNode.insertBefore(hr, s.el);
    });
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards-product": parse2,
    "cards-feature": parse3,
    "columns-banner": parse4,
    "columns-feature": parse5,
    "columns-testimonial": parse6,
    "columns-story": parse7,
    "columns-offer": parse8,
    "columns-cta": parse9,
    "columns-links": parse10
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "AT&T Business homepage: hero with product cards, bundles banner, 'Why choose' feature grid, testimonial, customer-story cards, guarantee feature grid, promotional offer cards, sales-expert CTA, and a link directory.",
    urls: [
      "https://www.business.att.com/"
    ],
    blocks: [
      { name: "hero", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__brochure"] },
      { name: "cards-product", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__featured-card-container"] },
      { name: "cards-feature", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp .foyerComp__standard-card-container"] },
      { name: "columns-banner", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.simple-story"] },
      { name: "columns-feature", instances: [
        "#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(4)",
        "#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(9)"
      ] },
      { name: "columns-testimonial", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.text-block"] },
      { name: "columns-story", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(7)"] },
      { name: "columns-offer", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(11)"] },
      { name: "columns-cta", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards"] },
      { name: "columns-links", instances: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm"] }
    ],
    sections: [
      { id: "hero_products", name: "Hero and products", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.foyer-comp"], style: "brand-blue", blocks: ["hero", "cards-product", "cards-feature"], defaultContent: [] },
      { id: "bundles_banner", name: "Bundles banner", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.simple-story"], style: null, blocks: ["columns-banner"], defaultContent: [] },
      { id: "why_choose", name: "Why choose AT&T Business", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(3)", "#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(4)"], style: null, blocks: ["columns-feature"], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(3)"] },
      { id: "testimonial", name: "Testimonial", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.text-block"], style: "light-blue", blocks: ["columns-testimonial"], defaultContent: [] },
      { id: "at_work", name: "AT&T Business at work", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(6)", "#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(7)"], style: null, blocks: ["columns-story"], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(6)"] },
      { id: "guarantee_banner", name: "Guarantee banner", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.gradient-banner"], style: "light-blue", blocks: [], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.gradient-banner"] },
      { id: "guarantee_features", name: "Guarantee features", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(9)"], style: null, blocks: ["columns-feature"], defaultContent: [] },
      { id: "unlock_offers", name: "Unlock value offers", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(10)", "#baem-container .segmentationSectionIncluded .aem-Grid > div.modular-card:nth-of-type(11)"], style: null, blocks: ["columns-offer"], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.single-title:nth-of-type(10)"] },
      { id: "sales_cta", name: "Sales expert CTA", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards"], style: "light-grey", blocks: ["columns-cta"], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.multi-tile-cards .container.rel"] },
      { id: "looking_for_more", name: "Looking for more", selector: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm"], style: "light-grey", blocks: ["columns-links"], defaultContent: ["#baem-container .segmentationSectionIncluded .aem-Grid > div.link-farm .container.rel"] }
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
  var SINGLETON_BLOCKS = /* @__PURE__ */ new Set(["hero"]);
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
          if (single && taken) return;
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
          taken = true;
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      const order = ["cards-product", "cards-feature", "hero"];
      const ordered = [
        ...pageBlocks.filter((b) => order.includes(b.name)).sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name)),
        ...pageBlocks.filter((b) => !order.includes(b.name))
      ];
      ordered.forEach((block) => {
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
  return __toCommonJS(import_homepage_exports);
})();
