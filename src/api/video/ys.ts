import request from '@/utils/request';

export function listDeviceKey(query : any) {
    return request({
        url: '/video/ys/list',
        method: 'get',
        params: query
    })
}

export function createDeviceKey(data : any) {
    return request({
        url: '/video/ys',
        method: 'post',
        data: data
    })
}

export function putDeviceKey(data : any) {
    return request({
        url: '/video/ys',
        method: 'put',
        data: data
    })
}

export function deleteDeviceKey(id : string) {
    return request({
        url: '/video/ys/'+id,
        method: 'delete',
    })
}


export function listDeviceList(query : any) {
    return request({
        url: '/video/ys/device/list',
        method: 'get',
        params: query
    })
}

export function getDeviceChannels(deviceSerial: string) {
    return request({
        url: '/video/ys/'+ deviceSerial +'/channel',
        method: 'get',
    })
}

export function getDeviceLive(deviceSerial: string,query : any) {
    return request({
        url: '/video/ys/'+ deviceSerial +'/channel/live',
        method: 'get',
        params: query
    })
}

export function ptzStart(deviceSerial: string,query : any) {
    return request({
        url: '/video/ys/'+ deviceSerial +'/ptz/start',
        method: 'get',
        params: query
    })
}

export function ptzStop(deviceSerial: string,query : any) {
    return request({
        url: '/video/ys/'+ deviceSerial +'/ptz/stop',
        method: 'get',
        params: query
    })
}
