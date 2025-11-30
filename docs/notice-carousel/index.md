<demo vue="components/notice-carousel/index.vue" react="components/notice-carousel/index.tsx" title="通知轮播" />

## 概要

`NoticeCarousel` 是一个通知轮播组件，支持 水平/垂直 轮播、淡入淡出动画、自动轮播、鼠标悬停暂停、自定义内容插槽等特性。

适合场景：公告、消息提示、活动通知等场景。

## 基本使用
下面示例展示最简单的用法

<demo vue="views/notice-carousel/simple-demo.vue" react="views/notice-carousel/simple-demo.tsx"  title="通知轮播 - 简单示例" />

## 垂直轮播

默认情况下，通知轮播组件水平滚动，如果需要

<demo vue="views/notice-carousel/vertical-demo.vue" react="views/notice-carousel/vertical-demo.tsx" title="通知轮播 - 垂直轮播" />

## 淡入淡出

<demo vue="views/notice-carousel/fade-demo.vue" react="views/notice-carousel/fade-demo.tsx" title="通知轮播 - 淡入淡出" />

## 鼠标悬停

<demo vue="views/notice-carousel/hover-demo.vue" react="views/notice-carousel/hover-demo.tsx" title="通知轮播 - 鼠标悬停" />

## 自定义内容

<demo vue="views/notice-carousel/template-demo.vue" react="views/notice-carousel/template-demo.tsx" title="通知轮播 - 自定义内容" />

## 手动控制

<demo vue="views/notice-carousel/control-demo.vue" react="views/notice-carousel/control-demo.tsx"  title="通知轮播 - 手动控制" />

## API

### Attribute
| 属性名         | 类型                         | 默认值         | 说明                 |
| -------------- | ---------------------------- | -------------- | -------------------- |
| `data`         | `any[]`                      | `[]`           | 通知数据列表         |
| `initialIndex` | `number`                     | `0`            | 初始显示的索引       |
| `interval`     | `number`                     | `3000`         | 自动轮播时间（毫秒） |
| `direction`    | `'horizontal' \| 'vertical'` | `'horizontal'` | 滚动方向             |
| `stopOnHover`  | `boolean`                    | `true`         | 鼠标悬停时是否暂停   |
| `animation`    | `'slide' \| 'fade'`          | `'slide'`      | 过渡动画类型         |

### Events
| 事件名   | 回调参数                     | 说明             |
| -------- | ---------------------------- | ---------------- |
| `change` | `(index: number)`            | 当轮播项发生改变 |
| `click`  | `(item: any, index: number)` | 用户点击某条通知 |

### Expose Events
通过 ref 获取组件实例后可调用以下方法：

| 方法名        | 参数            | 说明           |
| ------------- | --------------- | -------------- |
| `play()`      | —               | 开始自动轮播   |
| `pause()`     | —               | 暂停自动轮播   |
| `next()`      | —               | 播放下一条     |
| `goTo(index)` | `index: number` | 跳转到指定条目 |

# Slot

::: code-group

```vue
prefix：公告项前置的固定内容，例如通知图标。
default：公告项内容。
suffix: 公告项后置的固定内容，例如关闭按钮。
```

```react
props.children：用于渲染公告项内容。
```

## 常见问题
1. 为什么只有一条数据时不播放？

    组件内部会判断 data.length <= 1 时不启用自动轮播，这是为了避免无意义的动画。

2. 为什么淡入淡出模式下无法滑动？

    animation="fade" 时会禁用滑动过渡，只保留透明度变化，这是设计行为。

3. 组件是否支持响应式大小？

    支持，容器宽高完全由外部样式决定，组件内部仅设定 height: 40px 的默认高度，可自行覆盖。