import Waterfall from "../../../packages/components/src/waterfall/index.tsx";

interface DemoItem {
	id: number;
	color: string;
	label: string;
	height: number;
}

const items: DemoItem[] = [
	{ id: 1, color: "#f87171", label: "1", height: 120 },
	{ id: 2, color: "#fb923c", label: "2", height: 180 },
	{ id: 3, color: "#fbbf24", label: "3", height: 100 },
	{ id: 4, color: "#4ade80", label: "4", height: 200 },
	{ id: 5, color: "#2dd4bf", label: "5", height: 140 },
	{ id: 6, color: "#60a5fa", label: "6", height: 90 },
	{ id: 7, color: "#a78bfa", label: "7", height: 160 },
	{ id: 8, color: "#f472b6", label: "8", height: 130 },
];

export default function WaterfallSimpleDemo() {
	return (
		<div style={{ width: "100%" }}>
			<Waterfall list={items} columns={3} gap={12} renderItem={(item) => (
				<div
					style={{
						backgroundColor: item.color,
						height: `${item.height}px`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#fff",
						fontSize: "18px",
						fontWeight: "bold",
						borderRadius: "8px",
					}}
				>
					{item.label}
				</div>
			)} />
		</div>
	);
}
