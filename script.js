gsap.registerPlugin(ScrollTrigger);

/* * ---------------------------------------------------------
 * [인트로 섹션] 애니메이션 타임라인
 * 1. introTimeline Instance 정의
 * 2. introTimeline 기본 top값 설정
 * 3. introTimeline 애니메이션
 * 4. introTimeline 건너뛰기 : 사용자 편의
 * ---------------------------------------------------------
 */

// 1. introTimeline 정의
const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1,
  },
});
const axisPoint = document.querySelector(".axis-point");

// 2. introTimeline 기본 top값 설정
introTimeline.set(axisPoint, {
  top: "10%",
});

// 3. introTimeline 애니메이션
introTimeline
  .to(".intro__dot-inner-line", {
    rotate: 90,
  })
  .to(axisPoint, {
    width: "17px",
    height: "17px",
    opacity: 1,
    duration: 0.5,
    ease: "back.out(1.7)",
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

// 4. introTimeline 건너뛰기 : 사용자 편의
ScrollTrigger.create({
  trigger: "section.intro",
  start: "top top",
  onleave: () => {
    introTimeline.progress(1);
    once: true;
  },
});

/* * ---------------------------------------------------------
 * [프로필 섹션] 프로필 섹션의 축 포인트 애니메이션 타임라인
 * 1. axisPointTimeline Instance 정의
 * 2. axisPointTimeline 포인트 이동 범위 제한
 * 3.
 * 4.
 * ---------------------------------------------------------
 */

// 1. axisPointTimeline Instance 정의
const axisPointTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "top 55%",
    end: "bottom 55%",
    scrub: 0.75,
    markers: true,
  },
});

// 2. axisPointTimeline 포인트 이동 범위 제한
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

// 3.
