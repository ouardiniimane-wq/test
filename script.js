(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // -----------------------------
  // Navbar: transparency on top,
  // solid background on scroll
  // -----------------------------
  const navbar = $(".navbar");
  const navLinks = $(".nav-links");
  const hamburger = $("[data-hamburger]");

  function setNavOpen(open) {
    // We toggle on <body> to keep CSS simple.
    document.body.classList.toggle("nav-open", open);
    if (hamburger) hamburger.setAttribute("aria-expanded", String(open));
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const open = document.body.classList.contains("nav-open") ? false : true;
      setNavOpen(open);
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("nav-open")) return;
    const target = e.target;
    if (!navbar || navbar.contains(target)) return;
    setNavOpen(false);
  });

  // Make navbar solid after a small scroll
  const NAV_SOLID_AT = 24;
  function updateNavbar() {
    if (!navbar) return;
    const solid = window.scrollY > NAV_SOLID_AT;
    navbar.classList.toggle("navbar--solid", solid);
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  // -----------------------------
  // Smooth scrolling + menu close
  // -----------------------------
  $$(".nav-link, .brand").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      setNavOpen(false);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // -----------------------------
  // Scroll reveal animations
  // -----------------------------
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("reveal--in");
        }
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal--in"));
  }

  // -----------------------------
  // Image placeholders (self-contained)
  // -----------------------------
  // We generate tiny “atelier” visuals as inline SVG data-URIs.
  function svgDataUri(svg) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function makeJelabaSvg(seed, variant) {
    // Deterministic color picks from seed/variant
    const palettes = [
      { a: "#d9b56b", b: "#0f3a2a", c: "#d8c7a1" },
      { a: "#b8873b", b: "#123b2c", c: "#cdb792" },
      { a: "#d9b56b", b: "#0a241a", c: "#d8c7a1" },
      { a: "#b8873b", b: "#0f3a2a", c: "#cdb792" },
    ];
    const p = palettes[(seed.charCodeAt(0) + variant.length) % palettes.length];
    const s = seed.replace(/[^a-z0-9]/gi, "").slice(0, 6);
    const n = (s.charCodeAt(0) || 70) % 100;
    const w = 900;
    const h = 620;
    const drapeX = 420 + (n - 50) * 0.8;
    const motifX = 250 + (n % 70) * 2;
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${p.b}" stop-opacity="0.92"/>
            <stop offset="0.55" stop-color="${p.c}" stop-opacity="0.18"/>
            <stop offset="1" stop-color="#050605" stop-opacity="0.95"/>
          </linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="${p.a}" stop-opacity="0.95"/>
            <stop offset="1" stop-color="${p.a}" stop-opacity="0.35"/>
          </linearGradient>
          <pattern id="pattern" width="90" height="90" patternUnits="userSpaceOnUse">
            <path d="M45 4 L58 26 L45 48 L32 26 Z" fill="none" stroke="${p.a}" stroke-opacity="0.28" stroke-width="2"/>
            <path d="M4 45 L26 58 L48 45 L26 32 Z" fill="none" stroke="${p.a}" stroke-opacity="0.18" stroke-width="2"/>
          </pattern>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feMerge>
              <feMergeNode in="b"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#bg)"/>
        <rect width="${w}" height="${h}" fill="url(#pattern)" opacity="0.55"/>
        <!-- Draped silhouette -->
        <path d="M${drapeX} 60
                 C${drapeX + 40} 120, ${drapeX + 40} 200, ${drapeX} 260
                 C${drapeX - 40} 320, ${drapeX - 40} 430, ${drapeX} 560
                 C${drapeX + 10} 590, ${drapeX + 60} 590, ${drapeX + 110} 560
                 C${drapeX + 160} 520, ${drapeX + 170} 420, ${drapeX + 140} 340
                 C${drapeX + 120} 280, ${drapeX + 110} 205, ${drapeX + 145} 130
                 C${drapeX + 165} 90, ${drapeX + 110} 55, ${drapeX} 60 Z"
              fill="${p.c}" fill-opacity="0.14" filter="url(#soft)"/>
        <!-- Gold seams / motifs -->
        <path d="M${motifX} 95 C${motifX + 40} 160, ${motifX + 60} 250, ${motifX + 20} 340
                 C${motifX - 20} 420, ${motifX - 10} 520, ${motifX + 50} 590"
              fill="none" stroke="url(#gold)" stroke-width="6" stroke-linecap="round" opacity="0.9"/>
        <path d="M${motifX + 90} 90 C${motifX + 130} 160, ${motifX + 140} 250, ${motifX + 100} 330
                 C${motifX + 70} 420, ${motifX + 90} 510, ${motifX + 150} 600"
              fill="none" stroke="${p.a}" stroke-opacity="0.18" stroke-width="4" stroke-linecap="round"/>
        <!-- Soft vignette -->
        <radialGradient id="vig" cx="50%" cy="35%" r="70%">
          <stop offset="0" stop-color="#000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity="0.65"/>
        </radialGradient>
        <rect width="${w}" height="${h}" fill="url(#vig)"/>
        <!-- Tiny brand mark -->
        <text x="50" y="${h - 55}" font-family="Georgia, 'Times New Roman', Times, serif"
              font-size="34" fill="${p.a}" fill-opacity="0.78" letter-spacing="0.12em">${variant.toUpperCase().slice(0, 8)}</text>
      </svg>
    `;
  }

  function setGeneratedImages() {
    const extCandidates = ["jpg", "jpeg", "png", "webp"];

    // Try to load a local image file, falling back to the generated SVG.
    // This keeps the site working even if you haven't added images yet.
    function tryLoadImage(el, urlCandidates, onSuccess) {
      if (!el) return;
      let i = 0;
      function next() {
        if (i >= urlCandidates.length) return;
        const url = urlCandidates[i++];
        const img = new Image();
        img.onload = () => onSuccess(url);
        img.onerror = next;
        img.src = url;
      }
      next();
    }

    function fileCandidates(baseName) {
      return extCandidates.map((ext) => `${baseName}.${ext}`);
    }

    // -----------------------------
    // Hero background replacement
    // -----------------------------
    const heroBg = $(".hero-bg");
    if (heroBg) {
      const heroBase = heroBg.getAttribute("data-hero-img") || "hero";
      // Keep the CSS gradients; replace only the last background url layer.
      const heroBgStyles = [
        `radial-gradient(900px 600px at 20% 0%, rgba(217, 181, 107, 0.23), transparent 55%)`,
        `radial-gradient(1000px 720px at 90% 10%, rgba(15, 58, 42, 0.35), transparent 60%)`,
        `linear-gradient(180deg, rgba(5, 6, 5, 0.2), rgba(5, 6, 5, 0.8))`,
      ].join(",");
      const heroCandidates = fileCandidates(heroBase);

      // Generate fallback immediately (already applied by CSS), but attempt replacement if a file exists.
      tryLoadImage(heroBg, heroCandidates, (url) => {
        heroBg.style.background = `${heroBgStyles}, url("${url}")`;
        heroBg.style.backgroundSize = "cover";
        heroBg.style.backgroundPosition = "center";
      });
    }

    // -----------------------------
    // Collection: <img> elements
    // -----------------------------
    const imgs = $$("img[data-img]");
    imgs.forEach((img) => {
      const seed = img.getAttribute("data-img") || "x";
      const variant = img.getAttribute("alt") || "jelaba";
      // Fallback first
      img.src = svgDataUri(makeJelabaSvg(seed, variant));

      // Then try real local files from the same directory.
      tryLoadImage(
        img,
        fileCandidates(seed),
        (url) => {
          img.src = url;
        }
      );
    });

    // Decorative blocks (about)
    const blocks = $$(".about-img[data-img]");
    blocks.forEach((b) => {
      const seed = b.getAttribute("data-img") || "about";
      const variant = "atelier";
      // Fallback first
      b.style.backgroundImage = `url("${svgDataUri(makeJelabaSvg(seed, variant))}")`;
      b.style.backgroundSize = "cover";
      b.style.backgroundPosition = "center";

      // Attempt local replacement
      tryLoadImage(b, fileCandidates(seed), (url) => {
        b.style.backgroundImage = `url("${url}")`;
      });
    });

    // Lookbook: use a background-image on .shot-img
    const shotImgs = $$(".shot-img[data-img]");
    shotImgs.forEach((el) => {
      const seed = el.getAttribute("data-img") || "lb";
      const variant = "look";
      // Fallback first
      el.style.backgroundImage = `url("${svgDataUri(makeJelabaSvg(seed, variant))}")`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";

      // Attempt local replacement
      tryLoadImage(el, fileCandidates(seed), (url) => {
        el.style.backgroundImage = `url("${url}")`;
      });
    });
  }

  function setLookbookHeights() {
    // Gives each card a different height so the masonry columns look intentional.
    const shots = $$(".shot[data-seed]");
    shots.forEach((shot) => {
      const seed = shot.getAttribute("data-seed") || "lb";
      const img = $(".shot-img", shot);
      if (!img) return;

      const n = seed.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const options = [320, 360, 400, 440, 480];
      const h = options[n % options.length];
      img.style.setProperty("--h", `${h}px`);
    });
  }

  setGeneratedImages();
  setLookbookHeights();

  // -----------------------------
  // Collection filtering (JS)
  // -----------------------------
  const filterButtons = $$("[data-filter]");
  const cards = $$(".card[data-categories]");

  function applyFilter(filter) {
    const normalized = String(filter).toLowerCase().trim();
    filterButtons.forEach((btn) => {
      const active = btn.getAttribute("data-filter") === normalized;
      btn.classList.toggle("is-active", active);
    });

    cards.forEach((card) => {
      const cats = (card.getAttribute("data-categories") || "").split(/\s+/).filter(Boolean);
      const match = normalized === "all" ? true : cats.includes(normalized);
      // Transition-friendly visibility: toggle hidden + opacity via inline style
      card.style.display = match ? "" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.getAttribute("data-filter")));
  });

  // Default
  applyFilter("all");

  // -----------------------------
  // Contact form validation (front-end only)
  // -----------------------------
  const form = $("#contactForm");
  const successBox = $("[data-success]");
  const nameInput = form ? form.elements["name"] : null;
  const emailInput = form ? form.elements["email"] : null;
  const messageInput = form ? form.elements["message"] : null;

  function setError(inputEl, message) {
    if (!form) return;
    if (!inputEl || !inputEl.name) return;
    const key = inputEl.name;
    const errorEl = form ? $(`[data-error-for="${CSS.escape(key)}"]`, form) : null;
    if (!errorEl) return;
    errorEl.textContent = message || "";
  }

  function clearErrors() {
    if (!form) return;
    ["name", "email", "message"].forEach((key) => {
      const errorEl = $(`[data-error-for="${key}"]`, form);
      if (errorEl) errorEl.textContent = "";
    });
    if (successBox) successBox.hidden = true;
    if (successBox) successBox.textContent = "";
  }

  function isValidEmail(email) {
    // Practical email validation for front-end only
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    if (!form) return true;
    clearErrors();

    const name = (nameInput?.value || "").trim();
    const email = (emailInput?.value || "").trim();
    const message = (messageInput?.value || "").trim();

    let ok = true;

    if (name.length < 2) {
      setError(nameInput, "Please enter your name (at least 2 characters).");
      ok = false;
    }

    if (!isValidEmail(email)) {
      setError(emailInput, "Please enter a valid email address.");
      ok = false;
    }

    if (message.length < 10) {
      setError(messageInput, "Message must be at least 10 characters.");
      ok = false;
    }

    return ok;
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = validate();
      if (!valid) return;
      if (successBox) {
        successBox.hidden = false;
        successBox.textContent = "Message received (simulated). Thank you for contacting ZAHRA.";
      }
      // Prevent the reset handler from clearing the success message right away.
      form.dataset.skipClear = "true";
      form.reset();
    });

    form.addEventListener("reset", () => {
      if (form.dataset.skipClear === "true") {
        delete form.dataset.skipClear;
        return;
      }
      clearErrors();
    });
  }

  // Footer year
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

