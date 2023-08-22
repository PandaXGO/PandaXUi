import request from '@/utils/request';

// 查询Chain列表
export function listChain(query:any) {
    return request({
        url: '/rule/chain/list',
        method: 'get',
        params: query
    })
}

export function listChainLabel(query:any) {
    return request({
        url: '/rule/chain/list/label',
        method: 'get',
        params: query
    })
}

// 查询Chain详细
export function getChain(ruleId:string) {
    return request({
        url: '/rule/chain/' + ruleId,
        method: 'get'
    })
}

// 新增Chain
export function addChain(data:any) {
    return request({
        url: '/rule/chain',
        method: 'post',
        data: data
    })
}

// 克隆Chain
export function cloneChain(ruleId: string) {
    return request({
        url: '/rule/chain/clone/' + ruleId,
        method: 'post'
    })
}

// 修改Chain
export function updateChain(data:any) {
    return request({
        url: '/rule/chain',
        method: 'put',
        data: data
    })
}

// 删除Chain
export function delChain(ruleId: string) {
    return request({
        url: '/rule/chain/' + ruleId,
        method: 'delete'
    })
}

export function changeChainRoot(id: number, root: string) {
    const data = {
        id,
        root
    }
    return request({
        url: '/rule/chain/changeRoot',
        method: 'put',
        data: data
    })
}
