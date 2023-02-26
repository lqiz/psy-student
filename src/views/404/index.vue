<template>
	<main class="page-404-main">
		<div class="page-404-container">
			<div class="pic-404">
				<img class="pic-404__parent" src="@/assets/images/404.png" alt="404" />
				<img
					class="pic-404__child left"
					src="@/assets/images/404_cloud.png"
					alt="404"
				/>
				<img
					class="pic-404__child mid"
					src="@/assets/images/404_cloud.png"
					alt="404"
				/>
			</div>
			<div class="bullshit">
				<div class="bullshit__oops">哎哟!</div>
				<div class="bullshit__headline">页面走丢了...</div>
				<div class="bullshit__info">请确认访问地址无误</div>
				<span @click="jumpToHome" class="bullshit__return-home">返回首页</span>
			</div>
		</div>
	</main>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const jumpToHome = () => {
	router.push({
		name: 'home',
	});
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
