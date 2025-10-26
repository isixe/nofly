import InfiniteVerticalScroll from "../../../components/infinite-scroll-list/vertical.tsx";

const InfiniteVerticalScrollDemo: React.FC = () => {
	const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`);

	return (
		<InfiniteVerticalScroll height={100}>
			{items.map((item, index) => (
				<div key={index}>
					<span>{item}</span>
				</div>
			))}
		</InfiniteVerticalScroll>
	);
};
export default InfiniteVerticalScrollDemo;
