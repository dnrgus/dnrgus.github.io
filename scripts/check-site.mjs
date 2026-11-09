// Structural checks for the static site. No dependencies; run with `node scripts/check-site.mjs`.
// Fails (exit 1) when the fixed frame or the post metadata drifts, or when a link points nowhere.
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import vm from 'vm'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const fail = (file, msg) => errors.push(`${file}: ${msg}`)
const rel = (p) => path.relative(root, p).split(path.sep).join('/')
// Text is compared with LF line endings so a Windows autocrlf checkout hashes the same as Linux CI.
const TEXT_FILE = /\.(html|css|js|mjs|svg|yml|json|md)$/
const normalize = (buf) => buf.toString('utf8').replace(/\r\n/g, '\n')
const read = (p) => normalize(fs.readFileSync(p))

const EXPECTED_CATEGORIES = [
  'development',
  'ctf-wargame',
  'bug-bounty',
  'technical-writing',
  'papers-conferences',
  'competitions-certifications',
]

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === '.context-compress' || name === 'scripts') continue
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.html')) out.push(p)
  }
  return out
}

function frontMatter(html) {
  const m = /^---\n([\s\S]*?)\n---/.exec(html)
  if (!m) return {}
  const data = {}
  let listKey = null
  for (const line of m[1].split('\n')) {
    const item = /^\s+-\s+(.*)$/.exec(line)
    if (item && listKey) {
      data[listKey].push(item[1].replace(/^"|"$/g, ''))
      continue
    }
    const kv = /^([\w_]+):\s*(.*)$/.exec(line)
    if (!kv) continue
    if (kv[2] === '') {
      listKey = kv[1]
      data[listKey] = []
    } else {
      listKey = null
      data[kv[1]] = kv[2].replace(/^"|"$/g, '')
    }
  }
  return data
}

