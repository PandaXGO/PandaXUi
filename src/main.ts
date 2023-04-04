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
import screenShort from 'vue-web-screen-shot';
// @ts-ignore
import VueGridLayout from 'vue-grid-layout';
// @ts-ignore
import XmForm from 'xmgo-vform'
import 'xmgo-vform/dist/designer.style.css'  //引入XmForm样式

const app = createApp(App);
const pinia = createPinia();

directive(app);
other.elSvg(app);

app
    .use(pinia)
	.use(router)
	.use(ElementPlus, { i18n: i18n.global.t, size: "default" })
	.use(XmForm)
	.use(i18n)
	.use(screenShort, { enableWebRtc: false })
    .use(VueGridLayout)
	.mount('#app');


app.config.globalProperties.mittBus = mitt();

// 全局方法挂载
app.config.globalProperties.getDicts = getDicts
app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.download = download
app.config.globalProperties.dateStrFormat = dateStrFormat
