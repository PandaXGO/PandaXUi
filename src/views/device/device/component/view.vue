<template>
  <el-drawer
      v-model="state.isShowDrawer"
      title="设备详情"
      direction="rtl"
      size="62%"
  >
    <el-tabs v-model="state.activeName" stretch>
      <el-tab-pane label="设备详情" name="info">
        <DeviceInfo :rowData="state.rowData"/>
      </el-tab-pane>
      <el-tab-pane label="拓展信息" name="ext">
        <DeviceExt v-if="state.activeName === 'ext'" :rowData="state.rowData"/>
      </el-tab-pane>
      <template v-if="state.rowData.deviceType !== 'monitor'">
        <el-tab-pane  label="设备状态" name="property">
          <DeviceProperty  v-if="state.activeName === 'property'" :rowData="state.rowData"/>
        </el-tab-pane>
        <el-tab-pane label="告警详情" name="alarm">
          <DeviceAlarm v-if="state.activeName === 'alarm'" :rowData="state.rowData"/>
        </el-tab-pane>
        <el-tab-pane label="命令下发" name="commands">
          <DeviceCmd v-if="state.activeName === 'commands'" :rowData="state.rowData"></DeviceCmd>
        </el-tab-pane>
      </template>
      <template v-else>
        <el-tab-pane label="设备通道" name="channel">
          <DeviceChannel v-if="state.activeName === 'channel'" :rowData="state.rowData"/>
        </el-tab-pane>
      </template>
      <el-tab-pane v-if="state.rowData.deviceType === 'gateway'" label="子设备" name="deviceS">
        <DeviceSub v-if="state.activeName === 'deviceS'" :rowData="state.rowData"></DeviceSub>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>

</template>

<script lang="ts" setup name="viewDevice">
import {reactive} from "vue";
import DeviceInfo from "./device_info.vue"
import DeviceExt from "./device_ext.vue"
import DeviceProperty from "./device_property.vue"
import DeviceSub from "./device_sub.vue"
import DeviceAlarm from "./device_alarm.vue"
import DeviceCmd from "./device_cmd.vue"
import DeviceChannel from "./device_channel.vue"

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
