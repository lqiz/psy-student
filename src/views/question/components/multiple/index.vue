<template>
  <div class="question-container">
    <div class="question-title">{{ question.title }}</div>
    <div class="question-items">
      <div v-for="option in questionOptions" :key="option.id">
        <div
          :class="['question-item', option.selected ? 'is-selected' : '']"
          @click="choice(option, false)"
        >
          <div class="content">{{ option.content }}</div>
          <div class="bg"></div>
        </div>

        <el-input
          v-if="option.inputTag === 1"
          :key="option.id"
          class="question-textarea"
          v-model="option.inputValue"
          :rows="4"
          type="textarea"
          maxlength="500"
          show-word-limit
          placeholder="请输入"
          @input="choice(option, true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
  question: {
    type: Object,
    default: () => ({}),
  },
  questionOptions: {
    type: Array,
    default: () => [],
  },
});

// 已选选项字典
let selectedMap = new Map();
watch(
  () => props.questionOptions,
  (list) => {
    selectedMap = new Map();
    list.forEach((option) => {
      if (option.selected) {
        selectedMap.set(option.id, option);
      }
    });
  },
  {
    immediate: true,
  }
);
// 更新已选选项字典
const updateSelectedMap = (opt, setImmediate) => {
  if (opt.inputTag === 1 && opt.inputValue === '') {
    opt.selected = false;
    selectedMap.delete(opt.id);
  } else if (setImmediate || !selectedMap.has(opt.id)) {
    opt.selected = true;
    selectedMap.set(opt.id, opt);
  } else {
    opt.selected = false;
    selectedMap.delete(opt.id);
  }
};

// 已选选项字典转数组
const selectedMapToArray = () => {
  return Array.from(selectedMap.values()).map((item) => {
    const selectedValue = [
      item.originData.prefix,
      item.inputTag === 1 ? item.inputValue : '',
    ];
    return selectedValue;
  });
};

// 选择答案
const choice = (option, setImmediate) => {
  if (!setImmediate && option.inputTag === 1 && option.inputValue === '') {
    return;
  }
  updateSelectedMap(option, setImmediate);
  emit('changed', {
    selectedValue: selectedMapToArray(),
    // jumpValue: {},
  });
};

const emit = defineEmits(['changed']);
</script>

<style lang="scss" scoped>
@import '../../index.scss';
</style>
