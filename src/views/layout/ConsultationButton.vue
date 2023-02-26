<template>
  <el-link type="info" :underline="false" @click="getHelp">联系我们</el-link>
  <el-dialog
    class="consultation-dialog"
    :append-to-body="true"
    v-model="dialogVisible"
    :before-close="handleClose"
  >
    <div class="container">
      <div class="title">欢迎咨询</div>
      <el-form
        ref="formRef"
        :model="formInfo"
        :rules="rules"
        class="demo-dynamic"
      >
        <el-form-item prop="name">
          <el-input
            class="name"
            v-model="formInfo.name"
            :prefix-icon="User"
            placeholder="请输入您的姓名"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            class="phone"
            v-model="formInfo.phone"
            :prefix-icon="Iphone"
            placeholder="请输入您的手机号码"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <el-button class="comfirm-btn" type="primary" @click="comfirm">
        确定
      </el-button>
      <div class="tip">留下联系方式，稍后会有工作人员与您联系～</div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { submitFormData } from '@/api/system.js';
import { debounce } from '@/utils/index.js';
import { User, Iphone } from '@element-plus/icons-vue';

const dialogVisible = ref(false);
const formInfo = ref({
  name: '',
  phone: '',
});
const rules = ref({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系方式', trigger: 'blur' },
    {
      pattern: /(^((\+86)|(86))?(1[3-9])\d{9}$)|(^(0\d{2,3})-?(\d{7,8})$)/,
      message: '输入的手机号码格式不正确，请重新输入',
      trigger: 'blur',
    },
  ],
});
const formRef = ref(null);
const handleClose = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
};
const getHelp = () => {
  dialogVisible.value = true;
};
const comfirm = debounce(
  () => {
    formRef.value.validate((valid, fields) => {
      if (valid) {
        submitFormData(formInfo.value).then(() => {
          handleClose();
        });
      }
    });
  },
  500,
  true
);
</script>
<style lang="scss">
.consultation-dialog.el-dialog {
  width: 300px;
  border-radius: 20px;

  .el-dialog__header {
    margin-right: unset;
  }
}
</style>
<style lang="scss" scoped>
.el-link {
  color: #fff;
  &:hover {
    color: #fff;
  }
}

.consultation-dialog {
  .el-dialog__body {
    padding: 10px;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    .title {
      margin-bottom: 36px;
      width: 100%;
      line-height: 47px;
      font-size: 32px;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      text-align: center;
    }
    .el-input {
      width: 240px;
      height: 40px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 1);
    }
    .comfirm-btn {
      width: 240px;
      height: 36px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      background-color: var(--main-color);
      border-color: var(--main-color);
    }
    .tip {
      margin-top: 40px;
      width: 240px;
      font-size: 12px;
      font-weight: 400;
      color: #999;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>
