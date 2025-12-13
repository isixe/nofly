import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";

type NoticeCarouselProps = {
	data: any[];
	initialIndex?: number;
	interval?: number;
	direction?: "horizontal" | "vertical";
	stopOnHover?: boolean;
	animation?: "slide" | "fade";
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	renderItem?: (item: any, index: number) => React.ReactNode;
	onChange?: (index: number) => void;
	onClick?: (item: any, index: number) => void;
};

export type NoticeCarouselRef = {
	play: () => void;
	pause: () => void;
	goTo: (index: number) => void;
	next: () => void;
};

const NoticeCarousel = forwardRef<NoticeCarouselRef, NoticeCarouselProps>(
	(
		{
			data = [],
			initialIndex = 0,
			interval = 3000,
			direction = "horizontal",
			stopOnHover = true,
			animation = "slide",
			prefix,
			suffix,
			renderItem,
			onChange,
			onClick,
		},
		ref
	) => {
		const [currentIndex, setCurrentIndex] = useState(0);
		const timerRef = useRef<number | null>(null);

		const handleClick = (item: any, index: number) => onClick?.(item, index);

		function initNotice() {
			initializeIndex();
			if (data.length <= 1) return;

			play();

			return () => {
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}
			};
		}

		function initializeIndex() {
			const index = Math.max(0, Math.min(initialIndex, data.length - 1));
			setCurrentIndex(data.length > 0 ? index : 0);
		}

		function next() {
			if (data.length === 0) return;

			setCurrentIndex((prevIndex) => {
				const nextIndex = (prevIndex + 1) % data.length;
				onChange?.(nextIndex);
				return nextIndex;
			});
		}

		function play() {
			if (timerRef.current || data.length <= 1) return;
			timerRef.current = window.setInterval(next, interval);
		}

		function pause() {
			if (timerRef.current && stopOnHover) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}

		function goTo(index: number) {
			if (index >= 0 && index < data.length) {
				setCurrentIndex(index);
				onChange?.(index);
			}
		}

		useImperativeHandle(ref, () => ({
			play,
			pause,
			goTo,
			next,
		}));

		useEffect(() => {
			initNotice();
		}, []);

		useEffect(() => {
			initNotice();
		}, [data, interval, initialIndex, direction, animation]);

		if (!data.length) return null;

		const carouselStyle: React.CSSProperties = {
			display: "flex",
			alignItems: "center",
			gap: "5px",
			width: "100%",
			height: "40px",
			overflow: "hidden",
			position: "relative",
			boxSizing: "border-box",
		};

		const viewportStyle: React.CSSProperties = {
			flex: 1,
			height: "100%",
			overflow: "hidden",
			position: "relative",
		};

		const trackStyle: React.CSSProperties = {
			position: "relative",
			height: "100%",
			width: "100%",
		};

		const getItemStyle = (index: number): React.CSSProperties => {
			const isActive = currentIndex === index;

			const baseStyle: React.CSSProperties = {
				position: "absolute",
				top: 0,
				left: 0,
				display: "flex",
				alignItems: "center",
				height: "100%",
				width: "100%",
				cursor: "pointer",
				opacity: isActive ? 1 : 0,
				pointerEvents: isActive ? "auto" : "none",
				willChange: "transform, opacity",
			};

			if (animation === "fade") {
				return {
					...baseStyle,
					transition: isActive ? "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
				};
			}

			if (direction === "horizontal") {
				return {
					...baseStyle,
					transform: isActive ? "translateX(0)" : "translateX(100%)",
					transition: isActive ? "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
				};
			}

			return {
				...baseStyle,
				transform: isActive ? "translateY(0)" : "translateY(100%)",
				transition: isActive ? "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
			};
		};

		return (
			<div style={carouselStyle} onMouseEnter={pause} onMouseLeave={play}>
				{prefix && <div>{prefix}</div>}

				<div style={viewportStyle}>
					<div style={trackStyle}>
						{data.map((item, index) => (
							<div key={index} style={getItemStyle(index)} onClick={() => handleClick(item, index)}>
								{renderItem ? renderItem(item, index) : item}
							</div>
						))}
					</div>
				</div>

				{suffix && <div>{suffix}</div>}
			</div>
		);
	}
);

export default NoticeCarousel;
