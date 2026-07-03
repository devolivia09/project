gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(ScrollToPlugin);

const section = {
  intro: document.querySelector(".intro"),
  profile: document.querySelector(".profile"),
  skills: document.querySelector(".skills"),
  works: document.querySelector(".works"),
  outro: document.querySelector(".outro"),
};

const allSections = Object.values(section);
const axisPoint = document.querySelector(".axis-point");
const sectionIndicator = document.querySelector(".section-indicator");

const BASE_HEIGHT = 100;
const HALF_HEIGHT = BASE_HEIGHT / 2;

let isIntroComplete = false;
let introTimeline;

/*
 * ---------------------------------------------------------
 * [ Axis-Line ]
 *  intro 제외한 각 섹션의 축 포인트 제어하는 타임라인
 * ---------------------------------------------------------
 */
function startAxisTracker() {
  const axisTracker = gsap.timeline({
    scrollTrigger: {
      trigger: allSections[1],
      start: "top center",
      endTrigger: allSections[allSections.length - 1],
      end: "bottom bottom",
      scrub: 1,
      anticipatePin: 1,
    },
  });

  axisTracker.fromTo(
    axisPoint,
    {
      top: `${BASE_HEIGHT}dvh`,
    },
    {
      top: `450dvh`,
      ease: "none",
    },
  );
}

/*
 * ---------------------------------------------------------
 * [ Section-indicator ]
 *   Section 진입 시, 그에 맞는 색인 변화
 * ---------------------------------------------------------
 */
const indicatorController = (sectionName) => {
  gsap.killTweensOf(sectionIndicator);

  const timeline = gsap.timeline();
  let baseOpacity = sectionName === "intro" ? 0 : 1;

  timeline
    .to(sectionIndicator, { opacity: 0, duration: 0.25 })
    .to(sectionIndicator, {
      opacity: baseOpacity,
      textContent: sectionName,
      duration: 0.5,
    });
};

allSections.forEach((eachSec) => {
  const sectionName = eachSec.dataset.name;

  const indicatorTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: eachSec,
      start: "top center",
      end: "bottom center",
      onEnter: () => indicatorController(sectionName),
      onEnterBack: () => indicatorController(sectionName),
    },
  });
});

/*
 * ---------------------------------------------------------
 * [ Pulse Effect ]
 *   Intro 섹션 이탈 시, 클래스명 제거 & pulse 애니메이션 제거
 * ---------------------------------------------------------
 */
let pulseHandle;

const pulseAnimation = () => {
  return {
    boxShadow: "0 0 0 18px rgba(0, 0, 0, 0.18)",
    scale: 1.1,
    duration: 1.3,
    ease: "none",
    repeat: -1,
    yoyo: true,
  };
};

const clearPulseTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section.intro,
    start: "top center",
    end: "bottom center",
    scrub: true,
    onLeave: () => {
      gsap.to(".intro__arrow", { opacity: 0 });
      if (introTimeline) {
        introTimeline.progress(1);
      }
      gsap.to(axisPoint, { yPercent: -50 });
      if (pulseHandle) {
        pulseHandle.pause();
      }
    },
    onEnterBack: () => {
      pulseHandle = gsap.to(axisPoint, pulseAnimation());
      gsap.to(".intro__arrow", { opacity: 0.5 });
      gsap.to(axisPoint, { yPercent: -100 });
    },
  },
});

/*
 * ---------------------------------------------------------
 * [ Intro ]
 *   Intro 타임라인 애니메이션 (기기별 반응형 대응)
 * ---------------------------------------------------------
 */

let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  introTimeline = startIntroAnimation("2.6rem", "2.2rem");
  return () => {
    if (introTimeline) {
      introTimeline.kill();
      introTimeline = null;
    }
  };
});

mm.add("(max-width: 767px)", () => {
  introTimeline = startIntroAnimation("1.8rem", "1.4rem");
  return () => {
    if (introTimeline) {
      introTimeline.kill();
      introTimeline = null;
    }
  };
});

function startIntroAnimation(startDotSize, endDotSize) {
  const timeline = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
      duration: 0.85,
    },
    onComplete: () => {
      isIntroComplete = true;
      startAxisTracker();
    },
  });

  timeline.set(axisPoint, {
    top: `${HALF_HEIGHT}dvh`,
    yPercent: -50,
    xPercent: -50,
  });

  timeline
    //  1. point 안의 선을 90도 전환 및 point의 사이즈 축소
    .to(".intro__dot-innerline", {
      rotate: 90,
    })
    .to(axisPoint, {
      width: startDotSize,
      opacity: 1,
      duration: 1,
      ease: "back.out(3)",
    })

    //  2. point의 y 값을 intro section의 바닥까지 이동
    .to(axisPoint, {
      top: `${BASE_HEIGHT}dvh`,
      width: endDotSize,
    })
    .to(
      axisPoint,
      {
        yPercent: -100,
      },
      "<",
    )
    //  3. point에 Pulse Animation 넣기
    .to(axisPoint, pulseAnimation(), "+=0.3")

    //  4. 아래로 가기 화살표 등장
    .to(
      ".intro__arrow",
      {
        bottom: "2%",
        opacity: 0.6,
        ease: "power2.out",
      },
      "+=1.5",
    );

  return timeline;
}

//
/* * ---------------------------------------------------------
 * [ Profile 섹션]
 * 1 :: 섹션의 각 요소 타임라인 (아이템 우측 Slide-in)
 * 2 :: 얼굴의 각 요소 타임라인
 * ---------------------------------------------------------
 */
