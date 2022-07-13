import request from '@/utils/request';


/**
 * 获取验证码
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function captcha() {
	return request({
		url: '/system/user/getCaptcha',
		method: 'get',
	});
}

/**
 * 用户登录
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function signIn(params: object) {
	return request({
		url: '/system/user/login',
		method: 'post',
		data: params,
	});
}

/**
 * 用户退出登录
 * @param params 要传的参数值
 * @returns 返回接口数据
 */
export function signOut(params: object) {
	return request({
		url: '/system/user/logout',
		method: 'post',
		data: params,
	});
}
