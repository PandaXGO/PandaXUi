import { defineStore } from 'pinia';
import { UserInfosState } from 'storeInterface';
import { Session } from '/@/utils/storage';
export const useUserInfosState = defineStore('userInfos', {
	state: (): UserInfosState => ({
		userInfos: {},
	}),
	actions: {
		// 设置用户信息
		getUserInfos( data: object) {
			this.userInfos = data;
		},
		// 设置用户信息
		async setUserInfos( data?: object) {
			if (data) {
				this.getUserInfos( data);
			} else {
				if (Session.get('userInfo')) this.getUserInfos(Session.get('userInfo'));
			}
		},
	},
});