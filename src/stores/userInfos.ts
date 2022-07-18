import { defineStore } from 'pinia';
import { UserInfosState } from 'storeInterface';
import { Session } from '@/utils/storage';
import Cookies from 'js-cookie';
import {letterAvatar} from "@/utils/string";
import { authUser } from "@/api/system/user";

export const useUserInfosState = defineStore('userInfos', {
	state: (): UserInfosState => ({
		userInfos: {
			username: "",
			photo: '',
			time: 0,
			authBtnList: [],

			userId: 0,
			roleId: 0,
			deptId: 0,
			postId: 0,

			lastLoginTime: 0,
			lastLoginIp: "127.0.0.1",
		},
	}),
	actions: {
		// 设置用户信息
		getUserInfos( data: object) {
			this.userInfos = data;
		},
		// 设置用户信息
		async setUserInfos() {
			const userName = Cookies.get('userName');

			let response = await authUser({"username": userName})
			let loginRes = response.data
			Session.set("menus", loginRes.menus);
			let perms = loginRes.permissions;
			perms.push("base");
			// 用户信息模拟数据
			const userInfos = {
				username: loginRes.user.username,
				userId: loginRes.user.userId,
				tenantId: loginRes.user.tenantId,
				tenantName: loginRes.user.tenants.tenantName,
				roleId: loginRes.user.roleId,
				deptId: loginRes.user.deptId,
				postId: loginRes.user.postId,
				// 头像
				photo: loginRes.user.avatar || letterAvatar(loginRes.user.username),
				time: new Date().getTime(),
				lastLoginTime: new Date().getTime(),
				lastLoginIp: "127.0.0.1",
				//authPageList: perms,
				authBtnList: perms,
			};
			// 存储用户信息到浏览器缓存
			Session.set('userInfo', userInfos);


			if (Session.get('userInfo')) {
				this.getUserInfos(Session.get('userInfo'));
			} else {
				this.getUserInfos(userInfos);
			}
		},
		async setUserInfo() {
			this.getUserInfos(Session.get('userInfo'));
		}

	},
});