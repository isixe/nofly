<demo vue="components/infinite-scroll-list/horizontal.vue" react="components/infinite-scroll-list/vertical.tsx" title="水平无缝循环滚动的列表"/>

## 概要

`InfiniteHorizontalScroll` 是一个用于实现“垂直无缝循环垂直滚动”效果的轻量组件。组件通过克隆子行使内容循环滚动，并在到达末尾时回到顶部，从而实现无缝效果。

核心要点：
- 组件会以遍历所有子项目来计算容器的总高度，并通过容器的高度计算复制次数。
- 组件将包裹的 slot 内容放入内部可滚动容器中进行自动滚动，。

何时使用
- 需要展示固定高度、循环滚动的条目（例如公告、跑马灯列表）。
- 列表项高度相对稳定，或能通过 CSS 保持统一高度时最佳。


## 基本使用

下面示例展示最简单的用法

<demo vue="views/infinite-scroll-list/horizontal/horizontal-simple-demo.vue" react="views/infinite-scroll-list/horizontal/horizontal-simple-demo.tsx" title="水平无缝循环滚动的列表-简单示例"/>

1) 自定义容器宽度：

::: code-group

```vue
<InfiniteHorizontalScroll :width="400">
  <div v-for="(item, idx) in items" :key="idx">
    {{ item }}
  </div>
</InfiniteHorizontalScroll>
```

```react
<InfiniteHorizontalScroll width={400}>
	{items.map((item, index) => (
		<div key={index}>
			<span>{item}</span>
		</div>
	))}
</Infinite
```

:::

2) 自定义速度与间隔：

::: code-group

```vue
<InfiniteHorizontalScroll :step="2" :interval="30">
  <div v-for="(item, idx) in items" :key="idx">
    {{ item }}
  </div>
</InfiniteHorizontalScroll>
```

```react
<InfiniteHorizontalScroll step={2} interval={30}>
	{items.map((item, index) => (
		<div key={index}>
			<span>{item}</span>
		</div>
	))}
</InfiniteHorizontalScroll>
```

:::

3) 鼠标悬停停止：

::: code-group

```vue
<InfiniteHorizontalScroll :stopOnHover="false">
  <div v-for="(item, idx) in items" :key="idx">
    {{ item }}
  </div>
</InfiniteHorizontalScroll>
```

```react
<InfiniteHorizontalScroll stopOnHover={false}>
	{items.map((item, index) => (
		<div key={index}>
			<span>{item}</span>
		</div>
	))}
</InfiniteHorizontalScroll>
```

:::

4) 禁止容器填充：

您可能需要在容器子项目没有到达容器高度时，使其保持静止，而不是使用重复数据一直滚动

::: code-group

```vue
<InfiniteHorizontalScroll :height="800" :fill="false">
  <div v-for="(item, idx) in items" :key="idx">
    {{ item }}
  </div>
</InfiniteHorizontalScroll>
```

```react
<InfiniteHorizontalScroll height={800} fill={false}>
	{items.map((item, index) => (
		<div key={index}>
			<span>{item}</span>
		</div>
	))}
</InfiniteHorizontalScroll>
```

:::

5) 允许条目列表滚动：

::: code-group

```vue
<InfiniteHorizontalScroll :scroll="true">
  <div v-for="(item, idx) in items" :key="idx">
    {{ item }}
  </div>
</InfiniteHorizontalScroll>
```

```react
<InfiniteHorizontalScroll scroll={true}>
	{items.map((item, index) => (
		<div key={index}>
			<span>{item}</span>
		</div>
	))}
</InfiniteHorizontalScroll>
```

:::

## 不规则条目

有时候，您可能需要让单个的条目高度不一致，这在容器中是允许的，您可以单独设置条目的样式或者让条目的高度保持适应。

<demo vue="views/infinite-scroll-list/horizontal/horizontal-flex-demo.vue" react="views/infinite-scroll-list/horizontal/horizontal-flex-demo.tsx" title="水平无缝循环滚动的列表-不规则条目示例"/>

## API

| parameter   | description                                    | type    | default  |
| ----------- | ---------------------------------------------- | ------- | -------- |
| width       | 容器宽度                                       | Number  | undefine |
| step        | 每个 interval 增量移动的像素（越大越快）       | Number  | 1        |
| interval    | 滚动间隔（毫秒），值越小滚动越平滑             | Number  | 40       |
| stopOnHover | 鼠标悬停时是否停止滚动                         | Boolean | true     |
| fill        | 当数据长度小于可见行数时是否复制填充以启用滚动 | Boolean | true     |


## Slot

- 默认 slot：用于渲染行内容。默认获取的行内容会填充到容器高度使其能够保持滚动。

## 常见问题

1.条目如何影响滚动和容器
- 组件通过所有条目的高度计算容器宽度与复制次数。为了防止项目的 margin 重叠导致高度塌陷，容器内部默认了使用 flex 布局。

2.如何保证组件性能？  
- 组件通过 `setInterval` 控制滚动，较小的 `interval` 和较大的 `step` 会增加重绘频率，请根据需求调整以平衡流畅度和 CPU 使用率。

如何更新数据动态数据？  
- 如果 slot 内容在运行时动态改变（高度变化或数量显著变化），建议在数据变更后手动触发一次重新渲染（例如通过改变 key 或在父组件 nextTick 后强制刷新组件），以确保复制逻辑基于最新的行高度与数量。
