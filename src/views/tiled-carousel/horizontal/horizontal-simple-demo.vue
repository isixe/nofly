<template>
  <div class="demo-container">
    <HorizontalTiledCarousel :items="cardData" :item-width="60" :gap="15" :autoplay="true" :interval="2000"
      :show-indicator="true">
      <template #item="{ item }">
        <div class="demo-card" :style="{ background: item.color }">
          <div>{{ item.title }}</div>
        </div>
      </template>
    </HorizontalTiledCarousel>
  </div>
</template>

<script setup lang="ts">
import HorizontalTiledCarousel from '../../../components/tiled-carousel/horizontal.vue';

const cardData = [
  { title: "卡片 1", color: "#ff6b6b" },
  { title: "卡片 2", color: "#4ecdc4" },
  { title: "卡片 3", color: "#45b7d1" },
  { title: "卡片 4", color: "#96ceb4" },
  { title: "卡片 5", color: "#ffeaa7" },
];
</script>

<style scoped>
.demo-container {
  background: #ededed;
}

.demo-card {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s;
  font-size: 24px;
  font-weight: bold;
}

.demo-card:hover {
  transform: scale(1.05);
}
</style>
