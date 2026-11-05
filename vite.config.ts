import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import enquiryHandler from './api/enquiry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function mteVercelParityPlugin(): Plugin {
  const cleanUrlMap: Record<string, string> = {
    '/privacy-policy': '/privacy-policy.html',
    '/terms': '/terms.html',
    '/booking-policy': '/booking-policy.html',
    '/cancellation-refund-policy': '/cancellation-refund-policy.html',
  };

  const attachMiddleware = (middlewares: {
    use: (fn: (req: any, res: any, next: () => void) => void) => void;
  }) => {
    middlewares.use((req, res, next) => {
      const urlPath = (req.url || '').split('?')[0];
      if (urlPath === '/api/enquiry') {
        void enquiryHandler(req, res);
        return;
      }
      if (cleanUrlMap[urlPath]) {
        req.url = cleanUrlMap[urlPath];
      }
      next();
    });
  };

  return {
    name: 'mte-vercel-parity',
    configureServer(server) {
      attachMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mteVercelParityPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
