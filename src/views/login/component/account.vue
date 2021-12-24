<template>
	<el-form ref="loginFormRef" :model="state.loginForm" :rules="state.rules" class="login-content-form">
		<el-form-item>
			<el-input
				type="text"
				:placeholder="$t('message.account.accountPlaceholder1')"
				prefix-icon="el-icon-user"
				v-model="state.loginForm.username"
				clearable
				autocomplete="off"
			>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')"
				prefix-icon="el-icon-lock"
				v-model="state.loginForm.password"
				autocomplete="off"
			>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-row :gutter="15">
				<el-col :span="16">
					<el-input
						type="text"
						maxlength="6"
						:placeholder="$t('message.account.accountPlaceholder3')"
						prefix-icon="el-icon-position"
						v-model="state.loginForm.captcha"
						clearable
						autocomplete="off"
					></el-input>
				</el-col>
				<el-col :span="8">
					<div class="login-content-code">
						<img
								class="login-content-code-img"
								@click="getCaptcha"
								width="130px"
								height="40px"
								:src="state.captchaImage"
								style="cursor: pointer"
						/>
					</div>
				</el-col>
			</el-row>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" class="login-content-submit" round @click="openVerify" :loading="state.loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>

	<el-dialog v-model="state.dialogVerifyVisible" title="旋转验证码" width="300px" center>
		<DragVerifyImgRotate
				:imgsrc="state.imgThree"
				v-model:isPassing="state.isPassingFour"

				text="请按住滑块拖动"
				successText="验证通过"
				handlerIcon="el-icon-d-arrow-right"
				successIcon="el-icon-circle-check"
				@passcallback="passVerify"
		/>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted,ref, reactive, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes,initBackEndControlRoutes } from '/@/router/index';
import { useStore } from '/@/store/index';
import { Session } from '/@/utils/storage';
import { captcha,signIn } from '/@/api/login/index';
import { formatAxis } from '/@/utils/formatTime';
import { letterAvatar } from '/@/utils/string';
// 旋转图片滑块组件
import DragVerifyImgRotate from '/@/components/dragVerify/dragVerifyImgRotate.vue';

const { t } = useI18n();
const { proxy } = getCurrentInstance() as any;
const loginFormRef: any = ref(null);
const store = useStore();
const route = useRoute();
const router = useRouter();
const state = reactive({
	dialogVerifyVisible: false,
	isPassingFour: false,
	imgThree: 'https://img1.baidu.com/it/u=2813520958,2218166536&fm=26&fmt=auto&gp=0.jpg',
	captchaImage: '',
	loginForm: {
		username: 'admin',
		password: '123456',
		captcha: '',
		captchaId: '',
	},
	rules: {
		username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
		password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
		captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
	},
	isShowPassword: false,
	loading: {
		signIn: false,
	},
});
onMounted(() => {
	getCaptcha();
});


const getCaptcha = async () => {
	let res: any = await captcha();
	state.captchaImage = res.base64Captcha;
	state.loginForm.captchaId = res.captchaId;
};

// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date());
});
// 校验登录表单并登录
const login = () => {
	loginFormRef.value.validate((valid: boolean) => {
		if (valid) {
			onSignIn();
		} else {
			return false;
		}
	});
};
// 登录
const onSignIn = async () => {
	state.loading.signIn = true;
	let loginRespon;
	try {
		loginRespon = await signIn(state.loginForm)
	} catch (e) {
		console.log(loginRespon)
		state.isPassingFour = false;
		state.loading.signIn = false;
		state.loginForm.captcha = '';
		getCaptcha();
		return;
	}
	let loginRes = loginRespon.data
	Session.set('token', loginRes.token);
	Session.set('menus', loginRes.menus);
	let perms = loginRes.permissions
	perms.push('base')
	// 用户信息
	const userInfos = {
		username: loginRes.user.username,
		userId: loginRes.user.userId,
		roleId: loginRes.user.roleId,
		deptId: loginRes.user.deptId,
		postId: loginRes.user.postId,
		// 头像
		photo: loginRes.user.avatar || letterAvatar(loginRes.user.username),
		time: new Date().getTime(),
		authBtnList: perms,
		authPageList: perms,
		lastLoginTime: new Date().getTime(),
		lastLoginIp: '127.0.0.1',
	};
	// 存储用户信息到浏览器缓存
	Session.set('userInfo', userInfos);
	// 1、请注意执行顺序(存储用户信息到vuex)
	await store.dispatch('userInfos/setUserInfos', userInfos);
	if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
		// 前端控制路由，2、请注意执行顺序
		await initFrontEndControlRoutes();
		signInSuccess();
	} else {
		// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
		// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
		await initBackEndControlRoutes();
		// 执行完 initBackEndControlRoutes，再执行 signInSuccess
		signInSuccess();
	}
};
const openVerify = () => {
	state.dialogVerifyVisible = true
}
const passVerify = () => {
	state.dialogVerifyVisible = false
	console.log("通过滑块验证")
	state.isPassingFour = false
	login()

}

// 登录成功后的跳转
const signInSuccess = () => {
	// 初始化登录成功时间问候语
	let currentTimeInfo = currentTime.value;
	// 登录成功，跳到转首页
	// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
	// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
	if (route.query?.redirect) {
		router.push({
			path: route.query?.redirect,
			query: Object.keys(route.query?.params).length > 0 ? JSON.parse(route.query?.params) : '',
		});
	} else {
		router.push('/');
	}
	// 登录成功提示
	setTimeout(() => {
		// 关闭 loading
		state.loading.signIn = true;
		const signInText = t('message.signInText');
		ElMessage.success(`${currentTimeInfo}，${signInText}`);
		// 修复防止退出登录再进入界面时，需要刷新样式才生效的问题，初始化布局样式等(登录的时候触发，目前方案)
		proxy.mittBus.emit('onSignInClick');
	}, 300);
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	.login-content-password {
		display: inline-block;
		width: 25px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.login-content-code-img {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #ffffff;
			border: 1px solid rgb(220, 223, 230);
			color: #333;
			font-size: 16px;
			font-weight: 700;
			letter-spacing: 5px;
			text-indent: 5px;
			text-align: center;
			cursor: pointer;
			transition: all ease 0.2s;
			border-radius: 4px;
			user-select: none;
			&:hover {
				border-color: #c0c4cc;
				transition: all ease 0.2s;
			}
		}
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
