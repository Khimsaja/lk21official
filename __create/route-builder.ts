/// <reference types="vite/client" />
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

// Get current directory
const __dirname = join(fileURLToPath(new URL('.', import.meta.url)), '../src/app/api');
if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// Use Vite's import.meta.glob for both DEV and PROD
// This statically analyzes and bundles all routes, bypassing fs.readdir entirely!
const routeModules = import.meta.glob('../src/app/api/**/route.[jt]s', { eager: true });

function getHonoPath(pathStr: string): string {
  // Convert '../src/app/api/movies/[id]/route.js' to '/movies/:id'
  let cleanPath = pathStr.replace('../src/app/api', '').replace(/\/route\.[jt]s$/, '');
  if (cleanPath === '') cleanPath = '/';
  
  return cleanPath.replace(/\[([^\]]+)\]/g, ':$1');
}

async function registerRoutes() {
  api.routes = [];

  // Sort paths to ensure specific routes register before dynamic /:params
  const paths = Object.keys(routeModules).sort((a, b) => b.length - a.length);

  for (const path of paths) {
    try {
      const route = routeModules[path] as any;
      const honoPath = getHonoPath(path);
      
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      for (const method of methods) {
        if (route[method]) {
          console.log(`[API REGISTER] ${method} ${honoPath} (from ${path})`);
          
          const handler: Handler = async (c) => {
            const params = c.req.param();
            return await route[method](c.req.raw, { params });
          };

          const methodLowercase = method.toLowerCase();
          switch (methodLowercase) {
            case 'get': api.get(honoPath, handler); break;
            case 'post': api.post(honoPath, handler); break;
            case 'put': api.put(honoPath, handler); break;
            case 'delete': api.delete(honoPath, handler); break;
            case 'patch': api.patch(honoPath, handler); break;
          }
        }
      }
    } catch (err) {
      console.error(`Error registering route ${path}:`, err);
    }
  }
}

await registerRoutes();

export { api, API_BASENAME };
