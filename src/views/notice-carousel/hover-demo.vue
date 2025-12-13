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
        <NoticeCarousel :data="messages" :stopOnHover="true" />
    </div>
</template>

<style scoped></style>
