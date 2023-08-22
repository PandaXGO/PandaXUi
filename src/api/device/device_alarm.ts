import request from '@/utils/request';

// 查询告警列表
export function listAlarm(query:any) {
    return request({
        url: '/device/alarm/list',
        method: 'get',
        params: query
    })
}


// 修改告警
export function updateAlarm(data:any) {
    return request({
        url: '/device/alarm',
        method: 'put',
        data: data
    })
}

// 删除告警
export function delAlarm(id: string) {
    return request({
        url: '/device/alarm/' + id,
        method: 'delete'
    })
}
