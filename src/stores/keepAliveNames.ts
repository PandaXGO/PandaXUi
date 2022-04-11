// import { Module } from 'vuex';
import { defineStore } from 'pinia';
// 此处加上 `.ts` 后缀报错，具体原因不详
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

