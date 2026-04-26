gsap.registerPlugin(ScrollTrigger);

const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1,
  },
});
const axisPoint = document.querySelector(".axis-point");

// Intro Timeline 정의
introTimeline.set(axisPoint, {
  top: "10%",
});

//  Intro Animation
introTimeline
  .to(".intro__dot-inner-line", {
    rotate: 90,
  })
  .to(axisPoint, {
    width: "17px",
    height: "17px",
    opacity: 1,
    duration: 1.75,
  })
  .to(axisPoint, {
    top: "20%",
    yPercent: -100,
    width: "14px",
    height: "14px",
    duration: 1,
  })
  .to(axisPoint, {
    onComplete: () => {
      axisPoint.classList.add("active");
    },
  })
  .to(
    ".material-symbols-outlined",
    {
      opacity: 1,
    },
    "+=2",
  );

// Axis Point Scroll Animation for Profile Section
const axisPointTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "top 55%",
    end: "bottom 55%",
    scrub: 0.75,
    markers: true,
  },
});
axisPointTimeline.fromTo(
  axisPoint,
  {
    top: "20%",
  },
  {
    top: "40%",
    onStart: () => {
      axisPoint.classList.remove("active");
    },
    onReverseComplete: () => {
      axisPoint.classList.add("active");
    },
  },
);
