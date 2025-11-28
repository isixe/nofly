<demo vue="components/showcase-carousel/vertical.vue" react="components/showcase-carousel/vertical.tsx" title="垂直展柜式跑马灯" />

## 概要

垂直展柜式跑马灯（Tiled Carousel）用于将一组等高或等宽的卡片按垂直方向平铺展示，支持循环、自动播放、分页指示与上下箭头控制。该组件在内部使用克隆首尾元素实现无缝循环。

适合场景：推荐用于推荐列表、商品走马灯、图片或卡片的垂直轮播展示。

## 基本使用
下面示例展示最简单的用法

<demo vue="views/showcase-carousel/vertical/vertical-simple-demo.vue" react="views/showcase-carousel/vertical/vertical-simple-demo.tsx" title="垂直展柜式跑马灯 - 简单示例" />

## 完整示例
下面示例展示完整的用法

<demo vue="views/showcase-carousel/vertical/vertical-full-demo.vue" react="views/showcase-carousel/vertical/vertical-full-demo.tsx" title="垂直展柜式跑马灯 - 完整示例" />

## API

### Attribute

| 参数                | 说明                                                                                                                               | 类型                          | 默认值    |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | --------- |
| `itemHeight`        | 控制每个项目的高度。若为 number 则表示百分比（例如 `60` 表示 60% 的父容器高度），也可传入字符串。例如 `'300px'` 指定固定像素高度。 | number \\| string             | `60`      |
| `gap`               | 项目之间的间距，单位为 px。                                                                                                        | number                        | `0`       |
| `autoplay`          | 是否启用自动播放                                                                                                                   | boolean                       | `false`   |
| `interval`          | 自动播放间隔，单位为毫秒                                                                                                           | number                        | `3000`    |
| `showArrows`        | 是否显示上下箭头控制按钮                                                                                                           | boolean                       | `true`    |
| `showIndicator`     | 是否显示侧边分页指示器                                                                                                             | boolean                       | `true`    |
| `indicatorPosition` | 指示器位置：`'left'` 或 `'right'`，在组件两侧垂直居中显示                                                                          | 'left' \\| 'right'            | `'right'` |
| `arrowSize`         | 箭头按钮的大小。数字表示像素（如 `45`），也可传入字符串如 `'3rem'` 或 `'45px'`                                                     | number \\| string             | `45`      |
| `initialIndex`      | 初始激活的项目索引                                                                                                                 | number                        | `0`       |
| `change`            | 当前激活项变化时触发，参数为真实的 item 索引（不包含克隆项）                                                                       | (activeIndex: number) => void |           |
| `click`             | 当前项目被点击时触发，参数为真实的 item 索引（不包含克隆项）                                                                       | (activeIndex: number) => void |           |


### Slot

::: code-group

```vue
default slot：用于渲染列内容。
```

```react
props.children：渲染列内容。
```

:::


## 常见问题

1. 为什么卡片高度看起来不正确？
	- 确认 `itemHeight` 的类型（number 表示百分比），并确保外部容器有明确高度或可以被布局撑开（例如父容器有固定高度、使用 flex 并伸展，或使用 viewport 单位）。
2. 自动播放在切换后闪烁或跳跃？
	- 组件通过克隆首尾实现无缝循环，短时间内调整索引会触发无过渡的跳转，这是预期行为以维持循环一致性。