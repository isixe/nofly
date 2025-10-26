import InfiniteHorizontalScroll from "../../../components/infinite-scroll-list/horizontal.tsx";

const InfiniteHorizontalScrollDemo: React.FC = () => {
	const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`);

	return (
		<InfiniteHorizontalScroll>
			{items.map((item, index) => (
				<div key={index} style={{ margin: "0 5px" }}>
					<span>{item}</span>
				</div>
			))}
		</InfiniteHorizontalScroll>
	);
};
export default InfiniteHorizontalScrollDemo;
