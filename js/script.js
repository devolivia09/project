gsap.registerPlugin(ScrollTrigger);

/*
 * ---------------------------------------------------------
 * [ Axis-Line ] 애니메이션 타임라인
 * 각 섹션(intro, .outro 제외)에서의 축 포인트 애니메이션 타임라인
 * ---------------------------------------------------------
 */
const axisPoint = document.querySelector(".axis-point");
const sectionArray = gsap.utils.toArray(".profile, .skills, .works");
const basic_Height = 100;

sectionArray.forEach((section, idx) => {
  const startPos = basic_Height * (idx + 1);
  const endPos = basic_Height + startPos;

  const axisTracker = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 60%",
      end: "bottom 60%",
      scrub: 0.35,
    },
  });

  axisTracker.fromTo(
    axisPoint,
    {
      top: `${startPos}dvh`,
    },
    {
      top: `${endPos}dvh`,
    },
  );
});

//
/* * ---------------------------------------------------------
 * [ Intro ] 애니메이션 타임라인
 * 1. introTimeline Instance 정의
 * 2. introTimeline 기본 top값 설정
 * 3. introTimeline 애니메이션
 * 4. introTimeline 건너뛰기 : 사용자 편의
 * ---------------------------------------------------------
 */

// 1. introTimeline 정의

// const introSection = document.querySelector("section.intro");
const introHeight = `${basic_Height}dvh`;
const Axis_Start = `${basic_Height / 2}dvh`;

const introTimeline = gsap.timeline({
  defaults: {
    ease: "power2.inOut",
    duration: 1,
  },
});

// 2. introTimeline 기본 top값 설정
introTimeline.set(axisPoint, {
  top: Axis_Start,
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
  })
  .to(axisPoint, {
    onComplete: () => {
      axisPoint.classList.add("active");
    },
    duration: 0.5,
  })
  .to(
    ".intro__arrow",
    {
      opacity: 0.65,
    },
    "+=2",
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
});

//
/* * ---------------------------------------------------------
 * [ Profile 섹션] 애니메이션 타임라인
 * 1. Profile 섹션의 축 포인트 이동 범위 제한
 * 2. Profile 섹션의 각 아이템 애니메이션 (오른쪽에서 왼쪽 진입)
 * 3. 얼굴의 각 요소 애니메이션
 * ---------------------------------------------------------
 */

// 1. 프로필 섹션의 축 포인트 이동 범위 제한
const axisPointTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "top bottom",
    end: "bottom top",
    scrub: 0.85,
  },
});

axisPointTimeline.to(axisPoint, {
  onStart: () => {
    axisPoint.classList.remove("active");
  },
  onReverseComplete: () => {
    axisPoint.classList.add("active");
  },
});

// 2. Profile 섹션의 각 요소 애니메이션 (아이템들이 오른쪽에서 왼쪽으로 진입)
const profileItems = document.querySelectorAll(".profile__item");

profileItems.forEach((item) => {
  gsap.fromTo(
    item,
    { opacity: 0, x: 60 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: item,
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1,
      },
    },
    "-=0.85",
  );
});

// 3. 얼굴의 각 요소 애니메이션
const faceTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "25% 80%",
    end: "center 50%",
    scrub: 0.75,
    toggleActions: "play none none reverse",
  },
});

faceTimeline
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

//
/* * ---------------------------------------------------------
 * [ Skills ] 애니메이션 타임라인
 * 1. 기술 섹션의 요소들(언어) 애니메이션 함수
 * 2.
 * 3.
 * 4.
 * ---------------------------------------------------------
 */

// 1. 기술 섹션의 요소들(언어) 애니메이션 함수
const listItems = document.querySelectorAll(
  ".skills__arrow, .skills__title, .skills__desc li",
);

listItems.forEach((item) => {
  const skillsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: "top 80%",
      end: "bottom 60%",
      scrub: 1,
    },
    duration: 1.5,
    ease: "power2.out",
  });

  skillsTimeline.from(
    item,
    {
      y: 10,
      color: "#ccc",
      stagger: 0.3,
    },
    "+=1",
  );
});

//
/* * ---------------------------------------------------------
 * [ Works ] 섹션 애니메이션
 * 1. Works 섹션의 주요 프로젝트(Works) 리스트 및 스크롤 인터랙션 제어
 * 2.
 * 3.
 * 4.
 * ---------------------------------------------------------
 */
const timeline = gsap.timeline(".works", {
  scrollTrigger: {
    trigger: ".works",
    start: "top center",
    end: "end center",
    scub: 0.85,
  },
});

timeline.to(".works", {
  backgroundColor: "#000",
  duration: 1,
  ease: "power2.out",
});

//
/* * ---------------------------------------------------------
 * [ Outro ] 애니메이션 타임라인
 * 1.
 * 2.
 * 3.
 * 4.
 * ---------------------------------------------------------
 */
