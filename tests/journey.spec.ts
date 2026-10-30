import { test, expect } from "@playwright/test";
for (const width of [390, 1440]) {
  test(`Frames reais avançam e retornam com scroll em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    const journey = page.locator(".journey");
    await expect(journey).toHaveAttribute("data-motion", "scroll");
    await expect(journey).toHaveAttribute("data-frame", "1");
    const first = await page
      .locator("canvas")
      .evaluate((c: HTMLCanvasElement) => c.toDataURL());
    const end = await journey.evaluate(
      (e) => e.getBoundingClientRect().height - innerHeight,
    );
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      end * 0.5,
    );
    await expect(journey).toHaveAttribute("data-requested-frame", "31");
    await expect(journey).toHaveAttribute("data-frame", "31");
    await expect(journey).toHaveAttribute("data-chapter", "2");
    const middle = await page
      .locator("canvas")
      .evaluate((c: HTMLCanvasElement) => c.toDataURL());
    expect(middle).not.toEqual(first);
    expect(
      await page
        .locator(".journey-stage")
        .evaluate((e) => e.getBoundingClientRect().top),
    ).toBe(0);
    await page.screenshot({ path: `test-results/journey-middle-${width}.png` });
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      end,
    );
    await expect(journey).toHaveAttribute("data-frame", "60");
    const last = await page
      .locator("canvas")
      .evaluate((c: HTMLCanvasElement) => c.toDataURL());
    expect(last).not.toEqual(middle);
    await page.screenshot({ path: `test-results/journey-end-${width}.png` });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(journey).toHaveAttribute("data-frame", "1");
    expect(
      await page
        .locator("canvas")
        .evaluate((c: HTMLCanvasElement) => c.toDataURL()),
    ).toEqual(first);
    expect(errors).toEqual([]);
    await page.screenshot({ path: `test-results/journey-start-${width}.png` });
  });
}
test("Movimento reduzido elimina a sequência longa e downloads de frames", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const frames: string[] = [];
  page.on("request", (r) => {
    if (
      r.url().includes("/sequence/mobile/") ||
      r.url().match(/\/sequence\/desktop\/frame_\d+\.webp$/)
    )
      frames.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator(".journey")).toHaveAttribute(
    "data-motion",
    "reduced",
  );
  expect(
    await page
      .locator(".journey")
      .evaluate(
        (e) => Math.abs(e.getBoundingClientRect().height - innerHeight) < 2,
      ),
  ).toBe(true);
  expect(frames).toEqual([]);
});
