<template>
    <div class="carousel-container">
        <div v-if="showArrows && originItems.length > 0" class="arrow-container">
            <button class="arrow prev" :style="arrowStyle" @click="handlePrev">
                <svg style="width:60%;height:60%" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="arrow next" :style="arrowStyle" @click="handleNext">
                <svg style="width:60%;height:60%" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>

        <div ref="viewportRef" class="viewport">
            <div ref="trackRef" class="track" :style="trackStyle" @transitionend="handleTransitionEnd">
                <template v-for="(vnode, index) in virtualItems" :key="index">
                    <component :is="vnode" :style="itemStyle" />
                </template>
            </div>
        </div>

        <div v-if="showIndicator && originItems.length > 0" class="indicator-bar">
            <span v-for="(_, idx) in originItems" :key="idx" class="indicator" :class="{ active: idx === curRealIndex }"
                @click="handleJumpTo(idx)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useSlots, nextTick, watch } from "vue";

type Props = {
    itemWidth?: number | string;
    gap?: number;
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showIndicator?: boolean;
    arrowSize?: number | string;
    initialIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    itemWidth: 60,
    gap: 16,
    autoplay: false,
    interval: 3000,
    showArrows: true,
    showIndicator: true,
    arrowSize: 45,
    initialIndex: 0,
});

type LayoutCache = {
    viewportWidth: number;
    itemWidthPx: number;
    leftOffset: number;
}

const layoutCache = ref<LayoutCache>({
    viewportWidth: 0,
    itemWidthPx: 0,
    leftOffset: 0,
});

const slots = useSlots();

const viewportRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

const cloneOffset = 2;
const curRealIndex = ref<number>(0);
const curVirtualIndex = ref<number>(0);

const isTransitioning = ref<boolean>(false);
const autoplayTimerId = ref<number | null>(null);

const originItems = ref<any[]>([]);
const virtualItems = computed(() => {
    const items = originItems.value;
    if (items.length <= 1) return items;
    return [...items.slice(-2), ...items, ...items.slice(0, 2)];
});

const itemStyle = computed(() => {
    if (typeof props.itemWidth === "number") {
        const vw = layoutCache.value.viewportWidth;
        const itemWidth = vw ? `${(vw * props.itemWidth) / 100}px` : `${props.itemWidth}%`;
        return { width: itemWidth };
    }

    return { width: props.itemWidth as string };
});
const arrowStyle = computed(() => {
    if (typeof props.arrowSize === "number") {
        const size = props.arrowSize;
        return {
            width: `${size}px`,
            height: `${size}px`,
        }
    }

    const size = props.arrowSize || "45px";
    return {
        width: size,
        height: size,
    }

});
const trackStyle = computed(() => {
    const { viewportWidth, itemWidthPx, leftOffset } = layoutCache.value;

    if (!viewportWidth || !itemWidthPx) {
        return {
            gap: `${props.gap}px`,
            transform: `translateX(0px)`,
            transition: isTransitioning.value ? "transform 0.4s ease-out" : "none",
        };
    }

    const translate = -(curVirtualIndex.value * (itemWidthPx + props.gap) + leftOffset);
    return {
        gap: `${props.gap}px`,
        transform: `translateX(${translate}px)`,
        transition: isTransitioning.value ? "transform 0.4s ease-out" : "none",
    };
});

onMounted(async () => {
    const slotTarget = slots.default ? slots.default() : [];
    originItems.value = (slotTarget[0]?.children || []) as any[];

    nextTick();

    initLayout();
    measureLayoutCache();

    setupAutoplay();
    window.addEventListener("resize", onResize);
});

onUnmounted(() => {
    clearAutoplay();
    window.removeEventListener("resize", onResize);
});

function initLayout() {
    curRealIndex.value = props.initialIndex || 0
    curVirtualIndex.value = realToVirtual(curRealIndex.value);
}

