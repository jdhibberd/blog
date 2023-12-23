/**
 * Generate the static blog site.
 */

import fs from "fs";
import path from "path";
import showdown from "showdown";

const ARTICLE_DIR = "./article";
const OUTPUT_DIR = "./dist";

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR);

const converter = new showdown.Converter();
fs.readdirSync(ARTICLE_DIR).forEach((file: string) => {
  const content = fs.readFileSync(path.join(ARTICLE_DIR, file), "utf-8");
  const html = converter.makeHtml(content);
  const filename = `${path.parse(file).name}.html`;
  fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
});
