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

onMounted(async () => {
    await nextTick()
    const box = boxRef.value!
    const wrap = wrapRef.value!

    const firstRow = box.querySelector('.box-row') as HTMLElement
    if (!firstRow) return
    rowHeight = firstRow.getBoundingClientRect().height

    const originRows = Array.from(box.querySelectorAll('.box-row')) as HTMLElement[]

    const curLen = originRows.length

    if (curLen === 0) return

    if (!props.fill && curLen <= props.visibleRows) {
        wrap.style.height = `${rowHeight * props.visibleRows}px`
        return
    }

    const targetRounds = Math.max(2, Math.ceil(props.visibleRows / curLen))
    for (let i = 0; i < targetRounds; i++) {
        originRows.forEach((row) => box.appendChild(row.cloneNode(true)))
    }

    wrap.style.height = `${rowHeight * props.visibleRows}px`

    startScroll()
})

onUnmounted(() => stopScroll())

function startScroll() {
    if (timer) return
    timer = window.setInterval(() => {
        const box = boxRef.value!
        const wrap = wrapRef.value!

        box.scrollTop += props.speed
        if (box.scrollTop >= box.scrollHeight - wrap.offsetHeight) {
            box.scrollTop = 0
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