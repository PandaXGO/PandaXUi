
import { useKeepAliveNamesStore } from '@/stores/keepAliveNames'
import { useRoutesListStore } from "@/stores/routesList";
import { useTagsViewRoutesStore } from "@/stores/tagsViewRoutes";
import { useUserInfosState } from "@/stores/userInfos";
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {Session} from '@/utils/storage';
import { NextLoading } from '@/utils/loading';
import { staticRoutes, staticPageRoutes } from '@/router/route';
import { getRoutes } from '@/api/system/menu';
import pinia from "@/stores";
import {storeToRefs} from "pinia";

const Layout = () => import('@/layout/index.vue')
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');


/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules });
/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
const router = createRouter({
	history: createWebHashHistory(),
	routes: staticRoutes,
});
// 后端控制路由：模拟执行路由数据初始化
export async function initBackEndControlRoutes() {
    const routesList = useRoutesListStore();
    const tagsViewRoutes = useTagsViewRoutesStore();
    const userInfos = useUserInfosState();

	if (window.nextLoading === undefined) NextLoading.start();
	const token = Session.get('token'); // 获取浏览器缓存 token 值
	if (!token) {
		// 无 token 停止执行下一步
		return false
	}
	let menuRoute = Session.get('menus')
	if (!menuRoute) {
		await userInfos.setUserInfos(); // 触发初始化用户信息
		menuRoute = Session.get('menus')
	}
	let drs = [
		{
			path: '/',
			name: '/',
			component: () => import('@/layout/index.vue'),
			redirect: '/home',
			meta: {
				isKeepAlive: true,
			},
			children: [
				{
					path: '/home',
					name: 'home',
					component: () => import('@/views/home/index.vue'),
					meta: {
						title: 'message.router.home',
						isLink: '',
						isHide: false,
						isKeepAlive: true,
						isAffix: true,
						isIframe: false,
						icon: 'iconfont icon-shouye',
					},
				},
			],
		},
	]

	drs[0].children = drs[0].children?.concat(backEndRouterConverter(menuRoute))
	// @ts-ignore
	drs[0].children?.push( staticPageRoutes[0] );

	// 添加404界面
	router.addRoute(pathMatch);
	// 添加动态路由
	formatTwoStageRoutes(formatFlatteningRoutes(drs)).forEach((route: any) => {
		router.addRoute((route as unknown) as RouteRecordRaw);
	});
	routesList.setRoutesList(drs[0].children);
	// 添加到 pinia setTagsViewRoutes 中
	tagsViewRoutes.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(drs))[0].children);
}


// 后端控制路由，后端返回路由 转换为vue route
export function backEndRouterConverter(routes: any, parentPath: string = "/") {
	if (!routes) return;
	return routes.map((item: any) => {
		if (!item.meta.auth || item.meta.auth.length === 0){
			delete item.meta.auth
		}
		item.component = item.component === 'Layout' || item.component === ''? Layout : dynamicImport(dynamicViewsModules, item.component as string);
		if (!item.redirect || item.redirect == "") {
			delete item.redirect
		}
		let path = item.path
		// 如果不是以 / 开头，则路径需要拼接父路径
		if (!path.startsWith("/")) {
			path = parentPath + "/" + path;
		}
		item.path = path
		item.children && backEndRouterConverter(item.children,item.path);
		if (item.children.length === 0){
			delete item.children
		}

		return item;
	});
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		return false;
	}
}

/**
 * 定义404界面
 * @link 参考：https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
 */
const pathMatch = {
	path: '/:path(.*)*',
	redirect: '/404',
};

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（dynamicRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
    const keepAliveNames = useKeepAliveNamesStore();
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			// 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 路径：@/layout/routerView/parent.vue
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				keepAliveNames.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}

// 路由加载前
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();
	const token = Session.get('token');
	if (to.path === '/login' && !token) {
		next();
		NProgress.done();
	} else {
		if (!token) {
			next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			next('/home');
			NProgress.done();
		} else {
			const routesList = useRoutesListStore();
			if (routesList.routesList.length === 0) {
				// 后端控制路由：路由数据初始化，防止刷新时丢失
				await initBackEndControlRoutes();
				// 动态添加路由：防止非首页刷新时跳转回首页的问题
				// 确保 addRoute() 时动态添加的路由已经被完全加载上去
				next({ ...to, replace: true });
			} else {
				const userInfos = useUserInfosState();
				userInfos.setUserInfo()
				next();
			}
			NProgress.done();
		}
	}
});

// 路由加载后
router.afterEach(() => {
	NProgress.done();
	NextLoading.done();
});

// 导出路由
export default router;