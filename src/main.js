import "./style.css";

(() => {
  const tabs = Array.from(document.querySelectorAll(".tab"));
  const panels = {
    "tab-work": document.getElementById("panel-work"),
    "tab-side": document.getElementById("panel-side"),
    "tab-writing": document.getElementById("panel-writing"),
  };

  function select(tab) {
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      const panel = panels[t.id];
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const i = tabs.indexOf(t);
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      select(next);
    });
  });

  const timeEl = document.getElementById("local-time");
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  function tick() {
    const now = new Date();
    timeEl.textContent = fmt.format(now);
    timeEl.setAttribute("datetime", now.toISOString());
  }
  tick();
  setInterval(tick, 30000);

  const emailBtn = document.getElementById("email-btn");
  emailBtn.addEventListener("click", async () => {
    const email = emailBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = "mailto:" + email;
      return;
    }
    const original = emailBtn.textContent;
    emailBtn.textContent = "copied";
    setTimeout(() => {
      emailBtn.textContent = original;
    }, 1500);
  });
})();
