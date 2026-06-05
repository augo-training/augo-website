import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public/og-image.jpg");
const URL = "https://augotraining.com/en";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

// Pre-set consent so the cookie banner never renders
await page.evaluateOnNewDocument(() => {
  localStorage.setItem("augo_cookie_consent", "accepted");
});

await page.goto(URL, { waitUntil: "networkidle2" });
// Wait for GSAP intro animations to complete
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: OUT, type: "jpeg", quality: 90 } as Parameters<typeof page.screenshot>[0]);
await browser.close();

console.log(`Saved ${OUT}`);
