import request from '@/utils/request';

// 查询DeviceGroup列表
export function listDeviceGroup(query:any) {
    return request({
        url: '/device/group/list',
        method: 'get',
        params: query
    })
}

export function listDeviceGroupTree() {
    return request({
        url: '/device/group/list/tree',
        method: 'get',
    })
}

export function listDeviceGroupTreeLabel() {
    return request({
        url: '/device/group/list/tree/label',
        method: 'get',
    })
}
export function listDeviceGroupAllList(query:any) {
    return request({
        url: '/device/group/list/all',
        method: 'get',
        params: query
    })
}

// 查询DeviceGroup详细
export function getDeviceGroup(id:number) {
    return request({
        url: '/device/group/' + id,
        method: 'get'
    })
}

// 新增DeviceGroup
export function addDeviceGroup(data:any) {
    return request({
        url: '/device/group',
        method: 'post',
        data: data
    })
}

// 修改DeviceGroup
export function updateDeviceGroup(data:any) {
    return request({
        url: '/device/group',
        method: 'put',
        data: data
    })
}

// 删除DeviceGroup
export function delDeviceGroup(id: string) {
    return request({
        url: '/device/group/' + id,
        method: 'delete'
    })
}
