function generateSitemap() {
    var urls = new Set([location.href]);
    document.querySelectorAll('a').forEach(function(link) {
        if (!link.href.includes('#') && (link.href.startsWith(location.origin) || !link.href.startsWith('http'))) urls.add(link.href);
    });
    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        Array.from(urls).map(function(url) { return `<url><loc>${url}</loc><changefreq>${url == location.origin + '/' ? 'daily' : 'weekly'}</changefreq></url>`; }).join('\n') + `</urlset>`;
}

generateSitemap()
