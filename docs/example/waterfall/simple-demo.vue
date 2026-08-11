<script setup lang="ts">
import { ref } from 'vue';
import Waterfall from "../../../packages/components/src/waterfall/index.vue";

interface DemoItem {
    id: number;
    color: string;
    label: string;
    height: number;
}

const items = ref<DemoItem[]>([
    { id: 1, color: '#f87171', label: '1', height: 120 },
    { id: 2, color: '#fb923c', label: '2', height: 180 },
    { id: 3, color: '#fbbf24', label: '3', height: 100 },
    { id: 4, color: '#4ade80', label: '4', height: 200 },
    { id: 5, color: '#2dd4bf', label: '5', height: 140 },
    { id: 6, color: '#60a5fa', label: '6', height: 90 },
    { id: 7, color: '#a78bfa', label: '7', height: 160 },
    { id: 8, color: '#f472b6', label: '8', height: 130 },
]);
</script>

<template>
    <div class="waterfall-demo">
        <Waterfall :list="items" :columns="3" :gap="12">
            <template #item="{ item }">
                <div class="card" :style="{ backgroundColor: item.color, height: `${item.height}px` }">
                    {{ item.label }}
                </div>
            </template>
        </Waterfall>
    </div>
</template>

<style scoped>
.waterfall-demo {
    width: 100%;
}

.card {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
}
</style>
