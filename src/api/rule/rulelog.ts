import request from '@/utils/request';

export function listRuleLog(query:any) {
	return request({
		url: '/rule/chain/log/list',
		method: 'get',
		params: query
	})
}

export function delRuleLog(query:any) {
	return request({
		url: '/rule/chain/log/delete',
		method: 'get',
		params: query
	})
}
