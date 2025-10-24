import SeamlessScroll from "../../components/infinite-scroll-list";

const SeamlessScrollDemo: React.FC = () => {
	const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`);

	return (
		<SeamlessScroll list={items} visibleRows={5}>
			{items.map((item, index) => (
				<div key={index} className="box-row">
					<span>{item}</span>
				</div>
			))}
		</SeamlessScroll>
	);
};
export default SeamlessScrollDemo;
