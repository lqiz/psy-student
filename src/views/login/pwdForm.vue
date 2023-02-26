<template>
	<el-form
		class="login-form"
		ref="loginForm"
		:label-position="labelPosition"
		:model="formData"
		:rules="formRules"
	>
		<el-form-item label="用户名" prop="username">
			<el-input
				v-model="formData.username"
				autocomplete="off"
				placeholder="请输入用户名"
				:suffix-icon="User"
			/>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input
				v-model="formData.password"
				type="password"
				autocomplete="off"
				placeholder="请输入密码"
				:show-password="true"
			/>
		</el-form-item>
	</el-form>
</template>
<script setup>
import { ref, reactive } from 'vue';
import { User } from '@element-plus/icons-vue';
import { validateFrom } from '@/hooks/form.js';

const props = defineProps({
	formData: {
		type: Object,
		default: () => ({}),
	},
});
const labelPosition = ref('top');
const formRules = reactive({
	username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const loginForm = ref(null);
// 表单校验
const validate = () => validateFrom(loginForm);
defineExpose({
	validate,
});
</script>
<style lang="scss" scoped>
.login-form {
	:deep(.el-form-item__label) {
		font-size: 14px;
	}
	.el-input {
		width: 100%;
		height: 40px;
		background: rgba(194, 194, 194, 0.2);
		border-radius: 4px;
		:deep(.el-icon) {
			font-size: 18px;
			cursor: pointer;
		}
	}
}
</style>
