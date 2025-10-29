<template>
    <div ref="wrapRef" class="infinite-horizontal-scroll" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div ref="boxRef" class="box-wrap">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

type Props = {
    width?: number | string
    fill?: boolean
    step?: number
    interval?: number
    stopOnHover?: boolean
    scroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    width: undefined,
    fill: true,
    step: 1,
    interval: 40,
    stopOnHover: true,
    scroll: false,
})

const wrapRef = ref<HTMLDivElement>()
const boxRef = ref<HTMLDivElement>()

let timer: number | null = null
let singleCycleWidth = 0

function getElementWidth(element: HTMLElement): number {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    const marginLeft = parseFloat(style.marginLeft)
    const marginRight = parseFloat(style.marginRight)
    return rect.width + marginLeft + marginRight
}

function getTotalWidth(elements: HTMLElement[]): number {
    return elements.reduce((total, el) => total + getElementWidth(el), 0)
}

onMounted(async () => {
    await nextTick()
    const box = boxRef.value!
    const wrap = wrapRef.value!

    //[A, B, C]
    const originItems = Array.from(box.children) as HTMLElement[]
    if (originItems.length === 0) return

    box.style.overflowX = props.scroll ? "auto" : "hidden"
    if (props.width) {
        wrap.style.width = typeof props.width === 'number' ? `${props.width}px` : props.width
    }
    await nextTick()

    const targetWidth = wrap.getBoundingClientRect().width
    const originTotalWidth = getTotalWidth(originItems)

    if (!props.fill && originTotalWidth <= targetWidth) {
        return
    }

    const repeatTimes = Math.max(1, Math.ceil(targetWidth / originTotalWidth))

    //[A, B, C, A-clone, B-clone, C-clone]
    for (let i = 0; i < repeatTimes - 1; i++) {
        originItems.forEach((item) => box.appendChild(item.cloneNode(true)))
    }

    //[A, B, C, A-clone, B-clone, C-clone, A, B, C, A-clone, B-clone, C-clone]
    const firstCycleItems = (Array.from(box.children) as HTMLElement[])
    firstCycleItems.forEach((item) => box.appendChild(item.cloneNode(true)))

    singleCycleWidth = getTotalWidth(firstCycleItems)

    startScroll()
})

onUnmounted(() => stopScroll())

function startScroll() {
    if (timer) return
    timer = window.setInterval(() => {
        const box = boxRef.value!

        box.scrollLeft += props.step

        if (singleCycleWidth > 0 && box.scrollLeft >= singleCycleWidth) {
            box.scrollLeft -= singleCycleWidth
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
.infinite-horizontal-scroll {
    overflow: hidden;
    position: relative;
}

.box-wrap {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    scrollbar-width: none;
    overflow: hidden;
}

.box-wrap>* {
    flex-shrink: 0;
}

.box-wrap::-webkit-scrollbar {
    display: none;
}
</style>