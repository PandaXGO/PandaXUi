// const baseURL = "http://localhost:8088"
const baseURL = import.meta.env.VITE_API_URL

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str: any) {
    if (!str || str == "undefined" || str == "null") {
        return "";
    }
    return str;
}

// 添加日期范围
export function addDateRange(params: any, dateRange: any, propName: any) {
    var search = params;
    search.params = {};
    if (null != dateRange && '' != dateRange) {
        if (typeof (propName) === "undefined") {
            search.params["beginTime"] = dateRange[0];
            search.params["endTime"] = dateRange[1];
        } else {
            search.params["begin" + propName] = dateRange[0];
            search.params["end" + propName] = dateRange[1];
        }
    }
    return search;
}


// 日期格式化
export function parseTime(time: any, pattern: string) {
    var datetime = new Date(time);
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    } as any;
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any, id: number, parentId: number, children: any) {
    let config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    };

    const childrenListMap = {} as any;
    const nodeIds = {} as any;
    const tree = [];

    for (let d of data) {
        let parentId = d[config.parentId];
        if (childrenListMap[parentId] == null) {
            childrenListMap[parentId] = [];
        }
        nodeIds[d[config.id]] = d;
        childrenListMap[parentId].push(d);
    }

    for (let d of data) {
        let parentId = d[config.parentId];
        if (nodeIds[parentId] == null) {
            tree.push(d);
        }
    }

    for (let t of tree) {
        adaptToChildrenList(t);
    }

    function adaptToChildrenList(o: any) {
        if (childrenListMap[o[config.id]] !== null) {
            o[config.childrenList] = childrenListMap[o[config.id]];
        }
        if (o[config.childrenList]) {
            for (let c of o[config.childrenList]) {
                adaptToChildrenList(c);
            }
        }
    }

    return tree;
}

// 回显数据字典
export function selectDictLabel(datas: any, value: any) {
    var actions = [] as any;
    Object.keys(datas).some((key) => {
        if (datas[key].dictValue == ('' + value)) {
            actions.push(datas[key].dictLabel);
            return true;
        }
    })
    return actions.join('');
}


// 通用下载方法
export function download(fileName: any) {
    window.location.href = baseURL + "common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}
