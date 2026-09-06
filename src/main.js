import "./style.css";

document.documentElement.classList.add("js");

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tabs = Array.from(document.querySelectorAll(".tab"));
const tabNav = document.querySelector(".tabs");
const tabInd = document.querySelector(".tab-ind");
const panels = {
  "tab-work": document.getElementById("panel-work"),
  "tab-side": document.getElementById("panel-side"),
  "tab-writing": document.getElementById("panel-writing"),
};

function moveIndicator(tab) {
  if (!tabInd || !tab) return;
  tabInd.style.left = tab.offsetLeft + "px";
  tabInd.style.width = tab.offsetWidth + "px";
}

function select(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", String(active));
    const panel = panels[t.id];
    if (!panel) return;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
  moveIndicator(tab);
  const active = tabs.find((t) => t.classList.contains("is-active"));
  if (active && active.offsetParent) {
    active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
}

if (tabs.length) {
  moveIndicator(tabs.find((t) => t.classList.contains("is-active")) || tabs[0]);
  window.addEventListener("resize", () => {
    moveIndicator(tabs.find((t) => t.classList.contains("is-active")) || tabs[0]);
  });
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
}

const revealEls = Array.from(document.querySelectorAll(".reveal"));
if (revealEls.length) {
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }
}

const timeEl = document.getElementById("local-time");
if (timeEl) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  const tick = () => {
    const now = new Date();
    timeEl.textContent = fmt.format(now);
    timeEl.setAttribute("datetime", now.toISOString());
  };
  tick();
  setInterval(tick, 30000);
}

const emailBtn = document.getElementById("email-btn");
if (emailBtn) {
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
    emailBtn.style.opacity = "1";
    emailBtn.style.color = "var(--fg-strong)";
    setTimeout(() => {
      emailBtn.textContent = original;
      emailBtn.style.color = "";
    }, 1500);
  });
}
