import React, { useEffect, useRef, useState, useMemo } from "react";

type Props = {
	itemHeight?: number | string;
	gap?: number;
	autoplay?: boolean;
	interval?: number;
	showArrows?: boolean;
	showIndicator?: boolean;
	indicatorPosition?: "left" | "right";
	arrowSize?: number | string;
	initialIndex?: number;
	children?: React.ReactNode;
	change?: (activeIndex: number) => void;
};

type LayoutCache = {
	viewportHeight: number;
	itemHeightPx: number;
	topOffset: number;
};

const cloneOffset = 2;

const VerticalTiledCarousel: React.FC<Props> = ({
	itemHeight = 60,
	gap = 0,
	autoplay = false,
	interval = 3000,
	showArrows = true,
	showIndicator = true,
	indicatorPosition = "right",
	arrowSize = 45,
	initialIndex = 0,
	children,
	change,
}) => {
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);

	const [layoutCache, setLayoutCache] = useState<LayoutCache>({ viewportHeight: 0, itemHeightPx: 0, topOffset: 0 });
	const [originItems, setOriginItems] = useState<React.ReactNode[]>([]);

	const [curRealIndex, setCurRealIndex] = useState<number>(0);
	const [curVirtualIndex, setCurVirtualIndex] = useState<number>(cloneOffset);

	const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

	const autoplayTimer = useRef<number | null>(null);
	const viewportResizeObserver = useRef<ResizeObserver | null>(null);

	const virtualItems = useMemo(() => {
		const items = originItems;
		if (items.length <= 1) return items;
		return [...items.slice(-2), ...items, ...items.slice(0, 2)];
	}, [originItems]);

	const itemStyle = () => {
		if (typeof itemHeight === "number") {
			const vh = layoutCache.viewportHeight;
			const h = vh ? `${(vh * itemHeight) / 100}px` : `${itemHeight}%`;

			return { height: h, width: "100%" } as React.CSSProperties;
		}

		return { height: itemHeight as string, width: "100%" } as React.CSSProperties;
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
		const { viewportHeight, itemHeightPx, topOffset } = layoutCache;
		if (!viewportHeight || !itemHeightPx) {
			return {
				gap: `${gap}px`,
				transform: `translateY(0px)`,
				transition: isTransitioning ? "transform 0.4s ease-out" : "none",
			} as React.CSSProperties;
		}

		const translate = -(curVirtualIndex * (itemHeightPx + gap) + topOffset);
		return {
			gap: `${gap}px`,
			transform: `translateY(${translate}px)`,
			transition: isTransitioning ? "transform 0.4s ease-out" : "none",
		} as React.CSSProperties;
	};

	const indicatorStyle = useMemo(() => {
		const offset = "35px";
		if (indicatorPosition === "left") {
			return { left: offset, top: "50%", transform: "translateY(-50%)" } as React.CSSProperties;
		}
		return { right: offset, top: "50%", transform: "translateY(-50%)" } as React.CSSProperties;
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

		const viewportHeight = viewportRef.current.clientHeight || 0;
		let itemHeightPx = 0;
		if (typeof itemHeight === "number") {
			itemHeightPx = (viewportHeight * itemHeight) / 100;
		}

		if (!itemHeightPx) {
			const firstChild = trackRef.current?.children[0] as HTMLElement | undefined;
			itemHeightPx = firstChild?.clientHeight || 0;
		}

		const topOffset = itemHeightPx / 2 - viewportHeight / 2;
		setLayoutCache({ viewportHeight, itemHeightPx, topOffset });
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

	const onResize = () => {
		measureLayoutCache();
		setIsTransitioning(false);
	};

	useEffect(() => {
		const items = React.Children.toArray(children || []) as React.ReactNode[];
		setOriginItems(items.map((c) => c));

		const raf = window.requestAnimationFrame(() => {
			initLayout();
			measureLayoutCache();
			setupAutoplay();
		});

		window.addEventListener("resize", onResize);

		viewportResizeObserver.current = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const height = entry.contentRect.height;
				if (height === layoutCache.viewportHeight) continue;
				measureLayoutCache();
				setIsTransitioning(false);
			}
		});
		if (viewportRef.current) {
			viewportResizeObserver.current.observe(viewportRef.current);
		}

		return () => {
			clearAutoplay();
			window.removeEventListener("resize", onResize);
			window.cancelAnimationFrame(raf);
			if (viewportResizeObserver.current) {
				viewportResizeObserver.current.disconnect();
				viewportResizeObserver.current = null;
			}
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
		<div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
			{showArrows && originItems.length > 0 && (
				<div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
					<button
						className="arrow prev"
						style={{
							...(arrowStyle() as React.CSSProperties),
							pointerEvents: "all",
							position: "absolute",
							left: "50%",
							transform: "translateX(-50%)",
							top: 12,
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
							style={{ width: "60%", height: "60%", transform: "rotate(90deg)" }}
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
							left: "50%",
							transform: "translateX(-50%)",
							bottom: 12,
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
							style={{ width: "60%", height: "60%", transform: "rotate(90deg)" }}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}>
							<polyline points="9 18 15 12 9 6" />
						</svg>
					</button>
				</div>
			)}

			<div
				ref={viewportRef}
				className="viewport"
				style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
				<div
					ref={trackRef}
					className="track"
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						...(trackStyle() as React.CSSProperties),
					}}
					onTransitionEnd={handleTransitionEnd}>
					{virtualItems.map((child, idx) => (
						<div
							key={idx}
							style={{
								...(itemStyle() as React.CSSProperties),
								flexShrink: 0,
								display: "grid",
								alignItems: "stretch",
								justifyItems: "stretch",
							}}>
							{child}
						</div>
					))}
				</div>
			</div>

			{showIndicator && originItems.length > 0 && (
				<div
					className="indicator-bar"
					style={{
						height: "100%",
						position: "absolute",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						gap: 8,
						zIndex: 2,
						...(indicatorStyle as React.CSSProperties),
					}}>
					{originItems.map((_, idx) => (
						<span
							key={idx}
							className={`indicator ${idx === curRealIndex ? "active" : ""}`}
							onClick={() => handleJumpTo(idx)}
							style={{
								width: 4,
								height: "5%",
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

export default VerticalTiledCarousel;
