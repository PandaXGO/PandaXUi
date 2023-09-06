<template>
  <div style="margin: 10px">
  <el-descriptions :column="2" border>
    <el-descriptions-item
        label="产品图片"
        align="center"
        :span="2"
    >
      <el-image :src="baseURL + '/upload/get/'+ rowData.photoUrl" class="uploader-image" fit="fill">
        <template #error>
          <div class="image-slot">
            <el-image :src="rowData.deviceType ==='direct' ? monitorImg : rowData.deviceType ==='gatewayS' ? gatewayDImg : gatewayImg" fit="fill" />
          </div>
        </template>
      </el-image>
    </el-descriptions-item>
    <el-descriptions-item label="产品ID" align="center" width="100">{{rowData.id}}</el-descriptions-item>
    <el-descriptions-item label="产品名称" align="center" width="100">{{rowData.name}}</el-descriptions-item>
    <el-descriptions-item label="所属分类" align="center" width="100">{{rowData.productCategory.name}}</el-descriptions-item>
    <el-descriptions-item label="设备类型" align="center" width="100">{{rowData.deviceType ==='direct' ? '直连设备': rowData.deviceType ==='gateway' ? '网关设备': '网关子设备'}}</el-descriptions-item>
    <el-descriptions-item label="连接类型"  align="center">
      <el-tag  type="primary">{{rowData.directConnection ? "直连": "非直连"}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="协议名称"  align="center">
      <el-tag type="primary">{{rowData.protocolName}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="规则链库" align="center">
      Root Rule Chain
    </el-descriptions-item>
    <el-descriptions-item label="创建时间" align="center">
      {{ dateStrFormat(rowData.createTime) }}
    </el-descriptions-item>
    <el-descriptions-item label="产品说明" align="center" :span="2">
      {{rowData.description}}
    </el-descriptions-item>
  </el-descriptions>
  </div>
</template>

<script lang="ts" setup>
import gatewayImg from '@/assets/gateway.png'
import gatewayDImg from '@/assets/gateway_d.png'
import monitorImg from '@/assets/monitor.png'
const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const baseURL = import.meta.env.VITE_API_URL
</script>

<style scoped>

</style>
