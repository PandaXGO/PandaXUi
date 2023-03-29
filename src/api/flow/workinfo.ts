import request from '@/utils/request';

// 查询WorkInfo列表
export function listWorkInfo(query:any) {
	return request({
		url: '/flow/workinfo/list',
		method: 'get',
		params: query
	})
}

// 查询WorkInfo详细
export function getWorkInfo(id:number) {
	return request({
		url: '/flow/workinfo/' + id,
		method: 'get'
	})
}

// 新增WorkInfo
export function addWorkInfo(data:any) {
	return request({
		url: '/flow/workinfo',
		method: 'post',
		data: data
	})
}

// 修改WorkInfo
export function updateWorkInfo(data:any) {
	return request({
		url: '/flow/workinfo',
		method: 'put',
		data: data
	})
}

// 删除WorkInfo
export function delWorkInfo(id: string) {
	return request({
		url: '/flow/workinfo/' + id,
		method: 'delete'
	})
}