/**
 * Rusat Timber Depot - Landing Page Interactions
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // --------------------------------------------------------------------------
  const header = document.getElementById("site-header");

  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initialize on page load

  // --------------------------------------------------------------------------
  // 2. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const openDrawer = () => {
    mobileDrawer.classList.add("open");
    mobileDrawer.setAttribute("aria-hidden", "false");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove("open");
    mobileDrawer.setAttribute("aria-hidden", "true");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", openDrawer);
    drawerCloseBtn.addEventListener("click", closeDrawer);
    drawerBackdrop.addEventListener("click", closeDrawer);

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", closeDrawer);
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeDrawer();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. SMOOTH SCROLLING WITH STICKY HEADER OFFSET
  // --------------------------------------------------------------------------
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          (headerHeight + 16);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL hash without jumping
        history.pushState(null, "", targetId);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION LINK HIGHLIGHTING
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
  const sections = document.querySelectorAll("section[id]");

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  // --------------------------------------------------------------------------
  // 6. QUOTE REQUEST MODAL INTERACTION
  // --------------------------------------------------------------------------
  const quoteModal = document.getElementById("quote-modal");
  const openQuoteButtons = document.querySelectorAll(".open-quote-btn");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const quoteForm = document.getElementById("quote-form");
  const formSuccessMsg = document.getElementById("form-success-msg");

  const openQuoteModal = (presetCategory = "") => {
    // If mobile drawer is open, close it first
    if (mobileDrawer && mobileDrawer.classList.contains("open")) {
      closeDrawer();
    }

    if (presetCategory) {
      const select = document.getElementById("packaging-type");
      if (select) select.value = presetCategory;
    }

    quoteModal.classList.add("open");
    quoteModal.setAttribute("aria-hidden", "false");
    quoteModal.scrollTop = 0;
    document.body.style.overflow = "hidden";

    // Focus first input
    const firstInput = document.getElementById("contact-name");
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  };

  const closeQuoteModal = () => {
    quoteModal.classList.remove("open");
    quoteModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  openQuoteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category") || "";
      openQuoteModal(category);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeQuoteModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeQuoteModal);

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      quoteModal &&
      quoteModal.classList.contains("open")
    ) {
      closeQuoteModal();
    }
  });

  // Quote Form Submission Handler
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Show confirmation
      if (formSuccessMsg) {
        formSuccessMsg.style.display = "flex";
      }

      // Disable submit button temporarily
      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Inquiry Submitted ✓";
      }

      // Auto close modal after 3 seconds
      setTimeout(() => {
        closeQuoteModal();
        quoteForm.reset();
        if (formSuccessMsg) formSuccessMsg.style.display = "none";
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit Packaging Inquiry";
        }
      }, 3000);
    });
  }

  // --------------------------------------------------------------------------
  // 6b. FOOTER "GET IN TOUCH" FORM SUBMISSION HANDLER
  // --------------------------------------------------------------------------
  const footerNewsletterForm = document.getElementById("footer-newsletter-form");
  if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = footerNewsletterForm.querySelector('button[type="submit"] span');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Thank You ✓";

        setTimeout(() => {
          footerNewsletterForm.reset();
          submitBtn.textContent = originalText;
        }, 3000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. DYNAMIC YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    const year = new Date().getFullYear();
    currentYearSpan.textContent = `1990–${year}`;
  }

  // --------------------------------------------------------------------------
  // 8. WHY RUSAT EDITORIAL LIST + DYNAMIC SHOWCASE INTERACTION
  // --------------------------------------------------------------------------
  const whyRows = Array.from(document.querySelectorAll(".why-table-row, .why-custom-row"));
  const whyDynamicImg = document.getElementById("why-dynamic-img");
  const whyCaptionIndex = document.getElementById("why-caption-index");
  const whyCaptionText = document.getElementById("why-caption-text");
  const whyVisualCard = document.getElementById("why-visual-card");

  if (whyRows.length > 0) {
    let whyActiveIndex = whyRows.findIndex((row) => row.classList.contains("is-active"));
    if (whyActiveIndex === -1) whyActiveIndex = 0;

    const setActiveRow = (index) => {
      whyActiveIndex = (index + whyRows.length) % whyRows.length;
      const targetRow = whyRows[whyActiveIndex];

      whyRows.forEach((row) => row.classList.toggle("is-active", row === targetRow));

      const img = targetRow.getAttribute("data-img");
      const title = targetRow.getAttribute("data-title") || targetRow.querySelector(".why-table-title, .why-row-title")?.textContent;
      const num = targetRow.getAttribute("data-num") || targetRow.querySelector(".why-table-num, .why-row-num")?.textContent;

      if (whyDynamicImg && img) {
        // Smooth crossfade effect
        whyDynamicImg.classList.add("fade-out");
        setTimeout(() => {
          whyDynamicImg.src = img;
          whyDynamicImg.onload = () => {
            whyDynamicImg.classList.remove("fade-out");
          };
          // Fallback if already cached
          setTimeout(() => whyDynamicImg.classList.remove("fade-out"), 50);
        }, 120);
      }

      if (whyCaptionIndex && num) whyCaptionIndex.textContent = num;
      if (whyCaptionText && title) whyCaptionText.textContent = title;

      if (whyVisualCard && img) {
        whyVisualCard.style.backgroundImage = `url('${img}')`;
      }
    };

    whyRows.forEach((row, index) => {
      row.addEventListener("mouseenter", () => setActiveRow(index));
      row.addEventListener("focus", () => setActiveRow(index));
      row.addEventListener("click", () => setActiveRow(index));
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActiveRow(index);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = (index + 1) % whyRows.length;
          whyRows[nextIndex].focus();
          setActiveRow(nextIndex);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prevIndex = (index - 1 + whyRows.length) % whyRows.length;
          whyRows[prevIndex].focus();
          setActiveRow(prevIndex);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 9. BENTO CAPABILITIES DYNAMIC CENTER IMAGE SHOWCASE
  // --------------------------------------------------------------------------
  const bentoCards = document.querySelectorAll("#capabilities-bento .bento-card[data-capability]");
  const centerTitle = document.getElementById("center-title");
  const centerDesc = document.getElementById("center-desc");
  const centerImage = document.getElementById("center-image");
  const centerTypeTag = document.getElementById("center-type-tag");
  const centerTypeLabel = document.getElementById("center-type-label");

  const capabilitiesData = {
    "dim-weight": {
      title: "Product Dimensions & Weight",
      desc: "Custom sized and engineered to match exact payload dimensions, weight distribution, and centre of gravity.",
      tag: "SPECIFICATION CRITERIA • 01",
      typeLabel: "Bespoke Dimensioning",
      img: "assets/images/custom-packaging.jpg"
    },
    "transport-conditions": {
      title: "Transportation Conditions",
      desc: "Shock-absorbing framing and vibration-resistant construction built for road, rail, air, and ocean voyages.",
      tag: "SPECIFICATION CRITERIA • 02",
      typeLabel: "Multi-Modal Transport",
      img: "assets/images/crates.jpg"
    },
    "stacking-storage": {
      title: "Stacking & Storage Needs",
      desc: "Engineered for vertical warehouse racking, multi-tier container stacking, and long-term storage stability.",
      tag: "SPECIFICATION CRITERIA • 03",
      typeLabel: "Heavy-Duty Stacking Skids",
      img: "assets/images/pallets.jpg"
    },
    "load-bearing": {
      title: "Load-Bearing Requirements",
      desc: "Structural load calculations designed to maintain integrity under both static warehouse storage and dynamic transit stresses.",
      tag: "SPECIFICATION CRITERIA • 04",
      typeLabel: "Static & Dynamic Structural Rigidity",
      img: "assets/images/manufacturing.jpg"
    },
    "reusability-efficiency": {
      title: "Reusability & Storage Efficiency",
      desc: "Modular, knock-down, and collapsible timber designs that minimize return logistics volume and enable repeated deployments.",
      tag: "SPECIFICATION CRITERIA • 05",
      typeLabel: "Collapsible Timber Systems",
      img: "assets/images/nailless-plywood.jpg"
    },
    "forklift-handling": {
      title: "Forklift & Handling Conditions",
      desc: "Configured for 2-way and 4-way entry, pallet jack accessibility, crane slinging, and secure forklift transport.",
      tag: "SPECIFICATION CRITERIA • 06",
      typeLabel: "2-Way & 4-Way Rigging Interface",
      img: "assets/images/boxes.jpg"
    },
    "export-packaging": {
      title: "Export Packaging Requirements",
      desc: "Constructed in compliance with international freight mandates, with applicable ISPM-15 treatment options where required.",
      tag: "SPECIFICATION CRITERIA • 07",
      typeLabel: "Certified ISPM-15 Export Crates",
      img: "assets/images/export-packaging.jpg"
    },
    "customer-designs": {
      title: "Customer-Specific Designs",
      desc: "Dedicated packaging engineering customized around high-value machinery, electrical goods, and sensitive components.",
      tag: "SPECIFICATION CRITERIA • 08",
      typeLabel: "Engineered Bespoke Packaging",
      img: "assets/images/custom_packaging_showcase_1789026035507.jpg"
    }
  };

  const updateBentoCenterShowcase = (capKey) => {
    const data = capabilitiesData[capKey];
    if (!data) return;

    // Set active card
    bentoCards.forEach((card) => {
      const isMatch = card.getAttribute("data-capability") === capKey;
      card.classList.toggle("is-active", isMatch);
    });

    // Update text
    if (centerTitle) centerTitle.textContent = data.title;
    if (centerDesc) centerDesc.textContent = data.desc;
    if (centerTypeTag) centerTypeTag.textContent = data.tag;
    if (centerTypeLabel) centerTypeLabel.textContent = data.typeLabel;

    // Update image with smooth transition
    if (centerImage) {
      centerImage.classList.add("updating");
      setTimeout(() => {
        centerImage.src = data.img;
        centerImage.alt = `${data.title} preview`;
        centerImage.classList.remove("updating");
      }, 140);
    }
  };

  if (bentoCards.length > 0) {
    bentoCards.forEach((card) => {
      const capKey = card.getAttribute("data-capability");
      card.addEventListener("mouseenter", () => updateBentoCenterShowcase(capKey));
      card.addEventListener("click", () => updateBentoCenterShowcase(capKey));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          updateBentoCenterShowcase(capKey);
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. SOLUTIONS EDITORIAL FILTER & PRODUCT SPECIFICATIONS MODAL
  // --------------------------------------------------------------------------
  const solutionFilterPills = document.querySelectorAll(".solutions-filter-pill");
  const solutionCards = document.querySelectorAll(".solution-card-item");

  if (solutionFilterPills.length > 0) {
    solutionFilterPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const filterValue = pill.getAttribute("data-filter");

        // Update active pill state
        solutionFilterPills.forEach((p) => {
          const isActive = p === pill;
          p.classList.toggle("is-active", isActive);
          p.setAttribute("aria-selected", isActive ? "true" : "false");
        });

        // Filter cards
        solutionCards.forEach((card) => {
          const cardCategory = card.getAttribute("data-category");
          if (filterValue === "all" || cardCategory === filterValue) {
            card.classList.remove("is-hidden");
            card.style.opacity = "0";
            card.style.transform = "translateY(12px)";
            requestAnimationFrame(() => {
              card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            });
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }

  // Compact Specifications Data Dictionary (Short & Image-Free)
  const productSpecsData = {
    "wooden-pallets": {
      index: "01",
      tag: "INDUSTRIAL LOGISTICS",
      categoryKey: "wooden-pallets",
      title: "Wooden Pallets",
      desc: "2-way & 4-way high-racking load capacity engineered for industrial warehousing.",
      specs: [
        { label: "Dynamic Load", value: "1,500 – 2,500 kg (SWL)" },
        { label: "Handling Entry", value: "2-Way & 4-Way Forklift Entry" },
        { label: "Treatment", value: "ISPM-15 Certified Heat Treated (HT)" },
        { label: "Standard Sizes", value: "Euro (1200×800) • Industrial (1200×1000) • Custom CAD" }
      ]
    },
    "wooden-crates": {
      index: "02",
      tag: "INDUSTRIAL LOGISTICS",
      categoryKey: "wooden-crates",
      title: "Heavy-Duty Crates",
      desc: "Fully enclosed, heavy equipment export crates designed for overseas transport.",
      specs: [
        { label: "Payload Capacity", value: "Up to 15+ Tonnes Heavy Cargo" },
        { label: "Framing System", value: "Structural Timber with Diagonal Sway Bracing" },
        { label: "Handling Interface", value: "4-Way Skids & Crane Sling Lifting Channels" },
        { label: "Export Standard", value: "ISPM-15 Certified Phytosanitary Pass" }
      ]
    },
    "wooden-boxes": {
      index: "03",
      tag: "EXPORT & CUSTOM",
      categoryKey: "wooden-boxes",
      title: "Timber Boxes",
      desc: "Bolted timber & steel-bracketed containment engineered for maximum durability.",
      specs: [
        { label: "Enclosure Type", value: "Solid Timber with Steel-Bolted Brackets" },
        { label: "Protection Barrier", value: "Dust & Moisture Sealed (VCI Liner Compatible)" },
        { label: "Precision Sizing", value: "Custom CAD Millimeter Tolerances (±1mm)" },
        { label: "Compliance", value: "ISPM-15 Heat Treated for Global Export" }
      ]
    },
    "nailless-plywood": {
      index: "04",
      tag: "EXPORT & CUSTOM",
      categoryKey: "nailless-plywood",
      title: "Nail-Less Plywood",
      desc: "Steel-tongue modular system, collapsible and space-efficient for global logistics.",
      specs: [
        { label: "Locking System", value: "Pre-bent Steel-Tongue Modular Tabs" },
        { label: "Assembly Speed", value: "< 2 Minutes Fast Tool-Free Assembly" },
        { label: "Storage Saving", value: "100% Flat-Pack (-80% Warehouse Volume)" },
        { label: "Material Grade", value: "High-Density Engineered Birch Plywood" }
      ]
    }
  };

  // Product Specs Modal Elements & Handlers
  const specsModal = document.getElementById("product-specs-modal");
  const specsModalCloseBtn = document.getElementById("specs-modal-close-btn");
  const specsModalBackdrop = document.getElementById("specs-modal-backdrop");
  const specsModalIndex = document.getElementById("specs-modal-index");
  const specsModalTag = document.getElementById("specs-modal-tag");
  const specsModalTitle = document.getElementById("specs-modal-title");
  const specsModalDesc = document.getElementById("specs-modal-desc");
  const specsModalGrid = document.getElementById("specs-modal-grid");
  const specsModalQuoteBtn = document.getElementById("specs-modal-quote-btn");
  const specsModalConfigBtn = document.getElementById("specs-modal-config-btn");

  let activeProductKey = "wooden-pallets";

  const openProductSpecsModal = (productKey) => {
    const data = productSpecsData[productKey] || productSpecsData["wooden-pallets"];
    activeProductKey = productKey;

    if (specsModalIndex) specsModalIndex.textContent = data.index;
    if (specsModalTag) specsModalTag.textContent = data.tag;
    if (specsModalTitle) specsModalTitle.textContent = data.title;
    if (specsModalDesc) specsModalDesc.textContent = data.desc;

    // Render Compact Key-Value Rows
    if (specsModalGrid) {
      specsModalGrid.innerHTML = data.specs
        .map(
          (item) => `
          <div class="specs-row-item">
            <span class="specs-row-label">${item.label}</span>
            <span class="specs-row-val">${item.value}</span>
          </div>`
        )
        .join("");
    }

    // Open Modal
    if (specsModal) {
      specsModal.classList.add("open");
      specsModal.setAttribute("aria-hidden", "false");
      specsModal.scrollTop = 0;
      document.body.style.overflow = "hidden";
    }
  };

  const closeProductSpecsModal = () => {
    if (specsModal) {
      specsModal.classList.remove("open");
      specsModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  };

  // Attach click events to all open-specs-btn triggers
  const openSpecsButtons = document.querySelectorAll(".open-specs-btn");
  openSpecsButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const productKey = btn.getAttribute("data-product") || "wooden-pallets";
      openProductSpecsModal(productKey);
    });
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const productKey = btn.getAttribute("data-product") || "wooden-pallets";
        openProductSpecsModal(productKey);
      }
    });
  });

  if (specsModalCloseBtn) specsModalCloseBtn.addEventListener("click", closeProductSpecsModal);
  if (specsModalBackdrop) specsModalBackdrop.addEventListener("click", closeProductSpecsModal);

  // Quote button inside specs modal
  if (specsModalQuoteBtn) {
    specsModalQuoteBtn.addEventListener("click", () => {
      closeProductSpecsModal();
      const categoryKey = productSpecsData[activeProductKey]?.categoryKey || activeProductKey;
      openQuoteModal(categoryKey);
    });
  }

  // Configurator button inside specs modal
  if (specsModalConfigBtn) {
    specsModalConfigBtn.addEventListener("click", (e) => {
      e.preventDefault();
      closeProductSpecsModal();

      const targetElement = document.getElementById("custom-packaging") || document.getElementById("packaging-configurator-root");
      if (targetElement) {
        const headerEl = document.getElementById("site-header");
        const headerHeight = headerEl ? headerEl.offsetHeight : 70;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.scrollY -
          (headerHeight + 16);

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        history.pushState(null, "", "#custom-packaging");
      }
    });
  }

  // Escape key handling for specs modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && specsModal && specsModal.classList.contains("open")) {
      closeProductSpecsModal();
    }
  });

  // --------------------------------------------------------------------------
  // 11. CUSTOM PACKAGING CONFIGURATOR & ENGINEERING BRIEF GENERATOR
  // --------------------------------------------------------------------------
  const configuratorRoot = document.getElementById("packaging-configurator-root");

  if (configuratorRoot) {
    // Configurator State Model
    const configState = {
      currentStep: 1,
      totalSteps: 6,
      productCategory: "Machinery",
      packagingType: "Wooden Pallet",
      length: "",
      width: "",
      height: "",
      dimUnit: "mm",
      weight: "",
      weightUnit: "kg",
      centreOfGravity: "Centred",
      handlingMethods: ["Forklift"],
      transportMode: "Export",
      storageProfile: "Stacked",
      additionalRequirements: "",
      reusablePackaging: "Yes",
      exportReady: "Yes",
      contactName: "",
      contactCompany: "",
      contactEmail: "",
      contactPhone: "",
      contactNotes: "",
      referenceCode: ""
    };

    const stepTitles = {
      1: "YOUR PRODUCT",
      2: "PACKAGING TYPE",
      3: "DIMENSIONS & LOAD",
      4: "HANDLING & TRANSPORT",
      5: "REQUIREMENTS",
      6: "CONTACT DETAILS",
      7: "REVIEW REQUIREMENTS"
    };

    // DOM Elements
    const form = document.getElementById("custom-configurator-form");
    const stepPanes = configuratorRoot.querySelectorAll(".config-step-pane");
    const trackNodes = configuratorRoot.querySelectorAll(".step-track-node");
    const trackConnectors = configuratorRoot.querySelectorAll(".track-connector");
    const stepCounterEl = document.getElementById("config-step-counter");
    const stepNameEl = document.getElementById("config-step-name");
    const btnBack = document.getElementById("btn-step-back");
    const btnNext = document.getElementById("btn-step-next");
    const btnNextLabel = document.getElementById("btn-next-label");
    const navFooter = document.getElementById("config-nav-footer");
    const btnRestart = document.getElementById("btn-restart-config");
    const mobileToggleBtn = document.getElementById("mobile-brief-toggle");
    const mobileBriefContent = document.getElementById("mobile-brief-content");
    const mobileBriefTarget = document.getElementById("mobile-brief-target");
    const mobileBriefBadge = document.getElementById("mobile-brief-badge");

    // Live Brief DOM Elements
    const briefValProduct = document.getElementById("brief-val-product");
    const briefSubProduct = document.getElementById("brief-sub-product");
    const briefValPackaging = document.getElementById("brief-val-packaging");
    const briefSubPackaging = document.getElementById("brief-sub-packaging");
    const briefValDimensions = document.getElementById("brief-val-dimensions");
    const briefSubDimensions = document.getElementById("brief-sub-dimensions");
    const briefValWeight = document.getElementById("brief-val-weight");
    const briefValLogistics = document.getElementById("brief-val-logistics");
    const briefSubLogistics = document.getElementById("brief-sub-logistics");
    const briefValCompliance = document.getElementById("brief-val-compliance");
    const briefStatusTag = document.getElementById("brief-status-tag");
    const briefProgressBar = document.getElementById("brief-progress-bar");
    const reviewMatrix = document.getElementById("review-specs-matrix");
    const successRefCode = document.getElementById("success-ref-code");

    // Product Category Subtitle map
    const productSubtitles = {
      "Machinery": "Industrial machinery and equipment",
      "Electrical / Electronics": "Electrical and electronic components",
      "Automotive": "Automotive components and assemblies",
      "Engineering Products": "Engineering products and industrial parts",
      "Battery / Energy": "Battery-industry and energy-related products",
      "Other Industrial": "Other industrial commercial products"
    };

    const packagingSubtitles = {
      "Wooden Pallet": "Heavy-duty 2-way / 4-way base skids",
      "Wooden Crate": "Framed heavy equipment timber crating",
      "Wooden Box": "Solid timber enclosed containment",
      "Nail-Less Plywood Box": "Steel-tongue modular interlock casing",
      "Foldable / Collapsible Box": "Knock-down return-transit system",
      "Not Sure (Recommend)": "Custom engineered recommendation"
    };

    // Update Live Brief UI
    const updateLiveBrief = () => {
      // 1. Product
      if (briefValProduct) {
        briefValProduct.textContent = configState.productCategory;
        briefValProduct.classList.add("spec-value-updated");
        setTimeout(() => briefValProduct.classList.remove("spec-value-updated"), 600);
      }
      if (briefSubProduct) {
        briefSubProduct.textContent = productSubtitles[configState.productCategory] || "Custom payload";
      }

      // 2. Packaging
      if (briefValPackaging) {
        briefValPackaging.textContent = configState.packagingType;
        briefValPackaging.classList.add("spec-value-updated");
        setTimeout(() => briefValPackaging.classList.remove("spec-value-updated"), 600);
      }
      if (briefSubPackaging) {
        briefSubPackaging.textContent = packagingSubtitles[configState.packagingType] || "Timber packaging";
      }

      // 3. Dimensions
      if (briefValDimensions) {
        const l = configState.length || "—";
        const w = configState.width || "—";
        const h = configState.height || "—";
        briefValDimensions.textContent = `${l} × ${w} × ${h} ${configState.dimUnit}`;
      }
      if (briefSubDimensions) {
        briefSubDimensions.textContent = `Centre of gravity: ${configState.centreOfGravity}`;
      }

      // 4. Weight
      if (briefValWeight) {
        const wt = configState.weight ? `${configState.weight} ${configState.weightUnit}` : `— ${configState.weightUnit}`;
        briefValWeight.textContent = wt;
      }

      // 5. Logistics
      if (briefValLogistics) {
        const handlingStr = configState.handlingMethods.length > 0 ? configState.handlingMethods.join(" + ") : "Not specified";
        briefValLogistics.textContent = `${handlingStr} • ${configState.transportMode}`;
      }
      if (briefSubLogistics) {
        briefSubLogistics.textContent = `Storage: ${configState.storageProfile}`;
      }

      // 6. Compliance & Reusability
      if (briefValCompliance) {
        const ispmText = configState.exportReady === "Yes" ? "ISPM-15 Export" : "Standard Freight";
        const reuseText = configState.reusablePackaging === "Yes" ? "Reusable" : "Single-Trip";
        briefValCompliance.textContent = `${ispmText} • ${reuseText}`;
      }

      // Update progress bar in brief
      if (briefProgressBar) {
        const pct = Math.min(100, (configState.currentStep / configState.totalSteps) * 100);
        briefProgressBar.style.width = `${pct}%`;
      }

      // Update status tag in brief
      if (briefStatusTag) {
        if (configState.currentStep <= 6) {
          briefStatusTag.textContent = `CONFIGURING STEP 0${configState.currentStep}`;
        } else if (configState.currentStep === 7) {
          briefStatusTag.textContent = `READY FOR REVIEW`;
        } else {
          briefStatusTag.textContent = `SPECIFICATION RECORDED`;
        }
      }

      // Mobile Brief Sync
      if (mobileBriefTarget) {
        const stickyPanel = document.querySelector(".sticky-brief-sheet");
        if (stickyPanel) {
          const matrixClone = stickyPanel.querySelector(".brief-specs-matrix");
          if (matrixClone) {
            mobileBriefTarget.innerHTML = matrixClone.innerHTML;
            // Attach jump link listeners in mobile brief
            mobileBriefTarget.querySelectorAll(".brief-jump-link").forEach((btn) => {
              btn.addEventListener("click", () => {
                const targetStep = parseInt(btn.getAttribute("data-jump"), 10);
                if (targetStep) {
                  goToStep(targetStep);
                  if (mobileBriefContent) mobileBriefContent.style.display = "none";
                  if (mobileToggleBtn) mobileToggleBtn.setAttribute("aria-expanded", "false");
                }
              });
            });
          }
        }
      }

      if (mobileBriefBadge) {
        mobileBriefBadge.textContent = configState.currentStep <= 6 ? `Step 0${configState.currentStep}` : `Review`;
      }
    };

    // Clear Error Message
    const clearError = (stepNum) => {
      const errBox = document.getElementById(`step-${stepNum}-error`);
      if (errBox) {
        errBox.style.display = "none";
        errBox.textContent = "";
      }
      const pane = configuratorRoot.querySelector(`.config-step-pane[data-pane="${stepNum}"]`);
      if (pane) {
        pane.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
      }
    };

    // Show Error Message
    const showError = (stepNum, message, targetInputId = null) => {
      const errBox = document.getElementById(`step-${stepNum}-error`);
      if (errBox) {
        errBox.textContent = message;
        errBox.style.display = "block";
      }
      if (targetInputId) {
        const targetInput = document.getElementById(targetInputId);
        if (targetInput) {
          targetInput.classList.add("has-error");
          targetInput.focus();
        }
      }
    };

    // Step Validation Engine
    const validateStep = (stepNum) => {
      clearError(stepNum);

      if (stepNum === 1) {
        if (!configState.productCategory) {
          showError(1, "Please select a product category to proceed.");
          return false;
        }
        return true;
      }

      if (stepNum === 2) {
        if (!configState.packagingType) {
          showError(2, "Please select a packaging type or 'Not Sure'.");
          return false;
        }
        return true;
      }

      if (stepNum === 3) {
        const lengthInput = document.getElementById("dim-length");
        const widthInput = document.getElementById("dim-width");
        const heightInput = document.getElementById("dim-height");
        const weightInput = document.getElementById("prod-weight");

        const l = parseFloat(lengthInput.value);
        const w = parseFloat(widthInput.value);
        const h = parseFloat(heightInput.value);
        const wt = parseFloat(weightInput.value);

        if (isNaN(l) || l <= 0) {
          showError(3, "Please enter a valid numeric Length (greater than 0).", "dim-length");
          return false;
        }
        if (isNaN(w) || w <= 0) {
          showError(3, "Please enter a valid numeric Width (greater than 0).", "dim-width");
          return false;
        }
        if (isNaN(h) || h <= 0) {
          showError(3, "Please enter a valid numeric Height (greater than 0).", "dim-height");
          return false;
        }
        if (isNaN(wt) || wt <= 0) {
          showError(3, "Please enter an approximate numeric payload weight.", "prod-weight");
          return false;
        }

        configState.length = lengthInput.value;
        configState.width = widthInput.value;
        configState.height = heightInput.value;
        configState.weight = weightInput.value;
        return true;
      }

      if (stepNum === 4) {
        if (configState.handlingMethods.length === 0) {
          showError(4, "Please select at least one handling method (e.g. Forklift).");
          return false;
        }
        return true;
      }

      if (stepNum === 5) {
        const reqText = document.getElementById("special-requirements-text");
        if (reqText) configState.additionalRequirements = reqText.value;
        return true;
      }

      if (stepNum === 6) {
        const nameInput = document.getElementById("cfg-contact-name");
        const compInput = document.getElementById("cfg-contact-company");
        const emailInput = document.getElementById("cfg-contact-email");
        const phoneInput = document.getElementById("cfg-contact-phone");
        const notesInput = document.getElementById("cfg-contact-notes");

        if (!nameInput.value.trim()) {
          showError(6, "Please enter your full name.", "cfg-contact-name");
          return false;
        }
        if (!compInput.value.trim()) {
          showError(6, "Please enter your company or organization name.", "cfg-contact-company");
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showError(6, "Please enter a valid business email address.", "cfg-contact-email");
          return false;
        }
        if (!phoneInput.value.trim() || phoneInput.value.trim().length < 6) {
          showError(6, "Please enter a valid contact phone number.", "cfg-contact-phone");
          return false;
        }

        configState.contactName = nameInput.value.trim();
        configState.contactCompany = compInput.value.trim();
        configState.contactEmail = emailInput.value.trim();
        configState.contactPhone = phoneInput.value.trim();
        if (notesInput) configState.contactNotes = notesInput.value.trim();
        return true;
      }

      return true;
    };

    // Render Review Matrix (Step 07)
    const renderReviewScreen = () => {
      if (!reviewMatrix) return;

      const dimStr = `${configState.length || "1200"} × ${configState.width || "800"} × ${configState.height || "900"} ${configState.dimUnit}`;
      const weightStr = `${configState.weight || "850"} ${configState.weightUnit} (Centre of Gravity: ${configState.centreOfGravity})`;
      const handlingStr = configState.handlingMethods.join(", ") || "Forklift";

      reviewMatrix.innerHTML = `
        <!-- 1. Product -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">01 / YOUR PRODUCT</span>
            <span class="review-group-val">${configState.productCategory}</span>
            <span class="review-group-sub">${productSubtitles[configState.productCategory] || ""}</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="1">Edit →</button>
        </div>

        <!-- 2. Packaging Type -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">02 / PACKAGING TYPE</span>
            <span class="review-group-val">${configState.packagingType}</span>
            <span class="review-group-sub">${packagingSubtitles[configState.packagingType] || ""}</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="2">Edit →</button>
        </div>

        <!-- 3. Dimensions & Load -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">03 / DIMENSIONS &amp; MASS</span>
            <span class="review-group-val">${dimStr} &bull; ${weightStr}</span>
            <span class="review-group-sub">Engineering calculations based on payload parameters</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="3">Edit →</button>
        </div>

        <!-- 4. Handling & Transport -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">04 / HANDLING &amp; LOGISTICS</span>
            <span class="review-group-val">${handlingStr} &bull; ${configState.transportMode} Transit</span>
            <span class="review-group-sub">Storage: ${configState.storageProfile}</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="4">Edit →</button>
        </div>

        <!-- 5. Additional Requirements -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">05 / SPECIAL REQUIREMENTS &amp; COMPLIANCE</span>
            <span class="review-group-val">Export ISPM-15: ${configState.exportReady} &bull; Reusable: ${configState.reusablePackaging}</span>
            <span class="review-group-sub">${configState.additionalRequirements ? configState.additionalRequirements : "Standard protection specifications"}</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="5">Edit →</button>
        </div>

        <!-- 6. Contact Details -->
        <div class="review-spec-group">
          <div class="review-group-left">
            <span class="review-group-tag">06 / CONTACT &amp; PROPOSAL ROUTING</span>
            <span class="review-group-val">${configState.contactName} (${configState.contactCompany})</span>
            <span class="review-group-sub">${configState.contactEmail} &bull; ${configState.contactPhone}</span>
          </div>
          <button type="button" class="review-edit-btn" data-jump="6">Edit →</button>
        </div>
      `;

      // Attach jump link listeners
      reviewMatrix.querySelectorAll(".review-edit-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const targetStep = parseInt(btn.getAttribute("data-jump"), 10);
          if (targetStep) goToStep(targetStep);
        });
      });
    };

    // Go to Specific Step
    const goToStep = (stepNum) => {
      configState.currentStep = stepNum;

      // Update Tracker Bar UI
      if (stepCounterEl) {
        if (stepNum <= 6) {
          stepCounterEl.textContent = `STEP 0${stepNum} OF 06`;
        } else if (stepNum === 7) {
          stepCounterEl.textContent = `FINAL SPECIFICATION REVIEW`;
        } else {
          stepCounterEl.textContent = `ENQUIRY RECORDED`;
        }
      }

      if (stepNameEl) {
        stepNameEl.textContent = stepTitles[stepNum] || "CUSTOM PACKAGING";
      }

      // Update Track Nodes
      trackNodes.forEach((node) => {
        const nodeStep = parseInt(node.getAttribute("data-step"), 10);
        const isActive = nodeStep === stepNum;
        const isCompleted = nodeStep < stepNum || stepNum > 6;
        node.classList.toggle("is-active", isActive);
        node.classList.toggle("is-completed", isCompleted);
        node.setAttribute("aria-selected", isActive ? "true" : "false");
      });

      // Update Track Connectors
      trackConnectors.forEach((conn, idx) => {
        const connectorStep = idx + 1;
        conn.classList.toggle("is-filled", connectorStep < stepNum);
      });

      // Show Active Pane
      stepPanes.forEach((pane) => {
        const paneId = pane.getAttribute("data-pane");
        const isTarget = paneId === String(stepNum) || (stepNum === "success" && paneId === "success");
        pane.classList.toggle("is-visible", isTarget);
      });

      // Handle Step Specific Actions
      if (stepNum === 7) {
        renderReviewScreen();
      }

      // Update Footer Navigation Controls
      if (navFooter) {
        if (stepNum === "success") {
          navFooter.style.display = "none";
        } else {
          navFooter.style.display = "flex";
          // Back Button
          if (btnBack) {
            btnBack.style.visibility = stepNum === 1 ? "hidden" : "visible";
          }
          // Next Button Label
          if (btnNextLabel) {
            if (stepNum < 6) {
              btnNextLabel.textContent = "CONTINUE";
            } else if (stepNum === 6) {
              btnNextLabel.textContent = "REVIEW REQUIREMENTS";
            } else if (stepNum === 7) {
              btnNextLabel.textContent = "REQUEST A QUOTE";
            }
          }
        }
      }

      updateLiveBrief();

      // Smooth scroll back to configurator if scrolled past or transitioning steps
      const headerHeight = header ? header.offsetHeight : 70;
      const configuratorTop = configuratorRoot.getBoundingClientRect().top + window.scrollY - (headerHeight + 20);
      if (Math.abs(window.scrollY - configuratorTop) > 60) {
        window.scrollTo({
          top: configuratorTop,
          behavior: "smooth"
        });
      }
    };

    // Step Track Node Click
    trackNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const targetStep = parseInt(node.getAttribute("data-step"), 10);
        // Only allow clicking to steps already reached or step 1
        if (targetStep < configState.currentStep) {
          goToStep(targetStep);
        } else if (targetStep > configState.currentStep) {
          if (validateStep(configState.currentStep)) {
            goToStep(targetStep);
          }
        }
      });
    });

    // Quick Jump Links in Sticky Brief
    document.querySelectorAll(".brief-jump-link").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetStep = parseInt(btn.getAttribute("data-jump"), 10);
        if (targetStep) goToStep(targetStep);
      });
    });

    // Back Button Click
    if (btnBack) {
      btnBack.addEventListener("click", () => {
        if (configState.currentStep > 1) {
          goToStep(configState.currentStep - 1);
        }
      });
    }

    // Next / Submit Button Click
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        if (configState.currentStep <= 6) {
          if (validateStep(configState.currentStep)) {
            goToStep(configState.currentStep + 1);
          }
        } else if (configState.currentStep === 7) {
          // Final Submission
          submitConfiguratorBrief();
        }
      });
    }

    // Brief Submission Handler
    const submitConfiguratorBrief = () => {
      // Generate realistic reference code
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      configState.referenceCode = `RTD-${randomDigits}`;

      if (successRefCode) {
        successRefCode.textContent = configState.referenceCode;
      }

      // Transition to success state
      goToStep("success");
    };

    // Restart Configurator Handler
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        if (form) form.reset();
        configState.length = "";
        configState.width = "";
        configState.height = "";
        configState.weight = "";
        configState.additionalRequirements = "";
        configState.contactName = "";
        configState.contactCompany = "";
        configState.contactEmail = "";
        configState.contactPhone = "";
        configState.contactNotes = "";
        goToStep(1);
      });
    }

    // Input Change Listeners for Reactive Brief Updates
    form.addEventListener("change", (e) => {
      const target = e.target;
      if (!target) return;

      // Product Category
      if (target.name === "product_category") {
        configState.productCategory = target.value;
      }
      // Packaging Type
      if (target.name === "packaging_type") {
        configState.packagingType = target.value;
      }
      // Dimension Unit
      if (target.name === "dim_unit") {
        configState.dimUnit = target.value;
        document.querySelectorAll(".current-dim-unit").forEach((el) => (el.textContent = target.value));
      }
      // Weight Unit
      if (target.name === "weight_unit") {
        configState.weightUnit = target.value;
        document.querySelectorAll(".current-weight-unit").forEach((el) => (el.textContent = target.value));
      }
      // Centre of Gravity
      if (target.name === "centre_of_gravity") {
        configState.centreOfGravity = target.value;
      }
      // Handling Methods (Checkboxes)
      if (target.name === "handling_methods") {
        const checkedMethods = [];
        form.querySelectorAll('input[name="handling_methods"]:checked').forEach((cb) => {
          checkedMethods.push(cb.value);
        });
        configState.handlingMethods = checkedMethods;
      }
      // Transportation Mode
      if (target.name === "transport_mode") {
        configState.transportMode = target.value;
      }
      // Storage Profile
      if (target.name === "storage_profile") {
        configState.storageProfile = target.value;
      }
      // Reusable Packaging
      if (target.name === "reusable_packaging") {
        configState.reusablePackaging = target.value;
      }
      // Export Ready
      if (target.name === "export_ready") {
        configState.exportReady = target.value;
      }

      updateLiveBrief();
    });

    // Realtime Input Listeners (Dimensions, Weight, Contact)
    form.addEventListener("input", (e) => {
      const target = e.target;
      if (!target) return;

      if (target.name === "length") configState.length = target.value;
      if (target.name === "width") configState.width = target.value;
      if (target.name === "height") configState.height = target.value;
      if (target.name === "weight") configState.weight = target.value;
      if (target.name === "additional_requirements") configState.additionalRequirements = target.value;
      if (target.name === "contact_name") configState.contactName = target.value;
      if (target.name === "contact_company") configState.contactCompany = target.value;
      if (target.name === "contact_email") configState.contactEmail = target.value;
      if (target.name === "contact_phone") configState.contactPhone = target.value;
      if (target.name === "contact_notes") configState.contactNotes = target.value;

      updateLiveBrief();
    });

    // Mobile Brief Drawer Accordion Toggle
    if (mobileToggleBtn && mobileBriefContent) {
      mobileToggleBtn.addEventListener("click", () => {
        const isExpanded = mobileToggleBtn.getAttribute("aria-expanded") === "true";
        mobileToggleBtn.setAttribute("aria-expanded", !isExpanded ? "true" : "false");
        mobileBriefContent.style.display = isExpanded ? "none" : "block";
      });
    }

    // Initialize Configurator State
    updateLiveBrief();
  }
});

