// 校验非空
export function validateNotNull(msg) {
	let validator = (rule, value, callback) => {
		if (value === '' || value == null) {
			callback(new Error(msg || '不能为空'))
		} else {
			callback()
		}
	}
	return validator
}
// 校验经纬度 经度 [-180, 180] 纬度 [-90, 90]  格式 `${经度},${纬度}`
export function validateLogLat(msg) {
	let validator = (rule, value, callback) => {
		if (!value) {
			callback(new Error(msg || '格式有误'))
			return
		}
		if (value.indexOf(',') == -1) {
			callback(new Error(msg || '格式有误'))
		}
		let loglat = value.split(',')
		let longitude = loglat[0]
		let latitude = loglat[1]
		let numReg = new RegExp(/^(\-)?\d+(\.\d+)?$/)
		if (numReg.test(longitude) || numReg.test(latitude)) {
			if (
				Number(longitude) >= -180 &&
				Number(longitude) <= 180 &&
				Number(latitude) >= -90 &&
				Number(latitude) <= 90
			) {
				callback()
			} else {
				callback(new Error(msg || '格式有误'))
			}
		} else {
			callback(new Error(msg || '格式有误'))
		}
	}
	return validator
}

// 非负数
export function validateNonNegative(msg) {
	let numReg = new RegExp(/^\d+(\.\d+)?$/)
	let validator = (rule, value, callback) => {
		if (numReg.test(value)) {
			callback()
		} else {
			callback(new Error(msg || '格式有误'))
		}
	}
	return validator
}