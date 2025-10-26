<script setup lang="ts">
import InfiniteHorizontalScroll from "../../../components/infinite-scroll-list/horizontal.vue";

const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`)
</script>

<template>
    <InfiniteHorizontalScroll>
        <div v-for="(item, idx) in items" :key="idx" class="item-row">
            {{ item }}
        </div>
    </InfiniteHorizontalScroll>
</template>

<style>
.item-row {
    margin: 0 5px;
}
</style>