import { test, expect } from "@playwright/test";
test("Faixa contínua permite pausa e retomada; cards e depoimentos têm destinos reais", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".journey")).toHaveAttribute(
    "data-motion",
    "scroll",
  );
  const track = page.locator(".ribbon-track");
  await page.getByRole("button", { name: "Pausar faixa animada" }).click();
  await expect(track).toHaveCSS("animation-play-state", "paused");
  const paused = await track.evaluate((e) => getComputedStyle(e).transform);
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 180)));
  expect(await track.evaluate((e) => getComputedStyle(e).transform)).toBe(
    paused,
  );
  await page.getByRole("button", { name: "Reproduzir faixa animada" }).click();
  await page.mouse.move(0, 0);
  await expect(track).toHaveCSS("animation-play-state", "running");
  await expect
    .poll(() => track.evaluate((e) => getComputedStyle(e).transform))
    .not.toBe(paused);
  await expect(page.locator(".space-card")).toHaveCount(3);
  for (const card of await page.locator(".space-card").all())
    await expect(card).toHaveAttribute("href", "#contato");
  await expect(page.locator(".signature-card")).toHaveCount(3);
  await expect(page.locator(".process-card")).toHaveCount(3);
  await expect(page.getByText("DEPOIMENTOS EM BREVE")).toBeVisible();
  await expect(page.locator(".testimonial-card")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "Compartilhar minha experiência" }),
  ).toHaveAttribute("href", /^https:\/\/wa.me\/5517997448213\?text=/);
});
test("Faixa respeita preferência por movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".ribbon-track")).toHaveCSS(
    "animation-name",
    "none",
  );
});
