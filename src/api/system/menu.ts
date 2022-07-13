import request from '@/utils/request';

export function getRoutes(query: any) {
	return request({
		url: '/api/menu/menuRole',
		method: 'get',
		params: query
	})
}

// 查询菜单下拉树结构
export function treeselect() {
	return request({
		url: '/system/menu/menuTreeSelect',
		method: 'get'
	})
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: number) {
	return request({
		url: '/system/menu/roleMenuTreeSelect/' + roleId,
		method: 'get'
	})
}

// 查询菜单列表
export function listMenu(query: Array<object>) {
	return request({
		url: '/system/menu/list',
		method: 'get',
		params: query
	})
}

// 查询菜单详细
export function getMenu(menuId: number) {
	return request({
		url: '/system/menu/' + menuId,
		method: 'get'
	})
}


// 新增菜单
export function addMenu(data: any) {
	return request({
		url: '/system/menu',
		method: 'post',
		data: data
	})
}

// 修改菜单
export function updateMenu(data: any) {
	return request({
		url: '/system/menu',
		method: 'put',
		data: data
	})
}

// 删除菜单
export function delMenu(menuId: number) {
	return request({
		url: '/system/menu/' + menuId,
		method: 'delete'
	})
}