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
const axisPoint = document.querySelector(".axis-point");
const introSection = document.querySelector("section.intro");
const introHeight = introSection.offsetHeight;
const axisStartPoint = introSection.offsetHeight * 0.5;

const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1,
  },
});

// 2. introTimeline 기본 top값 설정
introTimeline.set(axisPoint, {
  top: axisStartPoint,
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
    top: introHeight,
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
    ".intro__arrow",
    {
      opacity: 0.65,
    },
    "+=2.5",
  );

// 4. introTimeline 건너뛰기 : 사용자 편의
ScrollTrigger.create({
  trigger: "section.intro",
  start: "top top",
  onLeave: () => {
    introTimeline.progress(1);
    gsap.to(".intro__arrow", {
      opacity: 0,
    });
  },
  // once: true,
});

/* * ---------------------------------------------------------
 * [프로필 섹션] 애니메이션 타임라인
 * 1. 프로필 섹션의 축 포인트 애니메이션 타임라인
 * 2. axisPointTimeline 포인트 이동 범위 제한
 * 3. Profile 섹션의 각 아이템 나타나는 애니메이션
 * 4.
 * ---------------------------------------------------------
 */

// 1. axisPointTimeline Instance 정의
const axisPointTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "top 55%",
    end: "bottom 55%",
    scrub: 0.85,
  },
});

// 2. axisPointTimeline 포인트 이동 범위 제한
axisPointTimeline.fromTo(
  axisPoint,
  {
    top: introHeight,
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

// 3. Profile 섹션의 각 아이템 애니메이션 (오른쪽에서 왼쪽 진입)
const profileItems = document.querySelectorAll(".profile__item");

profileItems.forEach((item) => {
  gsap.fromTo(
    item,
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.85,
      scrollTrigger: {
        trigger: item,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 0.85,
      },
    },
    "-=0.75",
  );
});

const profileItemTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "25% 80%",
    end: "center 50%",
    scrub: 0.75,
    toggleActions: "play none none reverse",
  },
});

profileItemTimeline
  .from("#face", {
    x: 350,
    y: 100,
  })
  .from("#hat", {
    rotate: -360,
    transformOrigin: "center center",
  })
  .from("#eye", {
    x: -150,
  })
  .from("#mouth", {
    x: 100,
    y: 50,
    rotate: -25,
  })
  .from("#mouthLine", {
    x: -100,
    y: 20,
  })
  .from("#nose", {
    y: -10,
    rotate: -90,
  });
/*


#
#
#
#



*/
