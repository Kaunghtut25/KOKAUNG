const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const API_BASE = 'https://a9travel.com/api/upload';
const IMG_DIR = path.join(__dirname, 'frontend', 'public', 'images');

async function uploadImage(filePath, filename) {
  const fileBuffer = fs.readFileSync(filePath);
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  
  const header = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="file"; filename="${filename}"`,
    `Content-Type: image/jpeg`,
    '',
    ''
  ].join('\r\n');
  
  const footer = `\r\n--${boundary}--\r\n`;
  const body = Buffer.concat([
    Buffer.from(header),
    fileBuffer,
    Buffer.from(footer)
  ]);

  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE);
    const mod = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      },
      timeout: 30000
    };
    
    const req = mod.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ ok: true, status: res.statusCode });
        } else {
          resolve({ ok: false, status: res.statusCode, body: data.slice(0, 200) });
        }
      });
    });
    
    req.on('error', (err) => reject(err));
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

async function main() {
  const files = fs.readdirSync(IMG_DIR)
    .filter(f => f.endsWith('.jpg'))
    .filter(f => fs.statSync(path.join(IMG_DIR, f)).size > 5000)
    .sort();
  
  console.log(`Seeding ${files.length} images to Upstash Redis...\n`);
  
  let success = 0, fail = 0;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(IMG_DIR, file);
    try {
      const result = await uploadImage(filePath, file);
      if (result.ok) {
        console.log(`[${i+1}/${files.length}] OK: ${file}`);
        success++;
      } else {
        console.log(`[${i+1}/${files.length}] FAIL: ${file} (HTTP ${result.status} ${result.body})`);
        fail++;
      }
    } catch (err) {
      console.log(`[${i+1}/${files.length}] FAIL: ${file} - ${err.message}`);
      fail++;
    }
    
    // Rate limit
    if ((i + 1) % 5 === 0) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  
  console.log(`\n=== DONE ===`);
  console.log(`Success: ${success} | Failed: ${fail} | Total: ${files.length}`);
}

main().catch(console.error);
