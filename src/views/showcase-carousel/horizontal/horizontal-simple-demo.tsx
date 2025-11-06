import HorizontalTiledCarousel from "../../../components/showcase-carousel/horizontal";

const HorizontalSimpleDemo: React.FC = () => {
	const cardData = [
		{ title: "卡片 1", color: "#ff6b6b" },
		{ title: "卡片 2", color: "#4ecdc4" },
		{ title: "卡片 3", color: "#45b7d1" },
		{ title: "卡片 4", color: "#96ceb4" },
		{ title: "卡片 5", color: "#ffeaa7" },
	];

	return (
		<div style={{ backgroundColor: "#ededed" }}>
			<HorizontalTiledCarousel>
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
			</HorizontalTiledCarousel>
		</div>
	);
};

export default HorizontalSimpleDemo;
