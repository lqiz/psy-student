
import * as http from '@/utils/http';
// ================ 申请联系我们
export function submitFormData(params) {
  return http.post('/api/user/request', params)
}
