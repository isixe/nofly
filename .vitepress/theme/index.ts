// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import { useData, useRoute, type Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import giscusTalk from "vitepress-plugin-comment-with-giscus";
import googleAnalytics from "vitepress-plugin-google-analytics";
import "./style.css";
import "virtual:group-icons.css";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router, siteData }) {
		googleAnalytics({
			id: "G-N14369DVDH",
		});
	},
	setup() {
		const { frontmatter } = useData();
		const route = useRoute();

		giscusTalk(
			{
				repo: "isixe/nofly",
				repoId: "R_kgDOPuEFwA",
				category: "General",
				categoryId: "DIC_kwDOPuEFwM4CxrPD",
				mapping: "title",
				inputPosition: "top",
				lang: "zh-CN",
				lightTheme: "light",
				darkTheme: "transparent_dark",
				reactionEnabled: "1",
			},
			{
				frontmatter,
				route,
			},
			true
		);
	},
} satisfies Theme;
