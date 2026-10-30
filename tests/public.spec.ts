import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [360, 390, 768, 1024, 1440]) {
  test(`Navegação, imagens e acessibilidade em ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page.locator('.journey')).toHaveAttribute('data-motion','scroll');
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Ambientes que expressam sua essência.",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    if (width < 768) {
      await page.getByRole("button", { name: "Abrir menu" }).click();
      await page
        .getByRole("navigation", { name: "Principal" })
        .getByRole("link", { name: "Materiais", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Abrir menu" }),
      ).toBeVisible();
    }
    await page.getByRole("button", { name: /Dormitórios & closets/ }).click();
    await expect(page.locator('#craft-panel-1')).toContainText(
      "O seu lugar de desacelerar.",
    );
    await page.getByRole('button',{name:/Salas & painéis/}).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#craft-panel-2')).toBeVisible();
    await page.getByRole("button", { name: "Puxadores", exact: true }).click();
    await page
      .getByRole("textbox", { name: "Buscar materiais" })
      .fill("carvalho");
    await expect(
      page.getByText("O primeiro detalhe é a sua escolha."),
    ).toBeVisible();
    const contact = page.getByRole("link", { name: "Conversar pelo WhatsApp" });
    await expect(contact).toHaveAttribute(
      "href",
      /^https:\/\/wa.me\/5517997448213\?text=/,
    );
    await expect(
      page.getByRole("button", { name: "Enviar solicitação" }),
    ).toBeDisabled();
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForFunction(() =>
      Array.from(document.images).every(
        (i) => i.complete && i.naturalWidth > 0,
      ),
    );
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/site-${width}.png`,
      fullPage: true,
    });
  });
}
test("Administração não expõe dados sem configuração", async ({ page }) => {
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Seu painel começa aqui." }),
  ).toBeVisible();
  await expect(
    page.getByText("Nenhum cadastro.", { exact: false }),
  ).toHaveCount(0);
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});
test("Links internos, metadados e página inexistente", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const anchors = await page
    .locator('a[href^="#"]')
    .evaluateAll((nodes) =>
      nodes.map((n) => n.getAttribute("href")).filter((h) => h && h !== "#"),
    );
  for (const href of anchors) await expect(page.locator(href!)).toHaveCount(1);
  await expect(page).toHaveTitle(/State Marcenaria/);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  await page.goto("/pagina-inexistente");
  await expect(
    page.getByRole("heading", { name: "Este espaço ainda não existe." }),
  ).toBeVisible();
});
test("Movimento reduzido e formulário com validação nativa", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const name = page.getByRole("textbox", { name: "Seu nome", exact: true });
  await name.fill("");
  expect(
    await name.evaluate((e: HTMLInputElement) => e.checkValidity()),
  ).toBeFalsy();
  await name.fill("Cliente");
  expect(
    await name.evaluate((e: HTMLInputElement) => e.checkValidity()),
  ).toBeTruthy();
});
