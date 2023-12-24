/**
 * Generate the static blog site.
 */

import fs from "fs";
import path from "path";
import showdown from "showdown";
import { getPage, trim, indent } from "./html.js";

const ARTICLE_DIR = "./article";
const OUTPUT_DIR = "./dist";

type Article = {
  title: string;
  created: string;
  path: string;
};

function build(): void {
  prepareOutputDir();
  const articles = buildArticlePages();
  buildIndexPage(articles);
}

build();

function prepareOutputDir(): void {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT_DIR);
}

function buildArticlePages(): Article[] {
  const index: Article[] = [];
  const converter = new showdown.Converter();
  fs.readdirSync(ARTICLE_DIR).forEach((file: string) => {
    const markdown = fs.readFileSync(path.join(ARTICLE_DIR, file), "utf-8");
    const title = getTitle(markdown);
    const created = path.parse(file).name;
    const filename = `${created}.html`;
    index.push({ title, created, path: filename });
    const html = getPage(converter.makeHtml(markdown));
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
  });
  return index;
}

function buildIndexPage(articles: Article[]): void {
  const items = articles
    .map((a) => `<li><a href="${a.path}">${a.title}</a> (${a.created})</li>`)
    .join("\n");
  const list = trim(`
    <ul>
      ${indent(items, 3)}
    </ul>
  `);
  const html = getPage(list);
  fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), html);
}

/**
 * Extract the article title from markdown.
 */
function getTitle(markdown: string): string {
  const match = /#\s(?<title>.+)/.exec(markdown);
  return match!.groups!.title;
}
