<demo vue="components/infinite-scroll-list/index.vue" title="无缝循环滚动的列表"/>


## 快速示例

下面示例展示最简单的用法

<demo vue="views/infinite-scroll-list/index.vue" title="无缝循环滚动的列表"/>


## 概要

`InfiniteScrollList` 是一个用于实现“无缝循环垂直滚动”效果的轻量组件。组件通过克隆子行使内容循环滚动，并在到达末尾时回到顶部，从而实现无缝效果。

核心要点：
- 组件会以第一个条目的高度作为单行高度来计算容器高度与复制次数，容器的高度取决于设置的可见行数。
- 组件将包裹的 slot 内容放入内部可滚动容器 `.box-wrap` 中进行自动滚动，。

## 何时使用

- 需要展示固定高度、循环滚动的条目（例如公告、跑马灯列表）。
- 列表项高度相对稳定，或能通过 CSS 保持统一高度时最佳。

## 常见示例

1) 自定义速度与间隔：

```vue
<template>
  <InfiniteScrollList :visibleRows="4" :speed="2" :interval="30">
    <div v-for="n in 10" :key="n" class="box-row">条目 {{ n }}</div>
  </InfiniteScrollList>
</template>
```

2) 鼠标悬停停止：

```vue
<template>
  <InfiniteScrollList :visibleRows="3" :stopOnHover="true">
    <div v-for="n in 6" :key="n" class="box-row">条目 {{ n }}</div>
  </InfiniteScrollList>
</template>
```

3) 自定义行内样式（固定高度）示例：如果行高度不一致，建议显式设置高度保证效果稳定。

```vue
<style scoped>
  .custom-row {
    height: 48px;
    display:flex;
    align-items:center;
    padding:0 12px
  }
</style>

<template>
  <InfiniteScrollList :visibleRows="4">
    <div v-for="n in 12" :key="n" class="box-row custom-row">消息 {{ n }}</div>
  </InfiniteScrollList>
</template>
```

## API

| parameter   | description                                                | type    | default |
| ----------- | ---------------------------------------------------------- | ------- | ------- |
| list        | 用于渲染的原始数据（仅作类型占位，不直接用于组件内部渲染） | Array   | []      |
| visibleRows | 可见行数，用于计算容器高度                                 | Number  | 3       |
| speed       | 每个 interval 增量移动的像素（越大越快）                   | Number  | 1       |
| interval    | 滚动间隔（毫秒），值越小滚动越平滑                         | Number  | 40      |
| stopOnHover | 鼠标悬停时是否停止滚动                                     | Boolean | true    |


## Slot

- 默认 slot：用于渲染行内容。必须为，组件依赖第一个条目的高度来计算复制次数和容器高度。

## 注意事项

- 行高需稳定：组件通过第一个条目的高度计算容器高度与复制倍数。如果首行高度不正确会导致布局异常。
- 性能：组件通过 `setInterval` 控制滚动，较小的 `interval` 和较大的 `speed` 会增加重绘频率，请根据需求调整以平衡流畅度和 CPU 使用率。
- 动态数据：如果 slot 内容在运行时动态改变（高度变化或数量显著变化），建议在数据变更后手动触发一次重新渲染（例如通过改变 key 或在父组件 nextTick 后强制刷新组件），以确保复制逻辑基于最新的行高度与数量。
