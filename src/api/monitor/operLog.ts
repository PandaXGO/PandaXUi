import request from '/@/utils/request'

// 查询操作日志列表
export function listOperlog(query:any) {
	return request({
		url: '/system/operlog/list',
		method: 'get',
		params: query
	})
}

// 删除操作日志
export function delOperlog(operId:any) {
	return request({
		url: '/system/operlog/' + operId,
		method: 'delete'
	})
}

// 清空操作日志
export function cleanOperlog() {
	return request({
		url: '/system/operlog/clean',
		method: 'delete'
	})
}

// 导出操作日志
export function exportOperlog(query:any) {
	return request({
		url: '/system/operlog/export',
		method: 'get',
		params: query
	})
}