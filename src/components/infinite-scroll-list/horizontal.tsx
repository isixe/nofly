import React, { useRef, useEffect, CSSProperties } from "react";

type InfiniteHorizontalScrollProps = {
	children: React.ReactNode;
	width?: number | string;
	fill?: boolean;
	step?: number;
	interval?: number;
	stopOnHover?: boolean;
	scroll?: boolean;
};

type ChildProps = {
	style?: CSSProperties;
};

const InfiniteHorizontalScroll: React.FC<InfiniteHorizontalScrollProps> = ({
	children,
	width,
	fill = true,
	step = 1,
	interval = 40,
	stopOnHover = true,
	scroll = false,
}) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<number | null>(null);
	const singleCycleWidthRef = useRef<number>(0);

	const getElementWidth = (element: HTMLElement): number => {
		const rect = element.getBoundingClientRect();
		const style = window.getComputedStyle(element);
		const marginLeft = parseFloat(style.marginLeft);
		const marginRight = parseFloat(style.marginRight);
		return rect.width + marginLeft + marginRight;
	};

	const getTotalWidth = (elements: HTMLElement[]): number => {
		return elements.reduce((total, el) => total + getElementWidth(el), 0);
	};

	const startScroll = () => {
		if (timerRef.current) return;
		timerRef.current = window.setInterval(() => {
			const box = boxRef.current;
			if (!box) return;

			box.scrollLeft += step;

			if (singleCycleWidthRef.current > 0 && box.scrollLeft >= singleCycleWidthRef.current) {
				box.scrollLeft = 0;
			}
		}, interval);
	};

	const stopScroll = () => {
		if (timerRef.current) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const handleMouseEnter = () => stopOnHover && stopScroll();
	const handleMouseLeave = () => stopOnHover && startScroll();

	useEffect(() => {
		const initScroll = async () => {
			const box = boxRef.current;
			const wrap = wrapRef.current;
			if (!box || !wrap) return;

			//[A, B, C]
			const originItems = Array.from(box.children) as HTMLElement[];
			if (originItems.length === 0) return;

			box.style.overflowX = scroll ? "auto" : "hidden";
			if (width) {
				wrap.style.width = typeof width === "number" ? `${width}px` : width;
			}

			const targetWidth = wrap.getBoundingClientRect().width;
			const originTotalWidth = getTotalWidth(originItems);

			if (!fill && originTotalWidth <= targetWidth) {
				return;
			}

			const repeatTimes = Math.max(1, Math.ceil(targetWidth / originTotalWidth));

			//[A, B, C, A-clone, B-clone, C-clone]
			for (let i = 0; i < repeatTimes - 1; i++) {
				originItems.forEach((item) => {
					const clone = item.cloneNode(true) as HTMLElement;
					box.appendChild(clone);
				});
			}

			const firstCycleItems = Array.from(box.children) as HTMLElement[];

			//[A, B, C, A-clone, B-clone, C-clone, A, B, C, A-clone, B-clone, C-clone]
			firstCycleItems.forEach((item) => {
				const clone = item.cloneNode(true) as HTMLElement;
				box.appendChild(clone);
			});

			singleCycleWidthRef.current = getTotalWidth(firstCycleItems);

			startScroll();
		};

		initScroll();

		return () => {
			stopScroll();
		};
	}, [width, fill, scroll, children]);

	useEffect(() => {
		stopScroll();
		startScroll();
		return () => stopScroll();
	}, [step, interval]);

	return (
		<div
			ref={wrapRef}
			style={{
				overflow: "hidden",
				position: "relative",
			}}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<div
				ref={boxRef}
				style={{
					display: "flex",
					flexDirection: "row",
					width: "100%",
					height: "100%",
					scrollbarWidth: "none",
					overflow: "hidden",
					WebkitOverflowScrolling: "touch",
				}}>
				{React.Children.map(children, (child) => {
					if (React.isValidElement<ChildProps>(child)) {
						return React.cloneElement(child, {
							style: {
								...child.props.style,
								flexShrink: 0,
							},
						});
					}
					return child;
				})}
			</div>
		</div>
	);
};

export default InfiniteHorizontalScroll;
