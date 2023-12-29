/**
 * Generate the static blog site.
 */

import fs from "fs";
import path from "path";
import showdown from "showdown";
import * as prettier from "prettier";

const ARTICLE_DIR = "./article";
const TARGET_DIR = "./dist";

type Article = {
  title: string;
  author: string;
  createdIso: string;
  createdLocale: string;
  uri: string;
  filename: string;
  body: string;
};

async function build(): Promise<void> {
  prepareTargetDir();
  const articles = await buildAllArticlePages();
  await buildIndexPage(articles);
}

await build();

function prepareTargetDir(): void {
  fs.rmSync(TARGET_DIR, { recursive: true, force: true });
  fs.mkdirSync(TARGET_DIR);
}

async function buildAllArticlePages(): Promise<Article[]> {
  const index: Article[] = [];
  const converter = new showdown.Converter();
  fs.readdirSync(ARTICLE_DIR).forEach(async (file: string) => {
    const markdown = fs.readFileSync(path.join(ARTICLE_DIR, file), "utf-8");
    const article = parseArticleMarkdown(markdown);
    index.push(article);
    await buildArticlePage(article, converter);
  });
  return index;
}

async function buildArticlePage(
  { title, author, createdLocale, filename, body }: Article,
  converter: showdown.Converter,
): Promise<void> {
  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0"
        />
        <title>${title}</title>
        <link href="style.css" rel="stylesheet" />
      </head>
      <body class="article">
        <header>
          <h2><a href="/">hemingroth</a></h2>
        </header>
        <article>
          <h1>${title}</h1>
          <h3>${author}</h3>
          <h3>${createdLocale}</h3>
          ${converter.makeHtml(body)}
        </article>
        <footer>
          <ul>
            <li>${buildCopyright()}</li>
            <li><a href="/">All articles</a></li>
          </ul>
        </footer>
      </body>
    </html>
  `;
  await writeHtmlFile(filename, html);
}

async function buildIndexPage(articles: Article[]): Promise<void> {
  const html = `
    <!doctype html> 
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta 
          name="viewport" 
          content="width=device-width,initial-scale=1.0"
        />
        <title>Blog</title>
        <link href="style.css" rel="stylesheet" />
      </head>
      <body class="index">
        <header>
          <h2>hemingroth</h2>
        </header>
        <main>
          ${frag(articles.map(buildIndexPageArticleCard))}
        </main>
        <footer>
          ${buildCopyright()}
        </footer>
      </body>
    </html>     
  `;
  await writeHtmlFile("index.html", html);
}

function buildIndexPageArticleCard({
  uri,
  title,
  author,
  createdLocale,
}: Article): string {
  return frag(`
    <a href="${uri}">
      <div>
        <h1>${title}</h1>
        <div>${author}</div>
        <time>${createdLocale}</time>
      </div>
    </a>
  `);
}

function buildCopyright(): string {
  return `hemingroth &copy; ${new Date().getUTCFullYear()}`;
}

function parseArticleMarkdown(markdown: string): Article {
  const headerEndIndex = markdown.indexOf("\n\n");
  const [title, author, createdIso] = markdown
    .substring(0, headerEndIndex)
    .split("\n");
  const uri = `/${createdIso}`;
  const filename = `${createdIso}.html`;
  const createdLocale = new Date(createdIso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const body = markdown.substring(headerEndIndex + 2);
  return {
    title,
    author,
    createdIso,
    createdLocale,
    uri,
    filename,
    body,
  };
}

function frag(html: string | string[]): string {
  if (html instanceof Array) return html.join("");
  return html.trim();
}

async function writeHtmlFile(filenanme: string, html: string): Promise<void> {
  const prettyHtml = await prettier.format(html, {
    htmlWhitespaceSensitivity: "ignore",
    parser: "html",
  });
  fs.writeFileSync(path.join(TARGET_DIR, filenanme), prettyHtml);
}
