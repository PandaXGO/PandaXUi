import request from '@/utils/request';

// 查询SysTenants列表分页
export function listSysTenants(query:any) {
    return request({
        url: '/system/tenant/list',
        method: 'get',
        params: query
    })
}

export function allSysTenants() {
    return request({
        url: '/system/tenant/lists',
        method: 'get'
    })
}

// 查询SysTenants详细
export function getSysTenants(tenantId:number) {
    return request({
        url: '/system/tenant/' + tenantId,
        method: 'get'
    })
}

// 新增SysTenants
export function addSysTenants(data:any) {
    return request({
        url: '/system/tenant',
        method: 'post',
        data: data
    })
}

// 修改SysTenants
export function updateSysTenants(data:any) {
    return request({
        url: '/system/tenant',
        method: 'put',
        data: data
    })
}

// 删除SysTenants
export function delSysTenants(tenantId: string) {
    return request({
        url: '/system/tenant/' + tenantId,
        method: 'delete'
    })
}