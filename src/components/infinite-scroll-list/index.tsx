import React, { useRef, useEffect } from "react";

interface SeamlessScrollProps {
	list: unknown[];
	visibleRows?: number;
	fill?: boolean;
	speed?: number;
	interval?: number;
	stopOnHover?: boolean;
	children: React.ReactNode;
}

const SeamlessScroll: React.FC<SeamlessScrollProps> = ({
	list,
	visibleRows = 3,
	fill = true,
	speed = 1,
	interval = 40,
	stopOnHover = true,
	children,
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<number | null>(null);
	const rowHeightRef = useRef(0);
	const singleCycleHeightRef = useRef(0);

	useEffect(() => {
		const initScroll = async () => {
			const box = boxRef.current;
			const wrap = wrapRef.current;

			if (!box || !wrap) return;

			const originRows = Array.from(box.children) as HTMLElement[];

			await new Promise((resolve) => setTimeout(resolve, 0));

			const firstRow = originRows[0] as HTMLElement;
			if (!firstRow) return;

			const height = firstRow.getBoundingClientRect().height;
			rowHeightRef.current = height;

			const curLen = originRows.length;
			if (curLen === 0) return;

			if (!fill && curLen <= visibleRows) {
				wrap.style.height = `${height * visibleRows}px`;
				return;
			}

			const repeatTimes = Math.max(1, Math.ceil(visibleRows / curLen));

			for (let i = 0; i < repeatTimes - 1; i++) {
				originRows.forEach((row) => box.appendChild(row.cloneNode(true)));
			}

			const singleCycleCount = curLen * repeatTimes;
			const firstCycleRows = (Array.from(box.querySelectorAll(".box-row")) as HTMLElement[]).slice(0, singleCycleCount);

			firstCycleRows.forEach((row) => box.appendChild(row.cloneNode(true)));

			const cycleHeight = height * singleCycleCount;
			singleCycleHeightRef.current = cycleHeight;

			wrap.style.height = `${height * visibleRows}px`;

			startScroll();
		};

		initScroll();

		return () => {
			stopScroll();
		};
	}, [list, visibleRows, fill, speed, interval]);

	const startScroll = () => {
		if (timerRef.current) return;

		timerRef.current = window.setInterval(() => {
			const box = boxRef.current;
			if (!box) return;

			box.scrollTop += speed;

			if (singleCycleHeightRef.current > 0 && box.scrollTop >= singleCycleHeightRef.current) {
				box.scrollTop -= singleCycleHeightRef.current;
			}
		}, interval);
	};

	const stopScroll = () => {
		if (timerRef.current) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const handleMouseEnter = () => {
		if (stopOnHover) stopScroll();
	};

	const handleMouseLeave = () => {
		if (stopOnHover) startScroll();
	};

	return (
		<div
			ref={wrapRef}
			className="seamless-scroll"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				overflow: "hidden",
				position: "relative",
			}}>
			<div
				ref={boxRef}
				className="box-wrap"
				style={
					{
						height: "100%",
						overflow: "hidden",
						scrollbarWidth: "none",
					} as React.CSSProperties
				}>
				{children}
			</div>
		</div>
	);
};

export default SeamlessScroll;
