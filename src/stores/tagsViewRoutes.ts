import { defineStore } from 'pinia';
import { TagsViewRoutesState } from 'storeInterface';
import { Session } from '@/utils/storage';
export const useTagsViewRoutesStore = defineStore('tagsViewRoutes', {
	state: (): TagsViewRoutesState => ({
		tagsViewRoutes: [],
		isTagsViewCurrenFull: false,
	}),
	actions: {
		// 设置 TagsView 路由
		getTagsViewRoutes( data: Array<string>) {
			this.tagsViewRoutes = data;
		},
		// 设置卡片全屏
		getCurrenFullscreen( bool: boolean) {
			Session.set('isTagsViewCurrenFull', bool);
			this.isTagsViewCurrenFull = bool;
		},
		// 设置 TagsView 路由
		async setTagsViewRoutes(data: Array<string>) {
			this.getTagsViewRoutes( data);
		},
		// 设置卡片全屏
		setCurrenFullscreen( bool: boolean) {
			this.getCurrenFullscreen( bool);
		},
	},
});