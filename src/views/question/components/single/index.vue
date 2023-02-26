<template>
  <div class="question-container">
    <div class="question-title">{{ question.title }}</div>
    <div class="question-items">
      <div v-for="option in questionOptions" :key="option.id">
        <div
          :class="['question-item', option.selected ? 'is-selected' : '']"
          @click="choice(option)"
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
          placeholder="请输入"
          maxlength="500"
          show-word-limit
          @input="inputChanged(option)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
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

// 高亮展示当前选中项
const highlineSelected = (option, value = true) => {
  props.questionOptions.forEach((option) => (option.selected = false));
  option.selected = value;
};

// 计算跳转选项
const initJumpValue = (prefix) => {
  if (props.question.target.length === 0) return '';
  const { targetQuestionId = '' } =
    props.question.target.find((item) => item.prefix === prefix) || {};
  return targetQuestionId;
};

// 不可输入类型
const choice = (option) => {
  if (option.inputTag === 1 && option.inputValue === '') return;
  highlineSelected(option);
  const selectedValue = [option.originData.prefix, ''];
  emit('changed', {
    selectedValue: [selectedValue],
    jumpValue: initJumpValue(option.originData.prefix),
  });
};

// 可输入类型
const inputChanged = (option) => {
  if (option.inputValue == '') {
    clearInputChanged(option);
    return;
  }
  highlineSelected(option);
  const selectedValue = [option.originData.prefix, option.inputValue];
  emit('changed', {
    selectedValue: [selectedValue],
    jumpValue: initJumpValue(option.originData.prefix),
  });
};

// 输入类型因清空输入内容还原选中
const clearInputChanged = (option) => {
  highlineSelected(option, false);
  emit('changed', {
    selectedValue: [],
    jumpValue: '',
  });
};

const emit = defineEmits(['changed']);
</script>

<style lang="scss" scoped>
@import '../../index.scss';
</style>
