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
  // 7. DYNAMIC YEAR
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    const year = new Date().getFullYear();
    currentYearSpan.textContent = `1990–${year}`;
  }

  // --------------------------------------------------------------------------
  // 8. WHY RUSAT SPLIT LIST INTERACTION
  // --------------------------------------------------------------------------
  const whyRows = document.querySelectorAll(".why-custom-row");
  if (whyRows.length > 0) {
    const setActiveRow = (targetRow) => {
      whyRows.forEach((row) => {
        const isTarget = row === targetRow;
        row.classList.toggle("is-active", isTarget);
        const tag = row.querySelector(".tag-label");
        if (tag) {
          tag.textContent = isTarget ? "CUSTOM NOW" : "CUSTOM";
        }
      });
    };

    whyRows.forEach((row) => {
      row.addEventListener("mouseenter", () => setActiveRow(row));
      row.addEventListener("click", (e) => {
        setActiveRow(row);
        // If clicking on the tag or action, trigger quote modal
        if (
          e.target.closest(".why-row-tag") ||
          e.target.closest(".why-row-preview")
        ) {
          openQuoteModal();
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
  // 10. SOLUTIONS EDITORIAL FILTER & SPECS DROPDOWN
  // --------------------------------------------------------------------------
  const solutionFilterPills = document.querySelectorAll(".solutions-filter-pill");
  const solutionCards = document.querySelectorAll(".solution-card-item");
  const specsDropdownToggle = document.getElementById("specs-dropdown-toggle");
  const specsDropdownMenu = document.getElementById("specs-dropdown-menu");

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

  // Specs Dropdown Handling
  if (specsDropdownToggle && specsDropdownMenu) {
    const toggleDropdown = (show) => {
      const isExpanded = show !== undefined ? show : specsDropdownToggle.getAttribute("aria-expanded") !== "true";
      specsDropdownToggle.setAttribute("aria-expanded", isExpanded ? "true" : "false");
      specsDropdownMenu.classList.toggle("is-open", isExpanded);
    };

    specsDropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!specsDropdownToggle.contains(e.target) && !specsDropdownMenu.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && specsDropdownMenu.classList.contains("is-open")) {
        toggleDropdown(false);
      }
    });

    // Close dropdown when an item inside is clicked
    const dropdownItems = specsDropdownMenu.querySelectorAll(".dropdown-item");
    dropdownItems.forEach((item) => {
      item.addEventListener("click", () => {
        toggleDropdown(false);
      });
    });
  }
});