const profileItems = document.querySelectorAll(".profile__item");

// Profile 1 :: 섹션의 각 요소 타임라인 (아이템 우측 Slide-in)
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

const faceTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "section.profile",
    start: "25% 80%",
    end: "center 50%",
    scrub: 0.75,
    toggleActions: "play none none reverse",
  },
});

// Profile 2 :: 얼굴의 각 요소 타임라인
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
 * [ Skills ]
 *   기술 섹션의 요소들(언어) 애니메이션 타임라인
 * ---------------------------------------------------------
 */
const listItems = section.skills.querySelectorAll(
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

/*
 ---------------------------------------------------------
 * [ Works ]
 *   item 요소들의 스크롤 인터랙션 제어
 ---------------------------------------------------------
 */
const worksItems = gsap.utils.toArray(".works__item");

worksItems.forEach((item) => {
  const targetImg = item.querySelector(".works__thumbnail img");
  const targetTxt = item.querySelector(".works-desc");

  const worksTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: item,
      start: "top 90%",
      end: "bottom 45%",
      scrub: 1,
    },
    ease: "slow(0.7,0.7,false)",
    duration: 1.25,
  });

  worksTimeline
    .to(targetImg, {
      opacity: 1,
    })
    .to(
      targetTxt,
      {
        color: "#000",
      },
      "<",
    );
});

//
/* * ---------------------------------------------------------
 * [ Outro ]
 * 1 :: cursorBlink 함수 정의 (커서 숨김 & 깜빡임)
 * 2 :: 섹션 클로징 타이핑 애니메이션
 * 3 :: 섹션의 메뉴 마우스 이벤트 설정
 * 4 :: Outro 메뉴의 클릭 이벤트 설정 (해당 섹션으로 스크롤 이동)
 * ---------------------------------------------------------
 */
const outroTitle = section.outro.querySelector(".outro__title");
const outroSubTitle = section.outro.querySelector(".outro__subtitle");
const outroMessageSub = section.outro.querySelector(".outro__message--sub");
const outroCursor = section.outro.querySelector(".outro__cursor");
const outroLists = section.outro.querySelectorAll(".outro__menu li");
const outroLinks = section.outro.querySelectorAll(".outro__menu li a");

const outroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section.outro,
    start: "top 65%",
    end: "bottom 35%",
    toggleActions: "play none none reverse",
  },
  ease: "none",
});

// 1 :: cursorBlink 함수 정의 (커서 숨김 & 깜빡임)
const cursorBlink = (target, count, showAtEnd = true) => {
  const timelilne = gsap.timeline();

  timelilne
    .set(target, {
      autoAlpha: 0,
    })
    .to(target, {
      autoAlpha: 1,
      repeat: count,
      duration: 0.4,
      yoyo: true,
      ease: "steps(1)",
    });

  return timelilne;
};

// 2 :: 섹션 클로징 타이핑 애니메이션
outroTimeline.set([outroTitle, outroSubTitle], {
  text: "",
  autoAlpha: 0,
});

outroTimeline
  // 2-1. 커서 깜빡임 & End 타이핑
  .add(cursorBlink(outroCursor, 3))
  .set(outroCursor, { autoAlpha: 1 })
  .to(
    outroTitle,
    {
      text: "End?",
      duration: 0.55,
      autoAlpha: 1,
    },
    "+=0.25",
  )

  // 2-2. 커서 깜빡임 & End 지우기
  .add(cursorBlink(outroCursor, 2))
  .set(outroCursor, { autoAlpha: 1 })
  .to(
    outroTitle,
    {
      text: {
        value: "",
        rtl: true,
      },
      duration: 1,
    },
    "+=0.1",
  )

  // 2-3. 커서 깜빡임 & And 타이핑
  .add(cursorBlink(outroCursor, 1))
  .set(outroCursor, { autoAlpha: 1 })
  .to(outroTitle, {
    text: "And",
    duration: 0.4,
    autoAlpha: 1,
  })

  // 2-4. 커서 깜빡임 & 커서 다음 줄 이동
  .add(cursorBlink(outroCursor, 2))
  .to(
    outroCursor,
    {
      autoAlpha: 1,
      onComplete: () => {
        outroMessageSub.appendChild(outroCursor);
      },
    },
    "<",
  )

  // 2-5. To be continued 타이핑 & 커서 깜박임 후 사라짐
  .to(outroSubTitle, {
    text: "To be continued",
    duration: 0.95,
    autoAlpha: 1,
  })
  .add(cursorBlink(outroCursor, 3))
  .set(outroCursor, { autoAlpha: 0 })

  // 2-6. 메뉴 나타남
  .to(
    outroLists,
    { x: 0, duration: 1.2, opacity: 1, stagger: 0.3, ease: "back.out(1.7)" },
    "+=0.35",
  )

  .to(axisPoint, pulseAnimation());

outroLinks.forEach((link) => {
  // 3 :: 섹션 메뉴의 마우스 hover 설정
  link.addEventListener("mouseenter", () => {
    gsap.to(link, {
      borderBottom: "1px solid black",
      duration: 0.5,
    });
  });
  link.addEventListener("mouseleave", () => {
    gsap.to(link, {
      borderBottom: "1px solid #fff",
      duration: 0.5,
    });
  });

  // 4 :: Outro 메뉴의 클릭 이벤트 설정 (해당 섹션으로 스크롤 이동)
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetSection = link.dataset.target;
    const targetElement = section[targetSection];
    if (targetSection) {
      gsap.to(window, {
        scrollTo: {
          y: targetElement,
          autoKill: false,
        },
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  });
});
