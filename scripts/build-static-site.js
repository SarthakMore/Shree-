const { cpSync, copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const output = path.join(root, 'dist');
const configuredSiteUrl = new URL(process.env.SITE_URL || 'https://shree-website-93o4.onrender.com');
if (!['http:', 'https:'].includes(configuredSiteUrl.protocol) ||
    configuredSiteUrl.pathname !== '/' ||
    configuredSiteUrl.search ||
    configuredSiteUrl.hash ||
    configuredSiteUrl.username ||
    configuredSiteUrl.password) {
    throw new Error('SITE_URL must be an HTTP(S) origin without a path, query, or credentials.');
}
const siteUrl = configuredSiteUrl.origin;
const siteFiles = [
    'index.html',
    'kolhapur-taxi.html',
    'contact.html',
    'admin.html',
    'airport-tours.html',
    'fleet.html',
    'login.html',
    'shared-cabs.html',
    'manifest.webmanifest',
    'service-worker.js',
    'script.js',
    'styles.css'
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of siteFiles) {
    if (file === 'script.js') {
        const script = readFileSync(path.join(root, file), 'utf8');
        const apiBase = process.env.API_BASE_URL || 'https://shree-venkateshwara-api.onrender.com';
        const localApiBase = "const API_BASE = 'http://localhost:5000';";

        if (!script.includes(localApiBase)) {
            throw new Error('Could not find the local API base URL in script.js.');
        }

        writeFileSync(
            path.join(output, file),
            script.replace(localApiBase, `const API_BASE = ${JSON.stringify(apiBase)};`)
        );
        continue;
    }

    const destination = path.join(output, file);
    copyFileSync(path.join(root, file), destination);
    if (file.endsWith('.html')) {
        const html = readFileSync(destination, 'utf8');
        writeFileSync(destination, html.replaceAll('__SITE_URL__', siteUrl));
    }
}

cpSync(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });

const sitemapPages = ['/', '/kolhapur-taxi.html', '/fleet.html', '/airport-tours.html', '/contact.html'];
const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapPages.map(page => `  <url><loc>${siteUrl}${page}</loc></url>`),
    '</urlset>',
    ''
].join('\n');
writeFileSync(path.join(output, 'sitemap.xml'), sitemap);
writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);