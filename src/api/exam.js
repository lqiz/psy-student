import * as http from '@/utils/http';
// ================ 获取当前任务状态
export function getTaskStatus() {
  return http.post('/api/student/dashboard/index')
}

// ================ 获取试卷详情
export function getTestDetail(id) {
  return http.post(`/api/student/exam/paper/select/${id}`);
}

// ================ 提交试卷
export function postTestResult(data) {
  return http.post('/api/student/exampaper/answer/answerSubmit', data);
}

// ================ 获取试卷结果
export function getTestResult(id) {
  return http.post(`/api/student/exampaper/answer/read/${id}`);
}