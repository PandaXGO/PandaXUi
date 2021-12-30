<template>
    <div style="height:85vh">
        <iframe width="100%" height="100%" :src="`${state.url}/form-generator/#/`" frameborder="0" />
    </div>
</template>

<script setup lang="ts">
    const baseURL = import.meta.env.VITE_API_URL
    import {reactive} from 'vue'
    const state = reactive({
        // 遮罩层
        url: baseURL,
        });
</script>

<style lang="scss">

</style>