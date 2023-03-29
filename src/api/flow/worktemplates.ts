import request from '@/utils/request';

// 查询WorkTemplates列表
export function listWorkTemplates(query:any) {
	return request({
		url: '/flow/worktemplates/list',
		method: 'get',
		params: query
	})
}

// 查询WorkTemplates详细
export function getWorkTemplates(id:number) {
	return request({
		url: '/flow/worktemplates/' + id,
		method: 'get'
	})
}

// 新增WorkTemplates
export function addWorkTemplates(data:any) {
	return request({
		url: '/flow/worktemplates',
		method: 'post',
		data: data
	})
}

// 修改WorkTemplates
export function updateWorkTemplates(data:any) {
	return request({
		url: '/flow/worktemplates',
		method: 'put',
		data: data
	})
}

// 删除WorkTemplates
export function delWorkTemplates(id: string) {
	return request({
		url: '/flow/worktemplates/' + id,
		method: 'delete'
	})
}