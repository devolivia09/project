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

const introState = {
  isComplete: false,
  pulse: null,
};

let introTimeline = null;

const base_VH = allSections[0].offsetHeight;
const half_VH = base_VH / 2;
const scrollEnd_VH = document.documentElement.offsetHeight - half_VH;

/*
 * ---------------------------------------------------------
 * [ AxisTracker ]
 *  intro 제외한 전체 화면의 스크롤에 맞춰 axis-point 움직임 조절
 * ---------------------------------------------------------
 */

function startAxisTracker() {
  const axisTracker = gsap.timeline({
    scrollTrigger: {
      trigger: section.intro,
      endTrigger: section.outro,
      start: "bottom center",
      end: "top center",
      anticipatePin: 1.25,
      scrub: 1,
    },
  });

  axisTracker.fromTo(
    axisPoint,
    {
      top: base_VH, // intro section 하단
    },
    {
      top: scrollEnd_VH, //outro section 중간 (450vh)
      ease: "none",
    },
  );
}

/*
 * ---------------------------------------------------------
 * [ Intro ]
 *   Intro 타임라인 애니메이션 & 기기별 대응
 * ---------------------------------------------------------
 */
function playIntro(startSize, endSize) {
  const tl = gsap.timeline({
    defaults: {
      ease: "power2.inOut",
      duration: 0.6,
    },
  });

  tl.set(axisPoint, {
    top: "50dvh",
    yPercent: -50,
    xPercent: -50,
  });

  tl
    //  1. point 안의 선을 90도 전환 및 point의 사이즈 축소
    .to(".intro__dot-innerline", {
      rotate: 90,
      duration: 0.6,
    })
    .to(axisPoint, {
      width: startSize,
      opacity: 1,
      ease: "back.out(3)",
    })

    //  2. point의 y 값을 intro section의 바닥까지 이동
    .to(axisPoint, {
      top: "100dvh",
      width: endSize,
      yPercent: -100,
    })

    //  3. point에 Pulse Animation 넣기
    .to(axisPoint, pulseAnimation(), "+=0.3")

    //  4. 아래로 가기 화살표 등장
    .to(
      ".intro__arrow",
      {
        opacity: 0.8,
        bottom: "4%",
      },
      "+=0.4",
    )
    .call(() => {
      introComplete = true;
      startAxisTracker();
    });
  return tl;
}

//  Intro 타임라인 기기별 대응 Desktop & Mobile
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  introTimeline = playIntro("3rem", "2.5rem");
  return () => {
    if (introTimeline) {
      introTimeline.kill();
      introTimeline = null;
    }
  };
});

mm.add("(max-width: 767px)", () => {
  introTimeline = playIntro("1.85rem", "1.5rem");

  return () => {
    if (introTimeline) {
      introTimeline.kill();
      introTimeline = null;
    }
  };
});

/*
 * ---------------------------------------------------------
 * [ Pulse Effect  ]
 *   Axis Point pulse 애니메이션
 * ---------------------------------------------------------
 */
function pulseAnimation() {
  return {
    boxShadow: "0 0 0 14px rgba(0, 0, 0, 0.18)",
    scale: 1.1,
    duration: 1.3,
    ease: "sine.inOut",
    repeat: 3,
    yoyo: true,
  };
}

/*
 * ---------------------------------------------------------
 * [ Intro Skip ]
 *   Intro 섹션 이탈 시, 클래스명 제거 & pulse 애니메이션 제거
 * ---------------------------------------------------------
 */
const clearPulseEffect = gsap.timeline({
  scrollTrigger: {
    trigger: section.intro,
    start: "top bottom",
    end: "bottom center",
    scrub: true,
    onLeave: () => {
      gsap.to(".intro__arrow", { opacity: 0 });
      gsap.to(axisPoint, { yPercent: -50 });
      introTimeline?.progress(1);
    },
    onEnterBack: () => {
      introState.pulse = gsap.to(axisPoint, pulseAnimation());
      gsap.to(".intro__arrow", { opacity: 0.5 });
      gsap.to(axisPoint, { yPercent: -100 });
    },
  },
});

/*
 * ---------------------------------------------------------
 * [ Section-indicator ]
 *   Section 진입 시, 그에 맞는 색인 변화
 * ---------------------------------------------------------
 */
allSections.forEach((eachSec) => {
  const sectionName = eachSec.dataset.name;

  const timline = gsap.timeline({
    scrollTrigger: {
      trigger: eachSec,
      start: "top center",
      end: "bottom center",
      onEnter: () => indicatorController(sectionName),
      onEnterBack: () => indicatorController(sectionName),
    },
  });
});

const indicatorController = (sectionName) => {
  gsap.killTweensOf(sectionIndicator);

  let baseOpacity = sectionName === "intro" ? 0 : 1;
  const tl = gsap.timeline();

  tl.to(sectionIndicator, { opacity: 0, duration: 0.25 }).to(sectionIndicator, {
    opacity: baseOpacity,
    textContent: sectionName,
    duration: 0.5,
  });
};

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
    start: "top bottom",
    end: "center center",
    scrub: 0.75,
    toggleActions: "play none none reverse",
  },
});

// Profile 2 :: 얼굴의 각 요소 타임라인
faceTimeline
  .from("#face", {
    x: 200,
    y: 50,
  })
  .from("#hat", {
    rotate: -270,
    transformOrigin: "top center",
  })
  .from("#eye", {
    x: -50,
    y: 100,
  })
  .from("#mouth", {
    x: 100,
    y: 50,
    rotate: -15,
  })
  .from("#mouthLine", {
    x: 60,
    y: 40,
    rotate: 180,
    transformOrigin: "top right",
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
      scrub: 0.75,
    },
    duration: 1.5,
    ease: "power2.out",
  });

  skillsTimeline.from(
    item,
    {
      x: 150,
      // y: 15,
      color: "#ccc",
      stagger: 0.3,
    },
    "+=0.5",
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
      start: "top bottom",
      end: "bottom center",
      scrub: 1,
    },
    ease: "slow(0.65,0.65,false)",
    duration: 1.5,
  });

  worksTimeline
    .to(targetImg, {
      opacity: 1,
      duration: 3,
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
const outroMessageSub = section.outro.querySelector(".outro__messages--sub");
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
