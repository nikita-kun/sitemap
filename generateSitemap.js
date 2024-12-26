const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const url = 'https://nikita-kun.github.io/;

async function generateSitemap() {
    const response = await axios.get(url, { responseType: 'stream' });
    let html = '';

    response.data.on('data', chunk => {
        html += chunk.toString();
    });

    response.data.on('end', () => {
        const $ = cheerio.load(html);
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
        console.log('Sitemap generated successfully!');
    });

    response.data.on('error', error => {
        console.error('Error processing stream:', error);
    });
}

generateSitemap();
