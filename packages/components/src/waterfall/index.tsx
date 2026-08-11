import React, { useMemo } from "react";

type WaterfallProps = {
	list?: any[];
	columns?: number;
	gap?: number;
	heightKey?: string;
	renderItem?: (item: any, index: number, column: number) => React.ReactNode;
};

const Waterfall: React.FC<WaterfallProps> = ({
	list = [],
	columns = 2,
	gap = 12,
	heightKey,
	renderItem,
}) => {
	// Shortest column first with heightKey, otherwise round-robin.
	const columnsData = useMemo(() => {
		const colCount = Math.max(1, columns);
		const cols: any[][] = Array.from({ length: colCount }, () => []);
		const colHeights = Array.from({ length: colCount }, () => 0);

		list.forEach((item, idx) => {
			if (!heightKey) {
				cols[idx % colCount].push(item);
				return;
			}
			const height = Number(item?.[heightKey]) || 0;
			let target = 0;
			for (let i = 1; i < colCount; i++) {
				if (colHeights[i] < colHeights[target]) {
					target = i;
				}
			}
			cols[target].push(item);
			colHeights[target] += height + gap;
		});
		return cols;
	}, [list, columns, gap, heightKey]);

	return (
		<div className="waterfall-container" style={containerStyle}>
			{columnsData.map((col, colIdx) => (
				<div
					key={colIdx}
					className="waterfall-column"
					style={{
						...columnStyle,
						marginRight: colIdx < columnsData.length - 1 ? `${gap}px` : "0",
					}}
				>
					{col.map((item, idx) => (
						<div key={idx} className="waterfall-item" style={{ ...itemStyle, marginBottom: `${gap}px` }}>
							{renderItem ? renderItem(item, idx, colIdx + 1) : item}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

const containerStyle: React.CSSProperties = {
	display: "flex",
	flexDirection: "row",
	alignItems: "flex-start",
	width: "100%",
};

const columnStyle: React.CSSProperties = {
	flex: 1,
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
};

const itemStyle: React.CSSProperties = {
	width: "100%",
	boxSizing: "border-box",
};

export default Waterfall;
