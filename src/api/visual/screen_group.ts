import request from '@/utils/request';

// 查询ScreenGroup列表
export function listScreenGroup(query:any) {
	return request({
		url: '/visual/screen/group/list',
		method: 'get',
		params: query
	})
}

export function listScreenGroupTree() {
	return request({
		url: '/visual/screen/group/list/tree',
		method: 'get',
	})
}
export function listScreenGroupAllList(query:any) {
	return request({
		url: '/visual/screen/group/list/all',
		method: 'get',
		params: query
	})
}

// 查询ScreenGroup详细
export function getScreenGroup(screenId:number) {
	return request({
		url: '/visual/screen/group/' + screenId,
		method: 'get'
	})
}

// 新增ScreenGroup
export function addScreenGroup(data:any) {
	return request({
		url: '/visual/screen/group',
		method: 'post',
		data: data
	})
}

// 修改ScreenGroup
export function updateScreenGroup(data:any) {
	return request({
		url: '/visual/screen/group',
		method: 'put',
		data: data
	})
}

// 删除ScreenGroup
export function delScreenGroup(screenId: string) {
	return request({
		url: '/visual/screen/group/' + screenId,
		method: 'delete'
	})
}