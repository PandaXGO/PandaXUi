<template>
  <slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed } from "vue";
import { useUserInfosState } from "@/stores/userInfos";
import { judementSameArr } from "@/utils/arrayOperation";
export default {
  name: "authAll",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  setup(props:any) {
    const userInfos = useUserInfosState();
    // 获取 vuex 中的用户权限
    const getUserAuthBtnList = computed(() => {
      return judementSameArr(props.value, userInfos.userInfos.authBtnList);
    });
    return {
      getUserAuthBtnList,
    };
  },
};
</script>
