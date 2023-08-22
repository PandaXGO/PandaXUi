import request from '@/utils/request';

// 查询ProductCategory列表
export function listProductCategory(query:any) {
    return request({
        url: '/device/product/category/list',
        method: 'get',
        params: query
    })
}

export function listProductCategoryTree() {
    return request({
        url: '/device/product/category/list/tree',
        method: 'get',
    })
}
export function listProductCategoryLabel() {
    return request({
        url: '/device/product/category/list/tree/label',
        method: 'get',
    })
}
export function listProductCategoryAllList(query:any) {
    return request({
        url: '/device/product/category/list/all',
        method: 'get',
        params: query
    })
}

// 查询ProductCategory详细
export function getProductCategory(id:number) {
    return request({
        url: '/device/product/category/' + id,
        method: 'get'
    })
}

// 新增ProductCategory
export function addProductCategory(data:any) {
    return request({
        url: '/device/product/category',
        method: 'post',
        data: data
    })
}

// 修改ProductCategory
export function updateProductCategory(data:any) {
    return request({
        url: '/device/product/category',
        method: 'put',
        data: data
    })
}

// 删除ProductCategory
export function delProductCategory(id: string) {
    return request({
        url: '/device/product/category/' + id,
        method: 'delete'
    })
}
