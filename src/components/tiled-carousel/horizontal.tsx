import React, { useState, useRef, useEffect } from "react";

type HorizontalTiledCarouselProps = {
	itemWidth?: number;
	gap?: number;
	autoplay?: boolean;
	interval?: number;
	showArrows?: boolean;
	showIndicator?: boolean;
	arrowSize?: number;
	initialIndex?: number;
	children: React.ReactNode;
};

const HorizontalTiledCarousel: React.FC<HorizontalTiledCarouselProps> = ({
	itemWidth = 60,
	gap = 16,
	autoplay = false,
	interval = 3000,
	showArrows = true,
	showIndicator = true,
	arrowSize = 45,
	initialIndex = 0,
	children,
}) => {
	const viewportRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [currentRealIndex, setCurrentRealIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const autoplayTimerId = useRef<number | null>(null);

	const itemList = React.Children.toArray(children);
	const cloneOffset = 2;

	const displayList = itemList.length <= 1 ? itemList : [...itemList.slice(-2), ...itemList, ...itemList.slice(0, 2)];

	const computedItemWidth = typeof itemWidth === "number" ? `${itemWidth}%` : itemWidth;

	const getTrackStyle = () => {
		if (!viewportRef.current) return {};

		const viewportWidth = viewportRef.current.clientWidth;
		let itemWidthPx = typeof itemWidth === "number" ? (viewportWidth * itemWidth) / 100 : parseFloat(itemWidth);

		const centerPosition = activeIndex * (itemWidthPx + gap);
		const translateOffset = viewportWidth / 2 - centerPosition - itemWidthPx / 2;

		return {
			transform: `translateX(${translateOffset}px)`,
			transition: isTransitioning ? "transform 0.4s ease-out" : "none",
		};
	};

	const moveToIndex = (targetIndex: number, skipTransition = false) => {
		const length = itemList.length;
		if (length === 0) return;

		const normalizedIndex = ((targetIndex % length) + length) % length;
		const virtualIndex = normalizedIndex + cloneOffset;

		if (skipTransition) {
			setIsTransitioning(false);
			setCurrentRealIndex(normalizedIndex);
			setActiveIndex(virtualIndex);
		} else {
			setIsTransitioning(true);
			setActiveIndex(virtualIndex);
		}
	};

	const handlePrev = () => {
		clearAutoplay();
		moveToIndex(currentRealIndex - 1);
		setupAutoplay();
	};

	const handleNext = () => {
		clearAutoplay();
		moveToIndex(currentRealIndex + 1);
		setupAutoplay();
	};

	const handleJumpTo = (targetIndex: number) => {
		clearAutoplay();
		moveToIndex(targetIndex);
		setupAutoplay();
	};

	const handleTransitionEnd = () => {
		const length = itemList.length;
		const virtualIndex = activeIndex;

		if (virtualIndex < cloneOffset) {
			moveToIndex(virtualIndex + length, true);
		} else if (virtualIndex >= cloneOffset + length) {
			moveToIndex(virtualIndex - length, true);
		} else {
			setCurrentRealIndex(virtualIndex - cloneOffset);
		}
	};

	const setupAutoplay = () => {
		if (!autoplay || itemList.length <= 1) return;
		clearAutoplay();
		autoplayTimerId.current = setInterval(() => {
			moveToIndex(currentRealIndex + 1);
		}, interval);
	};

	const clearAutoplay = () => {
		if (autoplayTimerId.current) {
			clearInterval(autoplayTimerId.current);
			autoplayTimerId.current = null;
		}
	};

	useEffect(() => {
		setTimeout(() => {
			moveToIndex(initialIndex, true);
			setupAutoplay();
		}, 100);

		return () => clearAutoplay();
	}, []);

	return (
		<div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
			{children && showArrows && (
				<div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, pointerEvents: "none" }}>
					<button
						style={{
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)",
							color: "#fff",
							border: "none",
							borderRadius: "50%",
							cursor: "pointer",
							pointerEvents: "all",
							transition: "background 0.3s",
							background: "rgba(0, 0, 0, 0.3)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							width: arrowSize,
							height: arrowSize,
							left: "20px",
						}}
						onClick={handlePrev}>
						<svg
							style={{
								width: "60%",
								height: "60%",
							}}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
					</button>
					<button
						style={{
							position: "absolute",
							top: "50%",
							transform: "translateY(-50%)",
							color: "#fff",
							border: "none",
							borderRadius: "50%",
							cursor: "pointer",
							pointerEvents: "all",
							transition: "background 0.3s",
							background: "rgba(0, 0, 0, 0.3)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							padding: 0,
							width: arrowSize,
							height: arrowSize,
							right: "20px",
						}}
						onClick={handleNext}>
						<svg
							style={{
								width: "60%",
								height: "60%",
							}}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</button>
				</div>
			)}

			<div ref={viewportRef} style={{ width: "100%", overflow: "hidden", position: "relative" }}>
				<div
					ref={trackRef}
					style={{
						display: "flex",
						alignItems: "center",
						padding: "20px 0",
						...getTrackStyle(),
					}}
					onTransitionEnd={handleTransitionEnd}>
					{displayList.map((item, index) => (
						<div
							key={index}
							style={{
								width: computedItemWidth,
								marginRight: gap,
								flexShrink: 0,
								transition: "all 0.4s ease-out",
								opacity: index === activeIndex ? 1 : 0.6,
								zIndex: index === activeIndex ? 1 : "auto",
							}}>
							{item}
						</div>
					))}
				</div>
			</div>

			{showIndicator && (
				<div
					style={{
						position: "absolute",
						bottom: "5px",
						left: "50%",
						transform: "translateX(-50%)",
						display: "flex",
						gap: "8px",
						zIndex: 2,
					}}>
					{itemList.map((_, idx) => (
						<span
							key={idx}
							style={{
								width: idx === currentRealIndex ? "24px" : "8px",
								height: "8px",
								borderRadius: idx === currentRealIndex ? "4px" : "50%",
								background: idx === currentRealIndex ? "#fff" : "rgba(255, 255, 255, 0.4)",
								transition: "all 0.3s",
								cursor: "pointer",
							}}
							onClick={() => handleJumpTo(idx)}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default HorizontalTiledCarousel;
