<template>
    <div ref="wrapRef" class="seamless-scroll" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div ref="boxRef" class="box-wrap">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

type Props = {
    list: unknown[]
    visibleRows?: number
    fill?: boolean
    speed?: number
    interval?: number
    stopOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    visibleRows: 3,
    fill: true,
    speed: 1,
    interval: 40,
    stopOnHover: true,
})

const wrapRef = ref<HTMLDivElement>()
const boxRef = ref<HTMLDivElement>()

let timer: number | null = null
let rowHeight = 0
let singleCycleHeight = 0

onMounted(async () => {
    await nextTick()
    const box = boxRef.value!
    const wrap = wrapRef.value!

    let originRows: HTMLElement[]
    originRows = Array.from(box.children) as HTMLElement[]

    if (originRows.length === 0) return

    const firstRow = originRows[0]
    rowHeight = firstRow.getBoundingClientRect().height

    const curLen = originRows.length

    if (!props.fill && curLen <= props.visibleRows) {
        wrap.style.height = `${rowHeight * props.visibleRows}px`
        return
    }

    const repeatTimes = Math.max(1, Math.ceil(props.visibleRows / curLen))
    for (let i = 0; i < repeatTimes - 1; i++) {
        originRows.forEach((row) => box.appendChild(row.cloneNode(true)))
    }

    const singleCycleCount = curLen * repeatTimes

    let firstCycleRows: HTMLElement[]
    firstCycleRows = (Array.from(box.children) as HTMLElement[]).slice(0, singleCycleCount)

    firstCycleRows.forEach((row) => box.appendChild(row.cloneNode(true)))

    singleCycleHeight = rowHeight * singleCycleCount

    wrap.style.height = `${rowHeight * props.visibleRows}px`

    startScroll()
})

onUnmounted(() => stopScroll())

function startScroll() {
    if (timer) return
    timer = window.setInterval(() => {
        const box = boxRef.value!

        box.scrollTop += props.speed

        if (singleCycleHeight > 0 && box.scrollTop >= singleCycleHeight) {
            box.scrollTop -= singleCycleHeight
        }
    }, props.interval)
}

function stopScroll() {
    if (timer) {
        window.clearInterval(timer)
    }
    timer = null
}

function handleMouseEnter() {
    if (props.stopOnHover) stopScroll()
}

function handleMouseLeave() {
    if (props.stopOnHover) startScroll()
}
</script>

<style scoped>
.seamless-scroll {
    overflow: hidden;
    position: relative;
}

.box-wrap {
    height: 100%;
    scrollbar-width: none;
    overflow: hidden;
}

.box-wrap::-webkit-scrollbar {
    display: none;
}
</style>