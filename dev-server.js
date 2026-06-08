// Servidor local que emula Vercel: sirve estáticos + funciones API
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Cargar variables de entorno desde .env.local
const envFile = path.join(__dirname, '.env.local');
if (fs.existsSync(envFile)) {
  fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
    const [key, ...vals] = line.trim().split('=');
    if (key && !key.startsWith('#')) process.env[key] = vals.join('=');
  });
}

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = __dirname;
const PUBLIC = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
};

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // --- Rutas API ---
  if (pathname.startsWith('/api/')) {
    const handlerPath = path.join(ROOT, pathname + '.js').replace(/\/$/, '');
    if (!fs.existsSync(handlerPath)) {
      res.writeHead(404); res.end('API route not found');
      return;
    }
    // Parsear body para POST
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      if (body) {
        try { req.body = JSON.parse(body); } catch { req.body = {}; }
      } else {
        req.body = {};
      }
      req.query = parsed.query;

      // Limpiar caché de require para recargar cambios
      delete require.cache[require.resolve(handlerPath)];
      const handler = require(handlerPath);

      const mockRes = {
        _headers: {},
        _status: 200,
        _body: '',
        setHeader(k, v) { this._headers[k] = v; },
        status(code) { this._status = code; return this; },
        json(data) {
          this._headers['Content-Type'] = 'application/json';
          this._body = JSON.stringify(data);
          res.writeHead(this._status, this._headers);
          res.end(this._body);
        },
        end(data) {
          res.writeHead(this._status, this._headers);
          res.end(data || this._body);
        }
      };
      try {
        await handler(req, mockRes);
      } catch (err) {
        console.error('[API ERROR]', err.message);
        res.writeHead(500); res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // --- Archivos estáticos desde public/ ---
  let filePath = path.join(PUBLIC, pathname === '/' ? 'index.html' : pathname);
  // Si no existe en public/, intentar en root (compat)
  if (!fs.existsSync(filePath)) filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  // SPA fallback
  if (!fs.existsSync(filePath)) filePath = path.join(PUBLIC, 'index.html');

  const ext = path.extname(filePath);
  const mimeType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n✅  Dev server corriendo en http://localhost:${PORT}`);
  console.log(`   APPS_SCRIPT_URL: ${process.env.APPS_SCRIPT_URL || '(no definida)'}\n`);
});
