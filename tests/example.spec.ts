import { test, expect } from "@playwright/test";

test("포트폴리오 테스트 외부링크", async ({ page }) => {
  // 1. 로딩검사 : 메인페이지 접속 & 제목 이상 없는지 확인
  await page.goto("http://solaris2.dothome.co.kr/project/index.html");
  await expect(page).toHaveTitle(/Connect/);
  await expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.2 });

  // 2. 렌더링 검사
  const firstSection = page.locator("section.intro");
  await expect(firstSection).toBeVisible();

  // 3. 외부링크 정의 및 테스트
  const workLinks = [
    {
      name: "자유 개인 포트폴리오",
      url: "http://solaris.dothome.co.kr/portfolio/index.html",
    },
    {
      name: "축제사이트 리디자인",
      url: "http://solaris.dothome.co.kr/jazz/index.html",
    },
    {
      name: "기업형 웹사이트",
      url: "http://solaris2.dothome.co.kr/mstech/index.html",
    },
    { name: "코드펜 기록물", url: "https://codepen.io/collection/JGQWEq" },
  ];

  for (const work of workLinks) {
    const link = page.locator(".works__list a", { hasText: work.name });
    //a. 요소가 화면에 보이는지 확인
    await link.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await expect(link).toBeVisible();

    // b. 클릭 테스트
    await link.scrollIntoViewIfNeeded();
    await link.click();

    // c. 링크 url 확인
    await expect(link).toHaveAttribute("href", work.url);

    // d. 보안 확인
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});
