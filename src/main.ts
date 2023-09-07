import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia'
import router from './router';
import { directive } from '@/utils/directive';
import { i18n } from '@/i18n/index';
import other from '@/utils/other';
import {addDateRange,parseTime,handleTree,selectDictLabel,download} from '@/utils'
import { getDicts } from "@/api/system/dict/data"
import { dateStrFormat } from "@/utils/formatTime"
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/theme/index.scss';
import mitt from 'mitt';
// @ts-ignore
import XmForm from 'pandax-form'
import 'pandax-form/dist/designer.style.css'  //引入XmForm样式
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'

initAMapApiLoader({
	key: '86fc3e60687d0a24e4badd8c1b0f4ea0',
	securityJsCode: '4f809401e3babecd6bc49eb79a17086a', // 新版key需要配合安全密钥使用
	plugins: [
		"AMap.Autocomplete",
		"AMap.PlaceSearch",
		"AMap.Scale",
		"AMap.OverView",
		"AMap.ToolBar",
		"AMap.MapType",
		"AMap.PolyEditor",
		"AMap.CircleEditor",
		"AMap.Geocoder",
		"AMap.Geolocation"
	],
})

const app = createApp(App);
const pinia = createPinia();

directive(app);
other.elSvg(app);
app.use(VueAMap)

app
	.use(ElementPlus)
	.use(i18n)
	.use(pinia)
	.use(router)
	.use(XmForm)
	.mount('#app');

// 全局方法挂载
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.download = download
app.config.globalProperties.dateStrFormat = dateStrFormat
