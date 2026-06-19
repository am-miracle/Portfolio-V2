const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SNIPPET_PATH = path.join(ROOT, 'static', 'js', 'theme-init.inline.js');
const INLINE_START = '<!-- theme-init:start -->';
const INLINE_END = '<!-- theme-init:end -->';
const EXTERNAL_TAG_RE = /\s*<script\s+src=["']\/static\/js\/theme-init\.js["']><\/script>\s*/;
const INLINE_BLOCK_RE = new RegExp(
    `\\s*${INLINE_START}[\\s\\S]*?${INLINE_END}`,
    'm'
);

function minifyJs(source) {
    return source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}();,:=+])\s*/g, '$1')
        .trim();
}

function htmlFiles(dir) {
    if (!fs.existsSync(dir)) return [];

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) return htmlFiles(fullPath);
        return entry.isFile() && entry.name.endsWith('.html') ? [fullPath] : [];
    });
}

function inject(filePath, snippet) {
    const original = fs.readFileSync(filePath, 'utf8');
    const inlineBlock = `\n    ${INLINE_START}\n    <script>${snippet}</script>\n    ${INLINE_END}\n`;
    let html = original.replace(INLINE_BLOCK_RE, inlineBlock);

    if (html === original) {
        html = html.replace(EXTERNAL_TAG_RE, inlineBlock);
    }

    html = html.replace(/\n\n<link rel=/, '\n\n    <link rel=');

    if (html === original) return false;

    fs.writeFileSync(filePath, html);
    return true;
}

const snippet = minifyJs(fs.readFileSync(SNIPPET_PATH, 'utf8'));
const files = [
    ...htmlFiles(ROOT).filter((file) => !file.includes(`${path.sep}public${path.sep}`)),
];

let changed = 0;
for (const file of files) {
    if (inject(file, snippet)) {
        changed += 1;
        console.log(`Injected theme init into ${path.relative(ROOT, file)}`);
    }
}

console.log(`Theme init injection complete. Updated ${changed} file(s).`);
