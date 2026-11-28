# Hello South Korea

Static site, no build step. Main address: https://my-project-silky.pages.dev/ (Cloudflare Pages, connected to the GitHub repo). Read only the file you need.

| File | Content |
|---|---|
| `index.html` | Markup only (plus the small early theme script) |
| `css/style.css` | All styles |
| `js/common.js` | Shared helpers (load first) |
| `js/i18n.js` | Language selection and text replacement on the home page |
| `js/lang/*.js` | One file per language (11); `en.js` holds script text, the others also hold home-page text |
| `js/hangul.js` | Hangul helpers, English name to Hangul |
| `js/names.js` | Korean name generator (uses hangul.js) |
| `js/age.js` | Age calculator |
| `js/skin.js` | Skincare routine builder |
| `js/size.js` | Size converter |
| `js/theme.js` | Light/dark toggle |
| `js/tabs.js` | Tab switching (load last) |
| `about.html`, `contact.html`, `privacy.html` | Info pages |
| `guides/*.html` | One guide article per tool |
| `404.html`, `robots.txt` | Not-found page (keeps Cloudflare Pages from serving the home page for missing paths) and crawler rules |
| `sitemap.xml` | Page list; update when adding a page or changing the domain |

## Rules
- Classic scripts sharing one global scope; keep the order in `index.html`.
- Do not put CSS or feature code back into `index.html`.
- Info and guide pages share the header and footer; change them together. If ads or analytics are added, update `privacy.html` too.
- Never put ads on `404.html` or other pages without real content. Keep ads less prominent than the content.
- Add new top-level files to the `git add` line in `deploy.cmd`.
- When a file passes about 300 lines, split it by feature and update this table.
- Deploy: `.\deploy "message"` from `main`. It pushes `main` and mirrors it to `gh-pages`. Deploy without asking once a finished change passes checks (user instruction, 2026-11-28), then confirm the live site. Never deploy half-done or failing work.
- Home-page text is translated. When you change English text in `index.html` or `js/lang/en.js`, update every file in `js/lang/`. Guides and info pages stay in English.
