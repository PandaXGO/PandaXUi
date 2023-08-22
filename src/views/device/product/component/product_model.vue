<template>
  <div style="margin: 10px">
    <div style="margin-bottom: 20px">
      <el-button type="primary">导入物模型</el-button>
      <el-button type="primary">物模型TSL</el-button>
    </div>

    <el-tabs v-model="activeName" :tab-position="tabPosition" type="border-card" style="height: 700px">
      <el-tab-pane label="属性模板" name="attributes">
        <Attributes v-if="activeName === 'attributes'" :rowData="rowData"/>
      </el-tab-pane>
      <el-tab-pane label="遥测模板" name="telemetry">
        <Telemetry v-if="activeName === 'telemetry'" :rowData="rowData" />
      </el-tab-pane>
      <el-tab-pane  label="命令服务" name="commands">
        <Commands v-if="activeName === 'commands'" :rowData="rowData"/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script lang="ts" setup>
import { ref} from "vue";
import Attributes from "./model/attributes.vue"
import Telemetry from "./model/telemetry.vue"
import Commands from "./model/commands.vue"

const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const tabPosition = ref('left')
const activeName = ref('attributes')

</script>

<style scoped>

</style>
