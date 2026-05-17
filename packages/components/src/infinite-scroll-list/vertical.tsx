import React, { useRef, useEffect } from "react";

type InfiniteVerticalScrollProps = {
	height?: number | string;
	fill?: boolean;
	step?: number;
	interval?: number;
	stopOnHover?: boolean;
	scroll?: boolean;
	children: React.ReactNode;
};

const InfiniteVerticalScroll: React.FC<InfiniteVerticalScrollProps> = ({
	height = 300,
	fill = true,
	step = 1,
	interval = 40,
	stopOnHover = true,
	scroll = false,
	children,
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<number | null>(null);
	const singleCycleHeightRef = useRef(0);

	const getElementHeight = (element: HTMLElement): number => {
		const rect = element.getBoundingClientRect();
		const style = window.getComputedStyle(element);
		const marginTop = parseFloat(style.marginTop);
		const marginBottom = parseFloat(style.marginBottom);
		return rect.height + marginTop + marginBottom;
	};

	const getTotalHeight = (elements: HTMLElement[]): number => {
		return elements.reduce((total, el) => total + getElementHeight(el), 0);
	};

	const startScroll = () => {
		if (timerRef.current) return;

		timerRef.current = window.setInterval(() => {
			const box = boxRef.current;
			if (!box) return;

			box.scrollTop += step;

			if (singleCycleHeightRef.current > 0 && box.scrollTop >= singleCycleHeightRef.current) {
				box.scrollTop = 0;
			}
		}, interval);
	};

	const stopScroll = () => {
		if (timerRef.current) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const handleMouseLeave = () => startScroll();
	const handleMouseEnter = () => stopOnHover && stopScroll();

	useEffect(() => {
		const initScroll = async () => {
			const box = boxRef.current;
			const wrap = wrapRef.current;

			if (!box || !wrap) return;

			//[A, B, C]
			const originRows = Array.from(box.children) as HTMLElement[];
			if (originRows.length === 0) return;

			box.style.overflowY = scroll ? "auto" : "hidden";
			wrap.style.height = typeof height === "number" ? `${height}px` : height;

			const targetHeight = wrap.getBoundingClientRect().height;
			const originTotalHeight = getTotalHeight(originRows);

			if (!fill && originTotalHeight <= targetHeight) {
				return;
			}

			const repeatTimes = Math.max(1, Math.ceil(targetHeight / originTotalHeight));

			//[A, B, C, A-clone, B-clone, C-clone]
			for (let i = 0; i < repeatTimes - 1; i++) {
				originRows.forEach((row) => box.appendChild(row.cloneNode(true)));
			}

			const firstCycleRows = Array.from(box.children) as HTMLElement[];

			//[A, B, C, A-clone, B-clone, C-clone, A, B, C, A-clone, B-clone, C-clone]
			firstCycleRows.forEach((row) => box.appendChild(row.cloneNode(true)));

			const cycleHeight = getTotalHeight(firstCycleRows);
			singleCycleHeightRef.current = cycleHeight;

			startScroll();
		};

		initScroll();

		return () => {
			stopScroll();
		};
	}, [height, fill, scroll, children]);

	useEffect(() => {
		stopScroll();
		startScroll();
		return () => stopScroll();
	}, [step, interval]);

	return (
		<div
			ref={wrapRef}
			className="vertical-infinite-scroll"
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
						display: "flex",
						flexDirection: "column",
					} as React.CSSProperties
				}>
				{children}
			</div>
		</div>
	);
};

export default InfiniteVerticalScroll;
