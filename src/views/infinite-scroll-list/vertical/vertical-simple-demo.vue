<script setup lang="ts">
import InfiniteVerticalScroll from "../../../components/infinite-scroll-list/vertical.vue";

const items = Array.from({ length: 8 }).map((_, i) => `Item ${i + 1}`)
</script>

<template>
    <InfiniteVerticalScroll :height="100" :scroll="true">
        <div v-for="(item, idx) in items" :key="idx">
            {{ item }}
        </div>
    </InfiniteVerticalScroll>
</template>