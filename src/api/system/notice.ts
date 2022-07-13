import request from '@/utils/request';

// 查询公告列表
export function listNotice(query:any) {
    return request({
        url: '/system/notice/list',
        method: 'get',
        params: query
    })
}

// 新增公告
export function addNotice(data:any) {
    return request({
        url: '/system/notice',
        method: 'post',
        data: data
    })
}

// 修改公告
export function updateNotice(data:any) {
    return request({
        url: '/system/notice',
        method: 'put',
        data: data
    })
}

// 删除公告
export function delNotice(noticeId: string) {
    return request({
        url: '/system/notice/' + noticeId,
        method: 'delete'
    })
}