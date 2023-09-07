import { createI18n } from 'vue-i18n';
import zhcnLocale from 'element-plus/dist/locale/zh-cn.mjs';
import enLocale from 'element-plus/dist/locale/en.mjs';
import nextZhcn from '@/i18n/lang/zh-cn';
import nextEn from '@/i18n/lang/en';

import pagesHomeZhcn from '@/i18n/pages/home/zh-cn';
import pagesHomeEn from '@/i18n/pages/home/en';
import pinia from '@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfigStateStore } from '@/stores/themeConfig';

import pagesLoginZhcn from '@/i18n/pages/login/zh-cn';
import pagesLoginEn from '@/i18n/pages/login/en';
import pagesFormI18nZhcn from '@/i18n/pages/formI18n/zh-cn';
import pagesFormI18nEn from '@/i18n/pages/formI18n/en';



// 定义语言国际化内容
/**
 * 说明：
 * /src/i18n/lang 下的 ts 为框架的国际化内容
 * /src/i18n/pages 下的 ts 为各界面的国际化内容
 */
const messages = {
	[zhcnLocale.name]: {
		...zhcnLocale,
		message: {
			...nextZhcn,
			...pagesHomeZhcn,
			...pagesLoginZhcn,
			...pagesFormI18nZhcn,
		},
	},
	[enLocale.name]: {
		...enLocale,
		message: {
			...nextEn,
			...pagesHomeEn,
			...pagesLoginEn,
			...pagesFormI18nEn,
		},
	},
};
const stores = useThemeConfigStateStore(pinia);
const { themeConfig } = storeToRefs(stores);
 //导出语言国际化
export const i18n = createI18n({
	legacy: false,
	silentTranslationWarn: true,
	missingWarn: false,
	silentFallbackWarn: true,
	fallbackWarn: false,
	locale: themeConfig.value.globalI18n,
	fallbackLocale: zhcnLocale.name,
	messages,
});



