import request from '@/utils/request';

// 查询Classify列表
export function listWorkClassify(query:any) {
	return request({
		url: '/flow/workclassify/list',
		method: 'get',
		params: query
	})
}

// 查询Classify详细
export function getWorkClassify(id:number) {
	return request({
		url: '/flow/workclassify/' + id,
		method: 'get'
	})
}

// 新增Classify
export function addWorkClassify(data:any) {
	return request({
		url: '/flow/workclassify',
		method: 'post',
		data: data
	})
}

// 修改Classify
export function updateWorkClassify(data:any) {
	return request({
		url: '/flow/workclassify',
		method: 'put',
		data: data
	})
}

// 删除Classify
export function delWorkClassify(id: string) {
	return request({
		url: '/flow/workclassify/' + id,
		method: 'delete'
	})
}