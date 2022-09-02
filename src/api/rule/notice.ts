import request from '@/utils/request';

// 查询Notice列表
export function listNotice(query:any) {
	return request({
		url: '/rule/notice/list',
		method: 'get',
		params: query
	})
}

// 查询Notice详细
export function getNotice(id:number) {
	return request({
		url: '/rule/notice/' + id,
		method: 'get'
	})
}

// 新增Notice
export function addNotice(data:any) {
	return request({
		url: '/rule/notice',
		method: 'post',
		data: data
	})
}

// 修改Notice
export function updateNotice(data:any) {
	return request({
		url: '/rule/notice',
		method: 'put',
		data: data
	})
}

// 删除Notice
export function delNotice(id: string) {
	return request({
		url: '/rule/notice/' + id,
		method: 'delete'
	})
}