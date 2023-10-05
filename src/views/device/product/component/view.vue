<template>
  <el-drawer
      v-model="state.isShowDrawer"
      title="产品详情"
      direction="rtl"
      size="60%"
  >
    <el-tabs v-model="state.activeName" stretch>
      <el-tab-pane label="产品信息" name="info">
          <ProductInfo :rowData="state.rowData"></ProductInfo>
      </el-tab-pane>
      <el-tab-pane label="设备接入" name="topic">
        <ProductTopic :rowData="state.rowData"></ProductTopic>
      </el-tab-pane>
      <el-tab-pane v-if="state.rowData.deviceType !== 'monitor'" label="物模型" name="model">
        <ProductModel v-if="state.activeName === 'model'" :rowData="state.rowData"></ProductModel>
      </el-tab-pane>
      <el-tab-pane v-if="state.rowData.deviceType !== 'monitor'" label="固件管理" name="ota">
        <ProductOta v-if="state.activeName === 'ota'" :rowData="state.rowData"></ProductOta>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>

</template>

<script lang="ts" setup name="viewProduct">
import {reactive} from "vue";
import ProductInfo from "./product_info.vue"
import ProductTopic from "./product_topic.vue"
import ProductOta from "./product_ota.vue"
import ProductDevice from "./product_device.vue"
import ProductModel from "./product_model.vue"

const state = reactive({
  isShowDrawer: false,
  activeName: "info",
  rowData: {}
})

const openDrawer = (row: any) => {
  state.isShowDrawer = true;
  state.activeName = "info"
  state.rowData = row
}

defineExpose({
  openDrawer,
});
</script>

<style scoped>

</style>
