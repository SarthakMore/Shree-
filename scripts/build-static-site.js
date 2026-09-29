const { cpSync, copyFileSync, mkdirSync, rmSync } = require('node:fs');
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
  'script.js',
  'styles.css'
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const file of siteFiles) {
  copyFileSync(path.join(root, file), path.join(output, file));
}

cpSync(path.join(root, 'images'), path.join(output, 'images'), { recursive: true });