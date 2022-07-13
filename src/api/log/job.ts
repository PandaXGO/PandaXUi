import request from '@/utils/request';

// 查询参数列表分页
export function listJobLog(query:any) {
    return request({
        url: '/log/logJob/list',
        method: 'get',
        params: query
    })
}

// 删除
export function delJobLog(logId:any) {
    return request({
        url: '/log/logJob/'+ logId,
        method: 'delete',
    })
}

// 查询参数列表分页
export function cleanJobLog() {
    return request({
        url: '/log/logJob/all',
        method: 'delete',
    })
}