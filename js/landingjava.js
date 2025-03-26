gsap.to(".bar", {
  delay: 1,
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 1,
  ease: "power4.inOut",
  stagger: {
    amount: 0.5,
    from: "random",
  },
});

gsap.to(".finder-container img", {
  scale: 1,
  delay: 2,
});

gsap.to(".finder-container img", {
  scale: 0,
  delay: 5,
  duration: 0.5,
  stagger: 0.075,
});

gsap.to(".bar", {
  delay: 5,
  clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
  duration: 1,
  ease: "power4.inOut",
  stagger: {
    amount: 0.5,
    from: "random",
  },
});

gsap.to(".marquee", {
  delay: 0,
  left: "0vw",
  duration: 4,
  ease: "power4.inOut",
  onComplete: () => {
    gsap.to(".marquee", {
      opacity: 0,
      repeat: 4,
      yoyo: true,
      duration: 0.1,
      onComplete: () => {
        gsap.to(".marquee", {
          opacity: 1,
        });
      },
    });
  },
});

gsap.to(".marquee", {
  delay: 4,
  left: "-100vw",
  duration: 4,
  ease: "power4.inOut",
});
