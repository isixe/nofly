import InfiniteVerticalScroll from "../../../components/infinite-scroll-list/vertical.tsx";

type Item = {
	title: string;
	content: string;
};

const InfiniteVerticalScrollDemo: React.FC = () => {
	const items: Item[] = [
		{ title: "Item 1", content: "Short content" },
		{
			title: "Item 2",
			content:
				"This is a large content block with multiple lines of text. It contains much more information than the other items and will take up more vertical space in the scrolling list.",
		},
		{
			title: "Item 3",
			content:
				"Another short one. You can add as much content as you want here and the component will calculate the correct height automatically.",
		},
		{
			title: "Item 4",
			content:
				"Extra large content block that spans many lines. This item demonstrates how the infinite scroll component handles varying heights. You can add as much content as you want here and the component will calculate the correct height automatically. It works seamlessly with items of different sizes.",
		},
	];

	return (
		<InfiniteVerticalScroll height={400}>
			{items.map((item, index) => (
				<div
					key={index}
					style={{
						margin: "8px 0",
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
