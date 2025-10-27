<template>
    <div class="carousel-container" ref="containerRef">
        <div v-if="showArrows && items.length > 0" class="arrow-container">
            <button class="arrow prev" @click="handlePrev">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>
            <button class="arrow next" @click="handleNext">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>

        <div ref="viewportRef" class="viewport">
            <div ref="trackRef" class="track" :style="trackStyle" @transitionend="handleTransitionEnd">
                <div v-for="(item, index) in displayItems" :key="index" class="carousel-item" :style="{
                    width: computedItemWidth,
                    marginRight: `${gap}px`,
                    opacity: index === activeIndex ? 1 : 0.6,
                    zIndex: index === activeIndex ? 1 : 'auto',
                }">
                    <slot name="item" :item="item" :index="getRealIndex(index)">
                        {{ item }}
                    </slot>
                </div>
            </div>
        </div>

        <div v-if="showIndicator && items.length > 0" class="indicator-container">
            <span v-for="(_, idx) in items" :key="idx" class="indicator" :class="{ active: idx === currentRealIndex }"
                @click="handleJumpTo(idx)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Props {
    itemWidth?: number | string;
    gap?: number;
    autoplay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showIndicator?: boolean;
    arrowSize?: number;
    initialIndex?: number;
    items?: any[];
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
    items: () => [],
});

const emit = defineEmits<{
    (e: "update:currentIndex", value: number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const viewportRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);
const currentRealIndex = ref(0);
const isTransitioning = ref(false);
const autoplayTimerId = ref<number | null>(null);

const cloneOffset = 2;

const displayItems = computed(() => {
    return props.items.length <= 1
        ? props.items
        : [...props.items.slice(-2), ...props.items, ...props.items.slice(0, 2)];
});

const computedItemWidth = computed(() => {
    return typeof props.itemWidth === "number" ? `${props.itemWidth}%` : props.itemWidth;
});

const trackStyle = computed(() => {
    if (!viewportRef.value) return {};

    const viewport = viewportRef.value!;
    const viewportWidth = viewport.clientWidth;
    const itemWidthPx =
        typeof props.itemWidth === "number"
            ? (viewportWidth * props.itemWidth) / 100
            : parseFloat(props.itemWidth?.toString() || '0');

    const centerPosition = activeIndex.value * (itemWidthPx + props.gap);
    const translateOffset = viewportWidth / 2 - centerPosition - itemWidthPx / 2;

    return {
        transform: `translateX(${translateOffset}px)`,
        transition: isTransitioning.value ? "transform 0.4s ease-out" : "none",
    };
});

const getRealIndex = (virtualIndex: number) => {
    const length = props.items.length;
    if (length === 0) return 0;
    return ((virtualIndex - cloneOffset) % length + length) % length;
};

const moveToIndex = (targetIndex: number, skipTransition = false) => {
    const length = props.items.length;
    if (length === 0) return;

    const normalizedIndex = ((targetIndex % length) + length) % length;
    const virtualIndex = normalizedIndex + cloneOffset;

    if (skipTransition) {
        isTransitioning.value = false;
        currentRealIndex.value = normalizedIndex;
        activeIndex.value = virtualIndex;
    } else {
        isTransitioning.value = (true);
        activeIndex.value = virtualIndex;
    }
};

const handlePrev = () => {
    clearAutoplay();
    moveToIndex(currentRealIndex.value - 1);
    setupAutoplay();
};

const handleNext = () => {
    clearAutoplay();
    moveToIndex(currentRealIndex.value + 1);
    setupAutoplay();
};

const handleJumpTo = (targetIndex: number) => {
    clearAutoplay();
    moveToIndex(targetIndex);
    setupAutoplay();
};

const handleTransitionEnd = () => {
    const length = props.items.length;
    const virtualIndex = activeIndex.value;

    if (virtualIndex < cloneOffset) {
        moveToIndex(virtualIndex + length, true);
    } else if (virtualIndex >= cloneOffset + length) {
        moveToIndex(virtualIndex - length, true);
    } else {
        currentRealIndex.value = virtualIndex - cloneOffset;
        emit("update:currentIndex", currentRealIndex.value);
    }
};

const setupAutoplay = () => {
    if (!props.autoplay || props.items.length <= 1) return;
    clearAutoplay();
    autoplayTimerId.value = setInterval(() => {
        moveToIndex(currentRealIndex.value + 1);
    }, props.interval);
};

const clearAutoplay = () => {
    if (autoplayTimerId.value) {
        clearInterval(autoplayTimerId.value);
        autoplayTimerId.value = null;
    }
};

onMounted(() => {
    setTimeout(() => {
        moveToIndex(props.initialIndex || 0, true);
        setupAutoplay();
    }, 100);
});

onUnmounted(() => {
    clearAutoplay();
});
</script>

<style scoped>
.carousel-container {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.arrow-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    pointer-events: none;
}

.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: all;
    transition: background 0.3s;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    width: v-bind('arrowSize + "px"');
    height: v-bind('arrowSize + "px"');
}

.arrow.prev {
    left: 20px;
}

.arrow.next {
    right: 20px;
}

.arrow svg {
    width: 60%;
    height: 60%;
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

.carousel-item {
    flex-shrink: 0;
    transition: all 0.4s ease-out;
}

.indicator-container {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 2;
}

.indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 257, 255, 0.4);
    transition: all 0.3s;
    cursor: pointer;
}

.indicator.active {
    width: 24px;
    border-radius: 4px;
    background: #fff;
}
</style>
