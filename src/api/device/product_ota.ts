import request from '@/utils/request';

// 查询Ota列表
export function listOta(query:any) {
    return request({
        url: '/device/ota/list',
        method: 'get',
        params: query
    })
}

// 查询Ota详细
export function getOta(id:number) {
    return request({
        url: '/device/ota/' + id,
        method: 'get'
    })
}

// 新增Ota
export function addOta(data:any) {
    return request({
        url: '/device/ota',
        method: 'post',
        data: data
    })
}

// 修改Ota
export function updateOta(data:any) {
    return request({
        url: '/device/ota',
        method: 'put',
        data: data
    })
}

// 删除Ota
export function delOta(id: string) {
    return request({
        url: '/device/ota/' + id,
        method: 'delete'
    })
}
