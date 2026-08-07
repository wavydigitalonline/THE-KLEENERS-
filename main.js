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
