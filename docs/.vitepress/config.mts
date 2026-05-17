import { defineConfig } from "vitepress";
import { vitepressDemoPlugin } from "vitepress-demo-plugin";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitepress.dev/reference/site-config
export default defineConfig({
	srcDir: "zh",
	title: "Nofly",
	description: "一个轻量级、无框架的 Vue 3 和 React 组件示例库",
	head: [["link", { rel: "icon", href: "/favicon.ico" }]],
	themeConfig: {
		logo: "/favicon.ico",
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: "首页", link: "/" },
			{ text: "组件", link: "/infinite-scroll-list/vertical" },
		],

		sidebar: [
			{
				text: "组件",
				items: [
					{
						text: "无缝循环滚动的列表",
						items: [
							{ text: "垂直", link: "/infinite-scroll-list/vertical" },
							{ text: "水平", link: "/infinite-scroll-list/horizontal" },
						],
					},
					{
						text: "展柜式跑马灯",
						items: [
							{ text: "垂直", link: "/showcase-carousel/vertical" },
							{ text: "水平", link: "/showcase-carousel/horizontal" },
						],
					},
					{ text: "通知轮播", link: "/notice-carousel/index" },
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/isixe/nofly" }],
	},
	markdown: {
		config(md) {
			md.use(vitepressDemoPlugin, {
				demoDir: path.resolve(__dirname, "../"),
			});
			md.use(groupIconMdPlugin);
		},
	},
	vite: {
		plugins: [react(), groupIconVitePlugin()],
		publicDir: path.resolve(__dirname, "../../public"),
		server: {
			fs: {
				allow: [path.resolve(__dirname, "../../")],
			},
		},
		resolve: {
			alias: {
				"@nofly/components": path.resolve(__dirname, "../../packages/components/src"),
			},
		},
	},
});
