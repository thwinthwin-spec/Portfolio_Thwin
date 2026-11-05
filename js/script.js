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
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navMenu.classList.toggle("open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
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

  document.getElementById("current-year").textContent = String(new Date().getFullYear());

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
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
