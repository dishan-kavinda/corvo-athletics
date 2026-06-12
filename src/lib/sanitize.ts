/* Server-side HTML sanitizer for CMS-sourced rich text (Wix product
   descriptions). Defense-in-depth: the data is first-party, but if the
   Wix account were ever compromised this stops stored XSS from reaching
   customers. Strips active content; keeps basic formatting markup. */

const BLOCKED_TAGS = 'script|style|iframe|object|embed|link|meta|form|svg|math';

export function sanitizeHtml(html: string): string {
  return (
    html
      // Paired blocked tags + their content
      .replace(new RegExp(`<\\s*(${BLOCKED_TAGS})\\b[^>]*>[\\s\\S]*?<\\s*/\\s*\\1\\s*>`, 'gi'), '')
      // Self-closing / unclosed blocked tags
      .replace(new RegExp(`<\\s*/?\\s*(${BLOCKED_TAGS})\\b[^>]*/?>`, 'gi'), '')
      // Inline event handlers (onclick=…, onerror=…)
      .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      // javascript:/data: URLs in href/src/action
      .replace(/\s(href|src|action|xlink:href)\s*=\s*("\s*(javascript|data|vbscript):[^"]*"|'\s*(javascript|data|vbscript):[^']*')/gi, '')
  );
}
