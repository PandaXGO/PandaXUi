import request from '@/utils/request';


// 查询用户列表
export function authUser(query: any) {
	return request({
		url: '/system/user/auth',
		method: 'get',
		params: query
	})
}

// 查询用户列表
export function listUser(query: any) {
	return request({
		url: '/system/user/list',
		method: 'get',
		params: query
	})
}

// 用户状态修改
export function changeUserStatus(userId: number, status: string) {
	const data = {
		userId,
		status
	}
	return request({
		url: '/system/user/changeStatus',
		method: 'put',
		data: data
	})
}

// 查询用户详细
export function getUser(userId: number) {
	return request({
		url: '/system/user/getById/' + userId,
		method: 'get'
	})
}

// 添加时查询用户详细
export function getUserInit() {
	return request({
		url: '/system/user/getInit',
		method: 'get'
	})
}

// 添加时查询用户ROLE
export function getRoPo() {
	return request({
		url: '/system/user/getRoPo',
		method: 'get'
	})
}
// 删除用户
export function delUser(userId: number) {
	return request({
		url: '/system/user/' + userId,
		method: 'delete'
	})
}

// 新增用户
export function addUser(data: any) {
	return request({
		url: '/system/user',
		method: 'post',
		data: data
	})
}

// 修改用户
export function updateUser(data:any) {
	return request({
		url: '/system/user',
		method: 'put',
		data: data
	})
}

// 修改密码
export function updateUserPwd(data:any) {
	return request({
		url: '/system/user/pwd',
		method: 'put',
		data: data
	})
}


// 导出
export function exportUser(query: any) {
	return request({
		url: '/system/user/export',
		method: 'get',
		params: query,
		responseType: 'blob'
	})
}

// 下载用户导入模板
export function importTemplate() {
	return request({
		url: '/system/user/importTemplate',
		method: 'get'
	})
}

// 用户头像上传
export function uploadAvatar(data:any) {
	return request({
		url: '/system/user/avatar',
		method: 'post',
		data: data
	})
}