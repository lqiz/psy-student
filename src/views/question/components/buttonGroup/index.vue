<template>
  <div class="button-container">
    <div v-if="questionIndex !== 0" class="btn pre" @click="preQuestion">
      上一题
    </div>
    <div
      v-if="nextBtnVisible"
      :class="['btn next', nextBtnDisabled ? 'disabled' : '']"
      @click="nextQuestion"
    >
      下一题
    </div>
    <div
      v-if="submitQuestionBtnVisible"
      class="btn next"
      @click="submitQuestion"
    >
      提交试题
    </div>
    <div
      v-if="completeBtnVisible"
      :class="['btn next', btnDisabled ? 'disabled' : '']"
      @click="submit"
    >
      完成测试
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  questionIndex: {
    type: [String, Number],
    default: 0,
  },
  currentQuestion: {
    type: Object,
    default: () => ({}),
  },
  questionList: {
    type: Array,
    default: () => [],
  },
  selectedOptions: {
    type: Array,
    default: () => [],
  },
  finishedQuestionStack: {
    type: Array,
    default: () => [],
  },
});

// 提交试卷按钮是否可以点击
const btnDisabled = computed(() => {
  return props.selectedOptions.length === 0;
});

// 下一题按钮是否可以点击
const nextBtnDisabled = computed(() => {
  return !props.currentQuestion.isAnswer;
});

// 是否展示下一题按钮
const nextBtnVisible = computed(() => {
  if (submitQuestionBtnVisible.value) return false;
  return props.questionIndex !== props.questionList.length - 1;
});

// 是否展示提交试卷按钮
const completeBtnVisible = computed(() => {
  return props.questionIndex === props.questionList.length - 1;
});

// 是否展示提交试题按钮
const submitQuestionBtnVisible = computed(() => {
  return (
    props.selectedOptions.length > 0 &&
    props.questionIndex !== props.questionList.length - 1
  );
});

// 获取上一个试题
const getPreviousQuestion = () => {
  const current = props.finishedQuestionStack.pop();
  if (props.finishedQuestionStack.length === 0) {
    return 0;
  }
  const index = props.questionList.findIndex((ques) => ques.id === current.id);
  return index === -1 ? 0 : index;
};

// 获取下一个试题
const getLastQuestion = () => {
  // 不存在跳转的情况
  if (props.currentQuestion.target.length === 0) return props.questionIndex + 1;

  // 存在跳转的情况
  const jumpValue = props.currentQuestion.jumpValue;
  const nextIndex = props.questionList.findIndex(
    (ques) => ques.id == jumpValue
  );
  return nextIndex > -1 ? nextIndex : props.questionIndex + 1;
};

// 提交试题
const submitQuestion = () => {
  emits('submitQuestion');
};

// 上一题
const preQuestion = () => {
  const index = getPreviousQuestion();
  emits('preQuestion', index);
};

// 下一题
const nextQuestion = () => {
  if (nextBtnDisabled.value) return;
  const index = getLastQuestion();
  emits('nextQuestion', index);
};

// 完成
const submit = () => {
  emits('submitPaper');
};

const emits = defineEmits([
  'preQuestion',
  'nextQuestion',
  'submitPaper',
  'submitQuestion',
]);
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
