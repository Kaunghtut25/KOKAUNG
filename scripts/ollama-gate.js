// ollama-gate.js — token-gated reverse proxy to local Ollama (OpenAI-compatible /v1)
// Usage: node ollama-gate.js <port> <secret>  (defaults: 11555 / from env OLLAMA_GATE_SECRET)
// Forwards ONLY POST /v1/chat/completions to http://localhost:11434/v1/chat/completions
// after checking Authorization: Bearer <secret>. Everything else -> 404.
var http = require('http');

var PORT = parseInt(process.argv[2] || process.env.OLLAMA_GATE_PORT || '11555', 10);
var SECRET = process.argv[3] || process.env.OLLAMA_GATE_SECRET || '';
var UPSTREAM = process.env.OLLAMA_UPSTREAM || 'http://localhost:11434';

if (!SECRET) {
  console.error('No secret set. Run with: node ollama-gate.js <port> <secret>  (or set OLLAMA_GATE_SECRET)');
  process.exit(1);
}

var server = http.createServer(function (req, res) {
  // CORS preflight (chat widget same-origin usually, but allow cross-origin dev)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  // Only allow POST /v1/chat/completions
  var url = req.url.split('?')[0];
  if (req.method !== 'POST' || url !== '/v1/chat/completions') {
    res.writeHead(404, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'not found' }));
  }

  // Auth check
  var auth = req.headers['authorization'] || '';
  var token = auth.replace(/^Bearer\s+/i, '');
  if (token !== SECRET) {
    res.writeHead(401, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ error: 'unauthorized' }));
  }

  // Buffer body and forward
  var chunks = [];
  req.on('data', function (c) { chunks.push(c); });
  req.on('end', function () {
    var body = Buffer.concat(chunks);
    var up = http.request(UPSTREAM + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': body.length,
      },
    }, function (upRes) {
      res.writeHead(upRes.statusCode || 200, { 'content-type': 'application/json' });
      upRes.pipe(res);
    });
    up.on('error', function (e) {
      res.writeHead(502, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'upstream error: ' + e.message }));
    });
    up.end(body);
  });
});

server.listen(PORT, function () {
  console.log('ollama-gate listening on :' + PORT + ' -> ' + UPSTREAM + ' (auth required)');
});
