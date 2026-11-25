"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const topButton = document.querySelector(".to-top");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typedText = document.querySelector(".typed-text");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const savedTheme = window.localStorage.getItem("portfolio-theme");

  function applyTheme(theme, save = false) {
    document.documentElement.dataset.theme = theme;
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
    themeToggle.setAttribute("title", `Switch to ${nextTheme} mode`);
    themeToggle.querySelector(".theme-label").textContent = `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`;
    themeColor.setAttribute("content", theme === "dark" ? "#090a10" : "#f5f6fb");
    if (save) window.localStorage.setItem("portfolio-theme", theme);
  }

  const initialTheme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(initialTheme);
  themeToggle.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
  });

  if (!reducedMotion) {
    const phrases = ["Web Developer", "Problem Solver", "Lifelong Learner"];
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;

    function typeNextCharacter() {
      const phrase = phrases[phraseIndex];
      typedText.textContent = phrase.slice(0, characterIndex);
      let delay = deleting ? 55 : 95;

      if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 350;
      } else if (!deleting && characterIndex === phrases[phraseIndex].length) {
        deleting = true;
        delay = 1450;
      }

      characterIndex += deleting ? -1 : 1;
      window.setTimeout(typeNextCharacter, delay);
    }

    window.setTimeout(typeNextCharacter, 1800);
  }

  function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navMenu.classList.remove("open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navMenu.classList.toggle("open", !isOpen);
  });

  header.querySelector(".brand").addEventListener("click", closeMenu);
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("pointerdown", (event) => {
    if (navMenu.classList.contains("open") && !header.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760 && navMenu.classList.contains("open")) closeMenu();
  });

  function updateScrollUI() {
    const scrollPosition = window.scrollY;
    header.classList.toggle("scrolled", scrollPosition > 20);
    topButton.classList.toggle("visible", scrollPosition > 500);
  }
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }));

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const currentLink = navLinks.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        navLinks.forEach((link) => {
          const isCurrent = link === currentLink;
          link.classList.toggle("active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category.split(" ").includes(filter);
        card.hidden = !matches;
      });
    });
  });

  const galleries = {
    "inventory-sales-system": {
      repo: "https://github.com/thwinthwin-spec/inventory-sales-system",
      images: [
        { src: "images/screenshots/inventory-dashboard.jpg", caption: "Owner dashboard with today's sales, monthly totals and gross profit." },
        { src: "images/screenshots/inventory-products.jpg", caption: "Product catalogue with SKU, category, MMK price and stock status." }
      ]
    },
    "job-application-tracker": {
      repo: "https://github.com/thwinthwin-spec/job-application-tracker",
      images: [
        { src: "images/screenshots/job-dashboard.jpg", caption: "Job search dashboard with application counts and upcoming follow-ups." }
      ]
    },
    "clinic-appointment-app": {
      repo: "https://github.com/thwinthwin-spec/clinic-appointment-app",
      images: [
        { src: "images/screenshots/clinic-patient.jpg", caption: "Patient view: browse clinicians and reserve an available slot." },
        { src: "images/screenshots/clinic-admin.jpg", caption: "Clinic administrator dashboard for doctors and appointments." }
      ]
    },
    "restaurant-pos-project": {
      repo: "https://github.com/thwinthwin-spec/restaurant-pos-project",
      images: [
        { src: "images/screenshots/restaurant-dashboard.jpg", caption: "Restaurant overview with confirmed MMK sales and pending orders." },
        { src: "images/screenshots/restaurant-pos.jpg", caption: "Point-of-sale desk with a searchable menu and order builder." },
        { src: "images/screenshots/restaurant-login.jpg", caption: "Staff sign-in screen for the restaurant workspace." }
      ]
    },
    "hotel-booking-app": {
      repo: "https://github.com/thwinthwin-spec/hotel-booking-app",
      images: [
        { src: "images/screenshots/hotel-dashboard.jpg", caption: "Hotel admin dashboard with bookings, revenue and occupancy." },
        { src: "images/screenshots/hotel-login.jpg", caption: "Hotel admin sign-in with a demo account shortcut." }
      ]
    },
    "Boxing-Management-System": {
      repo: "https://github.com/thwinthwin-spec/Boxing-Management-System",
      images: [
        { src: "images/screenshots/boxing-home.jpg", caption: "Boxing management landing page for athletes, coaches and admins." }
      ]
    },
    "Clothing-Website": {
      repo: "https://github.com/thwinthwin-spec/Clothing-Website",
      images: [
        { src: "images/screenshots/clothing-login.jpg", caption: "Jinx Clothing sign-in page for the server-rendered store." }
      ]
    },
    "coffee_project": {
      repo: "https://github.com/thwinthwin-spec/coffee_project",
      images: [
        { src: "images/screenshots/coffee-home.jpg", caption: "Bean Boutique Coffee Shop home page with the drinks catalogue." }
      ]
    },
    "LaravelFirstproject": {
      repo: "https://github.com/thwinthwin-spec/LaravelFirstproject",
      images: [
        { src: "images/screenshots/laravel-dashboard.jpg", caption: "Laravel dashboard showing the signed-in demo user." },
        { src: "images/screenshots/laravel-login.jpg", caption: "Laravel email and password sign-in form." }
      ]
    },
    "Node.js": {
      repo: "https://github.com/thwinthwin-spec/Node.js",
      images: [
        { src: "images/screenshots/node-login.jpg", caption: "TechCall student-management sign-in page." }
      ]
    },
    "Portfolio_Thwin": {
      repo: "https://github.com/thwinthwin-spec/Portfolio_Thwin",
      images: [
        { src: "images/screenshots/portfolio-home.jpg", caption: "This portfolio site with its hero section and project section." }
      ]
    },
    "Boxing": {
      repo: "https://github.com/thwinthwin-spec/Boxing",
      images: []
    }
  };

  const galleryModal = document.getElementById("gallery-modal");
  const galleryTitle = document.getElementById("gallery-title");
  const galleryImage = document.getElementById("gallery-image");
  const galleryCaption = document.getElementById("gallery-caption");
  const galleryCounter = document.getElementById("gallery-counter");
  const galleryRepo = document.getElementById("gallery-repo");
  const galleryThumbs = document.getElementById("gallery-thumbs");
  const galleryPrev = document.querySelector("[data-gallery-prev]");
  const galleryNext = document.querySelector("[data-gallery-next]");
  const galleryClose = document.querySelector(".gallery-close");
  let activeImages = [];
  let activeIndex = 0;
  let lastTrigger = null;

  function showGalleryImage(index) {
    if (activeImages.length === 0) return;
    activeIndex = (index + activeImages.length) % activeImages.length;
    const current = activeImages[activeIndex];
    galleryImage.src = current.src;
    galleryImage.alt = current.caption;
    galleryCaption.textContent = current.caption;
    galleryCounter.textContent = (activeIndex + 1) + " / " + activeImages.length;
    const buttons = galleryThumbs.querySelectorAll(".gallery-thumb");
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex === activeIndex);
      button.setAttribute("aria-pressed", String(buttonIndex === activeIndex));
    });
  }

  function stepGallery(amount) {
    if (activeImages.length < 2) return;
    showGalleryImage(activeIndex + amount);
  }

  function closeGallery() {
    if (galleryModal.hidden) return;
    galleryModal.hidden = true;
    document.body.classList.remove("gallery-open");
    galleryImage.removeAttribute("src");
    if (lastTrigger) lastTrigger.focus();
  }

  function openGallery(key, trigger) {
    const gallery = galleries[key];
    if (!gallery) return;
    activeImages = gallery.images;
    activeIndex = 0;
    lastTrigger = trigger;
    galleryTitle.textContent = trigger.closest(".project-card").querySelector("h3").textContent;
    galleryRepo.href = gallery.repo;
    galleryThumbs.textContent = "";

    if (activeImages.length === 0) {
      galleryImage.removeAttribute("src");
      galleryImage.alt = "";
      galleryCaption.textContent = "This repository is reserved for a future project, so there are no screenshots yet.";
      galleryCounter.textContent = "0 / 0";
      galleryPrev.disabled = true;
      galleryNext.disabled = true;
      galleryImage.hidden = true;
      const empty = document.createElement("p");
      empty.className = "gallery-empty";
      empty.textContent = "No screenshots yet — check the repository description for the current status.";
      galleryThumbs.appendChild(empty);
    } else {
      galleryImage.hidden = false;
      galleryPrev.disabled = activeImages.length < 2;
      galleryNext.disabled = activeImages.length < 2;
      activeImages.forEach((image, index) => {
        const button = document.createElement("button");
        button.className = "gallery-thumb";
        button.type = "button";
        button.setAttribute("aria-label", "Show screenshot " + (index + 1));
        button.setAttribute("aria-pressed", "false");
        const thumb = document.createElement("img");
        thumb.src = image.src;
        thumb.alt = "";
        thumb.loading = "lazy";
        button.appendChild(thumb);
        button.addEventListener("click", () => showGalleryImage(index));
        galleryThumbs.appendChild(button);
      });
      showGalleryImage(0);
    }

    galleryModal.hidden = false;
    document.body.classList.add("gallery-open");
    galleryClose.focus();
  }

  document.querySelectorAll("[data-gallery]").forEach((button) => {
    button.addEventListener("click", () => openGallery(button.dataset.gallery, button));
  });
  galleryClose.addEventListener("click", closeGallery);
  galleryModal.querySelectorAll("[data-gallery-close]").forEach((element) => element.addEventListener("click", closeGallery));
  galleryPrev.addEventListener("click", () => stepGallery(-1));
  galleryNext.addEventListener("click", () => stepGallery(1));
  document.addEventListener("keydown", (event) => {
    if (galleryModal.hidden) return;
    if (event.key === "Escape") closeGallery();
    if (event.key === "ArrowLeft") stepGallery(-1);
    if (event.key === "ArrowRight") stepGallery(1);
  });

  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;
  const fields = [
    { input: form.elements.name, error: document.getElementById("name-error"), label: "Full name", validate: (value) => value.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)." },
    { input: form.elements.email, error: document.getElementById("email-error"), label: "Email address", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Please enter a valid email address." },
    { input: form.elements.subject, error: document.getElementById("subject-error"), label: "Subject", validate: (value) => value.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters)." },
    { input: form.elements.message, error: document.getElementById("message-error"), label: "Message", validate: (value) => value.trim().length >= 10 ? "" : "Please enter a message (at least 10 characters)." }
  ];

  fields.forEach(({ input, error, validate }) => {
    input.addEventListener("input", () => {
      if (input.getAttribute("aria-invalid") === "true") {
        const message = validate(input.value);
        error.textContent = message;
        input.setAttribute("aria-invalid", String(Boolean(message)));
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalidField = null;
    fields.forEach(({ input, error, validate }) => {
      const message = validate(input.value);
      error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));
      if (message && !firstInvalidField) firstInvalidField = input;
    });

    if (firstInvalidField) {
      status.textContent = "Please correct the highlighted fields before continuing.";
      firstInvalidField.focus();
      return;
    }

    const values = new FormData(form);
    const subject = encodeURIComponent(values.get("subject").trim());
    const body = encodeURIComponent(`From: ${values.get("name").trim()} (${values.get("email").trim()})\n\n${values.get("message").trim()}`);
    status.textContent = "Your email app should open with the message ready. Nothing is sent or stored by this page.";
    window.location.href = `mailto:htoothwin055@gmail.com?subject=${subject}&body=${body}`;
  });
});
