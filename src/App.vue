<template>
  <div class="main-view">
    <div class="container">
      <RouterView />
      <div class="footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Footer from './views/layout/Footer.vue';
</script>

<style lang="scss" scoped>
.main-view {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--bg-color);
  .container {
    width: 750px;
    height: 100%;
    background-color: var(--bg-color);

    .footer {
      align-items: flex-end;
    }
  }
}
</style>
