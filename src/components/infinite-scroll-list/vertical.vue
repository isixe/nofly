<template>
    <div ref="wrapRef" class="vertical-infinite-scroll" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div ref="boxRef" class="box-wrap">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

type Props = {
    height?: number | string
    fill?: boolean
    step?: number
    interval?: number
    stopOnHover?: boolean
    scroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    height: 300,
    fill: true,
    step: 1,
    interval: 40,
    stopOnHover: true,
    scroll: false,
})

const wrapRef = ref<HTMLDivElement>()
const boxRef = ref<HTMLDivElement>()

let timer: number | null = null
let singleCycleHeight = 0

function getElementHeight(element: HTMLElement): number {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    const marginTop = parseFloat(style.marginTop)
    const marginBottom = parseFloat(style.marginBottom)
    return rect.height + marginTop + marginBottom
}

function getTotalHeight(elements: HTMLElement[]): number {
    return elements.reduce((total, el) => total + getElementHeight(el), 0)
}

onMounted(async () => {
    await nextTick()
    const box = boxRef.value!
    const wrap = wrapRef.value!

    //[A, B, C]
    const originRows = Array.from(box.children) as HTMLElement[]
    if (originRows.length === 0) return

    box.style.overflowY = props.scroll ? "auto" : "hidden"
    wrap.style.height = typeof props.height === 'number' ? `${props.height}px` : props.height

    await nextTick()

    const targetHeight = wrap.getBoundingClientRect().height
    const originTotalHeight = getTotalHeight(originRows)

    if (!props.fill && originTotalHeight <= targetHeight) {
        return
    }

    const repeatTimes = Math.max(1, Math.ceil(targetHeight / originTotalHeight))

    //[A, B, C, A-clone, B-clone, C-clone]
    for (let i = 0; i < repeatTimes - 1; i++) {
        originRows.forEach((row) => box.appendChild(row.cloneNode(true)))
    }

    //[A, B, C, A-clone, B-clone, C-clone, A, B, C, A-clone, B-clone, C-clone]
    const firstCycleRows = (Array.from(box.children) as HTMLElement[])
    firstCycleRows.forEach((row) => box.appendChild(row.cloneNode(true)))

    singleCycleHeight = getTotalHeight(firstCycleRows)

    startScroll()
})

onUnmounted(() => stopScroll())

function startScroll() {
    if (timer) return
    timer = window.setInterval(() => {
        const box = boxRef.value!

        box.scrollTop += props.step

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
.vertical-infinite-scroll {
    overflow: hidden;
    position: relative;
}

.box-wrap {
    height: 100%;
    scrollbar-width: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.box-wrap::-webkit-scrollbar {
    display: none;
}
</style>