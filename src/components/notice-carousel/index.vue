<template>
    <div v-if="data.length" class="notice-carousel" :class="[`is-${direction}`, animation === 'fade' ? 'is-fade' : '']"
        @mouseenter="pause" @mouseleave="play">
        <div v-if="$slots.prefix" class="notice-carousel-prefix">
            <slot name="prefix"></slot>
        </div>

        <div class="notice-carousel-viewport">
            <div class="notice-carousel-track">
                <div v-for="(item, index) in data" :key="index" class="notice-carousel-item"
                    :class="{ 'is-active': currentIndex === index }" @click="onClick(item, index)">
                    <slot :item="item" :index="index">{{ item }}</slot>
                </div>
            </div>
        </div>

        <div v-if="$slots.suffix" class="notice-carousel-suffix">
            <slot name="suffix"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    ref,
    onMounted,
    onUnmounted,
    watch
} from 'vue';

type NoticeBarProps = {
    data: any[];
    initialIndex?: number;
    interval?: number;
    direction?: 'horizontal' | 'vertical';
    stopOnHover?: boolean;
    animation?: 'slide' | 'fade';
}

const props = withDefaults(defineProps<NoticeBarProps>(), {
    data: () => [],
    initialIndex: 0,
    interval: 3000,
    direction: 'horizontal',
    stopOnHover: false,
    animation: 'slide',
});

const emit = defineEmits<{
    (e: 'change', index: number): void;
    (e: 'click', item: any, index: number): void;
}>();

const currentIndex = ref(0);
let timer: number | null = null;

const onClick = (item: any, index: number) => emit('click', item, index);

function initNotice() {
    pause();
    initializeIndex();
    if (props.data.length <= 1) {
        return;
    }

    play();
}

function initializeIndex() {
    const index = Math.max(0, Math.min(props.initialIndex, props.data.length - 1));
    currentIndex.value = props.data.length > 0 ? index : 0;
};

function next() {
    if (props.data.length === 0) return;

    const nextIndex = (currentIndex.value + 1) % props.data.length;
    currentIndex.value = nextIndex;
    emit('change', nextIndex);
};

function play() {
    if (timer || props.data.length <= 1) return;

    timer = window.setInterval(next, props.interval);
};

function pause() {
    if (timer && props.stopOnHover) {
        clearInterval(timer);
        timer = null;
    }
};

function goTo(index: number) {
    if (index >= 0 && index < props.data.length) {
        currentIndex.value = index;
        emit('change', index);
    }
};

watch(() => props.data, () => {
    initNotice();
}, { deep: true });

watch(() => [props.direction, props.animation, props.initialIndex], () => {
    initNotice();
});

watch(() => [props.interval], () => {
    pause();
    play();
});

onMounted(() => {
    initNotice();
});

onUnmounted(() => {
    pause();
});

defineExpose({
    play,
    pause,
    goTo,
    next
});
</script>

<style scoped>
.notice-carousel {
    display: flex;
    align-items: center;
    gap: 5px;
    width: 100%;
    height: 40px;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
}

.notice-carousel-viewport {
    flex: 1;
    height: 100%;
    overflow: hidden;
    position: relative;
}

.notice-carousel-track {
    position: relative;
    height: 100%;
    width: 100%;
}

.notice-carousel-item {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    will-change: transform, opacity;
}

.is-horizontal:not(.is-fade) .notice-carousel-item {
    transform: translateX(100%);
}

.is-horizontal:not(.is-fade) .notice-carousel-item.is-active {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-vertical:not(.is-fade) .notice-carousel-item {
    transform: translateY(100%);
}

.is-vertical:not(.is-fade) .notice-carousel-item.is-active {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-fade .notice-carousel-item.is-active {
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>