import request from '@/utils/request';

// 查询DataSetTable列表
export function listDataSetTable(query:any) {
	return request({
		url: '/visual/dataset/table/list',
		method: 'get',
		params: query
	})
}

// 查询DataSetTable详细
export function getDataSetTable(tableId:number) {
	return request({
		url: '/visual/dataset/table/' + tableId,
		method: 'get'
	})
}

// 新增DataSetTable
export function addDataSetTable(data:any) {
	return request({
		url: '/visual/dataset/table',
		method: 'post',
		data: data
	})
}

// 修改DataSetTable
export function updateDataSetTable(data:any) {
	return request({
		url: '/visual/dataset/table',
		method: 'put',
		data: data
	})
}

// 删除DataSetTable
export function delDataSetTable(tableId: string) {
	return request({
		url: '/visual/dataset/table/' + tableId,
		method: 'delete'
	})
}