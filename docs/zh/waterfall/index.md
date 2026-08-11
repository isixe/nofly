<demo vue="../packages/components/src/waterfall/index.vue" react="../packages/components/src/waterfall/index.tsx" title="瀑布流" />

## 概要

`Waterfall` 是一个瀑布流布局组件，支持 多列布局、自定义列数与间距、按高度字段最短列优先分配 等特性。

适合场景：图片流、商品列表、卡片墙、笔记流等。

## 基本使用

下面示例展示最简单的用法：3 列瀑布流，未提供高度字段时按顺序轮询分配。

<demo vue="example/waterfall/simple-demo.vue" react="example/waterfall/simple-demo.tsx" title="瀑布流 - 简单示例" />

## 高度字段分配

提供 `heightKey` 后，组件会把每个数据项放入当前累计高度最短的列，保证各列底部大致齐平。

<demo vue="example/waterfall/height-demo.vue" react="example/waterfall/height-demo.tsx" title="瀑布流 - 最短列分配" />

## 动态列数

拖动滑块实时调整列数，观察分配策略随列数变化的效果。

<demo vue="example/waterfall/columns-demo.vue" react="example/waterfall/columns-demo.tsx" title="瀑布流 - 动态列数" />

## API

### Attribute

| 属性名     | 类型       | 默认值 | 说明                                                                   |
| ---------- | ---------- | ------ | ---------------------------------------------------------------------- |
| `list`     | `any[]`    | `[]`   | 数据列表                                                               |
| `columns`  | `number`   | `2`    | 列数                                                                   |
| `gap`      | `number`   | `12`   | 列间距与项间距（px）                                                   |
| `heightKey`| `string`   | —      | 数据项中的高度字段名；提供后按最短列优先分配，缺省则按顺序轮询         |

## Slot

::: code-group

```vue
item：数据项插槽，作用域参数：
- item：当前数据项
- index：当前项在所在列中的索引
- column：所在列号（从 1 开始）
```

```react
renderItem(item, index, column)：渲染函数，参数与 Vue 插槽一致。
```

:::

## 常见问题

1. 为什么不提供 `heightKey` 时是轮询而不是最短列？

    瀑布流的核心价值在于「按内容实际高度对齐底部」，这依赖内容高度信息。没有高度信息时组件无法预知每列高度，因此退化为按顺序轮询，保证分配稳定可预期。

2. 高度数据不准确怎么办？

    `heightKey` 对应的高度会被转换为数值（`Number()`），转换失败或为 0 时按 0 处理。建议传入与渲染内容实际高度一致的数值。
