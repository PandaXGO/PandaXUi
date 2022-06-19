import { defineStore } from 'pinia';
import {KeepAliveNamesState} from 'storeInterface'
export const useKeepAliveNamesStore = defineStore(
    'keepAliveNames',{
        state: (): KeepAliveNamesState => ({
            keepAliveNames: [],
        }),
        actions: {
            // 设置路由缓存（name字段）
            getCacheKeepAlive(data: Array<string>) {
                this.keepAliveNames = data;
            },
            // 设置路由缓存（name字段）
            async setCacheKeepAlive(data: Array<string>) {
                this.getCacheKeepAlive(data);
            },
        }
	
})

