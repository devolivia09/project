gsap.registerPlugin(ScrollTrigger);

const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1,
  },
});

introTimeline
  .to(".intro__dot-inner-line", {
    rotate: 90,
    yPercent: -50,
  })
  .to(".intro__circle", {
    width: "1rem",
    height: "1rem",
    opacity: 1,
  })
  .to(".intro__circle", {
    top: "100%",
    yPercent: -100,
    width: "0.85rem",
    height: "0.85rem",
  })
  .to(
    ".intro__circle",
    {
      onComplete: () => {
        document.querySelector(".intro__circle").classList.add("active");
      },
    },
    "+=0.25",
  );
