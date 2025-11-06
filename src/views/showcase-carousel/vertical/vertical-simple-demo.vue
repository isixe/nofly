<script setup lang="ts">
import HorizontalTiledCarousel from '../../../components/showcase-carousel/vertical.vue';

const cardData = [
    { title: "卡片 1", color: "#ff6b6b" },
    { title: "卡片 2", color: "#4ecdc4" },
    { title: "卡片 3", color: "#45b7d1" },
    { title: "卡片 4", color: "#96ceb4" },
    { title: "卡片 5", color: "#ffeaa7" },
];


</script>

<template>
    <div class="carousel-wrapper">
        <HorizontalTiledCarousel>
            <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
                :style="{ backgroundColor: card.color }">
                <div>{{ card.title }}</div>
            </div>
        </HorizontalTiledCarousel>
    </div>
</template>

<style scoped>
.carousel-wrapper {
    height: 340px;
}

.carousel-card {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    cursor: pointer;
}
</style>
