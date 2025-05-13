import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            open: process.env.NODE_ENV !== 'CI',
            filename: './dist/stats.html',
        }),
    ],
    define: {
        'process.env': process.env,
    },
    server: {
        port: 7600,
        host: 'localhost',
        open: true,
        proxy: {
            '/api': {
                target: 'https://cloud.unitestream.com',
                changeOrigin: true,
                secure: false,
            },
            '/login': {
                target: 'https://cloud.unitestream.com',
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        proxyRes.statusCode = 302;
                        proxyRes.headers['location'] = 'https://auth.cloud.unitestream.com/login/oauth/authorize?client_id=a38fa70f908a10fcbc36&response_type=code&redirect_uri=http://localhost:7600/%23/oauth-callback&scope=read&state=casdoor';
                    });
                }
            },
            '/auth/logout': {
                target: 'https://cloud.unitestream.com',
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        proxyRes.statusCode = 302;
                        proxyRes.headers['location'] = 'https://auth.cloud.unitestream.com/api/logout';
                    });
                }
            },
            '/signup': {
                target: 'https://cloud.unitestream.com',
                changeOrigin: true,
                secure: false,
                configure: (proxy, options) => {
                    proxy.on('proxyRes', (proxyRes, req, res) => {
                        proxyRes.statusCode = 302;
                        proxyRes.headers['location'] = 'https://auth.cloud.unitestream.com/signup/unitestream';
                    });
                }
            }
        },
    },
    base: './',
    esbuild: {
        keepNames: true,
    },
    build: {
        sourcemap: true,
        rollupOptions: {
            plugins: [preserveDirectives()],
        },
    },
    resolve: {
        preserveSymlinks: true,
    },
});
