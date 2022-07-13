import { App } from 'vue';
 
import { judementSameArr } from '@/utils/arrayOperation';
import { useUserInfosState } from "@/stores/userInfos";

/**
 * 用户权限指令
 * @directive 单个权限验证（v-auth="xxx"）
 * @directive 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
 * @directive 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
 */
export function authDirective(app: App) {
    
	// 单个权限验证（v-auth="xxx"）
	app.directive('auth', {
        mounted(el, binding) {
            const userInfos = useUserInfosState();
			if (!userInfos.userInfos.authBtnList.some((v: string) => v === binding.value)) el.parentNode.removeChild(el);
		},
	});
	// 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
	app.directive('auths', {
        mounted(el, binding) {
            const userInfos = useUserInfosState();
			let flag = false;
			userInfos.userInfos.authBtnList.map((val: string) => {
				binding.value.map((v: string) => {
					if (val === v) flag = true;
				});
			});
			if (!flag) el.parentNode.removeChild(el);
		},
	});
	// 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
	app.directive('auth-all', {
        mounted(el, binding) {
            const userInfos = useUserInfosState();
			const flag = judementSameArr(binding.value, userInfos.userInfos.authBtnList);
			if (!flag) el.parentNode.removeChild(el);
		},
	});
}
