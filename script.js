gsap.registerPlugin(ScrollTrigger);

const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1.1,
  },
});
const axisPoint = document.querySelector(".axis-point");

introTimeline
  .to(".intro__dot-inner-line", {
    rotate: 90,
  })
  .to(axisPoint, {
    width: "16px",
    height: "16px",
    opacity: 1,
    backgroundColor: "#000",
    zIndex: 3,
  })
  .to(axisPoint, {
    top: "20%",
    yPercent: -100,
    width: "14px",
    height: "14px",
  })
  .to(axisPoint, {
    onComplete: () => {
      axisPoint.classList.add("active");
    },
  });
