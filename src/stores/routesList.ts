import { defineStore } from 'pinia';
import { RoutesListState } from 'storeInterface';
export const useRoutesListStore = defineStore('routesList', {
	state: (): RoutesListState => ({
		routesList: [],
		isColumnsMenuHover: false,
		isColumnsNavHover: false,
	}),
	actions: {
		// 设置路由，菜单中使用到
		getRoutesList(data: Array<object>) {
			this.routesList = data;
		},
		// 设置分栏布局，鼠标是否移入移出（菜单）
		getColumnsMenuHover(bool: Boolean) {
			this.isColumnsMenuHover = bool;
		},
		// 设置分栏布局，鼠标是否移入移出（导航）
		getColumnsNavHover(bool: Boolean) {
			this.isColumnsNavHover = bool;
		},
		// 设置路由，菜单中使用到
		async setRoutesList(data: any) {
			this.getRoutesList( data);
		},
		// 设置分栏布局，鼠标是否移入移出（菜单）
		async setColumnsMenuHover(bool: Boolean) {
			this.getColumnsMenuHover( bool);
		},
		// 设置分栏布局，鼠标是否移入移出（菜单）
		async setColumnsNavHover(bool: Boolean) {
			this.getColumnsNavHover( bool);
		},
	},
});

