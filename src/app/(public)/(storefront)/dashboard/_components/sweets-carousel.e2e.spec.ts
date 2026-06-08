import { expect, test } from "@playwright/test";

function getQueryParam(url: string, key: string) {
	return new URL(url).searchParams.get(key);
}

test.describe("SweetsCarousel", () => {
	test("auto-advances and updates URL", async ({ page }) => {
		await page.goto("/dashboard?activeIndex=0");

		await page.waitForTimeout(5500);

		await expect
			.poll(() => getQueryParam(page.url(), "activeIndex"))
			.not.toBe("0");
	});
});
