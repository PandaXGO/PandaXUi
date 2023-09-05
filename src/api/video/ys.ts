import request from '@/utils/request';

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
