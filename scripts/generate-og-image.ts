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
 *
 * A target names either a `path` on the site or a local `file` under scripts/.
 * The file form exists for pages that cannot be photographed as they are: /merci
 * is a gated tap-through sequence, so a screenshot of it would be beat 1 rather
 * than the postcard the card is supposed to show. --base does not apply to those.
 */
const TARGETS = {
  home: { path: "/en", out: "og-image.jpg" },
  nice: { path: "/en/nice-athletes", out: "nice-athletes-og.jpg" },
  "nice-coaches": { path: "/en/nice-coaches", out: "nice-coaches-og.jpg" },
  mcp: { path: "/en/mcp", out: "mcp-og.jpg" },
  merci: { file: "og/merci-card.html", out: "merci-og.jpg" },
} as const;

type TargetName = keyof typeof TARGETS;

const args = process.argv.slice(2);
const baseFlag = args.indexOf("--base");
const base = baseFlag === -1 ? "https://augotraining.com" : args[baseFlag + 1];
// The skipped index is the value belonging to --base. With no --base in the
// args, indexOf returns -1 and `baseFlag + 1` is 0, which used to skip the first
// argument: `npm run og-image:nice` silently fell through to "home" and wrote the
// home page over public/og-image.jpg. Only skip when --base is actually present.
const name = (args.find(
  (arg, i) => !arg.startsWith("--") && !(baseFlag !== -1 && i === baseFlag + 1),
) ?? "home") as TargetName;

const target = TARGETS[name];
if (!target) {
  console.error(`Unknown target "${name}". Known targets: ${Object.keys(TARGETS).join(", ")}`);
  process.exit(1);
}
if (!base) {
  console.error("--base needs a URL");
  process.exit(1);
}

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../public", target.out);
const URL = "file" in target ? `file://${join(HERE, target.file)}` : `${base}${target.path}`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });

// Pre-set consent so the cookie banner never renders. A file:// target has an
// opaque origin where touching localStorage throws, and there is no banner there
// to suppress anyway, so a failure here is not worth aborting the capture for.
await page.evaluateOnNewDocument(() => {
  try {
    localStorage.setItem("augo_cookie_consent", "accepted");
  } catch {
    // file:// origin: nothing to suppress.
  }
});

await page.goto(URL, { waitUntil: "networkidle2" });
// Wait for GSAP intro animations to complete
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: OUT, type: "jpeg", quality: 90 } as Parameters<typeof page.screenshot>[0]);
await browser.close();

console.log(`Saved ${OUT} from ${URL}`);
