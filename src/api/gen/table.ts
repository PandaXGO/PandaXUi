import request from '@/utils/request'

// 表列表
export function getDbList(query:any) {
    return request({
        url: '/develop/code/table/db/list',
        method: 'get',
        params: query
    })
}

export function getTableList(query:any) {
    return request({
        url: '/develop/code/table/list',
        method: 'get',
        params: query
    })
}

// 获取表信息
export function getTableInfo(tableId:any) {
    return request({
        url: '/develop/code/table/info/' + tableId,
        method: 'get',
    })
}

// 获取表信息
export function getTableInfoByName(query:any) {
    return request({
        url: '/develop/code/table/info/tableName',
        method: 'get',
        params: query
    })
}
// 获取表树信息
export function getTableTree() {
    return request({
        url: '/develop/code/table/tableTree',
        method: 'get',
    })
}

// 导入表
export function insertTable(data:any) {
    return request({
        url: '/develop/code/table',
        method: 'post',
        params: data
    })
}


// 修改代码生成信息
export function updateTable(data:any) {
    return request({
        url: '/develop/code/table',
        method: 'put',
        data: data
    })
}


// 删除表
export function deleteTable(tableId:any) {
    return request({
        url: '/develop/code/table/' + tableId,
        method: 'delete',
    })
}


