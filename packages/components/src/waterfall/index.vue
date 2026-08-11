<template>
    <div class="waterfall-container">
        <div v-for="(col, colIdx) in columnsData" :key="colIdx" class="waterfall-column"
            :style="{ marginRight: colIdx < columnsData.length - 1 ? `${gap}px` : '0' }">
            <div v-for="(item, idx) in col" :key="idx" class="waterfall-item"
                :style="{ marginBottom: `${gap}px` }">
                <slot name="item" :item="item" :index="idx" :column="colIdx + 1" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    list?: any[]
    /** Number of columns, default 2 */
    columns?: number
    /** Gap between columns and items (px), default 12 */
    gap?: number
    /** Height field name; when set, items go to the shortest column, otherwise round-robin */
    heightKey?: string
}

const props = withDefaults(defineProps<Props>(), {
    list: () => [],
    columns: 2,
    gap: 12,
})

// Shortest column first with heightKey, otherwise round-robin.
const columnsData = computed<any[][]>(() => {
    const colCount = Math.max(1, props.columns)
    const cols: any[][] = Array.from({ length: colCount }, () => [])
    const heightKey = props.heightKey
    const colHeights = Array.from({ length: colCount }, () => 0)

    props.list.forEach((item, idx) => {
        if (!heightKey) {
            cols[idx % colCount].push(item)
            return
        }
        const height = Number(item?.[heightKey]) || 0
        let target = 0
        for (let i = 1; i < colCount; i++) {
            if (colHeights[i] < colHeights[target]) {
                target = i
            }
        }
        cols[target].push(item)
        colHeights[target] += height + props.gap
    })
    return cols
})
</script>

<style scoped>
.waterfall-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
}

.waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.waterfall-item {
    width: 100%;
    box-sizing: border-box;
}
</style>
