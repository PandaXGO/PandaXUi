<template>
  <el-header
    class="layout-header"
    :height="setHeaderHeight"
    v-show="!isTagsViewCurrenFull"
  >
    <NavBarsIndex />
  </el-header>
</template>

<script lang="ts">
import { computed } from "vue";
import { useThemeConfigStateStore } from "@/stores/themeConfig";
import { useTagsViewRoutesStore } from "@/stores/tagsViewRoutes";
import NavBarsIndex from "@/layout/navBars/index.vue";
export default {
  name: "layoutHeader",
  components: { NavBarsIndex },
  setup() {
    const theme = useThemeConfigStateStore();
    const tagsViewRoutes = useTagsViewRoutesStore();
    // 设置 header 的高度
    const setHeaderHeight = computed(() => {
      let { isTagsview, layout } = theme.themeConfig;
      if (isTagsview && layout !== "classic") return "84px";
      else return "50px";
    });
    // 获取卡片全屏信息
    const isTagsViewCurrenFull = computed(() => {
      return tagsViewRoutes.isTagsViewCurrenFull;
    });
    return {
      setHeaderHeight,
      isTagsViewCurrenFull,
    };
  },
};
</script>
