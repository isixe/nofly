import { useState } from "react";
import NoticeCarousel from "../../components/notice-carousel/index.tsx";

export default function NoticeSimpleDemo() {
	const [messages] = useState([
		"欢迎使用通知栏组件！",
		"新版本已发布，请及时更新",
		"限时优惠活动正在进行中",
		"重要通知：请查收最新邮件",
	]);

	return (
		<div className="notice-demo">
			<NoticeCarousel data={messages} />
		</div>
	);
}
