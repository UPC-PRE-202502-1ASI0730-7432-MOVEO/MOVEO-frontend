// json-server.js
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { Low } from 'lowdb';
import { JSONFile, DataFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';
import { Observer } from 'json-server/lib/observer.js';

const DB_PATH = resolve('server', 'db.json');
const PORT = parseInt(process.env.PORT || '5332', 10);

if (!existsSync(DB_PATH)) {
  console.error(`No existe el archivo de datos: ${DB_PATH}`);
  process.exit(1);
}

if (readFileSync(DB_PATH, 'utf-8').trim() === '') {
  writeFileSync(DB_PATH, '{}');
}

let adapter;
if (extname(DB_PATH) === '.json5') {
  const JSON5 = await import('json5');
  adapter = new DataFile(DB_PATH, {
    parse: JSON5.parse,
    stringify: JSON5.stringify,
  });
} else {
  adapter = new JSONFile(DB_PATH);
}

const observer = new Observer(adapter);
const db = new Low(observer, {});
await db.read();

const app = createApp(db, { logger: false });

// Middleware para manejar /api/v1/* rutas
// Debe ir ANTES de que json-server procese las rutas
app.use((req, res, next) => {
  // Si la URL empieza con /api/v1/, la reescribimos
  if (req.url && req.url.startsWith('/api/v1/')) {
    req.url = req.url.replace(/^\/api\/v1/, '');
  }
  next();
});

app.listen(PORT, () => {
  console.log(`JSON Server listening => http://localhost:${PORT}`);
  if (db.data) {
    const keys = Object.keys(db.data);
    if (keys.length) {
      console.log('Endpoints:');
      keys.forEach(k => console.log(`  http://localhost:${PORT}/api/v1/${k}`));
    } else {
      console.log('Sin colecciones en el archivo db.json');
    }
  }
});