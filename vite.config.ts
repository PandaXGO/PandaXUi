import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { UserConfig } from 'vite';
import { loadEnv } from './src/utils/viteBuild';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';

const pathResolve = (dir: string): any => {
	return resolve(__dirname, dir);
};

const { VITE_PORT, VITE_OPEN, VITE_PUBLIC_PATH } = loadEnv();

const alias: Record<string, string> = {
	'@': pathResolve('src'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig: UserConfig = {
	plugins: [vue(),vueSetupExtend()],
	root: process.cwd(),
	resolve: { alias },
	base: process.env.NODE_ENV === 'production' ? VITE_PUBLIC_PATH : './',
	optimizeDeps: {
		include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en'],
	},
	server: {
		host: '0.0.0.0',
		port: VITE_PORT,
		open: VITE_OPEN,
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:7788',
				ws: true,
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, '/'),
			},
		},
	},
	build: {
		outDir: 'deploy/dist',
		minify: 'esbuild',
		sourcemap: false,
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].${new Date().getTime()}.js`,
				chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
				assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
			},
		},
	},
	css: { preprocessorOptions: { css: { charset: false } } },
	define: {
		__VUE_I18N_LEGACY_API__: JSON.stringify(false),
		__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
		__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
	},
};

export default viteConfig;
