import request from '@/utils/request'

// 查询定时任务调度列表
export function listJob(query:any) {
	return request({
		url: '/job/list',
		method: 'get',
		params: query
	})
}

// 查询定时任务调度详细
export function getJob(jobId:any) {
	return request({
		url: '/job/' + jobId,
		method: 'get'
	})
}

// 新增定时任务调度
export function addJob(data:any) {
	return request({
		url: '/job',
		method: 'post',
		data: data
	})
}

// 修改定时任务调度
export function updateJob(data:any) {
	return request({
		url: '/job',
		method: 'put',
		data: data
	})
}

// 删除定时任务调度
export function delJob(jobId:any) {
	return request({
		url: '/job/' + jobId,
		method: 'delete'
	})
}

// 任务状态修改
export function changeJobStatus(data:any) {
	return request({
		url: '/job/changeStatus',
		method: 'put',
		data: data
	})
}


// 开始执行
export function runStartJob(jobId:any) {
	return request({
		url: '/job/start/'+ jobId,
		method: 'get',
	})
}

// 停止执行
export function runStopJob(jobId:any) {
	return request({
		url: '/job/stop/'+ jobId,
		method: 'get',
	})
}