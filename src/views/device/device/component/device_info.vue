<template>
  <div style="margin: 10px">
    <el-descriptions title="设备信息" :column="2" border>
      <el-descriptions-item label="设备ID" align="center" width="100">{{rowData.id}}</el-descriptions-item>
      <el-descriptions-item label="设备状态" align="center" width="100">
        <el-tag class="ml-3" :type="rowData.linkStatus ==='inactive'? 'warning': rowData.linkStatus ==='online' ? 'primary': 'danger'">
          {{rowData.linkStatus ==='inactive'? "未激活": rowData.linkStatus ==='online' ? '在线': "离线"}}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="设备编码" align="center" width="100">{{rowData.name}}</el-descriptions-item>
      <el-descriptions-item label="设备别名" align="center" width="100">{{rowData.alias}}</el-descriptions-item>
      <el-descriptions-item label="所属分组" align="center" width="100">{{rowData.deviceGroup.name}}</el-descriptions-item>
      <el-descriptions-item label="所属产品" align="center" width="100">{{rowData.product.name}}</el-descriptions-item>
      <el-descriptions-item label="设备类型" align="center" width="100">{{rowData.deviceType ==='direct' ? '直连设备': rowData.deviceType ==='gateway' ? '网关设备': rowData.deviceType ==='gatewayS'?'网关子设备':'监控设备'}}</el-descriptions-item>
      <el-descriptions-item label="创建时间" align="center">
        {{ dateStrFormat(rowData.createTime) }}
      </el-descriptions-item>
      <el-descriptions-item label="设备说明" align="center" :span="2">
        {{rowData.description}}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions v-if="rowData.token" title="MQTT认证配置" :column="2" border style="margin-top: 20px">
      <el-descriptions-item label="AuthToken" align="center" width="100">{{rowData.token}}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})

</script>

<style scoped>

</style>
