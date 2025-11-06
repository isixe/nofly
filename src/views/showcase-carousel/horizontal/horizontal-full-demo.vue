<script setup lang="ts">
import HorizontalShowcaseCarousel from '../../../components/showcase-carousel/horizontal.vue';

const cardData = [
  { title: "卡片 1", color: "#ff6b6b" },
  { title: "卡片 2", color: "#4ecdc4" },
  { title: "卡片 3", color: "#45b7d1" },
  { title: "卡片 4", color: "#96ceb4" },
  { title: "卡片 5", color: "#ffeaa7" },
];

function onChange(index: number) {
  console.log("当前卡片索引：", index);
}
</script>

<template>
  <div class="carousel-wrapper">
    <HorizontalShowcaseCarousel :itemWidth="60" :gap="15" :autoplay="true" :interval="2000" :showIndicator="true"
      :showArrows="true" indicatorPosition="outside" @change="onChange">
      <div v-for="(card, index) in cardData" :key="index" class="carousel-card"
        :style="{ backgroundColor: card.color }">
        <div>{{ card.title }}</div>
      </div>
    </HorizontalShowcaseCarousel>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  background-color: #ededed;
}

.carousel-card {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
}
</style>
