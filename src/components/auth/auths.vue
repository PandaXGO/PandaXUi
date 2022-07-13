<template>
  <slot v-if="getUserAuthBtnList" />
</template>

<script lang="ts">
import { computed } from "vue";
import { useUserInfosState } from "@/stores/userInfos";
export default {
  name: "auths",
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const userInfos = useUserInfosState();
    // 获取 vuex 中的用户权限
    const getUserAuthBtnList = computed(() => {
      let flag = false;
      userInfos.userInfos.authBtnList.map((val: any) => {
        props.value.map((v) => {
          if (val === v) flag = true;
        });
      });
      return flag;
    });
    return {
      getUserAuthBtnList,
    };
  },
};
</script>
