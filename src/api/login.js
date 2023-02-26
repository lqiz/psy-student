import * as http from '@/utils/http';
// ================ 用户名登录
export function userLogin(data) {
	return http.post('/api/user/login', data)
}

// ================ 登录退出接口
export function userLogout() {
	return http.post('/api/user/logout');
}
