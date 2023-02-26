import axios from 'axios';
import qs from 'qs';
import { uuid } from 'vue-uuid';
import router from '@/router/index.js'


// import config from '../config';

const config = {}

axios.defaults.timeout = config.timeout;
axios.defaults.baseURL = config.baseUrl;

let cancel,
	promiseArr = {};
const CancelToken = axios.CancelToken;
axios.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//http request 拦截器
axios.interceptors.request.use(
	(config) => {
		config.headers['Trace-Id'] = uuid.v1();
		if (sessionStorage.token) {
			config.headers.Authorization = sessionStorage.token;
			config.headers['token'] = sessionStorage.token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

//http response 拦截器
axios.interceptors.response.use(
	(response) => {
		if (response.data.code === 401 || response.data.code === 502) {
			router.push({
				name: 'login',
			});
		}

		return Promise.resolve(response.data);
	},
	(error) => {
		console.log(error);
		return Promise.reject(error?.response?.data || '连接超时');
	}
);

function filterParams(obj) {
	let _newPar = {};
	for (let key in obj) {
		//如果对象属性的值不为空，就保存该属性（如果属性的值为0，保存该属性。如果属性的值全部是空格，属于为空。
		if (
			(obj[key] === 0 || obj[key] === false || obj[key]) &&
			obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== ''
		) {
			_newPar[key] = obj[key];
		}
	}
	return _newPar;
}
// 如果对象属性的值不为空或者不为Null则保存
function filterEmpty(obj) {
	let _newPar = {};
	for (let key in obj) {
		if (obj[key] !== null && obj[key] !== '') {
			_newPar[key] = obj[key];
		}
	}
	return _newPar;
}
/****get****/
export function get(url, params = {}, noCancel) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'get',
			url: url,
			params: filterParams(params),
			headers: {
				// 请求头
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			// timeout: requestConfig.timeout || 15000,
			cancelToken: noCancel
				? ''
				: new CancelToken((c) => {
						cancel = c;
				  }),
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/****post****/
export function post(url, data = {}, noCancel, utils) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'post',
			url: url,
			data: data,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
			...utils,
			cancelToken: noCancel
				? ''
				: new CancelToken((c) => {
						cancel = c;
				  }),
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/****encodedRequest****/
export function encodedRequest(url, params = {}, noCancel, utils) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: url,
			data: qs.stringify(filterEmpty(params)),
			headers: {
				// 请求头
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			...utils,
			cancelToken: noCancel
				? ''
				: new CancelToken((c) => {
						cancel = c;
				  }),
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

/****put****/
export function put(url, data = {}, noCancel) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'put',
			url: url,
			data: data,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
			cancelToken: noCancel
				? ''
				: new CancelToken((c) => {
						cancel = c;
				  }),
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

export function deleteRequest(url, params = {}, noCancel) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'delete',
			url: url,
			params: filterParams(params),
			paramsSerializer: (params) => {
				return qs.stringify(params, { indices: false });
			},
			headers: {
				// 请求头
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			cancelToken: noCancel
				? ''
				: new CancelToken((c) => {
						cancel = c;
				  }),
		})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				reject(err);
			});
	});
}

export function jsonp(url) {
	if (!url) {
		return;
	}
	return new Promise((resolve) => {
		window.jsonCallBack = (result) => {
			resolve(result);
		};
		let JSONP = document.createElement('script');
		JSONP.type = 'text/javascript';
		JSONP.src = `${url}&callback=jsonCallBack`;
		document.getElementsByTagName('head')[0].appendChild(JSONP);
		setTimeout(() => {
			document.getElementsByTagName('head')[0].removeChild(JSONP);
		}, 500);
	});
}

export default {
	GET: get,
	POST: post,
	PUT: put,
	DELETE: deleteRequest,
	JSONP: jsonp,
	FORM: encodedRequest,
};
