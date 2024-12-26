const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://example.com/';

async function generateSitemap() {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const urls = new Set();

    $('a').each((_, element) => {
        const href = $(element).attr('href');
        if (href && !href.includes('#') && (href.startsWith(url) || !href.startsWith('http'))) {
            urls.add(href);
        }
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from(urls).map(url => `<url><loc>${url}</loc><changefreq>${url === url ? 'daily' : 'weekly'}</changefreq></url>`).join('\n') + `\n</urlset>`;

    const deployDir = path.join(__dirname, 'deploy');
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir);
    fs.writeFileSync(path.join(deployDir, 'sitemap.xml'), sitemap);
}

await generateSitemap();
