import request from '@/utils/request';

// 查询Screen列表
export function listScreen(query:any) {
	return request({
		url: '/visual/screen/list',
		method: 'get',
		params: query
	})
}

// 查询Screen详细
export function getScreen(screenId:number) {
	return request({
		url: '/visual/screen/' + screenId,
		method: 'get'
	})
}

// 新增Screen
export function addScreen(data:any) {
	return request({
		url: '/visual/screen',
		method: 'post',
		data: data
	})
}

// 修改Screen
export function updateScreen(data:any) {
	return request({
		url: '/visual/screen',
		method: 'put',
		data: data
	})
}

// 删除Screen
export function delScreen(screenId: string) {
	return request({
		url: '/visual/screen/' + screenId,
		method: 'delete'
	})
}

export function changeScreenStatus(id: number, status: string) {
	const data = {
		id,
		status
	}
	return request({
		url: '/visual/screen/changeStatus',
		method: 'put',
		data: data
	})
}
