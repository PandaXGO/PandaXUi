import request from '@/utils/request';

// 查询Template列表
export function listTemplate(query:any) {
    return request({
        url: '/device/template/list',
        method: 'get',
        params: query
    })
}

// 查询Template列表
export function listTemplateAll(query:any) {
    return request({
        url: '/device/template/list/all',
        method: 'get',
        params: query
    })
}

// 查询Template详细
export function getTemplate(id:number) {
    return request({
        url: '/device/template/' + id,
        method: 'get'
    })
}

// 新增Template
export function addTemplate(data:any) {
    return request({
        url: '/device/template',
        method: 'post',
        data: data
    })
}

// 修改Template
export function updateTemplate(data:any) {
    return request({
        url: '/device/template',
        method: 'put',
        data: data
    })
}

// 删除Template
export function delTemplate(id: string) {
    return request({
        url: '/device/template/' + id,
        method: 'delete'
    })
}
