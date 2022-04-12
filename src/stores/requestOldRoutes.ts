import {defineStore} from 'pinia'
import { RequestOldRoutesState} from 'storeInterface';

export const useRequestOldRoutesStateStore = defineStore(
    'requestOldRoutes',{
        state: (): RequestOldRoutesState => ({
            requestOldRoutes: [],
        }),
        actions: {
            // 后端控制路由
			getBackEndControlRoutes(data: string[]) {
				this.requestOldRoutes=data;
            },
            // 后端控制路由
            setBackEndControlRoutes(routes: Array<string> ){
                // 需要类型转换，先待定
                this.getBackEndControlRoutes( routes);
            },
        }
	
})
