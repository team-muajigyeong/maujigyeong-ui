import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = fileURLToPath(new URL("../storybook-static/", import.meta.url));
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" };
const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative)) { res.writeHead(403).end(); return; }
  try {
    res.setHeader("Content-Type", types[path.extname(file)] ?? "application/octet-stream");
    res.end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, colorScheme: "light" });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}/iframe.html`;
  const story = id => page.goto(`${base}?id=${id}&viewMode=story`);

  await story("ui-sectionwithheader--default");
  await page.getByRole("heading", { name: "섹션 제목", level: 2 }).waitFor();
  assert.equal(await page.locator("section").textContent(), "섹션 제목섹션 본문");
  await story("ui-sectionwithheader--subsection");
  await page.getByRole("heading", { name: "섹션 제목", level: 3 }).waitFor();

  await story("ui-formactionbuttons--interactive");
  const confirm = page.getByRole("button", { name: "저장", exact: true });
  const cancel = page.getByRole("button", { name: "취소", exact: true });
  await confirm.click();
  await cancel.press("Enter");
  assert.equal(await page.locator("output").textContent(), "확인 1, 취소 1");
  assert.match(await confirm.getAttribute("class"), /consumer-confirm/);
  assert.match(await cancel.getAttribute("class"), /consumer-cancel/);
  assert.equal(await page.locator(".review-submit-button,.review-cancel-button").count(), 0);
  assert.notEqual(await confirm.evaluate(el => getComputedStyle(el).backgroundColor), "rgba(0, 0, 0, 0)");
  await page.getByRole("checkbox", { name: "처리 중" }).check();
  await confirm.press("Enter");
  await confirm.dispatchEvent("click");
  assert.equal(await page.locator("output").textContent(), "확인 1, 취소 1");
  assert.equal(await confirm.getAttribute("aria-disabled"), "true");
  assert.equal(await confirm.evaluate(el => el.disabled), false);
  await story("ui-formactionbuttons--disabled");
  assert.equal(await page.getByRole("button", { name: "저장", exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole("button", { name: "취소", exact: true }).isDisabled(), true);

  await story("ui-statustoast--announcement");
  const announcement = page.getByText("변경한 내용을 저장했습니다", { exact: true });
  await announcement.waitFor({ state: "attached" });
  assert.equal(await announcement.evaluate(el => getComputedStyle(el).width), "1px");
  assert.equal(await announcement.evaluate(el => getComputedStyle(el).position), "absolute");
  assert.equal(await page.getByRole("status").getAttribute("aria-live"), "polite");
  await story("ui-statustoast--error");
  await page.getByRole("alert").waitFor();
  assert.equal(await page.getByRole("alert").getAttribute("aria-live"), "assertive");
  await story("ui-statustoast--repeat");
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "false");
  await page.getByRole("button", { name: "같은 메시지 다시 알림" }).click();
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "true");
  assert.equal(await page.getByRole("status").textContent(), "저장했습니다");
  await page.waitForFunction(() => document.querySelector('[role="status"]')?.getAttribute("data-visible") === "false");

  await story("ui-checkchip--interactive");
  await page.getByRole("checkbox").check();
  assert.equal(await page.getByRole("checkbox").isChecked(), true);
  await story("ui-accordion--default");
  const accordion = page.getByRole("button", { name: "사용 방법" });
  await accordion.click();
  assert.equal(await accordion.getAttribute("aria-expanded"), "true");
  await accordion.press("Space");
  assert.equal(await accordion.getAttribute("aria-expanded"), "false");
  await story("ui-choiceselect--interactive");
  await page.getByRole("button", { name: "표시 순서" }).press("ArrowDown");
  await page.getByRole("option", { name: "최신순" }).press("ArrowDown");
  await page.getByRole("option", { name: "이름순" }).press("Enter");
  await page.getByRole("button", { name: "표시 순서, 현재 이름순" }).waitFor();
  await story("ui-controlledinput--interactive");
  await page.getByRole("textbox", { name: "이름" }).fill("입력 확인");
  assert.equal(await page.getByRole("textbox", { name: "이름" }).inputValue(), "입력 확인");

  await page.goto(`${base}?id=ui-formactionbuttons--docs&viewMode=docs`);
  await page.getByRole("heading", { name: "FormActionButtons", exact: true }).waitFor();
  await page.getByText("Additional class for the cancel button; owned by the consuming app.", { exact: false }).first().waitFor();
  assert.deepEqual(errors, []);
  console.log("PASS: seven components, busy/disabled actions, style slots, heading levels, repeated toast, announcements, keyboard and Autodocs");
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
