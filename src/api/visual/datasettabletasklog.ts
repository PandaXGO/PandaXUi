import request from '@/utils/request';

// 查询DataSetTableTaskLog列表
export function listDataSetTableTaskLog(query:any) {
	return request({
		url: '/visual/dataset/tabletask/log/list',
		method: 'get',
		params: query
	})
}

// 查询DataSetTableTaskLog详细
export function getDataSetTableTaskLog(id:number) {
	return request({
		url: '/visual/dataset/tabletask/log/' + id,
		method: 'get'
	})
}

// 新增DataSetTableTaskLog
export function addDataSetTableTaskLog(data:any) {
	return request({
		url: '/visual/dataset/tabletask/log',
		method: 'post',
		data: data
	})
}

// 修改DataSetTableTaskLog
export function updateDataSetTableTaskLog(data:any) {
	return request({
		url: '/visual/dataset/tabletask/log',
		method: 'put',
		data: data
	})
}

// 删除DataSetTableTaskLog
export function delDataSetTableTaskLog(id: string) {
	return request({
		url: '/visual/dataset/tabletask/log/' + id,
		method: 'delete'
	})
}