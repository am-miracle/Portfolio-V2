const https = require('https');
const fs = require('fs');

const SITE_URL = 'https://judemiracle.com';
const HYGRAPH_ENDPOINT = process.env.HYGRAPH_ENDPOINT;

if (!HYGRAPH_ENDPOINT) {
    console.error('Error: HYGRAPH_ENDPOINT environment variable is not set.');
    process.exit(1);
}

const STATIC_PAGES = [
    '/',
    '/about.html',
    '/project.html',
    '/article.html',
    '/blog.html',
    '/#contact'
];

const QUERY_ALL_POSTS_SLUGS = `
  query GetAllPosts {
    posts {
      slug
      updatedAt
      date
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

        req.write(JSON.stringify({ query: QUERY_ALL_POSTS_SLUGS }));
        req.end();
    });
}

function generateSitemap(posts) {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    STATIC_PAGES.forEach(page => {
        // Handle root vs pages
        const loc = page === '/' ? SITE_URL : `${SITE_URL}${page}`;
        xml += '  <url>\n';
        xml += `    <loc>${loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
    });

    // Add dynamic posts
    posts.forEach(post => {
        const lastMod = post.updatedAt ? post.updatedAt.split('T')[0] : post.date.split('T')[0];
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/article-detail.html?slug=${post.slug}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
}

async function main() {
    console.log('Generating sitemap...');
    try {
        const data = await fetchHygraphData();
        if (!data || !data.posts) {
            console.error('No posts found or error fetching data.');
            process.exit(1);
        }

        const sitemapXml = generateSitemap(data.posts);
        fs.writeFileSync('sitemap.xml', sitemapXml);
        console.log('sitemap.xml generated successfully!');
    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

main();
