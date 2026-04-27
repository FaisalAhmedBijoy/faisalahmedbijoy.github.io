document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeButton = document.querySelector(".theme-btn");
  const menuButton = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav-links");
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const revealItems = document.querySelectorAll(".reveal");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const copyButton = document.querySelector(".copy-email");
  const toast = document.querySelector(".toast");
  
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  
  function setTheme(theme) {
    body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
    themeButton.textContent = theme === "dark" ? "Light" : "Dark";
    themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
  }
  
  setTheme(initialTheme);
  
  themeButton.addEventListener("click", () => {
    setTheme(body.classList.contains("dark") ? "light" : "dark");
  });
  
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
  
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
  
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  
  revealItems.forEach((item) => revealObserver.observe(item));
  
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        navLinks.forEach((link) => link.classList.toggle("is-active", link === active));
      });
    },
    { rootMargin: "-35% 0px -58% 0px" }
  );
  
  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
  
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      projectCards.forEach((card) => {
        const tags = card.dataset.tags.split(" ");
        card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
      });
    });
  });
  
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }
  
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied.");
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
});
