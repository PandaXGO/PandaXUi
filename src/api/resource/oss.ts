import request from '@/utils/request';

// 查询ResOsses列表
export function listResOsses(query:any) {
    return request({
        url: '/resource/oss/list',
        method: 'get',
        params: query
    })
}

// 查询ResOsses详细
export function getResOsses(ossId:number) {
    return request({
        url: '/resource/oss/' + ossId,
        method: 'get'
    })
}

// 新增ResOsses
export function addResOsses(data:any) {
    return request({
        url: '/resource/oss',
        method: 'post',
        data: data
    })
}

// 修改ResOsses
export function updateResOsses(data:any) {
    return request({
        url: '/resource/oss',
        method: 'put',
        data: data
    })
}

// 删除ResOsses
export function delResOsses(ossId: string) {
    return request({
        url: '/resource/oss/' + ossId,
        method: 'delete'
    })
}

// 状态修改
export function changeOssStatus(data:any) {
    return request({
        url: '/resource/oss/changeStatus',
        method: 'put',
        data: data
    })
}
