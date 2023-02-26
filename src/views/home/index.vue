<template>
  <main class="home-main">
    <template v-if="!isEmpty">
      <div class="title">{{ examName }}</div>
      <div class="question-total">
        <img src="@/assets/images/question-icon.png" alt="" srcset="" />
        <div class="tip">测试共计{{ examQuesTotal }}题</div>
      </div>
      <div class="btn-group">
        <div v-if="startBtnVisible" class="start-btn" @click="start">
          {{ btnName }}
        </div>
        <div v-if="previewBtnVisible" class="preview-btn" @click="preview">
          查看上次测试结果
        </div>
      </div>
      <div class="description">
        <p class="description-title">
          <img src="@/assets/images/wing-l.png" alt="" />
          <span>测试说明</span>
          <img src="@/assets/images/wing-r.png" alt="" />
        </p>
        <div class="description-content">{{ examDescription }}</div>
      </div>
    </template>
    <div v-else class="empty">
      <img src="@/assets/images/empty.png" alt="" />
      <span>没有任何测评任务！</span>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getTaskStatus, getTestDetail } from '@/api/exam.js';
import { ref, computed, toRef } from 'vue';
import { setTaskId, getTaskId } from '@/hooks/store.js';

const btnName = ref('开始测试');
const startType = ref('new');
const previewBtnVisible = ref(false);
const startBtnVisible = ref(false);
let finishedPaperTaskId = '';
const examDescription = ref('');
const isEmpty = ref(false);
const getStatus = () => {
  getTaskStatus()
    .then((res) => {
      const {
        finishedPaper = [],
        inExamPaper = [],
        waitExamPaper = [],
      } = res.response;
      if (
        !finishedPaper.length &&
        !waitExamPaper.length &&
        !inExamPaper.length
      ) {
        // 啥都没有的情况
        isEmpty.value = true;
        return;
      } else if (
        finishedPaper.length &&
        !waitExamPaper.length &&
        !inExamPaper.length
      ) {
        examDescription.value = finishedPaper[0].description;
        setTaskId(finishedPaper[0].id);
      } else if (inExamPaper.length) {
        setTaskId(inExamPaper[0].id);
        examDescription.value = inExamPaper[0].description;
        btnName.value = '继续测试';
        startType.value = 'goon';
      } else if (waitExamPaper.length) {
        setTaskId(waitExamPaper[0].id);
        examDescription.value = waitExamPaper[0].description;
        btnName.value = '开始测试';
        startType.value = 'new';
      }
      isEmpty.value = false;

      finishedPaperTaskId = finishedPaper[0]?.id;
      previewBtnVisible.value = !!finishedPaper.length;
      startBtnVisible.value = !!inExamPaper.length || !!waitExamPaper.length;

      getPaperInfo();
    })
    .catch((err) => {
      console.log('获取试卷状态失败：', err);
    });
};
getStatus();

const paperInfo = ref({});
const getPaperInfo = () => {
  const id = getTaskId();
  getTestDetail(id)
    .then((res) => {
      paperInfo.value = res.response;
    })
    .catch((err) => {
      console.log('获取试卷详情失败：', err);
    });
};

const examName = computed(() => {
  return paperInfo.value.name ?? '';
});
const examQuesTotal = computed(() => {
  let total = 0;
  const titleItems = toRef(paperInfo.value, 'titleItems');
  titleItems.value?.forEach((element) => {
    total += element.questionItems.length;
  });
  return total;
});

const router = useRouter();

const start = () => {
  router.push({
    name: 'question',
    query: {
      id: paperInfo.value.id,
      tag: startType.value,
    },
  });
};
const preview = () => {
  router.push({
    name: 'message',
    query: {
      id: finishedPaperTaskId,
    },
  });
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
