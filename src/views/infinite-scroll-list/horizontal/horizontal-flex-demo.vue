<script setup lang="ts">
import InfiniteHorizontalScroll from "../../../components/infinite-scroll-list/horizontal.vue";

type Item = {
    title: string;
    content: string;
}

const items: Item[] = [
    { title: 'Item 1', content: 'Short content.' },
    { title: 'Item 2', content: 'This is a large content block.' },
    { title: 'Item 3', content: 'Another short one.' },
    { title: 'Item 4', content: 'This a extra large content block that spans many lines.' },
]
</script>

<template>
    <InfiniteHorizontalScroll :height="400">
        <div v-for="(item, idx) in items" :key="idx" class="item-row">
            <div>{{ item.title }}</div>
            <div>{{ item.content }}</div>
        </div>
    </InfiniteHorizontalScroll>
</template>

<style scoped>
.item-row {
    display: flex;
    flex-direction: column;
    margin: 0 8px;
    padding: 12px 16px;
    border-radius: 8px;
}

.item-row:nth-child(odd) {
    background: #cdecde;
}

.item-row:nth-child(even) {
    background: #e3f2fd;
}
</style>