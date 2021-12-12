import request from '/@/utils/request'

// 查询登录日志列表
export function listLoginInfo(query:any) {
	return request({
		url: '/system/loginLog/list',
		method: 'get',
		params: query
	})
}

// 删除登录日志
export function delLoginInfo(infoId:any) {
	return request({
		url: '/system/loginLog/' + infoId,
		method: 'delete'
	})
}

// 清空登录日志
export function cleanLoginInfo() {
	return request({
		url: '/system/loginLog/clean',
		method: 'delete'
	})
}

// 导出登录日志
export function exportLoginInfo(query:any) {
	return request({
		url: '/system/loginLog/export',
		method: 'get',
		params: query
	})
}