// --- Menu burger ---
(function () {
  const burger = document.getElementById("burgerBtn");
  const nav = document.getElementById("mainNav");
  if (!burger || !nav) return;

  const closeNav = () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    nav.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
  };

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) closeNav();
    else openNav();
  });

  // Ferme après clic sur un lien
  nav.addEventListener("click", (e) => {
    if (e.target && e.target.matches(".nav-link")) closeNav();
  });

  // Ferme avec Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Ferme si clic en dehors
  document.addEventListener("click", (e) => {
    const target = e.target;
    const clickedInside = nav.contains(target) || burger.contains(target);
    if (!clickedInside) closeNav();
  });

  // Ferme si on repasse en desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeNav();
  });
})();

// --- Accordion FAQ (accessible avec hidden) ---
(function () {
  const wrap = document.querySelector("[data-accordion]");
  if (!wrap) return;

  const buttons = wrap.querySelectorAll(".acc-btn");

  const closeAll = () => {
    buttons.forEach((btn) => {
      btn.setAttribute("aria-expanded", "false");
      const panel = btn.nextElementSibling;
      if (panel && panel.classList.contains("acc-panel")) panel.hidden = true;
    });
  };

  // Init : tout fermé
  closeAll();

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      if (!panel || !panel.classList.contains("acc-panel")) return;

      const isOpen = btn.getAttribute("aria-expanded") === "true";

      closeAll();

      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });
})();

// --- Checklist + localStorage ---
(function () {
  const list = document.querySelector("[data-checklist]");
  if (!list) return;

  const key = "checklist_" + (list.getAttribute("data-checklist") || "default");
  const checkboxes = list.querySelectorAll("input[type='checkbox'][data-item]");
  const countEl = document.getElementById("checkCount");
  const totalEl = document.getElementById("checkTotal");
  const resetBtn = document.getElementById("resetChecklist");

  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch {}

  const update = () => {
    let done = 0;
    checkboxes.forEach((cb) => { if (cb.checked) done++; });
    if (countEl) countEl.textContent = String(done);
    if (totalEl) totalEl.textContent = String(checkboxes.length);
  };

  checkboxes.forEach((cb) => {
    const item = cb.getAttribute("data-item");
    if (item && saved[item] === true) cb.checked = true;

    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-item");
      if (!id) return;

      saved[id] = cb.checked;

      try { localStorage.setItem(key, JSON.stringify(saved)); } catch {}
      update();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      checkboxes.forEach((cb) => (cb.checked = false));
      saved = {};
      try { localStorage.removeItem(key); } catch {}
      update();
    });
  }

  update();
})();

// --- Contact form validation (avec aria-invalid + focus) ---
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("msg");

  const errName = document.getElementById("errName");
  const errEmail = document.getElementById("errEmail");
  const errMsg = document.getElementById("errMsg");
  const success = document.getElementById("successMsg");

  const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const setFieldState = (field, errEl, ok) => {
    if (!field) return;
    field.setAttribute("aria-invalid", ok ? "false" : "true");
    if (errEl) errEl.hidden = !!ok;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameOk = !!(nameEl && nameEl.value.trim().length >= 2);
    const emailOk = !!(emailEl && isEmailValid(emailEl.value.trim()));
    const msgOk = !!(msgEl && msgEl.value.trim().length >= 10);

    setFieldState(nameEl, errName, nameOk);
    setFieldState(emailEl, errEmail, emailOk);
    setFieldState(msgEl, errMsg, msgOk);

    const allOk = nameOk && emailOk && msgOk;

    if (success) success.hidden = !allOk;

    if (!allOk) {
      // Focus sur le premier champ en erreur
      if (!nameOk && nameEl) nameEl.focus();
      else if (!emailOk && emailEl) emailEl.focus();
      else if (!msgOk && msgEl) msgEl.focus();
      return;
    }

    form.reset();
    // Reset aria-invalid après reset
    if (nameEl) nameEl.setAttribute("aria-invalid", "false");
    if (emailEl) emailEl.setAttribute("aria-invalid", "false");
    if (msgEl) msgEl.setAttribute("aria-invalid", "false");

    setTimeout(() => { if (success) success.hidden = true; }, 4000);
  });
})();
