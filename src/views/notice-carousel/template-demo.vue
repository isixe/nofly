<script setup lang="ts">
import { ref } from 'vue';
import NoticeCarousel from "../../components/notice-carousel/index.vue";

const messages = ref([
    '欢迎使用通知栏组件！',
    '新版本已发布，请及时更新',
    '限时优惠活动正在进行中',
    '重要通知：请查收最新邮件'
]);
</script>

<template>
    <div class="notice-demo">
        <NoticeCarousel :data="messages" :interval="4000" direction="horizontal">
            <template #prefix>
                <span class="notice-icon prefix">🔔</span>
            </template>
            <template #default="{ item }">
                <div class="notice-content">
                    <span class="text">{{ item }}</span>
                </div>
            </template>
            <template #suffix>
                <span class="notice-icon suffix">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg></span>
            </template>
        </NoticeCarousel>
    </div>
</template>

<style scoped>
.notice-demo {
    background: #fef5da;
    padding: 0 5px;
    border-radius: 4px;
}

.notice-icon.suffix {
    cursor: pointer;
}
</style>
