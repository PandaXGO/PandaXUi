<template>
  <FormDesign  ref="vfdRef" />
</template>

<script setup lang="ts">
    import {ref} from "vue";
    const vfdRef = ref()
</script>

<style lang="scss">
    body {
        margin: 0;  /* 如果页面出现垂直滚动条，则加入此行CSS以消除之 */
    }
</style>
