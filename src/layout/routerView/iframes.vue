<template>
  <div
    class="layout-view-bg-white flex mt1"
    :style="{ height: `calc(100vh - ${setIframeHeight}`, border: 'none' }"
    v-loading="iframeLoading"
  >
    <iframe
      :src="iframeUrl"
      frameborder="0"
      height="100%"
      width="100%"
      id="iframe"
      v-show="!iframeLoading"
    ></iframe>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  nextTick,
  watch,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import { useThemeConfigStateStore } from "@/stores/themeConfig";
import { useTagsViewRoutesStore } from "@/stores/tagsViewRoutes";
export default defineComponent({
  name: "layoutIfameView",
  setup() {
    const route = useRoute();
     
    const theme = useThemeConfigStateStore();
    const tagsViewRoutes = useTagsViewRoutesStore();
    const state = reactive({
      iframeLoading: true,
      iframeUrl: "",
    });
    // 初始化页面加载 loading
    const initIframeLoad = () => {
      state.iframeUrl = route.meta.isLink;
      nextTick(() => {
        state.iframeLoading = true;
        const iframe = document.getElementById("iframe");
        if (!iframe) return false;
        iframe.onload = () => {
          state.iframeLoading = false;
        };
      });
    };
    // 设置 iframe 的高度
    const setIframeHeight = computed(() => {
      let { isTagsview } = theme.themeConfig;
      let { isTagsViewCurrenFull } = tagsViewRoutes;
      if (isTagsViewCurrenFull) {
        return `1px`;
      } else {
        if (isTagsview) return `85px`;
        else return `51px`;
      }
    });
    // 页面加载时
    onMounted(() => {
      initIframeLoad();
    });
    // 监听路由变化，多个 iframe 时使用
    watch(
      () => route.path,
      () => {
        initIframeLoad();
      }
    );
    return {
      setIframeHeight,
      ...toRefs(state),
    };
  },
});
</script>
