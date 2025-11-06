<template>
    <div class="carousel-container">
        <div v-if="showArrows && originItems.length > 0" class="arrow-container">
            <button class="arrow prev" :style="arrowStyle" @click="handlePrev">
                <svg style="width:60%;height:60%;transform:rotate(90deg)" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="arrow next" :style="arrowStyle" @click="handleNext">
                <svg style="width:60%;height:60%;transform:rotate(90deg)" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2">
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

        <div v-if="showIndicator && originItems.length > 0" class="indicator-bar" :style="indicatorStyle">
            <span v-for="(_, idx) in originItems" :key="idx" class="indicator" :class="{ active: idx === curRealIndex }"
                @click="handleJumpTo(idx)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useSlots, nextTick, watch } from "vue";


const emit = defineEmits<{
    (e: 'change', activeIndex: number): void
}>();

type Props = {
    itemHeight?: number | string;
    gap?: number;
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showIndicator?: boolean;
    indicatorPosition?: 'left' | 'right';
    arrowSize?: number | string;
    initialIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
    itemHeight: 60,
    gap: 0,
    autoplay: false,
    interval: 3000,
    showArrows: true,
    showIndicator: true,
    indicatorPosition: 'right',
    arrowSize: 45,
    initialIndex: 0,
});

type LayoutCache = {
    viewportHeight: number;
    itemHeightPx: number;
    topOffset: number;
}

const layoutCache = ref<LayoutCache>({
    viewportHeight: 0,
    itemHeightPx: 0,
    topOffset: 0,
});

const slots = useSlots();

const viewportRef = ref<HTMLElement | null>(null);
const viewportResizeObserver = ref<ResizeObserver | null>(null);
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
    if (typeof props.itemHeight === "number") {
        const vh = layoutCache.value.viewportHeight;
        const itemHeight = vh ? `${(vh * props.itemHeight) / 100}px` : `${props.itemHeight}%`;
        return { height: itemHeight, width: '100%' };
    }

    return { height: props.itemHeight as string, width: '100%' };
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
const indicatorStyle = computed(() => {
    const offset = '35px';
    if (props.indicatorPosition === 'left') {
        return { left: offset, top: '50%', transform: 'translateY(-50%)' };
    }
    return { right: offset, top: '50%', transform: 'translateY(-50%)' };
});
const trackStyle = computed(() => {
    const { viewportHeight, itemHeightPx, topOffset } = layoutCache.value;

    if (!viewportHeight || !itemHeightPx) {
        return {
            gap: `${props.gap}px`,
            transform: `translateY(0px)`,
            transition: isTransitioning.value ? "transform 0.4s ease-out" : "none",
        };
    }

    const translate = -(curVirtualIndex.value * (itemHeightPx + props.gap) + topOffset);
    return {
        gap: `${props.gap}px`,
        transform: `translateY(${translate}px)`,
        transition: isTransitioning.value ? "transform 0.4s ease-out" : "none",
    };
});

watch(curRealIndex, (value) => {
    emit('change', value);
}, { immediate: true });

onMounted(async () => {
    const slotTarget = slots.default ? slots.default() : [];
    originItems.value = (slotTarget[0]?.children || []) as any[];

    nextTick();

    initLayout();
    measureLayoutCache();

    setupAutoplay();
    window.addEventListener("resize", onResize);

    viewportResizeObserver.value = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const height = entry.contentRect.height;
            if (height === layoutCache.value.viewportHeight) return;

            measureLayoutCache();
            isTransitioning.value = false;
        }
    });
    if (viewportRef.value) {
        viewportResizeObserver.value.observe(viewportRef.value);
    }
});

onUnmounted(() => {
    clearAutoplay();
    window.removeEventListener("resize", onResize);
    if (viewportResizeObserver.value) {
        viewportResizeObserver.value.disconnect();
        viewportResizeObserver.value = null;
    }
});

function initLayout() {
    curRealIndex.value = props.initialIndex || 0
    curVirtualIndex.value = realToVirtual(curRealIndex.value);
}

function measureLayoutCache() {
    if (!viewportRef.value) return;

    let viewportHeight = 0;
    let itemHeightPx = 0;
    let topOffset = 0;

    nextTick();

    viewportHeight = viewportRef.value.clientHeight;
    console.log(viewportHeight)

    if (typeof props.itemHeight === "number") {
        itemHeightPx = (viewportHeight * props.itemHeight) / 100;
    }
    if (!itemHeightPx) {
        const firstChild = trackRef.value?.children[0] as HTMLElement | undefined;
        itemHeightPx = firstChild?.clientHeight || 0;
    }

    topOffset = itemHeightPx / 2 - viewportHeight / 2;

    layoutCache.value = { viewportHeight, itemHeightPx, topOffset };
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
    height: 100%;
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
    left: 50%;
    transform: translateX(-50%);
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
    top: 12px;
}

.arrow.next {
    bottom: 12px;
}

.viewport {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.track {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.track>* {
    flex-shrink: 0;
}

.indicator-bar {
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    z-index: 2;
}

.indicator {
    width: 4px;
    height: 5%;
    background: rgba(255, 255, 255, 0.45);
    cursor: pointer;
    transition: all 0.25s;
}

.indicator.active {
    background: #fff;
}
</style>
