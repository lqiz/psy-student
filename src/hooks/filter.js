const paramsFilter = (searchFormData) => {
	return Object.entries(searchFormData).reduce((pre, curr) => {
		const [k, v] = curr;
		if (v === 0 || v) {
			pre[k] = v;
		}
		return pre;
	}, {});
};

export { paramsFilter };
