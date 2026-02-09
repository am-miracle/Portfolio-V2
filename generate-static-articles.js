const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the endpoint from config.js or env
let HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;

if (!HYGRAPH_ENDPOINT) {
    try {
        const configPath = path.join(__dirname, 'static', 'js', 'config.js');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const match = configContent.match(/const HYGRAPH_ENDPOINT = ['"]([^'"]+)['"]/);
        if (match && match[1]) {
            HYGRAPH_ENDPOINT = match[1];
            console.log('Using HYGRAPH_ENDPOINT from static/js/config.js');
        }
    } catch (e) {
        console.warn('Could not read config.js');
    }
}

if (!HYGRAPH_ENDPOINT) {
    console.warn('Warning: HYGRAPH_ENDPOINT not set. Skipping static article generation.');
    return;
}

const TEMPLATE_PATH = path.join(__dirname, 'article-detail.html');
const ARTICLES_DIR = path.join(__dirname, 'articles');
const ASSETS_PREFIX = '../'; // generating in /articles/, so need to go up one level for assets

// Query to get all posts with full content
const QUERY_ALL_POSTS = `
  query GetAllPosts {
    posts {
      slug
      title
      date
      tags
      coverImage {
        url
      }
      content {
        html
      }
      updatedAt
    }
  }
`;

function fetchHygraphData() {
    return new Promise((resolve, reject) => {
        const url = new URL(HYGRAPH_ENDPOINT);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.errors) {
                        reject(new Error(JSON.stringify(json.errors)));
                    } else {
                        resolve(json.data);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(JSON.stringify({ query: QUERY_ALL_POSTS }));
        req.end();
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

async function main() {
    console.log('Starting static article generation...');

    // 1. Create articles directory of it doesn't exist
    if (!fs.existsSync(ARTICLES_DIR)) {
        fs.mkdirSync(ARTICLES_DIR);
    }

    // 2. Read template
    let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');


    const relativeLinks = [
        'about.html', 'project.html', 'article.html', 'blog.html', 'index.html'
    ];
    relativeLinks.forEach(link => {
        const regex = new RegExp(`href="${link}"`, 'g');
        template = template.replace(regex, `href="../${link}"`);
    });

    let data;
    try {
        data = await fetchHygraphData();
    } catch (e) {
        console.error('Failed to fetch posts:', e);
        process.exit(1);
    }

    if (!data || !data.posts) {
        console.error('No posts found.');
        return;
    }

    console.log(`Found ${data.posts.length} posts. Generating files...`);

    data.posts.forEach(post => {
        let html = template;

        html = html.replace('<!-- SEO_TITLE -->', `${post.title} | Jude Miracle`);
        html = html.replace('<!-- SEO_DESCRIPTION -->', post.title);
        html = html.replace('<!-- SEO_AUTHOR -->', 'Jude Miracle');


        html = html.replace('<div id="loading-indicator" class="padd-15" style="text-align: center; padding: 50px;">', '<div id="loading-indicator" style="display: none;">');

        html = html.replace(/<article\s+id="article-container"\s*style="display:\s*none;"\s*>/, '<article id="article-container">');

        html = html.replace(
            /<h1\s+id="article-title"\s+class="section-title\s+animate-fade-up\s+delay-200"\s*style="margin-bottom:\s*1rem;"\s*>\s*<\/h1>/,
            `<h1 id="article-title" class="section-title animate-fade-up delay-200" style="margin-bottom: 1rem;">${post.title}</h1>`
        );

        const date = formatDate(post.date);
        const tags = post.tags.join(', ');
        html = html.replace(/<span\s+id="article-date">\s*<\/span>/, `<span id="article-date">${date}</span>`);
        html = html.replace(/<span\s+id="article-tags">\s*<\/span>/, `<span id="article-tags">${tags}</span>`);

        if (post.coverImage && post.coverImage.url) {
            const imgRegex = /<img\s+id="article-cover"\s+class="animate-fade-up\s+delay-100"\s+src=""\s+alt=""[\s\S]*?>/;
            html = html.replace(imgRegex, `<img id="article-cover" class="animate-fade-up delay-100" src="${post.coverImage.url}" style="display: block; width: 100%; object-fit: cover; border-radius: var(--border-radius); margin-bottom: 2rem;" alt="${post.title}">`);
        }

        html = html.replace(
            /<div\s+id="article-body"\s+class="padd-15\s+article-body-content\s+animate-fade-up\s+delay-400">\s*<\/div>/,
            `<div id="article-body" class="padd-15 article-body-content animate-fade-up delay-400">\n${post.content.html}\n</div>`
        );

        html = html.replace('<script src="/static/js/blog.js" defer></script>', '');

        const filename = `${post.slug}.html`;
        const filepath = path.join(ARTICLES_DIR, filename);
        fs.writeFileSync(filepath, html);
        console.log(`Generated: articles/${filename}`);
    });

    console.log('Static generation complete!');
}

main();
