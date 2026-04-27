import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // SPAWN PYTHON BACKEND
  const pyBackend = spawn('python3', ['backend/main.py'], {
    stdio: 'inherit'
  });

  pyBackend.on('error', (err) => {
    console.error(`Failed to start Python backend: ${err.message}`);
  });

  pyBackend.on('close', (code) => {
    console.log(`Python backend exited with code ${code}`);
  });

  process.on('SIGINT', () => {
      pyBackend.kill('SIGINT');
      process.exit();
  });

  // WS Proxy for Control Plane
  const wsProxy = createProxyMiddleware({
    target: 'ws://127.0.0.1:8001',
    ws: true,
  });
  
  app.use('/admin-ws', wsProxy);
  
  app.use(express.json());

  // Existing mock endpoints...
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/admin-ws')) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
  
  // Attach upgrade handler to Express server for the WS proxy
  server.on('upgrade', wsProxy.upgrade);
}

startServer();
