<script setup lang="ts">
import InfiniteScrollList from "./../../components/infinite-scroll-list/index.vue"
const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`)
</script>

<template>
    <InfiniteScrollList :visibleRows="3">
        <div v-for="(item, idx) in items" :key="idx" class="box-row">
            {{ item }}
        </div>
    </InfiniteScrollList>
</template>