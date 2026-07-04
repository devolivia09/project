import { test, expect } from "@playwright/test";

test("포트폴리오 테스트 외부링크", async ({ page }) => {
  // 1. 페이지 접속
  await page.goto("http://solaris2.dothome.co.kr/project/index.html");

  // 2. 제목 이상 없는지 확인
  await expect(page).toHaveTitle(/Connect/);

  // 3. 링크 정의
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
    const link = page
      .locator("section.works")
      .getByRole("link", { name: work.name });
    // 4. 요소가 화면에 보이는지 확인
    await expect(link).toBeVisible();
    // 5. 클릭 테스트
    // await page.waitForTimeout(3000);
    // await page.screenshot({ path: "before-click.png" });
    // await link.scrollIntoViewIfNeeded();
    await link.click();
    // 6. 링크 url 확인
    await expect(link).toHaveAttribute("href", work.url);
    //  7. 보안 확인
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});
