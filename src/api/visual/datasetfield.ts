import request from '@/utils/request';

// 查询DataSetField列表
export function listDataSetField(query:any) {
	return request({
		url: '/visual/dataset/field/list',
		method: 'get',
		params: query
	})
}

// 查询DataSetField详细
export function getDataSetField(fieldId:number) {
	return request({
		url: '/visual/dataset/field/' + fieldId,
		method: 'get'
	})
}

// 新增DataSetField
export function addDataSetField(data:any) {
	return request({
		url: '/visual/dataset/field',
		method: 'post',
		data: data
	})
}

// 修改DataSetField
export function updateDataSetField(data:any) {
	return request({
		url: '/visual/dataset/field',
		method: 'put',
		data: data
	})
}

// 删除DataSetField
export function delDataSetField(fieldId: string) {
	return request({
		url: '/visual/dataset/field/' + fieldId,
		method: 'delete'
	})
}