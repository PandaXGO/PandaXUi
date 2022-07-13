import request from '@/utils/request';

// 查询参数列表分页
export function listLoginInfo(query:any) {
    return request({
        url: '/log/logLogin/list',
        method: 'get',
        params: query
    })
}

// 删除
export function delLoginInfo(infoId:any) {
    return request({
        url: '/log/logLogin/'+ infoId,
        method: 'delete',
    })
}

// 查询参数列表分页
export function cleanLoginInfo() {
    return request({
        url: '/log/logLogin/all',
        method: 'delete',
    })
}