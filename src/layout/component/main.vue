<template>
  <el-main class="layout-main">
    <el-button type="primary" color="#626aef" class="drawer-container" @click="showSettingDrawer" ><SvgIcon name="elementSetting" /></el-button>
    <el-scrollbar
      class="layout-scrollbar"
      ref="layoutScrollbarRef"
      :style="{
        minHeight: `calc(100vh - ${headerHeight})`,
        padding: currentRouteMeta.isLink && currentRouteMeta.isIframe ? 0 : '',
        transition: 'padding 0.3s ease-in-out',
      }"
    >
      <LayoutParentView />
      <Footer v-if="getThemeConfig.isFooter" />
    </el-scrollbar>
  </el-main>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  toRefs,
  reactive,
  getCurrentInstance,
  watch,
  onBeforeMount,
} from "vue";
import { useThemeConfigStateStore } from "@/stores/themeConfig";
import { useRoute } from "vue-router";
import LayoutParentView from "@/layout/routerView/parent.vue";
import Footer from "@/layout/footer/index.vue";
export default defineComponent({
  name: "layoutMain",
  components: { LayoutParentView, Footer },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const route = useRoute();
    const theme = useThemeConfigStateStore();
    const state = reactive({
      headerHeight: "",
      currentRouteMeta: {},
    });
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return theme.themeConfig;
    });
    // 设置 main 的高度
    const initHeaderHeight = () => {
      let { isTagsview } = theme.themeConfig;
      if (isTagsview) return (state.headerHeight = `84px`);
      else return (state.headerHeight = `50px`);
    };
    // 初始化获取当前路由 meta，用于设置 iframes padding
    const initGetMeta = () => {
      state.currentRouteMeta = route.meta;
    };
    // 布局配置 icon 点击时
    const showSettingDrawer = () => {
      proxy.mittBus.emit("openSetingsDrawer");
    }
    // 页面加载前
    onBeforeMount(() => {
      initHeaderHeight();
      initGetMeta();
    });
    // 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
    watch(theme.themeConfig, (val) => {
      state.headerHeight = val.isTagsview ? "84px" : "50px";
      if (val.isFixedHeaderChange !== val.isFixedHeader) {
        if (!proxy.$refs.layoutScrollbarRef) return false;
        proxy.$refs.layoutScrollbarRef.update();
      }
    });
    // 监听路由变化
    watch(
      () => route.path,
      () => {
        state.currentRouteMeta = route.meta;
      }
    );
    return {
      getThemeConfig,
      showSettingDrawer,
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
.drawer-container {
    transition: all 0.2s;
    &:hover{
      right: 0
    }
    position: fixed;
    right: 10px;
    top: 20%;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    -webkit-box-shadow: inset 0 0 6px rgba(0 ,0 ,0, 10%);
}

</style>