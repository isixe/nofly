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
	srcDir: "./docs",
	title: "Nofly",
	description: "Vue3 和 React 的组件通用示例",
	themeConfig: {
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
				],
			},
		],

		socialLinks: [{ icon: "github", link: "https://github.com/isixe/nofly" }],
	},
	markdown: {
		config(md) {
			md.use(vitepressDemoPlugin, {
				demoDir: path.resolve(__dirname, "../src"),
			});
			md.use(groupIconMdPlugin);
		},
	},
	vite: {
		plugins: [react(), groupIconVitePlugin()],
		publicDir: "../public",
	},
});
