import {
  ref
} from 'vue';
import router from '@/router/index.js'

const examId = ref(0);
const setTaskId = (id) => {
  examId.value = id;
};
const getTaskId = () => {
  if (router.currentRoute.value.query.id) {
    return router.currentRoute.value.query.id;
  }

  return examId.value;
};

export {
  setTaskId,
  getTaskId
}