const tl = gsap.timeline({ paused: true });

function revealMenu() {
  revealMenuItems();

  const toggleBtn = document.getElementById("menu-toggle");
  const closeBtn = document.getElementById("close-menu");

  toggleBtn.onclick = function (e) {
    tl.reversed(!tl.reversed());
  };

  closeBtn.onclick = function (e) {
    tl.reversed(!tl.reversed());
  };
}

revealMenu();

function revealMenuItems() {
  tl.to(".menu-container", 0.01, {
    height: "210px",
  });

  tl.to(".col-1", 1, {
    left: "-200px",
    ease: "power4.inOut",
  });

  tl.to(
    ".col-2",
    0.025,
    {
      left: "0px",
      ease: "power4.inOut",
    },
    "<"
  );

  tl.to(
    ".col-2 > .menu-item",
    1,
    {
      left: 0,
      ease: "power4.inOut",
      stagger: {
        amount: 0.25,
      },
    },
    "<"
  ).reverse();
}

gsap.to(".marquee", {
  x: "-25%",
  duration: 10,
  ease: "none",
  repeat: -1,
  yoyo: true,
});

document.addEventListener("DOMContentLoaded", function () {
  var menuContainer = document.querySelector(".menu-container");
  var marqueeContainer = document.querySelector("#main-page .marquee-container");
  var isInsideMenuContainer = false;

  menuContainer.addEventListener("mouseenter", function () {
    isInsideMenuContainer = true;
    marqueeContainer.style.display = "block";
  });

  menuContainer.addEventListener("mousemove", function (event) {
    if (isInsideMenuContainer) {
      marqueeContainer.style.display = "block";
      var pageXOffset =
        window.pageXOffset || document.documentElement.scrollLeft;
      var pageYOffset =
        window.pageYOffset || document.documentElement.scrollTop;

      var cursorX = event.clientX + pageXOffset;
      var cursorY = event.clientY + pageYOffset;

      var containerX = cursorX - marqueeContainer.offsetWidth / 2;
      var containerY = cursorY - marqueeContainer.offsetHeight / 2;

      gsap.to(marqueeContainer, {
        scale: 1,
        left: containerX + 25,
        top: containerY,
        duration: 1,
        ease: "power3.out",
      });
    }
  });

  menuContainer.addEventListener("mouseleave", function () {
    isInsideMenuContainer = false;
    gsap.to(marqueeContainer, {
      scale: 0,
      duration: 0.5,
      ease: "power3.out",
      onComplete: function () {
        marqueeContainer.style.display = "none";
      },
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var menuContainer = document.querySelector(".menu-container");
  var marqueeText = document.querySelector("#main-page .marquee");

  var isInsideMenuContainer = false;

  menuContainer.addEventListener("mouseenter", function () {
    isInsideMenuContainer = true;
  });

  menuContainer.addEventListener("mousemove", function (event) {
    if (isInsideMenuContainer) {
      var hoveredMenuItem = event.target.closest(".menu-item");
      var hoveredText = hoveredMenuItem.textContent.trim() || "home";
      var marqueeContent = (hoveredText + "  ").repeat(12);
      marqueeText.innerHTML = marqueeContent.replace(/\s/g, "&nbsp;");
    }
  });

  menuContainer.addEventListener("mouseleave", function () {
    isInsideMenuContainer = false;
    var marqueeContent = ("home" + "  ").repeat(12);
    marqueeText.innerHTML = marqueeContent.replace(/\s/g, "&nbsp;");
  });
});

document.querySelectorAll('.menu-item').forEach(item => {
  const target = item.getAttribute('data-target');

  if (target) {
    item.addEventListener('click', () => {
      window.location.href = target;
    });
  }
});

