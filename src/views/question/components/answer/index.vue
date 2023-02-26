<template>
  <div class="question-container">
    <div class="question-title">{{ question.title }}</div>
    <el-input
      class="question-textarea"
      v-model="inputValue"
      :rows="6"
      type="textarea"
      maxlength="500"
      show-word-limit
      placeholder="请输入"
      @input="change"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  question: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['changed']);

const inputValue = ref('');

watch(
  () => props.question.contentArray,
  (val) => {
    if (val) {
      const target = val[0] || [''];
      inputValue.value = target[0];
    } else {
      inputValue.value = '';
    }
  },
  {
    immediate: true
  }
);

const change = () => {
  emit('changed', {
    selectedValue: [[inputValue.value]],
    // jumpValue: {}
  });
};
</script>

<style lang="scss" scoped>
@import '../../index.scss';
</style>
