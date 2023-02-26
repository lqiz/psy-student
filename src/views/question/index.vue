<template>
  <main class="question-main">
    <div class="title">{{ examName }}</div>
    <Progress :steps="steps" :currentProgress="currentProgress" />
    <div class="block-des">{{ blockDescription }}</div>

    <component
      :is="getComponent(currentQuestion.questionType)"
      :question="currentQuestion"
      :questionOptions="questionOptions"
      @changed="questionAnswerChanged"
    ></component>

    <ButtonGroup
      :finishedQuestionStack="finishedQuestionStack"
      :selectedOptions="selectedOptions"
      :questionIndex="currentQuestionIndex"
      :currentQuestion="currentQuestion"
      :questionList="questionList"
      @preQuestion="preQuestion"
      @nextQuestion="nextQuestion"
      @submitQuestion="submitQuestion"
      @submitPaper="submitPaper"
    />
  </main>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getTestDetail, getTestResult, postTestResult } from '@/api/exam.js';
import { onMounted, ref, computed, toRef } from 'vue';
import { getTaskId } from '@/hooks/store.js';
import Progress from './components/progress/index.vue';
import ButtonGroup from './components/buttonGroup/index.vue';
import Answer from './components/answer/index.vue';
import Multiple from './components/multiple/index.vue';
import Single from './components/single/index.vue';

let startTime = +new Date();
// 试卷名
const examName = computed(() => {
  return paperInfo.value.name ?? '';
});

// 试卷详情
const paperInfo = ref({});
const getPaperInfo = () => {
  const id = getTaskId();
  getTestDetail(id)
    .then((res) => {
      paperInfo.value = res.response;
      initQuestionList(res.response.titleItems);

      const tag = route.query.tag;
      if (tag !== 'new') {
        getResult(true);
      } else {
        initCurrentQuestion(true);
        initSteps(paperInfo.value.titleItems);
      }
    })
    .catch((err) => {
      console.log('获取试卷详情失败：', err);
    });
};
// 答卷详情
const resultInfo = ref([]);
const getResult = (isFirst) => {
  const id = getTaskId();
  getTestResult(id)
    .then((res) => {
      resultInfo.value = res.response;
      updateHasAnsweredQuestion();
      initCurrentQuestion(isFirst);
      initSteps(paperInfo.value.titleItems);
    })
    .catch((err) => {
      resultInfo.value = [];
      console.log('获取结果失败：', err);
    });
};

const questionList = ref([]);
const questionMap = new Map();
// 初始化试题列表
const initQuestionList = (arr) => {
  const list = [];
  arr.forEach((item, i) => {
    item.questionItems.forEach((ques) => {
      ques.pindex = i;
      ques.isAnswer = false;
      ques.contentArray = ques.contentArray ?? [];
      ques.jumpValue = '';
      list.push(ques);
      questionMap.set(ques.id, ques);
    });
  });
  questionList.value = list;
};

// 更新已经答完的试题
const updateHasAnsweredQuestion = () => {
  resultInfo.value.answer?.answerItems.forEach((question) => {
    const ques = questionMap.get(question.questionId);
    if (ques) {
      // 计算已作答试题的跳转
      const prefix = question.contentArray[0][0];
      ques.jumpValue = initJumpValue(prefix, ques);
      ques.isAnswer = true;
      ques.contentArray = question.contentArray;
    }
  });
};

// 计算跳转目标值id
const initJumpValue = (prefix, question) => {
  if (question.target.length === 0) return '';
  const { targetQuestionId = '' } =
    question.target.find((item) => item.prefix === prefix) || {};
  return targetQuestionId;
};

const steps = ref([]);
const currentProgress = ref(0);
const blockDescription = ref('');
const initSteps = (arr) => {
  const step = 3;
  const pindex = currentQuestion.value.pindex;
  const list = arr.map((item, i) => {
    const total = item.questionItems.length;
    const finishedQuestion = item.questionItems.filter((ques) => ques.isAnswer);
    const selected = i === pindex;
    if (selected) {
      currentProgress.value = (finishedQuestion.length / total) * 100;
      blockDescription.value = item.blockDescription;
    }
    return {
      index: i + 1,
      id: i,
      name: item.name,
      total,
      finishedTotal: finishedQuestion.length,
      selected,
    };
  });

  // 份数(三个题块是一份)
  let buckets =
    list.length % step === 0
      ? list.length / step
      : Math.floor(list.length / step) + 1;
  let bucketIndex = Math.floor(pindex / step);

  // 只有一个篮子直接返回全部，多个篮子且是最后一个篮子从后往前截取3个，否则顺位截取3个
  if (buckets <= 1) {
    steps.value = list;
  } else if (bucketIndex + 1 === buckets) {
    steps.value = list.slice(list.length - 3);
  } else {
    steps.value = list.slice(bucketIndex * 3, bucketIndex * 3 + 3);
  }
};

