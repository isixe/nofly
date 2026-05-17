<script setup lang="ts">
import { ref } from 'vue';
import NoticeCarousel from "../../../packages/components/src/notice-carousel/index.vue";

const messages = ref([
    '欢迎使用通知栏组件！',
    '新版本已发布，请及时更新',
    '限时优惠活动正在进行中',
    '重要通知：请查收最新邮件'
]);

const noticeCarouselRef = ref();

const playNotice = () => {
    noticeCarouselRef.value?.play();
};

const pauseNotice = () => {
    noticeCarouselRef.value?.pause();
};
</script>

<template>
    <div class="notice-demo">
        <NoticeCarousel ref="noticeCarouselRef" :data="messages" :interval="5000" direction="horizontal">
            <template #prefix>
                <span class="icon">🎮</span>
            </template>
        </NoticeCarousel>

        <div class="notice-controls">
            <button @click="playNotice">播放</button>
            <button @click="pauseNotice">暂停</button>
        </div>
    </div>
</template>



<style scoped>
.notice-controls {
    margin-top: 10px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.notice-controls button {
    padding: 2px 20px;
    background-color: #f3cc9f;
    color: #000000;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.notice-controls button:hover {
    background-color: #ffbb45;
}

.notice-controls button:active {
    background-color: #d48806;
}
</style>
