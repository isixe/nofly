import InfiniteVerticalScroll from "../../../components/infinite-scroll-list/horizontal.tsx";

type Item = {
	title: string;
	content: string;
};

const InfiniteVerticalScrollDemo: React.FC = () => {
	const items: Item[] = [
		{ title: "Item 1", content: "Short content." },
		{ title: "Item 2", content: "This is a large content block." },
		{ title: "Item 3", content: "Another short one." },
		{ title: "Item 4", content: "This a extra large content block that spans many lines." },
	];
	return (
		<InfiniteVerticalScroll>
			{items.map((item, index) => (
				<div
					key={index}
					style={{
						margin: "0 8px",
						padding: "12px 16px",
						borderRadius: "8px",
						background: index % 2 === 0 ? "#e3f2fd" : "#cdecde",
					}}>
					<div>{item.title}</div>
					<div>{item.content}</div>
				</div>
			))}
		</InfiniteVerticalScroll>
	);
};

export default InfiniteVerticalScrollDemo;
