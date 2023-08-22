import request from '@/utils/request';

// 查询命令下发列表
export function listCmdLog(query:any) {
    return request({
        url: '/device/cmd/list',
        method: 'get',
        params: query
    })
}


// 添加命令下发
export function addCmd(data:any) {
    return request({
        url: '/device/cmd',
        method: 'post',
        data: data
    })
}

// 删除命令下发
export function delCmd(id: string) {
    return request({
        url: '/device/cmd/' + id,
        method: 'delete'
    })
}
