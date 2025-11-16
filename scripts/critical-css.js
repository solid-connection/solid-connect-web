const Beasties = require("beasties");
const fs = require("fs");
const path = require("path");

const NEXT_BUILD_DIR = path.join(process.cwd(), ".next");
const SERVER_APP_DIR = path.join(NEXT_BUILD_DIR, "server", "app");

async function processCriticalCSS() {
  console.log("Starting Critical CSS extraction with Beasties...");

  const beasties = new Beasties({
    path: NEXT_BUILD_DIR,
    publicPath: "/_next/",
    preload: "swap",
    noscriptFallback: true,
    inlineFonts: true,
    pruneSource: false,
    reduceInlineStyles: true,
    mergeStylesheets: true,
    additionalStylesheets: [],
    fonts: true,
  });

  const htmlFiles = findHtmlFiles(SERVER_APP_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to process`);

  for (const htmlFile of htmlFiles) {
    try {
      const html = fs.readFileSync(htmlFile, "utf-8");
      const processedHtml = await beasties.process(html);
      fs.writeFileSync(htmlFile, processedHtml);
      console.log(`Processed: ${path.relative(process.cwd(), htmlFile)}`);
    } catch (error) {
      console.error(`Error processing ${htmlFile}:`, error.message);
    }
  }

  console.log("Critical CSS extraction complete!");
}

function findHtmlFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findHtmlFiles(fullPath));
    } else if (item.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

processCriticalCSS().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
