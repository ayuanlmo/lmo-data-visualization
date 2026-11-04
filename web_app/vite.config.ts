import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const LMO_APP_NAME = 'lmo-Data-Visualization';
const LMO_APP_BUILD_TIME = Date.now();

// 对齐旧 craco 的 HtmlWebpackPlugin templateParameters：注入构建时间与名称
const lmoBuildConfigPlugin = (): Plugin => ({
    name: 'lmo-build-config',
    transformIndexHtml(html: string): string {
        return html
            .replaceAll('<%= __LMO_BUILD_CONFIG.__LMO_APP_BUILD_TIME %>', String(LMO_APP_BUILD_TIME))
            .replaceAll('<%= __LMO_BUILD_CONFIG.__LMO_APP_NAME %>', LMO_APP_NAME);
    }
});

const serverPort = Number(process.env.LMO_SERRVER_APP_DEV_PORT ?? 49237);

export default defineConfig({
    base: '/',
    plugins: [react(), lmoBuildConfigPlugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        port: Number(process.env.LMO_WEB_APP_DEV_PORT ?? 8081),
        proxy: {
            '/api': {
                target: `http://localhost:${serverPort}`,
                changeOrigin: true,
                rewrite: (p: string): string => p.replace(/^\/api/, '')
            },
            '/connect': {
                target: `http://localhost:${serverPort}/connect`,
                changeOrigin: true,
                ws: true,
                rewrite: (p: string): string => p.replace(/^\/connect/, '')
            }
        }
    },
    build: {
        outDir: 'build',
        target: 'es2020',
        sourcemap: false,
        rollupOptions: {
            output: {
                entryFileNames: 'script/_t_script_[hash].t.js',
                chunkFileNames: 'script/_t_script_[hash].chunk.r.js',
                assetFileNames: (info): string => {
                    const name = info.name ?? '';
                    if (name.endsWith('.css')) return 'css/_t_style_[hash].t.css';
                    return `static/_t_static_[hash].t${path.extname(name)}`;
                }
            }
        }
    }
});
