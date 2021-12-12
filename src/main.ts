import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import { globalComponentSize } from '/@/utils/componentSize';
import {addDateRange,parseTime,handleTree,selectDictLabel,download} from '/@/utils'
import { getDicts } from "/@/api/system/dict/data"
import { dateStrFormat } from "/@/utils/formatTime"

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import mitt from 'mitt';
import screenShort from 'vue-web-screen-shot';
import VueGridLayout from 'vue-grid-layout';

const app = createApp(App);
app
	.use(router)
	.use(store, key)
	.use(ElementPlus, { i18n: i18n.global.t, size: globalComponentSize })
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


directive(app);
