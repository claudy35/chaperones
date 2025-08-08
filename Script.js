
  const links = document.querySelectorAll('.nav-items a');
  const currentPath = window.location.pathname;

  links.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });


  const hamburger = document.getElementById("hamburger");
  const navItems = document.getElementById("nav-items");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  hamburger.addEventListener("click", () => {
    navItems.classList.add("open");
    overlay.classList.add("show");
  });

  closeBtn.addEventListener("click", () => {
    navItems.classList.remove("open");
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", () => {
    navItems.classList.remove("open");
    overlay.classList.remove("show");
  });

