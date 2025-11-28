import React, { useEffect, useRef, useState, useMemo } from "react";

type Props = {
	itemWidth?: number | string;
	gap?: number;
	autoplay?: boolean;
	interval?: number;
	showArrows?: boolean;
	showIndicator?: boolean;
	indicatorPosition?: "outside" | "inside";
	arrowSize?: number | string;
	initialIndex?: number;
	children?: React.ReactNode;
	change?: (activeIndex: number) => void;
	click?: (activeIndex: number) => void;
};

type LayoutCache = {
	viewportWidth: number;
	itemWidthPx: number;
	leftOffset: number;
};

const cloneOffset = 2;

const HorizontalShowcaseCarousel: React.FC<Props> = ({
	itemWidth = 60,
	gap = 15,
	autoplay = false,
	interval = 3000,
	showArrows = true,
	showIndicator = true,
	indicatorPosition = "inside",
	arrowSize = 45,
	initialIndex = 0,
	children,
	change,
	click,
}) => {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);

	const [layoutCache, setLayoutCache] = useState<LayoutCache>({ viewportWidth: 0, itemWidthPx: 0, leftOffset: 0 });
	const [originItems, setOriginItems] = useState<React.ReactNode[]>([]);

	const [curRealIndex, setCurRealIndex] = useState<number>(0);
	const [curVirtualIndex, setCurVirtualIndex] = useState<number>(cloneOffset);

	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

	const autoplayTimer = useRef<number | null>(null);

	const virtualItems = (() => {
		const items = originItems;
		if (items.length <= 1) return items;
		return [...items.slice(-2), ...items, ...items.slice(0, 2)];
	})();

	const itemStyle = () => {
		if (typeof itemWidth === "number") {
			const vw = layoutCache.viewportWidth;
			const w = vw ? `${(vw * itemWidth) / 100}px` : `${itemWidth}%`;
			return { width: w } as React.CSSProperties;
		}
		return { width: itemWidth as string } as React.CSSProperties;
	};

	const arrowStyle = () => {
		if (typeof arrowSize === "number") {
			const size = arrowSize;
			return {
				width: `${size}px`,
				height: `${size}px`,
			} as React.CSSProperties;
		}
		const size = arrowSize || "45px";
		return { width: size, height: size } as React.CSSProperties;
	};

	const trackStyle = () => {
		const { viewportWidth, itemWidthPx, leftOffset } = layoutCache;
		if (!viewportWidth || !itemWidthPx) {
			return {
				gap: `${gap}px`,
				transform: `translateX(0px)`,
				transition: isTransitioning ? "transform 0.4s ease-out" : "none",
			} as React.CSSProperties;
		}

		const translate = -(curVirtualIndex * (itemWidthPx + gap) + leftOffset);
		return {
			gap: `${gap}px`,
			transform: `translateX(${translate}px)`,
			transition: isTransitioning ? "transform 0.4s ease-out" : "none",
		} as React.CSSProperties;
	};

	const indicatorStyle = useMemo(() => {
		const bottom = indicatorPosition === "inside" ? "35px" : "8px";
		return { bottom } as React.CSSProperties;
	}, [indicatorPosition]);

	const realToVirtual = (realPos: number) => {
		const len = originItems.length || 0;
		if (len === 0) return cloneOffset;
		const normalized = ((realPos % len) + len) % len;
		return normalized + cloneOffset;
	};

	const virtualToReal = (virtualPos: number) => {
		const len = originItems.length || 0;
		if (len === 0) return 0;
		return (((virtualPos - cloneOffset) % len) + len) % len;
	};

	function initLayout() {
		setCurRealIndex(initialIndex || 0);
		setCurVirtualIndex(realToVirtual(initialIndex || 0));
	}

	function measureLayoutCache() {
		if (!viewportRef.current) return;

		const viewportWidth = viewportRef.current.clientWidth || 0;
		let itemWidthPx = 0;

		if (typeof itemWidth === "number") {
			itemWidthPx = (viewportWidth * itemWidth) / 100;
		}

		if (!itemWidthPx) {
			const firstChild = trackRef.current?.children[0] as HTMLElement | undefined;
			itemWidthPx = firstChild?.clientWidth || 0;
		}

		const leftOffset = itemWidthPx / 2 - viewportWidth / 2;
		setLayoutCache({ viewportWidth, itemWidthPx, leftOffset });
	}

	function moveToIndex(targetIndex: number, skipTransition = false) {
		const length = originItems.length;
		if (length === 0) return;

		if (skipTransition) {
			setIsTransitioning(false);
			setCurVirtualIndex((v) => {
				const newV = v + targetIndex;
				setCurRealIndex(virtualToReal(newV));
				return newV;
			});
			return;
		}

		setIsTransitioning(true);
		setCurVirtualIndex((v) => v + targetIndex);
	}

	const handlePrev = () => {
		clearAutoplay();
		moveToIndex(-1);
		setupAutoplay();
	};

	const handleNext = () => {
		clearAutoplay();
		moveToIndex(1);
		setupAutoplay();
	};

	const handleJumpTo = (realIdx: number) => {
		clearAutoplay();
		const virtualIndex = realToVirtual(realIdx);
		setIsTransitioning(true);
		setCurVirtualIndex(virtualIndex);
		setupAutoplay();
	};

	function handleTransitionEnd() {
		const len = originItems.length;
		if (len === 0) return;

		const virtualIndex = curVirtualIndex;
		if (virtualIndex < cloneOffset) {
			const newV = virtualIndex + len;
			moveToIndex(newV - virtualIndex, true);
			return;
		}

		if (virtualIndex >= cloneOffset + len) {
			const newV = virtualIndex - len;
			moveToIndex(newV - virtualIndex, true);
			return;
		}

		setCurRealIndex(virtualToReal(virtualIndex) % originItems.length);
	}

	function setupAutoplay() {
		if (!autoplay || originItems.length <= 1) return;
		clearAutoplay();
		autoplayTimer.current = window.setInterval(() => {
			moveToIndex(1);
		}, interval);
	}

	function clearAutoplay() {
		if (!autoplayTimer.current) return;
		clearInterval(autoplayTimer.current);
		autoplayTimer.current = null;
	}

	function onResize() {
		measureLayoutCache();
		setIsTransitioning(false);
	}

	function onClick(index: number) {
		const realIndex = virtualToReal(index);

		if (index > curVirtualIndex) {
			clearAutoplay();
			moveToIndex(1);
			setupAutoplay();
		}

		if (index < curVirtualIndex) {
			clearAutoplay();
			moveToIndex(-1);
			setupAutoplay();
		}

		if (typeof click === "function") {
			click(realIndex);
		}
	}

	useEffect(() => {
		const items = React.Children.toArray(children || []) as React.ReactNode[];
		setOriginItems(items.map((c) => c));

		const raf = window.requestAnimationFrame(() => {
			initLayout();
			measureLayoutCache();
			setupAutoplay();
		});

		window.addEventListener("resize", onResize);
		return () => {
			clearAutoplay();
			window.removeEventListener("resize", onResize);
			window.cancelAnimationFrame(raf);
		};
	}, [children]);

	useEffect(() => {
		measureLayoutCache();
	}, [curVirtualIndex]);

	useEffect(() => {
		if (typeof change === "function") {
			change(curRealIndex);
		}
	}, [curRealIndex, change]);

	return (
		<div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
			{showArrows && originItems.length > 0 && (
				<div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
					<button
						className="arrow prev"
						style={{
							...(arrowStyle() as React.CSSProperties),
							pointerEvents: "all",
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)",
							left: 12,
							border: "none",
							borderRadius: "50%",
							background: "rgba(0,0,0,0.25)",
							color: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						onClick={handlePrev}>
						<svg
							style={{ width: "60%", height: "60%" }}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}>
							<polyline points="15 18 9 12 15 6" />
						</svg>
					</button>
					<button
						className="arrow next"
						style={{
							...(arrowStyle() as React.CSSProperties),
							pointerEvents: "all",
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)",
							right: 12,
							border: "none",
							borderRadius: "50%",
							background: "rgba(0,0,0,0.25)",
							color: "#fff",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						onClick={handleNext}>
						<svg
							style={{ width: "60%", height: "60%" }}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				</div>
			)}

			<div ref={viewportRef} className="viewport" style={{ width: "100%", overflow: "hidden", position: "relative" }}>
				{originItems.length > 0 && (
					<div
						ref={trackRef}
						className="track"
						style={{
							display: "flex",
							alignItems: "center",
							padding: "20px 0",
							...(trackStyle() as React.CSSProperties),
						}}
						onTransitionEnd={handleTransitionEnd}>
						{virtualItems.map((child, idx) => (
							<div
								key={idx}
								style={{ ...(itemStyle() as React.CSSProperties), flexShrink: 0 }}
								onClick={() => onClick(idx)}>
								{child}
							</div>
						))}
					</div>
				)}
			</div>

			{showIndicator && originItems.length > 0 && (
				<div
					className="indicator-bar"
					style={{
						width: "50%",
						position: "absolute",
						...(indicatorStyle as React.CSSProperties),
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						justifyContent: "center",
						gap: 8,
						zIndex: 2,
					}}>
					{originItems.map((_, idx) => (
						<span
							key={idx}
							className={`indicator ${idx === curRealIndex ? "active" : ""}`}
							onClick={() => handleJumpTo(idx)}
							style={{
								width: "10%",
								height: 4,
								background: idx === curRealIndex ? "#fff" : "rgba(255,255,255,0.45)",
								cursor: "pointer",
								transition: "all 0.25s",
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default HorizontalShowcaseCarousel;
