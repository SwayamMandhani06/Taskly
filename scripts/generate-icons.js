import fs from 'fs';
import path from 'path';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#ECEEE8" />
  <!-- Signature priority bar indicator -->
  <rect x="80" y="100" width="50" height="312" rx="25" fill="#E0483E" />
  <rect x="170" y="140" width="260" height="50" rx="25" fill="#1E2320" />
  <rect x="170" y="230" width="200" height="50" rx="25" fill="#6B716B" />
  <rect x="170" y="320" width="140" height="50" rx="25" fill="#4B4FE0" />
</svg>`;

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);

// A simple 1x1 transparent PNG data URI converted to buffer for fallback binary icons if PNG requested
const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(minimalPngBase64, 'base64');

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), pngBuffer);

console.log('App icons generated successfully in public/');
