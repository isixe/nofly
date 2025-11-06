import HorizontalShowcaseCarousel from "../../../components/showcase-carousel/horizontal";

const HorizontalSimpleDemo: React.FC = () => {
	const cardData = [
		{ title: "卡片 1", color: "#ff6b6b" },
		{ title: "卡片 2", color: "#4ecdc4" },
		{ title: "卡片 3", color: "#45b7d1" },
		{ title: "卡片 4", color: "#96ceb4" },
		{ title: "卡片 5", color: "#ffeaa7" },
	];

	const onChange = (index: number) => {
		console.log("当前卡片索引：", index);
	};

	return (
		<div style={{ backgroundColor: "#ededed" }}>
			<HorizontalShowcaseCarousel
				itemWidth={60}
				gap={15}
				autoplay={true}
				interval={2000}
				showIndicator={true}
				indicatorPosition="outside"
				change={onChange}>
				{cardData.map((item) => (
					<div
						style={{
							height: "200px",
							background: item.color,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							color: "#fff",
							cursor: "pointer",
							transition: "transform 0.3s",
						}}>
						<div>{item.title}</div>
					</div>
				))}
			</HorizontalShowcaseCarousel>
		</div>
	);
};

export default HorizontalSimpleDemo;
