<template>
  <div class="app-container">
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="card-header-text">萤石设备列表</span>
      </div>
    </template>
    <el-table
        v-loading="state.loading"
        style="margin-top: 10px"
        border
        :data="state.deviceOptions"
    >
      <el-table-column label="设备名称" align="center" prop="deviceName"/>
      <el-table-column label="设备编号" align="center" prop="deviceSerial"/>
      <el-table-column label="设备类型" align="center" prop="deviceType"/>
      <el-table-column label="设备状态" align="center" prop="status">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 0 ? 'primary' : 'warning'"
              disable-transitions
          >{{ scope.row.status === 0 ? "离线": "在线" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备地址" align="center" prop="netAddress"/>
      <el-table-column label="版本号" align="center" prop="deviceVersion"/>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button text type="primary" @click="showChannels(scope.row)">
            <SvgIcon name="elementEdit"/>
            通道列表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="state.total > 0">
      <el-divider></el-divider>
      <el-pagination
          background
          :total="state.total"
          :current-page="state.queryParams.pageNum"
          :page-size="state.queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
  <el-dialog v-model="state.isShowChanDialog" width="80%" title="通道列表" center draggable>
    <el-table
        style="margin-top: 10px"
        border
        :data="state.deviceChannelsOptions"
    >
      <el-table-column label="通道号" align="center" prop="channelNo"/>
      <el-table-column label="通道名称" align="center" prop="channelName"/>
      <el-table-column label="IPC序列号" align="center" prop="ipcSerial"/>
      <el-table-column label="通道状态" align="center" prop="status">
        <template #default="scope">
          <el-tag
              :type="scope.row.status === 'ON' ? 'primary' : 'success'"
              disable-transitions
          >{{ scope.row.status === 1 ?"在线":"不在线" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否加密" align="center" prop="isEncrypt">
        <template #default="scope">
          {{ scope.row.isEncrypt === 0 ? "不加密":"加密" }}
        </template>
      </el-table-column>
      <el-table-column label="视频质量" align="center" prop="videoLevel">
        <template #default="scope">
          {{ scope.row.videoLevel === 0 ? "流程": scope.row.videoLevel === 1 ? "均衡" : scope.row.videoLevel === 1 ? "高清" : "超清" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button text type="primary" @click="viewZb(scope.row)" :disabled="scope.row.isEncrypt===1?true:false">
            <SvgIcon name="elementEdit"/>
            查看直播
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="state.isShowZbDialog" width="60%" title="监控数据" center draggable @closed="closeDialog">
    <JessibucaPlay :src="playUrl" :width="'100%'" :height="'350px'" :autoplay="true"></JessibucaPlay>
    <div style="margin-top: 10px">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="设备直播" name="zb">
          <div style="display: flex; justify-content: left;">
            <div class="control-wrapper">
              <div class="control-btn control-top" @click="controlPtz(0)"><el-icon class="icon-top"><CaretTop /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-left" @click="controlPtz(2)"><el-icon class="icon-left"><CaretLeft /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-bottom" @click="controlPtz(1)"><el-icon class="icon-bottom"><CaretBottom /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-right" @click="controlPtz(3)"><el-icon class="icon-right"><CaretRight /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-round"><div class="control-round-inner"><i class="fa fa-pause-circle"></i></div></div>
            </div>
          </div>
        </el-tab-pane>
<!--        <el-tab-pane label="录像回放" name="hf">
          录像功能开发中。。。
        </el-tab-pane>-->
      </el-tabs>
    </div>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowZbDialog = false">取 消</el-button>
        </span>
    </template>
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
// 查询列表
import {nextTick, onMounted, reactive, ref} from "vue";
import {getDeviceChannels, getDeviceLive, listDeviceList, ptzStart} from "@/api/video/ys";
import JessibucaPlay from "@/components/jessibuca/index.vue";

const playUrl = ref('http://flv.bdplay.nodemedia.cn/live/bbb.flv');

const state:any = reactive({
  // 遮罩层
  loading: false,
  // 表格数据
  activeName: 'zb',
  deviceOptions: [],
  deviceChannelsOptions: [],
  total: 0,
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
  },

  isShowZbDialog: false,
  isShowChanDialog: false,
  currentChannel: {},
});


const handleQuery = () => {
  state.queryParams.pageNum = state.queryParams.pageNum-1
  listDeviceList(state.queryParams).then((res:any)=>{
    if (res.code === 200){
      state.deviceOptions = res.data.data;
      state.total = res.data.total
    }
  })
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}


const showChannels = (row:any) => {
  state.currentDeviceOptions = row
  state.isShowChanDialog = true
  getDeviceChannels(row.deviceSerial).then((res:any)=>{
    if (res.code === 200){
      state.deviceChannelsOptions = res.data
    }
  })
}

const viewZb = (row:any) => {
  state.isShowZbDialog = true
  state.currentChannel = row
  getDeviceLive(row.deviceSerial,{channelNo: row.channelNo}).then((res:any)=>{
    if (res.code === 200){
      if (res.data.length > 0){
        playUrl.value = res.data[0].url
      }
    }
  })
}

const controlPtz = (direction:number) => {
  const query = {
    channelNo: state.currentChannel.channelNo,
    speed: 1,
    direction: direction
  }
  ptzStart(state.currentChannel.deviceSerial,query).then((res:any)=>{
    console.log("控制命令",res)
  })
}

onMounted(()=>{
  handleQuery()
})

</script>

<style scoped >

</style>
