import request from '@/utils/request'

//视图
export function preview(tableId:any) {
    return request({
        url: '/develop/code/gen/preview/'+ tableId,
        method: 'get',
    })
}

// 生成代码
export function code(tableId:any) {
    return request({
        url: '/develop/code/gen/code/' + tableId,
        method: 'get'
    })
}

// 生成api菜单
export function menuAndApi(tableId:any) {
    return request({
        url: '/develop/code/gen/menuAndApi/' + tableId,
        method: 'get',
    })
}