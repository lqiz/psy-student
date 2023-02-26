// 表单校验
const validateFrom = (instance) => {
  if (!instance) return Promise.resolve(false);
  return instance.value.validate((valid) => {
    return Promise.resolve(valid);
  });
}

// 表单还原
const resetFromFields = (instance) => {
  if (!instance) return;
  instance.value.resetFields();
}

// 表单清空
const clearFormField = (instance, props, defaultData) => {
  if (!instance) return;
  instance.value.clearValidate();
  updateFormData(props, defaultData);
}

// 赋值操作
const updateFormData = (target, source) => {
  for (let key in target) {
    target[key] = source[key] ?? '';
  }
}

export {
  validateFrom,
  resetFromFields,
  clearFormField,
  updateFormData
}