// Resolve local href/src targets and make sure the file exists.
function checkLocalLinks(file, html) {
  const dir = path.dirname(file)
  const re = /\s(?:href|src)="([^"]+)"/g
  let m
  while ((m = re.exec(html))) {
    const target = m[1]
    if (/^(https?:|mailto:|#|\{)/.test(target) || target.includes('{{')) continue
    const clean = target.split('#')[0].split('?')[0]
    if (!clean) continue
    let p = clean.startsWith('/') ? path.join(root, clean) : path.join(dir, clean)
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html')
    if (!fs.existsSync(p)) fail(rel(file), `broken link "${target}"`)
  }
}

function checkShell(file, html) {
  const must = [
    ['<html lang="ko">', 'lang="ko"'],
    ['name="viewport"', 'viewport meta'],
    ['<title>', 'title'],
    ['class="skip-link"', 'skip link'],
    ['id="main"', 'main landmark'],
    ['class="site-footer"', 'footer'],
    ['class="site-header"', 'header'],
  ]
  for (const [needle, label] of must) {
    if (!html.includes(needle)) fail(rel(file), `missing ${label}`)
  }
}

// --- index.html: hero image and six categories in the agreed order
const indexPath = path.join(root, 'index.html')
const indexHtml = read(indexPath)
if (!indexHtml.includes('assets/brachio-line.webp')) fail('index.html', 'hero dinosaur image missing')
if (!/<img[^>]+alt="[^"]+"/.test(indexHtml)) fail('index.html', 'hero image has no alt text')
const catHrefs = [...indexHtml.matchAll(/href="categories\/([\w-]+)\.html"/g)].map((m) => m[1])
const uniqueCats = [...new Set(catHrefs)]
if (JSON.stringify(uniqueCats) !== JSON.stringify(EXPECTED_CATEGORIES)) {
  fail('index.html', `category list is [${uniqueCats.join(', ')}], expected the six agreed categories in order`)
}
checkShell(indexPath, indexHtml)
checkLocalLinks(indexPath, indexHtml)

// --- category pages: one per category, with matching key
for (const key of EXPECTED_CATEGORIES) {
  const p = path.join(root, 'categories', `${key}.html`)
  if (!fs.existsSync(p)) {
    fail(`categories/${key}.html`, 'category page missing')
    continue
  }
  const html = read(p)
  const fm = frontMatter(html)
  if (fm.category_key !== key) fail(rel(p), `category_key is "${fm.category_key}", expected "${key}"`)
  if (!html.includes('class="writing-list archive-list"')) fail(rel(p), 'post list container missing')
  checkShell(p, html)
  checkLocalLinks(p, html)
  if (!html.includes('class="archive-tools" hidden')) fail(rel(p), 'search tools missing')
  if (!html.includes('assets/site.js')) fail(rel(p), 'site.js not included')
}

// --- posts: metadata required by the list pages and the category filters
const postFiles = walk(path.join(root, 'posts')).filter((p) => fs.readFileSync(p, 'utf8').startsWith('---'))
const REQUIRED = ['item_type', 'permalink', 'title', 'post_category', 'post_categories', 'category_label', 'post_date']
for (const p of postFiles) {
  const html = read(p)
  const fm = frontMatter(html)
  if (fm.item_type !== 'post') continue
  for (const k of REQUIRED) {
    if (fm[k] === undefined || fm[k] === '' || (Array.isArray(fm[k]) && fm[k].length === 0)) {
      fail(rel(p), `front matter "${k}" missing`)
    }
  }
  if (Array.isArray(fm.post_categories) && !fm.post_categories.includes(fm.post_category)) {
    fail(rel(p), 'post_category is not listed in post_categories')
  }
  for (const c of fm.post_categories || []) {
    if (!EXPECTED_CATEGORIES.includes(c)) fail(rel(p), `unknown category "${c}"`)
  }
  const folder = path.basename(path.dirname(p))
  if (fm.permalink && fm.permalink !== `/posts/${folder}/`) fail(rel(p), `permalink ${fm.permalink} does not match folder`)
  if (!/<h1>[^<]+<\/h1>/.test(html)) fail(rel(p), 'post has no h1')
  if (!html.includes('class="story-back"')) fail(rel(p), 'post navigation (story-back) missing')
  checkShell(p, html)
  checkLocalLinks(p, html)
}


// --- enhancements: script wiring, search markup, live counts, and the stylesheet they depend on
const jsPath = path.join(root, "assets", "site.js")
if (!fs.existsSync(jsPath)) fail("assets/site.js", "missing")
else {
  try {
    new vm.Script(read(jsPath), { filename: "assets/site.js" })
  } catch (e) {
    fail("assets/site.js", "syntax error: " + e.message)
  }
}
const css = read(path.join(root, "assets", "site.css"))
const opens = (css.match(/{/g) || []).length
const closes = (css.match(/}/g) || []).length
if (opens !== closes) fail("assets/site.css", "unbalanced braces (" + opens + " open, " + closes + " close)")
for (const token of ["--accent", "--paper", "--ink", "--muted", "--line", ".read-progress", ".archive-tools", ".to-top"]) {
  if (!css.includes(token)) fail("assets/site.css", "missing " + token)
}
for (const key of EXPECTED_CATEGORIES) {
  if (!indexHtml.includes("{{ site.pages | where: \"item_type\", \"post\" | where_exp: \"p\", \"p.post_categories contains '" + key + "'\" | size }}")) {
    fail("index.html", "live post count missing for " + key)
  }
}
if (!indexHtml.includes('<script src="assets/site.js" defer>')) fail("index.html", "site.js not included")

// --- frame lock: the shell, styles, scripts, and assets must match the committed manifest.
// Posts are not in the manifest, so writing new posts never trips this check.
const FRAME_FILES = [
  "index.html",
  ...EXPECTED_CATEGORIES.map((k) => `categories/${k}.html`),
  "assets/site.css",
  "assets/site.js",
  "assets/favicon.svg",
  "assets/brachio-line.webp",
  "assets/brachio-sky.webp",
  "_config.yml",
]
const manifestPath = path.join(root, "scripts", "frame-manifest.json")
const digest = (f) => {
  const raw = fs.readFileSync(path.join(root, f))
  const bytes = TEXT_FILE.test(f) ? Buffer.from(normalize(raw), 'utf8') : raw
  return crypto.createHash("sha256").update(bytes).digest("hex")
}
const current = Object.fromEntries(FRAME_FILES.map((f) => [f, digest(f)]))

if (process.argv.includes("--update")) {
  if (errors.length) {
    console.error("not updating the manifest while structure checks fail")
    process.exit(1)
  }
  fs.writeFileSync(manifestPath, JSON.stringify(current, null, 2) + "\n")
  console.log(`frame manifest updated: ${FRAME_FILES.length} files`)
  process.exit(0)
}

if (!fs.existsSync(manifestPath)) {
  fail("scripts/frame-manifest.json", "missing; run `node scripts/check-site.mjs --update` once and commit it")
} else {
  const saved = JSON.parse(read(manifestPath))
  for (const f of FRAME_FILES) {
    if (saved[f] !== current[f]) {
      fail(f, "frame file changed since the manifest was written; if this is intended, run `node scripts/check-site.mjs --update` and commit the manifest")
    }
  }
}

if (errors.length) {
  console.error(`site check failed (${errors.length}):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`site check passed: ${EXPECTED_CATEGORIES.length} categories, ${postFiles.length} files with front matter`)
