const { cpSync, copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const output = path.join(root, 'dist');
const siteFiles = [
    'index.html',
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

    copyFileSync(path.join(root, file), path.join(output, file));
}

cpSync(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });