import request from '@/utils/request';

// 查询Product列表
export function listProduct(query:any) {
    return request({
        url: '/device/product/list',
        method: 'get',
        params: query
    })
}

// 查询Product所有列表
export function listProductAll(query:any) {
    return request({
        url: '/device/product/list/all',
        method: 'get',
        params: query
    })
}

// 查询Product详细
export function getProduct(id:number) {
    return request({
        url: '/device/product/' + id,
        method: 'get'
    })
}

// 查询Product详细
export function getProductTsl(id:number) {
    return request({
        url: '/device/product/' + id+'/tsl',
        method: 'get'
    })
}

// 新增Product
export function addProduct(data:any) {
    return request({
        url: '/device/product',
        method: 'post',
        data: data
    })
}

// 修改Product
export function updateProduct(data:any) {
    return request({
        url: '/device/product',
        method: 'put',
        data: data
    })
}

// 删除Product
export function delProduct(id: string) {
    return request({
        url: '/device/product/' + id,
        method: 'delete'
    })
}
