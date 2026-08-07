/* =========================================================
   Whack-A-Pest — vanilla JS interactivity
   No frameworks, no build step. Loaded with `defer`, so the
   DOM is already parsed by the time this runs.
   ========================================================= */

/* ---------- sticky / glass header on scroll ---------- */
(function stickyHeader() {
  var header = document.getElementById("site-header");
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
/* ---------- mobile menu ---------- */
(function mobileMenu() {
  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var icon = document.getElementById("menu-icon");
  if (!toggle || !menu || !icon) return;

  var open = false;

  function setOpen(next) {
    open = next;
    menu.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      icon.innerHTML = '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>';
    } else {
      icon.innerHTML = '<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>';
    }
  }

  toggle.addEventListener("click", function () {
    setOpen(!open);
  });

  menu.querySelectorAll(".mobile-link").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && open) setOpen(false);
  });
})();
/* ---------- FAQ accordion (one open at a time, first open by default) ---------- */
(function faqAccordion() {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  function closeAll() {
    items.forEach(function (item) {
      item.classList.remove("open");
      var q = item.querySelector(".faq-question");
      if (q) q.setAttribute("aria-expanded", "false");
    });
  }

  function openItem(item) {
    item.classList.add("open");
    var q = item.querySelector(".faq-question");
    if (q) q.setAttribute("aria-expanded", "true");
  }

  items.forEach(function (item) {
    var question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      closeAll();
      if (!isOpen) openItem(item);
    });
  });

  // First FAQ open by default, matching the original site.
  openItem(items[0]);
})();
/* ---------- footer year ---------- */
(function footerYear() {
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

/* ---------- quote form -> opens a pre-filled email ---------- */
(function quoteForm() {
  var form = document.getElementById("quote-form");
  var status = document.getElementById("quote-status");
  var submitBtn = document.getElementById("quote-submit");
  if (!form || !status || !submitBtn) return;

  function showStatus(message, isError) {
    status.textContent = message;
    status.style.color = isError ? "#f87171" : "var(--primary)";
    status.classList.remove("hidden");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = Object.fromEntries(new FormData(form).entries());

    var subject = "Quote request from " + (data.name || "website visitor");

    var body =
      "Name: " + (data.name || "-") +
      "\nPhone: " + (data.phone || "-") +
      "\nEmail: " + (data.email || "-") +
      "\nProperty Type: " + (data.property_type || "-") +
      "\nPest Problem: " + (data.pest_problem || "-") +
      "\nMessage: " + (data.message || "-");

    var mailtoLink =
      "mailto:whackapest@zohomail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    window.location.href = mailtoLink;

    showStatus(
      "Opening your email app to send this through — if nothing opens, WhatsApp or call us directly.",
      false
    );
  });
})();

/* ---------- sticky header (already in base) + carousel + lightbox + quote WhatsApp ---------- */

// Override quote form to WhatsApp for The Kleeners
(function kleenersQuote() {
  var form = document.getElementById("quote-form");
  if (!form) return;
  // remove previous listeners by cloning
  var newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(newForm).entries());
    var text = [
      "Hi The Kleeners — quote request from the website:",
      "",
      "Name: " + (data.name || "-"),
      "Phone: " + (data.phone || "-"),
      data.email ? "Email: " + data.email : null,
      "Property: " + (data.property_type || "-"),
      "Bedrooms: " + (data.bedrooms || "N/A"),
      "Business sqm: " + (data.sqm || "N/A"),
      "Location: " + (data.location || "-"),
      "Pest / service: " + (data.pest_problem || "-"),
      data.message ? "Details: " + data.message : null,
    ].filter(Boolean).join("\n");
    window.open("https://wa.me/27823852963?text=" + encodeURIComponent(text), "_blank", "noopener");
  });
})();

// Gallery carousel arrows
(function carousel() {
  var el = document.getElementById("carousel");
  var prev = document.getElementById("carouselPrev");
  var next = document.getElementById("carouselNext");
  if (!el || !prev || !next) return;
  function amount() {
    var img = el.querySelector("img");
    return img ? img.offsetWidth + 14 : 300;
  }
  prev.addEventListener("click", function () {
    el.scrollBy({ left: -amount(), behavior: "smooth" });
  });
  next.addEventListener("click", function () {
    el.scrollBy({ left: amount(), behavior: "smooth" });
  });
})();

// Video autoplay when in view
(function reels() {
  var videos = document.querySelectorAll("video[data-autoplay-reel]");
  if (!videos.length || !("IntersectionObserver" in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.play().catch(function () {});
      else entry.target.pause();
    });
  }, { threshold: 0.4 });
  videos.forEach(function (v) {
    v.muted = true;
    obs.observe(v);
  });
})();

// Lightbox
(function lightbox() {
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lightboxImg");
  var closeBtn = document.getElementById("lightboxClose");
  var prevBtn = document.getElementById("lightboxPrev");
  var nextBtn = document.getElementById("lightboxNext");
  var counter = document.getElementById("lightboxCounter");
  var imgs = Array.from(document.querySelectorAll(".carousel-track img"));
  if (!box || !imgs.length) return;
  var index = 0;
  var startX = 0;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    img.src = imgs[index].getAttribute("src");
    img.alt = imgs[index].getAttribute("alt") || "";
    if (counter) counter.textContent = index + 1 + " / " + imgs.length;
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function hide() {
    box.hidden = true;
    document.body.style.overflow = "";
  }

  imgs.forEach(function (el, i) {
    el.addEventListener("click", function () { show(i); });
  });
  if (closeBtn) closeBtn.addEventListener("click", hide);
  if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) hide(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  box.addEventListener("touchstart", function (e) {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });
  box.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].screenX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) show(index + 1);
    else show(index - 1);
  }, { passive: true });
})();
