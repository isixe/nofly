import React, { useState } from "react";
import NoticeCarousel from "../../../packages/components/src/notice-carousel/index.tsx";

export default function NoticeTemplateDemo() {
	const [messages] = useState([
		"欢迎使用通知栏组件！",
		"新版本已发布，请及时更新",
		"限时优惠活动正在进行中",
		"重要通知：请查收最新邮件",
	]);

	return (
		<div
			style={{
				background: "#fef5da",
				padding: "0 5px",
				borderRadius: "4px",
			}}>
			<NoticeCarousel
				data={messages}
				interval={4000}
				direction="horizontal"
				prefix={
					<span
						style={{
							fontSize: "16px",
							display: "flex",
							alignItems: "center",
						}}>
						🔔
					</span>
				}
				renderItem={(item) => (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							height: "40px",
						}}>
						<span
							style={{
								fontSize: "14px",
								whiteSpace: "nowrap",
							}}>
							{item}
						</span>
					</div>
				)}
				suffix={
					<span
						style={{
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
						}}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</span>
				}
			/>
		</div>
	);
}
