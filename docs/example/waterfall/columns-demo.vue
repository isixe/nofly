<script setup lang="ts">
import { ref } from 'vue';
import Waterfall from "../../../packages/components/src/waterfall/index.vue";

interface DemoItem {
    id: number;
    label: string;
    color: string;
    height: number;
}

const columns = ref(2);

const items = ref<DemoItem[]>([
    { id: 1, label: 'A', color: '#f87171', height: 160 },
    { id: 2, label: 'B', color: '#fb923c', height: 100 },
    { id: 3, label: 'C', color: '#fbbf24', height: 140 },
    { id: 4, label: 'D', color: '#4ade80', height: 80 },
    { id: 5, label: 'E', color: '#2dd4bf', height: 180 },
    { id: 6, label: 'F', color: '#60a5fa', height: 120 },
    { id: 7, label: 'G', color: '#a78bfa', height: 90 },
    { id: 8, label: 'H', color: '#f472b6', height: 150 },
]);
</script>

<template>
    <div class="columns-demo">
        <div class="controls">
            <label for="columns-slider">列数：{{ columns }}</label>
            <input id="columns-slider" type="range" min="1" max="4" step="1" v-model.number="columns" />
        </div>
        <Waterfall :list="items" :columns="columns" :gap="10" height-key="height">
            <template #item="{ item }">
                <div class="card" :style="{ backgroundColor: item.color, height: `${item.height}px` }">
                    {{ item.label }} ({{ item.height }})
                </div>
            </template>
        </Waterfall>
    </div>
</template>

<style scoped>
.columns-demo {
    width: 100%;
}

.controls {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 14px;
    color: #666;
}

.controls input {
    flex: 1;
    max-width: 240px;
}

.card {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    border-radius: 8px;
}
</style>
