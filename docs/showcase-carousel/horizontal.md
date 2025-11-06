<demo vue="components/showcase-carousel/horizontal.vue" react="components/showcase-carousel/horizontal.tsx" title="水平展柜式跑马灯" />



## 概要

水平展柜式跑马灯（Tiled Carousel）用于将一组等高或等宽的卡片按水平方向平铺展示，支持循环、自动播放、分页指示与左右箭头控制。该组件在内部使用克隆首尾元素实现无缝循环。

适合场景：推荐用于推荐列表、商品走马灯、图片或卡片的横向轮播展示。

## 基本使用
下面示例展示最简单的用法

<demo vue="views/showcase-carousel/horizontal/horizontal-simple-demo.vue" react="views/showcase-carousel/horizontal/horizontal-simple-demo.tsx" title="水平展柜式跑马灯 - 简单示例" />

1) 自定义容器高度和间距：

::: code-group

```vue
<div class="carousel-wrapper">
    <HorizontalShowcaseCarousel :itemWidth="60" :gap="15">
    <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
        :style="{ backgroundColor: card.color }">
        <div>{{ card.title }}</div>
    </div>
    </HorizontalShowcaseCarousel>
</div>
```

```react
<div class="carousel-wrapper">
	<HorizontalShowcaseCarousel itemWidth={60} gap={15}>
		{cardData.map((item) => (
			<div class="carousel-card">
				<div>{item.title}</div>
			</div>
		))}
	</HorizontalShowcaseCarousel>
</div>;

```

:::

2) 隐藏指示器和分页指示器：

::: code-group

```vue
<div class="carousel-wrapper">
    <HorizontalShowcaseCarousel :showArrows="false" :showIndicator="false">
    <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
        :style="{ backgroundColor: card.color }">
        <div>{{ card.title }}</div>
    </div>
    </HorizontalShowcaseCarousel>
</div>
```

```react
<div class="carousel-wrapper">
	<HorizontalShowcaseCarousel showArrows={false} showIndicator={false}>
		{cardData.map((item) => (
			<div class="carousel-card">
				<div>{item.title}</div>
			</div>
		))}
	</HorizontalShowcaseCarousel>
</div>;

```

:::

3) 取消自动滚动：

::: code-group

```vue
<div class="carousel-wrapper">
    <HorizontalShowcaseCarousel :autoplay="false">
    <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
        :style="{ backgroundColor: card.color }">
        <div>{{ card.title }}</div>
    </div>
    </HorizontalShowcaseCarousel>
</div>
```

```react
<div class="carousel-wrapper">
	<HorizontalShowcaseCarousel autoplay={false}>
		{cardData.map((item) => (
			<div class="carousel-card">
				<div>{item.title}</div>
			</div>
		))}
	</HorizontalShowcaseCarousel>
</div>;

```

:::

4) 设置指示器位置位于外部：

::: code-group

```vue
<div class="carousel-wrapper">
    <HorizontalShowcaseCarousel :indicatorPosition="outside">
    <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
        :style="{ backgroundColor: card.color }">
        <div>{{ card.title }}</div>
    </div>
    </HorizontalShowcaseCarousel>
</div>
```

```react
<div class="carousel-wrapper">
	<HorizontalShowcaseCarousel indicatorPosition="outside">
		{cardData.map((item) => (
			<div class="carousel-card">
				<div>{item.title}</div>
			</div>
		))}
	</HorizontalShowcaseCarousel>
</div>;

```

:::

## 完整示例
下面示例展示完整的用法

<demo vue="views/showcase-carousel/horizontal/horizontal-full-demo.vue" react="views/showcase-carousel/horizontal/horizontal-full-demo.tsx" title="水平展柜式跑马灯 - 完整示例" />

## API

### Attribute

| 参数                | 说明                                                                                                                    | 类型                          | 默认值     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ---------- |
| `itemWidth`         | 控制每个项目的宽度。若为 number 则表示百分比（例如 `60` 表示 60%），也可传入字符串。例如如 `'300px'` 指定固定像素宽度。 | number \\| string             | `60`       |
| `gap`               | 项目之间的间距，单位为 px。                                                                                             | number                        | `16`       |
| `autoplay`          | 是否启用自动播放                                                                                                        | boolean                       | `false`    |
| `interval`          | 自动播放间隔，单位为毫秒                                                                                                | number                        | `3000`     |
| `showArrows`        | 是否显示左右箭头控制按钮                                                                                                | boolean                       | `true`     |
| `showIndicator`     | 是否显示底部分页指示器                                                                                                  | boolean                       | `true`     |
| `indicatorPosition` | 指示器位置：`'inside'` 在组件内偏上显示，`'outside'` 更靠近组件外部底部                                                 | 'outside' \\| 'inside'        | `'inside'` |
| `arrowSize`         | 箭头按钮的大小。数字表示像素（如 `45`），也可传入字符串如 `'3rem'` 或 `'45px'`                                          | number \\| string             | `45`       |
| `initialIndex`      | 初始激活的项目索引                                                                                                      | number                        | `0`        |
| `change`            | 当当前激活项变化时触发，参数为真实的 item 索引（不包含克隆项）                                                          | (activeIndex: number) => void |            |

### Slot

::: code-group

```vue
default slot：用于渲染行内容。
```

```react
props.children：渲染行内容。
```



## 常见问题

1. 为什么卡片宽度看起来不正确？
   - 确认 `itemWidth` 的类型（number 表示百分比），并确保外部容器有明确宽度
2. 自动播放在切换后闪烁或跳跃？
   - 组件通过克隆首尾实现无缝循环，短时间内调整索引会触发无过渡的跳转，这是预期行为以维持循环一致性。