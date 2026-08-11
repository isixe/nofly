import { useState } from "react";
import Waterfall from "../../../packages/components/src/waterfall/index.tsx";

interface DemoItem {
	id: number;
	label: string;
	color: string;
	height: number;
}

const items: DemoItem[] = [
	{ id: 1, label: "A", color: "#f87171", height: 160 },
	{ id: 2, label: "B", color: "#fb923c", height: 100 },
	{ id: 3, label: "C", color: "#fbbf24", height: 140 },
	{ id: 4, label: "D", color: "#4ade80", height: 80 },
	{ id: 5, label: "E", color: "#2dd4bf", height: 180 },
	{ id: 6, label: "F", color: "#60a5fa", height: 120 },
	{ id: 7, label: "G", color: "#a78bfa", height: 90 },
	{ id: 8, label: "H", color: "#f472b6", height: 150 },
];

export default function WaterfallColumnsDemo() {
	const [columns, setColumns] = useState(2);

	return (
		<div style={{ width: "100%" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					marginBottom: "12px",
					fontSize: "14px",
					color: "#666",
				}}
			>
				<label htmlFor="columns-slider">列数：{columns}</label>
				<input
					id="columns-slider"
					type="range"
					min={1}
					max={4}
					step={1}
					value={columns}
					onChange={(e) => setColumns(Number(e.target.value))}
					style={{ flex: 1, maxWidth: "240px" }}
				/>
			</div>
			<Waterfall list={items} columns={columns} gap={10} heightKey="height" renderItem={(item) => (
				<div
					style={{
						height: `${item.height}px`,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: "#fff",
						fontSize: "14px",
						fontWeight: "bold",
						backgroundColor: item.color,
						borderRadius: "8px",
					}}
				>
					{item.label} ({item.height})
				</div>
			)} />
		</div>
	);
}
