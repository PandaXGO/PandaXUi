import request from '@/utils/request';

// 查询参数列表分页
export function listOperInfo(query:any) {
    return request({
        url: '/log/logOper/list',
        method: 'get',
        params: query
    })
}

// 删除
export function delOperInfo(operId:any) {
    return request({
        url: '/log/logOper/'+ operId,
        method: 'delete',
    })
}

// 查询参数列表分页
export function cleanOpernfo() {
    return request({
        url: '/log/logOper/all',
        method: 'delete',
    })
}