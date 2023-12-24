/**
 * Helper functions for working with HTML.
 */

/**
 * Return string of a complete HTML page.
 */
export function getPage(body: string): string {
  return trim(`
    <!doctype html> 
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Blog</title>
      </head>
      <body>
        ${indent(body, 4)}
      </body>
    </html>  
  `);
}

/**
 * Trim superfluous newline and space characters from a multiline HTML string
 * expressed using JavaScript template literals.
 *
 * return `
 *   <html>
 *     <head></head>
 *     <body></body>
 *   </html>
 * `;
 * ->
 * <html>
 *   <head></head>
 *   <body></body>
 * </html>
 */
function trim(s: string): string {
  const lines = s.split("\n").slice(1, -1);
  const indent = lines[0].indexOf("<");
  return lines.map((line) => line.slice(indent)).join("\n");
}

/**
 * Indent an HTML fragment string appropriately within its containing HTML
 * string. Often used with the `trim` function.
 *
 * The indent parameter `n` is the number of tab indentations that should be
 * applied to the HTML fragment relative to the source code line where it's
 * referenced. A tab character is considered equivalent to 2 space characters.
 *
 * return `
 *   <html>
 *     <head></head>
 *     <body>
 *       ${indent(body, 3)}
 *     </body>
 *   </html>
 * `;
 * ->
 * <html>
 *   <head></head>
 *   <body>
 *     <div>Hello</div>
 *     <div>World</div>
 *   </body>
 * </html>
 */
function indent(s: string, n: number): string {
  return s
    .split("\n")
    .map((line, i) => (i === 0 ? line : " ".repeat(n * 2) + line))
    .join("\n");
}
