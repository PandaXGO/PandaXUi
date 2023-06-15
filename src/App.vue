<template>
  <el-config-provider :locale="zhCn">
    <router-view v-show="getThemeConfig.lockScreenTime !== 0" />
    <LockScreen v-if="getThemeConfig.isLockScreen" />
    <Setings ref="setingsRef" v-show="getThemeConfig.lockScreenTime !== 0" />
    <CloseFull />
  </el-config-provider>
</template>

<script lang="ts">
import {
  computed,
  ref,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  nextTick,
  defineComponent,
  watch,
  reactive,
  toRefs,
} from "vue";
import { useRoute } from "vue-router";
import { useThemeConfigStateStore } from "@/stores/themeConfig";
import { useTagsViewRoutesStore } from "@/stores/tagsViewRoutes";
import other from "@/utils/other";
import { Local, Session } from "@/utils/storage";
import setIntroduction from "@/utils/setIconfont";
import LockScreen from "@/layout/lockScreen/index.vue";
import Setings from "@/layout/navBars/breadcrumb/setings.vue";
import CloseFull from "@/layout/navBars/breadcrumb/closeFull.vue";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
export default defineComponent({
  name: "app",
  components: { LockScreen, Setings, CloseFull },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const setingsRef = ref();
    const route = useRoute();
    const theme = useThemeConfigStateStore();
    const tagsViewRoutes = useTagsViewRoutesStore();
    const state: any = reactive({
      i18nLocale: null,
    });

    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return theme.themeConfig;
    });
    // 布局配置弹窗打开
    const openSetingsDrawer = () => {
      setingsRef.value.openDrawer();
    };
    // 设置初始化，防止刷新时恢复默认
    onBeforeMount(() => {
      // 设置批量第三方 icon 图标
      setIntroduction.cssCdn();
      // 设置批量第三方 js
      setIntroduction.jsCdn();
    });
    // 页面加载时
    onMounted(() => {
      nextTick(() => {
        // 监听布局配置弹窗点击打开
        proxy.mittBus.on("openSetingsDrawer", () => {
          openSetingsDrawer();
        });
        // 获取缓存中的布局配置
        if (Local.get("themeConfig")) {
          theme.setThemeConfig(Local.get("themeConfig"));
          document.documentElement.style.cssText = Local.get("themeConfigStyle");
        }
        // 获取缓存中的全屏配置
        if (Session.get("isTagsViewCurrenFull")) {
          tagsViewRoutes.setCurrenFullscreen(Session.get("isTagsViewCurrenFull"));
        }
      });
    });
    // 页面销毁时，关闭监听布局配置/i18n监听
    onUnmounted(() => {
      proxy.mittBus.off("openSetingsDrawer", () => {});
      proxy.mittBus.off("getI18nConfig", () => {});
    });
    // 监听路由的变化，设置网站标题
    watch(
      () => route.path,
      () => {
        other.useTitle();
      }
    );
    return {
      zhCn,
      setingsRef,
      getThemeConfig,
      ...toRefs(state),
    };
  },
});
</script>
