<template>
  <slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed } from "vue";
import { useUserInfosState } from "@/stores/userInfos";
export default {
  name: "auth",
  props: {
    value: {
      type: String,
      default: () => "",
    },
  },
  setup(props:any) {
    const userInfos = useUserInfosState();
    // 获取 vuex 中的用户权限
    const getUserAuthBtnList = computed(() => {
      return userInfos.userInfos.authBtnList.some((v: any) => v === props.value);
    });
    return {
      getUserAuthBtnList,
    };
  },
};
</script>
