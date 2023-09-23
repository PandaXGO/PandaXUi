import request from '@/utils/request';

// 查询Device统计面板
export function getDevicePanel() {
    return request({
        url: '/device/panel',
        method: 'get',
    })
}

// 查询Device列表
export function listDevice(query:any) {
    return request({
        url: '/device/list',
        method: 'get',
        params: query
    })
}
// 查询Device列表
export function listDeviceAll(query:any) {
    return request({
        url: '/device/list/all',
        method: 'get',
        params: query
    })
}

// 查询Device详细
export function getDevice(id:number) {
    return request({
        url: '/device/' + id,
        method: 'get'
    })
}

// 查询Device详细
export function getDeviceStatus(id:number,query:any) {
    return request({
        url: '/device/' + id+'/status',
        method: 'get',
        params: query
    })
}

// 查询Device属性历史
export function getDevicePropertyHistory(id:number,query:any) {
    return request({
        url: '/device/' + id+'/property/history',
        method: 'get',
        params: query
    })
}

// 设备属性下发
export function downAttribute(id:number,query:any) {
    return request({
        url: '/device/' + id+'/attribute/down',
        method: 'get',
        params: query
    })
}


// 新增Device
export function addDevice(data:any) {
    return request({
        url: '/device',
        method: 'post',
        data: data
    })
}

// 修改Device
export function updateDevice(data:any) {
    return request({
        url: '/device',
        method: 'put',
        data: data
    })
}

// 删除Device
export function delDevice(id: string) {
    return request({
        url: '/device/' + id,
        method: 'delete'
    })
}

// 查询Device详细
export function allotDevice(id:string,query:any) {
    return request({
        url: '/device/' + id+'/allot/org',
        method: 'get',
        params: query
    })
}
