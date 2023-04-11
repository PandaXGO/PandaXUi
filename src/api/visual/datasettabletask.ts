import request from '@/utils/request';

// 查询DataSetTableTask列表
export function listDataSetTableTask(query:any) {
	return request({
		url: '/visual/dataset/tabletask/list',
		method: 'get',
		params: query
	})
}

// 查询DataSetTableTask详细
export function getDataSetTableTask(id:number) {
	return request({
		url: '/visual/dataset/tabletask/' + id,
		method: 'get'
	})
}

// 新增DataSetTableTask
export function addDataSetTableTask(data:any) {
	return request({
		url: '/visual/dataset/tabletask',
		method: 'post',
		data: data
	})
}

// 修改DataSetTableTask
export function updateDataSetTableTask(data:any) {
	return request({
		url: '/visual/dataset/tabletask',
		method: 'put',
		data: data
	})
}

// 删除DataSetTableTask
export function delDataSetTableTask(id: string) {
	return request({
		url: '/visual/dataset/tabletask/' + id,
		method: 'delete'
	})
}