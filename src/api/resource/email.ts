import request from '@/utils/request';

// 查询ResEmails列表
export function listResEmails(query:any) {
    return request({
        url: '/resource/email/list',
        method: 'get',
        params: query
    })
}

// 查询ResEmails详细
export function getResEmails(mailId:number) {
    return request({
        url: '/resource/email/' + mailId,
        method: 'get'
    })
}

// 新增ResEmails
export function addResEmails(data:any) {
    return request({
        url: '/resource/email',
        method: 'post',
        data: data
    })
}

// 修改ResEmails
export function updateResEmails(data:any) {
    return request({
        url: '/resource/email',
        method: 'put',
        data: data
    })
}

// 删除ResEmails
export function delResEmails(mailId: string) {
    return request({
        url: '/resource/email/' + mailId,
        method: 'delete'
    })
}

// 状态修改
export function changeMailStatus(data:any) {
    return request({
        url: '/resource/email/changeStatus',
        method: 'put',
        data: data
    })
}

// 状态修改
export function debugMail(data:any) {
    return request({
        url: '/resource/email/debugMail',
        method: 'post',
        data: data
    })
}

