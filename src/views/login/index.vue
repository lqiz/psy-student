<template>
  <main class="login-main">
    <div class="login-card">
      <div class="title">青少年在线心理测评系统</div>
      <PwdForm ref="pwdForm" :form-data="loginForm" />
      <el-button class="login-btn" type="primary" @click="login">
        登录
      </el-button>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive } from 'vue';
import PwdForm from './pwdForm.vue';
import { ElMessage } from 'element-plus';
import { userLogin } from '@/api/login.js';
import { debounce } from '@/utils/index.js';
import { useRouter } from 'vue-router';

const loginForm = reactive({
  username: '',
  password: '',
  phone: '',
  verifyCode: '',
});

const pwdForm = ref(null);
const router = useRouter();

const login = debounce(async function () {
  try {
    let res = await pwdForm.value.validate();
    if (!res) return;
    const data = await userLogin({
      userName: loginForm.username,
      password: loginForm.password,
    });

    const { response, code, message } = data;
    if (code === 1) {
      sessionStorage.setItem('token', response.token);
      router.push({ name: 'home' });
    } else {
      ElMessage({
        type: 'error',
        message: message,
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '登录失败',
    });
    console.log('登录失败', error);
  }
});
</script>

<style lang="scss" scoped>
@import '@/style/variable.scss';
.login-main {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - $footerHeight);
  height: 100%;
  box-sizing: border-box;
}
.login-card {
  padding: 30px 40px;
  width: 100%;
  max-width: var(--max-width);
  background: #ffffff;
  border-radius: 20px;
  box-sizing: border-box;
  box-shadow: $boxShadow;

  .title {
    padding-bottom: 30px;
    font-size: 24px;
    font-weight: bold;
    color: #4f525b;
    line-height: 31px;
    text-align: center;
  }
  .login-btn {
    margin-top: 20px;
    width: 100%;
    height: 48px;
    font-size: 16px;
    background: var(--main-color);
    border-color: var(--main-color);
    border-radius: 12px;
  }
}
</style>
