/* The Kleeners — main.js */

// Mobile nav
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// Vertical reels: autoplay when in view, keep controls
const reels = document.querySelectorAll("video[data-autoplay-reel]");

if ("IntersectionObserver" in window && reels.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.45 }
  );

  reels.forEach((video) => {
    video.muted = true;
    observer.observe(video);
  });
}

// Quote form → WhatsApp with structured message
const form = document.getElementById("quoteForm");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = data.get("name") || "";
    const phone = data.get("phone") || "";
    const email = data.get("email") || "";
    const propertyType = data.get("propertyType") || "";
    const bedrooms = data.get("bedrooms") || "N/A";
    const sqm = data.get("sqm") || "N/A";
    const location = data.get("location") || "";
    const pest = data.get("pest") || "";
    const message = data.get("message") || "";

    const text = [
      "Hi The Kleeners — quote request from the website:",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Property: ${propertyType}`,
      `Bedrooms: ${bedrooms}`,
      `Business sqm: ${sqm}`,
      `Location: ${location}`,
      `Pest / service: ${pest}`,
      message ? `Details: ${message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://wa.me/27823852963?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener");
  });
}

// Gallery carousel arrows
const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("carouselPrev");
const nextBtn = document.getElementById("carouselNext");

if (carousel && prevBtn && nextBtn) {
  const scrollAmount = () => {
    const img = carousel.querySelector("img");
    return img ? img.offsetWidth + 14 : 300;
  };

  prevBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}


// Lightbox — full size images with swipe
(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const carouselImgs = Array.from(document.querySelectorAll(".carousel-track img"));

  if (!lightbox || !carouselImgs.length) return;

  let index = 0;
  let touchStartX = 0;

  function show(i) {
    index = (i + carouselImgs.length) % carouselImgs.length;
    const src = carouselImgs[index].getAttribute("src");
    const alt = carouselImgs[index].getAttribute("alt") || "";
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCounter.textContent = index + 1 + " / " + carouselImgs.length;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function hide() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  carouselImgs.forEach((img, i) => {
    img.addEventListener("click", () => show(i));
  });

  lightboxClose.addEventListener("click", hide);
  lightboxPrev.addEventListener("click", () => show(index - 1));
  lightboxNext.addEventListener("click", () => show(index + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) hide();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) show(index + 1);
    else show(index - 1);
  }, { passive: true });
})();
