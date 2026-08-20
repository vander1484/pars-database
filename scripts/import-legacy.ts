import * as cheerio from "cheerio";

const BASE_URL = "https://parsdatabase.co.uk/";

type StagedPage = {
  url: string;
  title: string;
  links: string[];
  fetchedAt: string;
};

async function fetchPage(url: string): Promise<StagedPage> {
  const response = await fetch(url, { headers: { "User-Agent": "ParsDatabaseMigration/1.0" } });
  if (!response.ok) throw new Error(`Failed ${response.status}: ${url}`);
  const html = await response.text();
  const $ = cheerio.load(html);
  const links = $("a[href]").map((_, element) => {
    const href = $(element).attr("href")!;
    try { return new URL(href, url).href; } catch { return ""; }
  }).get().filter(link => link.startsWith(BASE_URL));
  return { url, title: $("title").text().trim(), links: [...new Set(links)], fetchedAt: new Date().toISOString() };
}

async function main() {
  console.log("Pars Database legacy migration inventory");
  console.log(`Source: ${BASE_URL}`);
  const home = await fetchPage(BASE_URL);
  console.log(`Discovered ${home.links.length} internal links from the entry page.`);
  console.log("Next migration stage: classify player, season, result, table, cup and record pages before normalisation.");
}

main().catch(error => { console.error(error); process.exit(1); });
