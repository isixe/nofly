import React, { useRef, useState } from "react";
import NoticeCarousel, { NoticeCarouselRef } from "../../../packages/components/src/notice-carousel";

export default function NoticeControlDemo() {
	const [messages] = useState([
		"欢迎使用通知栏组件！",
		"新版本已发布，请及时更新",
		"限时优惠活动正在进行中",
		"重要通知：请查收最新邮件",
	]);

	const noticeCarouselRef = useRef<NoticeCarouselRef>(null);

	const playNotice = () => {
		noticeCarouselRef.current?.play();
	};

	const pauseNotice = () => {
		noticeCarouselRef.current?.pause();
	};

	return (
		<div>
			<NoticeCarousel
				ref={noticeCarouselRef}
				data={messages}
				interval={5000}
				direction="horizontal"
				prefix={<span style={{ fontSize: "18px" }}>🎮</span>}
			/>

			<div
				style={{
					marginTop: "10px",
					display: "flex",
					gap: "10px",
					flexWrap: "wrap",
				}}>
				<button
					onClick={playNotice}
					style={{
						padding: "2px 20px",
						backgroundColor: "#f3cc9f",
						color: "#000",
						border: "none",
						borderRadius: "50px",
						cursor: "pointer",
						transition: "background-color 0.2s",
					}}
					onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#d48806")}
					onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#f3cc9f")}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ffbb45")}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3cc9f")}>
					播放
				</button>

				<button
					onClick={pauseNotice}
					style={{
						padding: "2px 20px",
						backgroundColor: "#f3cc9f",
						color: "#000",
						border: "none",
						borderRadius: "50px",
						cursor: "pointer",
						transition: "background-color 0.2s",
					}}
					onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "#d48806")}
					onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#f3cc9f")}
					onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ffbb45")}
					onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f3cc9f")}>
					暂停
				</button>
			</div>
		</div>
	);
}