function measureLayoutCache() {
    if (!viewportRef.value) return;

    let viewportWidth = 0;
    let itemWidthPx = 0;
    let leftOffset = 0;

    viewportWidth = viewportRef.value.clientWidth;

    if (typeof props.itemWidth === "number") {
        itemWidthPx = (viewportWidth * props.itemWidth) / 100;
    }
    if (!itemWidthPx) {
        const firstChild = trackRef.value?.children[0] as HTMLElement | undefined;
        itemWidthPx = firstChild?.clientWidth || 0;
    }

    leftOffset = itemWidthPx / 2 - viewportWidth / 2;

    layoutCache.value = { viewportWidth, itemWidthPx, leftOffset };
}


function realToVirtual(realPos: number) {
    const len = originItems.value.length || 0;
    if (len === 0) return cloneOffset;

    const normalized = ((realPos % len) + len) % len;
    return normalized + cloneOffset;
}
function virtualToReal(virtualPos: number) {
    const len = originItems.value.length || 0;
    if (len === 0) return 0;

    return ((virtualPos - cloneOffset) % len + len) % len;
}

function moveToIndex(targetIndex: number, skipTransition = false) {
    const length = originItems.value.length;
    if (length === 0) return;

    //[ >2, 3, 1, 2, 3, 1, 2]
    //[ 1, >2, 3]
    if (skipTransition) {
        isTransitioning.value = false;

        //[ 2, >3, 1, 2, 3, 1, 2]
        curVirtualIndex.value = curVirtualIndex.value + targetIndex;
        //[ 1, 2, >3]
        curRealIndex.value = virtualToReal(curVirtualIndex.value);
        return
    }

    isTransitioning.value = true;
    curVirtualIndex.value = curVirtualIndex.value + targetIndex;
}

const handlePrev = () => {
    clearAutoplay();
    moveToIndex(-1);
    setupAutoplay();
};

const handleNext = () => {
    clearAutoplay();
    moveToIndex(1);
    setupAutoplay();
};

const handleJumpTo = (realIdx: number) => {
    clearAutoplay();
    const virtualIndex = realToVirtual(realIdx);
    isTransitioning.value = true;
    curVirtualIndex.value = virtualIndex;
    setupAutoplay();
};

function handleTransitionEnd() {
    const len = originItems.value.length;
    if (len === 0) return;

    const virtualIndex = curVirtualIndex.value;
    if (virtualIndex < cloneOffset) {
        const newV = virtualIndex + len;
        moveToIndex(newV - virtualIndex, true);
        return
    }

    if (virtualIndex >= cloneOffset + len) {
        const newV = virtualIndex - len;
        moveToIndex(newV - virtualIndex, true);
        return
    }
    curRealIndex.value = virtualToReal(virtualIndex) % originItems.value.length;
}

function setupAutoplay() {
    if (!props.autoplay || originItems.value.length <= 1) return;

    clearAutoplay();
    autoplayTimerId.value = window.setInterval(() => {
        moveToIndex(1);
    }, props.interval);
}
function clearAutoplay() {
    if (!autoplayTimerId.value) return;

    clearInterval(autoplayTimerId.value);
    autoplayTimerId.value = null;
}

function onResize() {
    measureLayoutCache();
    isTransitioning.value = false;
}
</script>

<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.arrow-container {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
}

.arrow {
    pointer-events: all;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    cursor: pointer;
}

.arrow.prev {
    left: 12px;
}

.arrow.next {
    right: 12px;
}

.viewport {
    width: 100%;
    overflow: hidden;
    position: relative;
}

.track {
    display: flex;
    align-items: center;
    padding: 20px 0;
}

.track>* {
    flex-shrink: 0;
}

.indicator-bar {
    position: absolute;
    bottom: 35px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 2;
}

.indicator {
    width: 30px;
    height: 4px;
    background: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    transition: all 0.25s;
}

.indicator.active {
    background: #fff;
}
</style>
