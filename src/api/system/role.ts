import request from '@/utils/request';


// 查询角色列表
export function listRole(query: Array<object>) {
	return request({
		url: '/system/role/list',
		method: 'get',
		params: query
	})
}

// 查询角色详细
export function getRole(roleId: number) {
	return request({
		url: '/system/role/' + roleId,
		method: 'get'
	})
}

// 新增角色
export function addRole(data: Array<object>) {
	return request({
		url: '/system/role',
		method: 'post',
		data: data
	})
}

// 修改角色
export function updateRole(data: Array<object>) {
	return request({
		url: '/system/role',
		method: 'put',
		data: data
	})
}

// 角色数据权限
export function dataScope(data: Array<object>) {
	return request({
		url: '/system/role/dataScope',
		method: 'put',
		data: data
	})
}

// 角色状态修改
export function changeRoleStatus(roleId: number, status: string) {
	const data = {
		roleId,
		status
	}
	return request({
		url: '/system/role/changeStatus',
		method: 'put',
		data: data
	})
}

// 删除角色
export function delRole(roleId: number) {
	return request({
		url: '/system/role/' + roleId,
		method: 'delete'
	})
}
// 导出
export function exportRole(query: any) {
	return request({
		url: '/system/role/export',
		method: 'get',
		params: query
	})
}