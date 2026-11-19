
"use strict";

// ========================================
// SUHAS S K — PORTFOLIO JAVASCRIPT
// ========================================

// ELEMENT REFERENCES
const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const scrollTopButton = document.getElementById("scroll-top-button");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ========================================
// 1. MOBILE NAVIGATION
// ========================================

function syncMenuAccessibility() {
  if (!navMenu) return;

  const mobile = window.innerWidth <= 850;
  const open = navMenu.classList.contains("open");

  navMenu.inert = mobile && !open;
}

function setMenu(open) {
  if (!navMenu || !menuToggle) return;

  navMenu.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);

  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation menu" : "Open navigation menu"
  );

  document.body.classList.toggle("menu-open", open);

  syncMenuAccessibility();
}

menuToggle?.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("open"));
});

document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    const wasOpen = navMenu?.classList.contains("open");

    setMenu(false);

    if (wasOpen) {
      menuToggle?.focus();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 850) {
    setMenu(false);
  }

  syncMenuAccessibility();
});

syncMenuAccessibility();

// ========================================
// 2. HEADER AND SCROLL TOP
// ========================================

function updateScrollUI() {
  const scrollY = window.scrollY;

  header?.classList.toggle("scrolled", scrollY > 25);

  if (scrollTopButton) {
    const show = scrollY > 500;

    scrollTopButton.classList.toggle("visible", show);
    scrollTopButton.tabIndex = show ? 0 : -1;
  }
}

window.addEventListener("scroll", updateScrollUI, {
  passive: true
});

updateScrollUI();

// ========================================
// 3. ACTIVE NAVIGATION
// ========================================

function updateActiveNavigation() {
  let currentSection = "home";

  const offset = window.scrollY +
    (header?.offsetHeight || 80) + 100;

  sections.forEach(section => {
    if (offset >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    const active =
      link.getAttribute("href") === "#" + currentSection;

    link.classList.toggle("active", active);

    if (active) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("scroll", updateActiveNavigation, {
  passive: true
});

window.addEventListener("resize", updateActiveNavigation);

updateActiveNavigation();

// ========================================
// 4. TYPING ANIMATION
// ========================================

const typingElement = document.getElementById("typed-text");

const roles = [
  "Full Stack Developer",
  "Software Engineer",
  "Web Developer",
  "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function animateTyping() {
  if (!typingElement) return;

  const role = roles[roleIndex];

  charIndex += deleting ? -1 : 1;

  typingElement.textContent = role.slice(0, charIndex);

  let delay = deleting ? 50 : 90;

  if (!deleting && charIndex === role.length) {
    deleting = true;
    delay = 1800;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 330;
  }

  window.setTimeout(animateTyping, delay);
}

if (typingElement) {
  if (reducedMotion) {
    typingElement.textContent = roles[0];
  } else {
    typingElement.textContent = "";
    animateTyping();
  }
}

// ========================================
// 5. SCROLL REVEAL ANIMATIONS
// ========================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !reducedMotion) {
  document.documentElement.classList.add("js");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.07,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => {
    element.classList.add("visible");
  });
}

// ========================================
// 6. PROFILE IMAGE
// ========================================

// Your exact file:
// assets/profile.png

const profilePhoto = document.getElementById("profile-photo");
const photoPlaceholder = document.getElementById("photo-placeholder");

if (profilePhoto && photoPlaceholder) {
  function showPhoto() {
    profilePhoto.hidden = false;
    photoPlaceholder.hidden = true;
  }

  function showPlaceholder() {
    profilePhoto.hidden = true;
    photoPlaceholder.hidden = false;
  }

  profilePhoto.addEventListener("load", showPhoto);
  profilePhoto.addEventListener("error", showPlaceholder);

  if (profilePhoto.complete) {
    if (profilePhoto.naturalWidth > 0) {
      showPhoto();
    } else {
      showPlaceholder();
    }
  }
}

// ========================================
// 7. COPY EMAIL
// ========================================

const copyEmailButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");

const emailAddress = "suhas0824sk@gmail.com";

copyEmailButton?.addEventListener("click", async () => {
  let success = false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(emailAddress);
      success = true;
    } else {
      const temp = document.createElement("textarea");

      temp.value = emailAddress;
      temp.style.position = "fixed";
      temp.style.opacity = "0";

      document.body.appendChild(temp);

      temp.focus();
      temp.select();

      success = document.execCommand("copy");

      temp.remove();
    }
  } catch (error) {
    success = false;
  }

  if (success) {
    if (copyStatus) {
      copyStatus.textContent = "Email copied to clipboard!";
    }

    copyEmailButton.textContent = "✓ Email Copied";
  } else {
    if (copyStatus) {
      copyStatus.textContent = "Copy manually: " + emailAddress;
    }

    copyEmailButton.textContent = "Copy Email Address";
  }
});

// ========================================
// 8. SMOOTH INTERNAL NAVIGATION
// ========================================

function getTargetPosition(target) {
  const headerHeight = header?.offsetHeight || 0;

  return Math.max(
    target.getBoundingClientRect().top +
    window.scrollY -
    headerHeight -
    8,
    0
  );
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const hash = link.getAttribute("href");

    if (!hash || hash === "#") return;

    const target = document.getElementById(hash.slice(1));

    if (!target) return;

    event.preventDefault();

    setMenu(false);

    window.scrollTo({
      top: getTargetPosition(target),
      behavior: reducedMotion ? "auto" : "smooth"
    });

    if (window.location.hash !== hash) {
      history.pushState(null, "", hash);
    }
  });
});

// ========================================
// 9. BROWSER BACK / FORWARD
// ========================================

function navigateToCurrentHash() {
  const hash = window.location.hash;

  if (!hash) {
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    return;
  }

  const target = document.getElementById(
    decodeURIComponent(hash.substring(1))
  );

  if (target) {
    window.scrollTo({
      top: getTargetPosition(target),
      behavior: "auto"
    });
  }
}

window.addEventListener("popstate", navigateToCurrentHash);

window.addEventListener("load", () => {
  if (window.location.hash) {
    navigateToCurrentHash();
  }
});

// ========================================
// 10. COPYRIGHT YEAR
// ========================================

const yearElement = document.getElementById("current-year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// ========================================
// 11. INITIALIZATION
// ========================================

console.log("Suhas S K Portfolio — Final Version Loaded");
