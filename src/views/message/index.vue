<template>
  <main class="message-main">
    <div class="result-box">
      <div class="result-title">谢谢您的参与！</div>
      <div class="result-content">
        <div class="result-item" v-for="block in resultInfo" :key="block.name">
          <template v-if="block.assessCriteria.length > 0 && !isEmptyList(block.questionItems)">
            <el-divider></el-divider>
            <div class="blod">{{ block.name }}</div>
            <div><span class="blod">分数：</span>{{ block.score }}分</div>
            <div>
              <span class="blod">结果：</span>{{ block.comment || '--' }}
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="back-btn" @click="backToHome">回到首页</div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { getTestResult } from '@/api/exam.js';
import { ref } from 'vue';
import { getTaskId } from '@/hooks/store.js';

const isEmptyList = (questionItems) => {
  const newQuestionList = questionItems.filter((ques) => {
    return !ques.leaveOut && [1, 6].includes(ques.questionType);
  });
  return newQuestionList.length === 0;
};
const resultInfo = ref([]);
const getResult = () => {
  const id = getTaskId();
  getTestResult(id)
    .then((res) => {
      resultInfo.value = res.response?.paper.titleItems;
    })
    .catch((err) => {
      resultInfo.value = [];
      console.log('获取结果失败：', err);
    });
};
getResult();

const router = useRouter();
const backToHome = () => {
  router.push({
    name: 'home',
  });
};
</script>

<style lang="scss" scope>
@import '@/style/variable.scss';

.message-main {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - $footerHeight);
  height: 100%;
  box-sizing: border-box;

  .result-box {
    padding: 20px;
    width: 100%;
    max-width: var(--max-width);
    height: 100%;
    background: #fff;
    border-radius: 10px;
    box-shadow: $boxShadow;
    box-sizing: border-box;
  }
  .result-title {
    padding-bottom: 20px;
    max-width: var(--max-width);
    font-size: 28px;
    line-height: 40px;
    text-align: center;
    font-weight: 700;
  }
  .result-content {
    font-size: 14px;
    line-height: 30px;
    .blod {
      font-weight: bold;
    }
    .el-divider--horizontal {
      margin: 18px 0;
    }
    .el-divider__text {
      font-weight: bold;
    }
  }
  .back-btn {
    margin-top: 20px;
    width: 100%;
    max-width: var(--max-width);
    height: 50px;
    border-radius: 25px;
    background: var(--main-color);
    text-align: center;
    line-height: 50px;
    font-size: 18px;
    color: #fff;
    font-weight: 500;
    cursor: pointer;
    box-shadow: $boxShadow;

    &:hover {
      box-shadow: $boxShadowHover;
    }
  }
}
</style>
