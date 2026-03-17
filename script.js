const mobileToggle = document.querySelector(".mobile-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");

if (mobileToggle && siteNav) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const slides = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.querySelector(".dots");
const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

let currentSlide = 0;
let autoPlayTimer;

function updateSlider(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === index);
  });

  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
    dot.setAttribute("aria-selected", String(i === index));
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  updateSlider(currentSlide);
}

function startAutoPlay() {
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 6000);
}

if (slides.length && dotsContainer) {
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.role = "tab";
    dot.setAttribute("aria-label", `${i + 1}. slayta git`);
    dot.setAttribute("aria-selected", "false");
    dot.addEventListener("click", () => {
      goToSlide(i);
      startAutoPlay();
    });
    dotsContainer.appendChild(dot);
  });

  updateSlider(0);
  startAutoPlay();
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    goToSlide(currentSlide - 1);
    startAutoPlay();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    goToSlide(currentSlide + 1);
    startAutoPlay();
  });
}

const countdownBlocks = Array.from(document.querySelectorAll(".countdown[data-target]"));

function updateCountdownBlock(block) {
  const targetText = block.getAttribute("data-target");
  const targetMs = targetText ? new Date(targetText).getTime() : NaN;
  if (Number.isNaN(targetMs)) return;

  const label = block.querySelector(".countdown-label");
  if (label && !block.dataset.defaultLabel) {
    block.dataset.defaultLabel = label.textContent.trim();
  }

  const nowMs = Date.now();
  let diff = targetMs - nowMs;

  if (diff <= 0) {
    diff = 0;
    block.classList.add("is-finished");
    if (label) {
      label.textContent = "Etkinlik Başladı";
    }
  } else {
    block.classList.remove("is-finished");
    if (label && block.dataset.defaultLabel) {
      label.textContent = block.dataset.defaultLabel;
    }
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const values = {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0")
  };

  Object.entries(values).forEach(([unit, value]) => {
    const node = block.querySelector(`.countdown-value[data-unit="${unit}"]`);
    if (node) {
      node.textContent = value;
    }
  });
}

if (countdownBlocks.length) {
  const tickCountdowns = () => {
    countdownBlocks.forEach(updateCountdownBlock);
  };

  tickCountdowns();
  setInterval(tickCountdowns, 1000);
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealItems.length) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("in-view"));
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  const navEntry = performance.getEntriesByType("navigation")[0];
  const isReload = navEntry && navEntry.type === "reload";

  if (isReload) {
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
});
