import request from '@/utils/request';

// 查询Chain列表
export function listChain(query:any) {
    return request({
        url: '/visual/rulechain/list',
        method: 'get',
        params: query
    })
}

// 查询Chain详细
export function getChain(ruleId:string) {
    return request({
        url: '/visual/rulechain/' + ruleId,
        method: 'get'
    })
}

// 新增Chain
export function addChain(data:any) {
    return request({
        url: '/visual/rulechain',
        method: 'post',
        data: data
    })
}

// 修改Chain
export function updateChain(data:any) {
    return request({
        url: '/visual/rulechain',
        method: 'put',
        data: data
    })
}

// 删除Chain
export function delChain(ruleId: string) {
    return request({
        url: '/visual/rulechain/' + ruleId,
        method: 'delete'
    })
}

export function changeChainStatus(ruleId: number, status: string) {
    const data = {
        ruleId,
        status
    }
    return request({
        url: '/visual/rulechain/changeStatus',
        method: 'put',
        data: data
    })
}