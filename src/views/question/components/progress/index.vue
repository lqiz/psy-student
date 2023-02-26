<template>
  <div class="progress-container">
    <div class="steps">
      <div
        :class="['step-item', step.selected ? 'is-active' : '']"
        v-for="step in steps"
        :key="step.id"
      >
        <div class="circle-box">
          <span class="line left"></span>
          <span class="circle">{{ step.index }}</span>
          <span class="line right"></span>
        </div>
        <span class="label">{{ step.name }}</span>
        <span class="total">{{ step.finishedTotal }}/{{ step.total }}</span>
      </div>
    </div>
    <el-progress
      color="#8876ff"
      :show-text="false"
      :stroke-width="14"
      :percentage="currentProgress"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  steps: {
    type: Array,
    default: () => [],
  },
  currentProgress: {
    type: [String, Number],
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