const currentQuestion = ref({});
const currentQuestionIndex = ref(0);
// 计算首次进入页面的试题
const initCurrentQuestion = (isFirst) => {
  if (isFirst) {
    currentQuestionIndex.value = findLastQuestion();
  }
  currentQuestion.value = questionList.value[currentQuestionIndex.value];
  initQuestionOptions(currentQuestion.value.contentArray);
};

const finishedQuestionStack = ref([]);
const findLastQuestion = () => {
  let index = 0;
  if (questionList.value.length === 0) {
    finishedQuestionStack.value = [];
    return index;
  };

  let current = questionList.value[0];
  while (current.isAnswer) {
    finishedQuestionStack.value.push(current)
    if (current.target.length > 0) {
      const prefix = current.contentArray[0][0];
      const id = initJumpValue(prefix, current);
      const i = questionList.value.findIndex((v) => v.id === id);
      if (i === -1) {
        index++;
      } else {
        index = i;
      }
    } else {
      index++;
    }
    if (index >= questionList.value.length) {
      return index - 1;
    }
    current = questionList.value[index];
  }
  return index;
};

const questionOptions = ref([]);
const initQuestionOptions = (contentArray) => {
  questionOptions.value = currentQuestion.value.items.map((item, i) => {
    const [prefix = '', content = ''] =
      contentArray.find((val) => val[0] === item.prefix) || [];
    const selected = prefix === item.prefix;
    return {
      id: i,
      content: item.content,
      selected,
      inputTag: item.inputTag,
      originData: item,
      inputValue: content,
    };
  });
};

// 获取当前试题组件
const getComponent = (type) => {
  switch (type) {
    // 单选、量表题型
    case 1:
    case 6:
      return Single;
    // 多选题型
    case 2:
      return Multiple;
    // 简答题型
    case 5:
      return Answer;
  }
};

// 选择的选项
let selectedOptions = ref([]);
let jumpValue = ref('');
// 选项的改变
const questionAnswerChanged = (val) => {
  if (val.jumpValue) jumpValue.value = val.jumpValue;
  selectedOptions.value = val.selectedValue;
  // 更新选中状态
  const id = currentQuestion.value.id;
  const ques = questionMap.get(id);
  // ques.isAnswer = true;
  ques.jumpValue = jumpValue.value;
};

// 上一题
const preQuestion = (index) => {
  clearSelected();
  startTime = +new Date();
  currentQuestionIndex.value = index;
  changeQuestion();
};

// 下一题
const nextQuestion = (index, jumpId) => {
  finishedQuestionStack.value.push(currentQuestion.value);
  startTime = +new Date();
  if (jumpId) {
    const targetIndex = questionList.value.findIndex(
      (item) => item.id === jumpId
    );
    currentQuestionIndex.value = targetIndex || currentQuestionIndex.value + 1;
  } else {
    currentQuestionIndex.value = index ?? currentQuestionIndex.value + 1;
  }
  clearSelected();
  changeQuestion();
};

// 清除选中状态
const clearSelected = () => {
  selectedOptions.value = [];
  jumpValue.value = '';
};

// 更新切换的试题
const changeQuestion = () => {
  currentQuestion.value = questionList.value[currentQuestionIndex.value];
  initQuestionOptions(currentQuestion.value.contentArray);
  initSteps(paperInfo.value.titleItems);
};

// 提交试题
const submitQuestion = async () => {
  const endTime = +new Date();
  const res = await postTestResult({
    questionId: currentQuestion.value.id,
    doTime: (endTime - startTime) / 1000,
    answerItems: [
      {
        questionId: currentQuestion.value.id,
        contentArray: selectedOptions.value,
        completed: true,
        itemOrder: currentQuestion.value.itemOrder,
      },
    ],
    finish: false,
    id: getTaskId(),
  });

  if (res.code === 1) {
    router.replace({
      query: { ...route.query, tag: 'goon' },
    });
    if (currentQuestionIndex.value < questionList.value.length - 1) {
      nextQuestion(null, jumpValue.value);
    }
    getResult();
  } else {
    ElMessage({
      type: 'error',
      message: res.message,
    });
  }
};

const router = useRouter();
const route = useRoute();

// 提交试卷
const submitPaper = () => {
  postTestResult({
    questionId: currentQuestion.value.id,
    doTime: 1,
    answerItems: [
      {
        questionId: currentQuestion.value.id,
        contentArray: selectedOptions.value,
        completed: true,
        itemOrder: currentQuestion.value.itemOrder,
      },
    ],
    finish: true,
    id: getTaskId(),
  }).then((res) => {
    if (res.code === 1) {
      router.push({
        name: 'message',
        query: {
          id: getTaskId(),
        },
      });
    } else {
      ElMessage({
        type: 'error',
        message: res.message,
      });
    }
  });
};

onMounted(() => {
  getPaperInfo();
});
</script>

<style lang="scss" scope>
@import './index.scss';
</style>
