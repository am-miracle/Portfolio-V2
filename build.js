const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, 'public');

function clean() {
    console.log('Cleaning public directory...');
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(PUBLIC_DIR);
}

function runScript(scriptName) {
    console.log(`Running ${scriptName}...`);
    try {
        if (scriptName.endsWith('.sh')) {
            execSync(`bash ${scriptName}`, { stdio: 'inherit' });
        } else if (scriptName.endsWith('.js')) {
            execSync(`node ${scriptName}`, { stdio: 'inherit' });
        } else if (scriptName.endsWith('.py')) {
            execSync(`python3 ${scriptName}`, { stdio: 'inherit' });
        }
    } catch (e) {
        console.error(`Error running ${scriptName}:`, e);
        process.exit(1);
    }
}

function copyRecursive(src, dest) {
    if (fs.existsSync(src)) {
        const stats = fs.statSync(src);
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    }
}

function copyAssets() {
    console.log('Copying assets to public/...');

    // Copy HTML files
    fs.readdirSync(__dirname).forEach(file => {
        if (file.endsWith('.html')) {
            fs.copyFileSync(path.join(__dirname, file), path.join(PUBLIC_DIR, file));
        }
    });

    // Copy directories and other files
    copyRecursive(path.join(__dirname, 'static'), path.join(PUBLIC_DIR, 'static'));
    copyRecursive(path.join(__dirname, 'articles'), path.join(PUBLIC_DIR, 'articles'));
    copyRecursive(path.join(__dirname, 'fonts'), path.join(PUBLIC_DIR, 'fonts'));

    if (fs.existsSync(path.join(__dirname, 'sitemap.xml'))) {
        fs.copyFileSync(path.join(__dirname, 'sitemap.xml'), path.join(PUBLIC_DIR, 'sitemap.xml'));
    }

    if (fs.existsSync(path.join(__dirname, 'robots.txt'))) {
        fs.copyFileSync(path.join(__dirname, 'robots.txt'), path.join(PUBLIC_DIR, 'robots.txt'));
    }
}

function main() {
    clean();
    runScript('generate-config.sh');
    runScript('generate-static-articles.js');
    runScript('generate-sitemap.js');
    runScript('minify_assets.py');
    copyAssets();
    console.log('Build complete! Output in public/');
}

main();
