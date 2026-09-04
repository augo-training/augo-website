import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

/**
 * Social share cards, captured from the live pages themselves.
 *
 * Run by hand, not by the build: `npm run og-image` (home) or
 * `npm run og-image:nice`. The output lands in public/ and is committed — it is
 * a build input, not a build artifact.
 *
 * The viewport is 1200x630 because SEOHead hardcodes og:image:width/height to
 * those numbers; capture at any other size and the meta tags start lying.
 *
 * Pass --base to capture from somewhere other than production, which is what you
 * want whenever the copy has changed but has not shipped yet:
 *   node --experimental-strip-types scripts/generate-og-image.ts nice --base http://localhost:5173
 */
const TARGETS = {
  home: { path: "/en", out: "og-image.jpg" },
  nice: { path: "/en/nice-athletes", out: "nice-athletes-og.jpg" },
} as const;

type TargetName = keyof typeof TARGETS;

const args = process.argv.slice(2);
const baseFlag = args.indexOf("--base");
const base = baseFlag === -1 ? "https://augotraining.com" : args[baseFlag + 1];
const name = (args.find((arg, i) => !arg.startsWith("--") && i !== baseFlag + 1) ?? "home") as TargetName;

const target = TARGETS[name];
if (!target) {
  console.error(`Unknown target "${name}". Known targets: ${Object.keys(TARGETS).join(", ")}`);
  process.exit(1);
}
if (!base) {
  console.error("--base needs a URL");
  process.exit(1);
}

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../public", target.out);
const URL = `${base}${target.path}`;

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

console.log(`Saved ${OUT} from ${URL}`);
