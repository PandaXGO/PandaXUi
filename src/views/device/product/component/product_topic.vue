<template>
  <div style="margin: 10px">
    <el-descriptions v-if="rowData.deviceType === 'monitor'" :column="2" border>
      <el-descriptions-item label="SIP服务器" align="center" :span="2">{{tableMonitorData.sipip}}</el-descriptions-item>
      <el-descriptions-item label="SIP编号" align="center" width="100">{{tableMonitorData.serial}}</el-descriptions-item>
      <el-descriptions-item label="SIP域" align="center" width="100">{{tableMonitorData.realm}}</el-descriptions-item>
      <el-descriptions-item label="用户名" align="center" width="100">{{tableMonitorData.username}}</el-descriptions-item>
      <el-descriptions-item label="密码" align="center" width="100">{{tableMonitorData.password}}</el-descriptions-item>
    </el-descriptions>
    <el-table
        v-else
        :data="tableData"
        :span-method="objectSpanMethod"
        :header-cell-style="{background: 'var(--color-primary)', color: '#000', textAlign: 'center'}"
        border
        style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="group" label="分组" width="160" />
      <el-table-column prop="topic" label="Topic" width="320" />
      <el-table-column prop="stream" label="数据流向" width="100"/>
      <el-table-column prop="platform" label="平台" width="100"/>
      <el-table-column prop="device" label="设备" width="100"/>
      <el-table-column prop="describe" label="描述" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})


const tableMonitorData = {
    sipip: '${ip}:5060',
    serial: "34020000002000000001",
    realm: '3402000000',
    username: '${设备编号}',
    password: "pandax",
}



const tableData = [
  {
    group: '原始数据',
    topic: "v1/devices/me/raw",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "设备端上报原始数据到服务端",
  },
  {
    group: '设备属性',
    topic: "v1/devices/me/attributes",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "设备端上报属性到服务端",
  },
  {
    group: '设备遥测',
    topic: "v1/devices/me/telemetry",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "设备遥测上报到服务端",
  },
  {
    group: '网关子设备',
    topic: "v1/gateway/attributes",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "网关上报子设备客户端属性",
  },{
    group: '网关子设备',
    topic: "v1/gateway/telemetry",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "网关上报子设备客户端遥测",
  },{
    group: '网关子设备',
    topic: "v1/gateway/connect",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "网关子设备连接上线",
  },{
    group: '网关子设备',
    topic: "v1/gateway/disconnect",
    stream: '上行',
    platform: '订阅',
    device: '发布',
    describe: "网关子设备连接下线",
  },{
    group: '设备命令',
    topic: "v1/devices/me/rpc/request/$request_id",
    stream: '上行、下行',
    platform: '订阅、发布',
    device: '发布、订阅',
    describe: "设备调用服务端方法，服务端命令下发到设备",
  },{
    group: '设备命令',
    topic: "v1/devices/me/rpc/response/$request_id",
    stream: '下行、上行',
    platform: '发布、订阅',
    device: '订阅、发布',
    describe: "服务端响应调用方法结果，设备端响应命令执行结果",
  }
]

const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
  if (columnIndex === 0) {
    if (rowIndex === 0 || row.group !== tableData[rowIndex - 1].group) {
      return {
        rowspan: getGroupRowCount(row.group),
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

const getGroupRowCount = (group) => {
  let count = 0
  tableData.forEach(row => {
    if (row.group === group) {
      count++
    }
  })
  return count
}

</script>

<style scoped>

</style>
