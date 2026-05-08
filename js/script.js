gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);

/*
 * ---------------------------------------------------------
 * [ Axis-Line ] 애니메이션 타임라인
 * 각 섹션(intro, .outro 제외)에서의 축 포인트 애니메이션 타임라인
 * ---------------------------------------------------------
 */
const axisPoint = document.querySelector(".axis-point");
const section = {
  intro: document.querySelector(".intro"),
  profile: document.querySelector(".profile"),
  skills: document.querySelector(".skills"),
  works: document.querySelector(".works"),
  outro: document.querySelector(".outro"),
};
const sectionArray = Object.values(section).slice(1, 5);

const basic_Height = 100;

sectionArray.forEach((section, idx) => {
  const startPos = basic_Height * (idx + 1);
  const endPos = basic_Height + startPos;

  const axisTracker = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top center",
      end: "bottom 55%",
      scrub: 0.5,
      ease: "none",
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

/*
 * ---------------------------------------------------------
 * [ Pulse Effect ] Pulse 애니메이션 관련
 * 1. Profile 섹션 진입 시, 축 포인트 클래스명 제거
 * 2. Outro 섹션 진입 시, 축 포인트 클래스명 추가
 * ---------------------------------------------------------
 */

// 1.  Profile 섹션 진입 시, 축 포인트 클래스명 제거
const clearPulseTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section.profile,
    start: "top bottom",
    end: "bottom top",
    scrub: 0.85,
  },
});

clearPulseTimeline.to(axisPoint, {
  onStart: () => {
    axisPoint.classList.remove("active");
  },
  onReverseComplete: () => {
    axisPoint.classList.add("active");
  },
});

// 2. Outro 섹션 진입 시, 축 포인트 클래스명 추가
const applyPulseTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section.outro,
    start: "top bottom",
    end: "bottom top",
    scrub: 0.85,
  },
});

applyPulseTimeline.to(axisPoint, {
  onStart: () => {
    axisPoint.classList.add("active");
  },
  onReverseComplete: () => {
    axisPoint.classList.remove("active");
  },
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
    width: "15px",
    height: "15px",
    opacity: 1,
    duration: 0.5,
    ease: "back.out(1.7)",
  })
  .to(axisPoint, {
    top: introHeight,
    yPercent: -100,
    width: "13px",
    height: "13px",
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
 * 1. Profile 섹션의 각 아이템 애니메이션 (오른쪽에서 왼쪽 진입)
 * 2. 얼굴의 각 요소 애니메이션
 * ---------------------------------------------------------
 */

// 1. Profile 섹션의 각 요소 애니메이션 (아이템들이 오른쪽에서 왼쪽으로 진입)
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

// 2. 얼굴의 각 요소 애니메이션
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
 * ---------------------------------------------------------
 */

// 1. 기술 섹션의 요소들(언어) 애니메이션 함수
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
 * [ Works ] 섹션 애니메이션
 * 1. item 요소들의 스크롤 인터랙션 제어
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
 * [ Outro ] 애니메이션 타임라인
 * 1.
 * 2.
 * 3.
 * 4.
 * ---------------------------------------------------------
 */

const outroTitle = section.outro.querySelector(".outro__title");
const outroSubTitle = section.outro.querySelector(".outro__subtitle");
const outroMessageSub = section.outro.querySelector(".outro__message--sub");
const outroCursor = section.outro.querySelector(".outro__cursor");

const outroTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: section.outro,
    start: "top 65%",
    end: "bottom 35%",
    toggleActions: "play none none reverse",
    markers: true,
  },
  ease: "none",
});

outroTimeline.set([outroTitle, outroSubTitle], {
  text: "",
});
outroTimeline.set([outroCursor], {
  autoAlpha: 0,
});

outroTimeline
/// 1. 커서 깜빡임
  .to(outroCursor, {
    autoAlpha: 1,
    repeat: 4,
    duration: 0.4,
    yoyo: true,
    ease: "steps(1)",    
  })

/// 2. 커서 깜빡임 멈춤, End 타이핑
  .to(
    outroTitle,
    {
      onStart: () => {
        gsap.set(outroCursor, {autoAlpha: 1})
      },
      text: "End?",
      duration: 0.65,
      autoAlpha: 1,
    },"+=0.25"
  )

/// 3. 커서 깜빡임
  .to(outroCursor, {
    autoAlpha: 0,    
  })
  .to(outroCursor, {    
    autoAlpha: 1,
    repeat: 2,
    duration: 0.4,
    yoyo: true,
    ease: "steps(1)",    
  })

/// 4. 글자 지우기
  .to(
    outroTitle,
    {
      text: {
        value: "",
        rtl: true,
      },
      duration: 1.2,      
    },
    "+=0.15",
  ) 
  
 /// 5. 다시 커서 깜빡임
  .to(outroCursor, {
    autoAlpha: 0,    
  })
  .to(outroCursor, {    
    autoAlpha: 1,
    repeat: 1,
    duration: 0.4,
    yoyo: true,
    ease: "steps(1)",
  })


  /// 6. And 타이핑
  .to(outroCursor, {
    autoAlpha: 1,    
  })
  .to(
    outroTitle,
    {
      text: "And",
      duration: 0.4,
      autoAlpha: 1,         
    },
  )

  /// 7. 커서 깜빡임 및 이동
  .to(outroCursor, {
    autoAlpha: 1,
    repeat: 2,
    duration: 0.4,
    yoyo: true,
    ease: "steps(1)",
  })
  .to(outroCursor, {
    autoAlpha: 1,    
       onComplete: () => {
        outroMessageSub.appendChild(outroCursor);
      },
  },"<")


  /// 8. To be... 타이핑
  .to(
  outroSubTitle,
  {      
    text: "To be continued",
    duration: 0.95,
    autoAlpha: 1,    
  },
  "+=0.1",
  )

  /// 9. 커서 사라짐
   .to(outroCursor, {
    autoAlpha: 0,    
  })
   .to(outroCursor, {
    autoAlpha: 1,
    repeat: 2,
    duration: 0.4,
    yoyo: true,
    ease: "steps(1)",
  })
 .to(outroCursor, {
    autoAlpha: 0,    
  });

