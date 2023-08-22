import request from '@/utils/request';

// 查询参数列表分页
export function listJobLog(query:any) {
    return request({
        url: '/job/log/list',
        method: 'get',
        params: query
    })
}

// 删除
export function delJobLog(logId:any) {
    return request({
        url: '/job/log/'+ logId,
        method: 'delete',
    })
}

// 查询参数列表分页
export function cleanJobLog() {
    return request({
        url: '/job/log/all',
        method: 'delete',
    })
}
