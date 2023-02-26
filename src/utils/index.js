/**
 * 防抖
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 * @returns
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result;

	const later = function () {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp;
		// 上次被包装函数被调用时间间隔last小于设定时间间隔wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			}
		}
	};

	return function (...args) {
		context = this;
		timestamp = +new Date();
		const callNow = immediate && !timeout;
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}
		return result;
	};
}

export function formatDate(date) {
	let date1 = new Date(date);
	let YY = date1.getFullYear() + '-';
	let MM =
		(date1.getMonth() + 1 < 10
			? '0' + (date1.getMonth() + 1)
			: date1.getMonth() + 1) + '-';
	let DD = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate();
	let hh =
		(date1.getHours() < 10 ? '0' + date1.getHours() : date1.getHours()) + ':';
	let mm =
		(date1.getMinutes() < 10 ? '0' + date1.getMinutes() : date1.getMinutes()) +
		':';
	let ss =
		date1.getSeconds() < 10 ? '0' + date1.getSeconds() : date1.getSeconds();
	return YY + MM + DD + ' ' + hh + mm + ss;
}

/**
 * 节流函数
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
export function throttle(func, wait, options) {
	let context, args, result;
	let timeout = null;
	// 之前的时间戳
	let previous = 0;
	// 如果 options 没传则设为空对象
	if (!options) options = {};
	// 定时器回调函数
	let later = function () {
		// 如果设置了 leading，就将 previous 设为 0
		// 用于下面函数的第一个 if 判断
		previous = options.leading === false ? 0 : +new Date();
		// 置空一是为了防止内存泄漏，二是为了下面的定时器判断
		timeout = null;
		result = func.apply(context, args);
		if (!timeout) context = args = null;
	};
	return function () {
		// 获得当前时间戳
		let now = +new Date();
		if (!previous && options.leading === false) previous = now;
		// 计算剩余时间
		let remaining = wait - (now - previous);
		context = this;
		args = arguments;
		if (remaining <= 0 || remaining > wait) {
			// 如果存在定时器就清理掉否则会调用二次回调
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			previous = now;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		} else if (!timeout && options.trailing !== false) {
			// 判断是否设置了定时器和 trailing
			timeout = setTimeout(later, remaining);
		}
		return result;
	};
}
