import request from '@/utils/request';

// 查询参数列表分页
export function listApi(query:any) {
    return request({
        url: '/system/api/list',
        method: 'get',
        params: query
    })
}
// 查询参数列表
export function listApiAll(query:any) {
    return request({
        url: '/system/api/all',
        method: 'get',
        params: query
    })
}
// 查询参数详细
export function getApi(id:any) {
    return request({
        url: '/system/api/' + id,
        method: 'get'
    })
}

// 新增参数配置
export function addApi(data:any) {
    return request({
        url: '/system/api',
        method: 'post',
        data: data
    })
}

// 修改参数配置
export function updateApi(data:any) {
    return request({
        url: '/system/api',
        method: 'put',
        data: data
    })
}

// 删除参数配置
export function delApi(id:any) {
    return request({
        url: '/system/api/' + id,
        method: 'delete'
    })
}
// 获取权限Api通过角色id
export function getPolicyPathByRoleId(query:any) {
    return request({
        url: '/system/api/getPolicyPathByRoleId',
        method: 'get',
        params: query
    })
}
