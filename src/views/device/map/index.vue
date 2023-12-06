<template>
  <div class="app-container">
    <div class="amap-map" >
      <el-amap vid="map" class="amap-box" v-bind="mapConfig" viewMode="3D" @click="mapClick">
        <el-amap-control-tool-bar visible ></el-amap-control-tool-bar>
        <el-amap-control-control-bar visible></el-amap-control-control-bar>
        <el-amap-control-map-type visible ></el-amap-control-map-type>
        <el-amap-control-hawk-eye visible ></el-amap-control-hawk-eye>
        <el-amap-marker  v-for="(marker, index) in state.markers" :key="'marker_'+index" :position="marker.position" :content="marker.content" :label="marker.label" @click="marker.click"></el-amap-marker>
        <el-amap-info-window :position="state.boatWindow.position" :content="state.boatWindow.content" :visible="state.boatWindow.visible" :offset="state.boatWindow.offset" :is-custom="true" :auto-move="true" />
      </el-amap>
    </div>
    <div class="control-item">
      <!-- 查询 -->
      <el-card shadow="always">
      <el-form :model="state.queryParams" ref="queryForm" label-width="68px">
        <el-form-item label="设备名称" prop="name">
          <el-input
              v-model="state.queryParams.name"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属产品" prop="pid">
          <el-select v-model="state.queryParams.pid" filterable  placeholder="请选择所属产品" clearable >
            <el-option v-for="product in state.productAllOptions" :key="product.id" :label="product.name" :value="product.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="deviceType">
          <el-select v-model="state.queryParams.deviceType" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in deviceTypeOptions"
                :key="dict.label"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <SvgIcon name="elementSearch" />搜索</el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="elementRefresh" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
      </el-card>
      <el-card class="box-card">
        <el-scrollbar height="300px">
        <el-table :data="state.tableData">
          <el-table-column label="名称" align="center" prop="name"/>
          <el-table-column label="设备类型" align="center" prop="deviceType">
            <template #default="scope">
              {{scope.row.deviceType ==='direct' ? '直连设备': scope.row.deviceType ==='gateway' ? '网关设备': '网关子设备'}}
            </template>
          </el-table-column>
          <el-table-column label="设备状态" align="center" prop="linkStatus">
            <template #default="scope">
              <el-tag class="ml-3" :type="scope.row.linkStatus ==='inactive'? 'warning': scope.row.linkStatus ==='online' ? 'primary': 'danger'">
                {{scope.row.linkStatus ==='inactive'? "未激活": scope.row.linkStatus ==='online' ? '在线': "离线"}}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
        </el-scrollbar>
        <div v-show="state.total > 0" style="margin-top: 5px">
          <el-pagination
              small
              background
              :total="state.total"
              :current-page="state.queryParams.pageNum"
              :page-size="state.queryParams.pageSize"
              layout="total, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive,onMounted} from "vue";
import {listDevice} from "@/api/device/device";
import {listProductAll} from "@/api/device/product";
import {dateStrFormat} from "@/utils/formatTime";

const mapConfig = ref({
  zoom: 8,
  center: [116.39, 39.9],
  // 地图插件
  plugin: [
    'MapType'
  ],
})

const deviceTypeOptions = [{
  label: "未激活",
  value: "inactive"
},{
  label: "在线",
  value: "online"
},{
  label: "离线",
  value: "offline"
}]

const state = reactive({
  // 遮罩层
  loading: false,
  // 表格数据
  tableData: [],
  currentDevice: {},
  // 当前坐标
  position: [],
  // 点坐标
  markers: [],
  // 信息窗体
  boatWindows: [],
  boatWindow: {
    visible: false,
    position: [116.39, 39.9],
    content: "",
    offset: [10, -30]
  },
  // 总条数
  total: 0,
  productAllOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 8,
    // 以下为参数
    name: "",
    deviceType: "",
    pid: ""
  },
});

const mapClick = () => {
  state.boatWindow.visible = false
}

const handleQuery = () => {
  listDevice(state.queryParams).then((response:any) => {
    if (response.code === 200){
      state.tableData = response.data.data;
      state.total = response.data.total;
      renderMarks()
    }
  });
};

const resetQuery = () => {
  state.queryParams.name = "";
  state.queryParams.deviceType = "";
  state.queryParams.pid = "";
  handleQuery();
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}
// 获取所有在线的产品
const geyProductAll = () => {
  listProductAll({status: "0"}).then((res:any)=>{
    if (res.code === 200)
      state.productAllOptions = res.data
  })
}


const renderMarks = () => {
  state.markers = []
  state.tableData.forEach((item:any) => {
    if (item.ext) {
      state.markers.push({
        position: item.ext.location.position,
        label: {
          content: `<div class="label-info">${item.name} - ${item.alias}</div>`,
          offset: [5, 5],
          direction: 'bottom'
        },
        click: (e) => {
          state.currentDevice = item
          createWindow();
        }
      })
    }
  })
}

const createWindow = () =>{
  state.boatWindow.visible = true
  state.boatWindow.position = state.currentDevice.ext.location.position
  state.boatWindow.content = `<div style="display: flex;flex-direction: column;justify-content: space-between; white-space: nowrap;min-width: 240px;border-radius:6px; background: #fff;padding:12px;box-shadow:3px 5px 3px #ccc; font-size:15px">
             <div style="line-height:30px;display:flex;justify-content:space-between">
               <div><span style="font-weight:bold;">设备名：</span>${state.currentDevice.name}</div>
               <div style="margin-left:20px"><span style="font-weight:bold;">设备别名：</span>${state.currentDevice.alias}</div>
             </div>
             <div style="line-height:30px;display:flex;justify-content:space-between">
              <div style="margin-right: 20px"><span style="font-weight:bold;">最后在线时间：</span>${ dateStrFormat(state.currentDevice.lastTime) }</div>
              <span class="el-tag ${state.currentDevice.linkStatus ==='inactive'? 'el-tag--warning': state.currentDevice.linkStatus ==='online' ? 'el-tag--primary': 'el-tag--danger'} el-tag--light ml-3">
              ${ state.currentDevice.linkStatus == "inactive" ? "未激活": state.currentDevice.linkStatus === "online" ? "在线" : "离线"}
              </span>
            </div>
            <div>
                <div><span style="font-weight:bold;">设备地址：</span>${state.currentDevice.ext.location.address}</div>
            </div>
           </div>`

}

onMounted(()=>{
  handleQuery()
  geyProductAll();
})


</script>

<style lang="scss" scoped>

.amap-map{
  width: 100%;
  height: 88vh;
  filter: invert(100%) hue-rotate(180deg);
  -webkit-filter: invert(100%) hue-rotate(180deg);
  mix-blend-mode: exclusion;
}

.amap-box {
  flex: 1;
  height: 100vh;
}
.control-item {
  width: 300px;
  cursor: pointer;
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  margin: 10px 100px 10px;
  padding: 10px 5px;
  left: -60px;
  top: 130px;
  box-shadow: 1px 4px 12px 10px var(--color-primary-light-5);
  .control {
    display: block;
    padding: 5px 20px 10px;
  }
}

.label-info {
  position: absolute;
  z-index: 2;
  border: 1px solid #fff;
  background-color: var(--color-primary-light) !important;
  white-space: nowrap;
  border-radius: 4px;
  cursor: default;
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  color: #fff;
  margin-left: -2px;
  font-weight: bold;
}
</style>
