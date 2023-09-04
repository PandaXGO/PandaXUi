<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span class="card-header-text">国标设备列表</span>
      </div>
    </template>
    <el-table
        v-loading="state.loading"
        style="margin-top: 10px"
        border
        :data="state.deviceOptions"
    >
      <el-table-column label="设备名称" align="center" prop="Name"/>
      <el-table-column label="设备编号" align="center" prop="ID"/>
      <el-table-column label="厂家" align="center" prop="Manufacturer"/>
      <el-table-column label="型号" align="center" prop="Model"/>
      <el-table-column label="通道地址" align="center" prop="Addr"/>
      <el-table-column label="通道数" align="center" prop="status">
        <template #default="scope">
          {{ scope.row.Channels.length }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag
              :type="scope.row.Status === 'ONLINE' ? 'primary' : 'warning'"
              disable-transitions
          >{{ scope.row.Status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" align="center" prop="RegisterTime">
        <template #default="scope">
          {{ dateStrFormat(scope.row.RegisterTime) }}
        </template>
      </el-table-column>
      <el-table-column label="最近心跳" align="center" prop="LastKeepaliveAt">
        <template #default="scope">
          {{ dateStrFormat(scope.row.LastKeepaliveAt) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button text type="primary" @click="showChannels(scope.row)">
            <SvgIcon name="elementEdit"/>
            通道列表
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-dialog v-model="state.isShowChanDialog" width="769px" title="通道列表" center draggable>
    <el-table
    style="margin-top: 10px"
    border
    :data="state.currentDeviceOptions.Channels"
    >
    <el-table-column label="通道ID" align="center" prop="DeviceId"/>
    <el-table-column label="通道名称" align="center" prop="Name"/>
    <el-table-column label="通道状态" align="center" prop="status">
      <template #default="scope">
        <el-tag
            :type="scope.row.status === 'ON' ? 'primary' : 'success'"
            disable-transitions
        >{{ scope.row.status }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="通道地址" align="center" prop="Address"/>
    <el-table-column label="操作" align="center" prop="lastTime">
      <template #default="scope">
        <el-button text type="primary" @click="viewZb(scope.row)">
          <SvgIcon name="elementEdit"/>
          查看直播
        </el-button>
      </template>
    </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="state.isShowZbDialog" width="680px" title="监控数据" center draggable @closed="closeDialog">
    <div style="width: 100%;height: 350px" id="container" ref="container"></div>
    <div style="margin-top: 10px">
      <el-tabs v-model="state.activeName">
        <el-tab-pane label="设备直播" name="zb">
          <div style="display: flex; justify-content: left;">
            <div class="control-wrapper">
              <div class="control-btn control-top" @click="controlPtz('up')"><el-icon class="icon-top"><CaretTop /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-left" @click="controlPtz('left')"><el-icon class="icon-left"><CaretLeft /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-bottom" @click="controlPtz('down')"><el-icon class="icon-bottom"><CaretBottom /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-btn control-right" @click="controlPtz('right')"><el-icon class="icon-right"><CaretRight /></el-icon><div class="control-inner-btn control-inner"></div></div>
              <div class="control-round"><div class="control-round-inner"><i class="fa fa-pause-circle"></i></div></div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="录像回放" name="hf">
          录像功能开发中。。。
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowZbDialog = false">取 消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// 查询列表
import {nextTick, onMounted, reactive, ref} from "vue";
import axios from "axios";


const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API_URL as any

const service = axios.create({
  baseURL: MEDIA_API_URL,
  timeout: 50000,
});

let jessibuca = null;
const container = ref();
const showBandwidth = ref(true)
const showOperateBtns = ref(true);
const forceNoOffscreen = ref(true);
const playUrl = ref('http://flv.bdplay.nodemedia.cn/live/bbb.flv');
const playing = ref(false);
const quieting = ref(true);
const loaded = ref(false);


const state:any = reactive({
  // 遮罩层
  loading: false,
  // 表格数据
  activeName: 'zb',
  deviceOptions: [],
  currentDeviceOptions: {
    Channels: [],
    RegisterTime: ""
  },

  isShowZbDialog: false,
  isShowChanDialog: false,
  currentChannel: {},
});


const handleQuery = () => {
  state.loading = true;
  service({
    url: '/gb28181/api/list',
    method: 'get',
  }).then((res:any)=>{
    state.deviceOptions = res.data;
    state.loading = false;
  })
};

const showChannels = (row) => {
  state.currentDeviceOptions = row
  state.isShowChanDialog = true
}

const viewZb = (row:any) => {
  state.isShowZbDialog = true
  state.currentChannel = row
  playUrl.value =  MEDIA_API_URL.replace(/^http/, 'ws') + "/jessica/" + state.currentChannel.LivePublisher.StreamPath
  nextTick(() => {
    // 初始化jessica 并进行播放
    createJessibuca()
    jessibuca.play(playUrl.value);
  })
}

const createJessibuca = () => {
  jessibuca = new (window as any).Jessibuca({
    container: container.value,
    videoBuffer: 0.2, // 缓存时长
    isResize: false,
    text: "",
    loadingText: "加载中。。。",
    debug: true,
    showBandwidth: showBandwidth.value, // 显示网速
    operateBtns: {
      fullscreen: showOperateBtns.value,
      screenshot: showOperateBtns.value,
      play: showOperateBtns.value,
      audio: showOperateBtns.value,
    },
    forceNoOffscreen: forceNoOffscreen.value,
    isNotMute: false,
  })

  jessibuca.on("load", function () {
    console.log("on load");
  });

  jessibuca.on("log", function (msg : any) {
    console.log("on log", msg);
  });
  jessibuca.on("record", function (msg: any) {
    console.log("on record:", msg);
  });
  jessibuca.on("pause", function () {
    console.log("on pause");
    playing.value = false;
  });
  jessibuca.on("play", function () {
    console.log("on play");
    playing.value = true;
    loaded.value = true;
    quieting.value = jessibuca.isMute();
  });
  jessibuca.on("fullscreen", function (msg: any) {
    console.log("on fullscreen", msg);
  });

  jessibuca.on("mute", function (msg: any) {
    console.log("on mute", msg);
    quieting.value = msg;
  });

  jessibuca.on("mute", function (msg: any) {
    console.log("on mute2", msg);
  });

  jessibuca.on("audioInfo", function (msg: any) {
    console.log("audioInfo", msg);
  });

  jessibuca.on("videoInfo", function (info: any) {
    console.log("videoInfo", info);
  });

  jessibuca.on("error", function (error: any) {
    console.log("error", error);
  });

  jessibuca.on("timeout", function () {
    console.log("timeout");
  });

  jessibuca.on('start', function () {
    console.log('start');
  })

  jessibuca.on("performance", function (performance: any) {
    var show = "卡顿";
    if (performance === 2) {
      show = "非常流畅";
    } else if (performance === 1) {
      show = "流畅";
    }
    //console.log('performance', show);
  });
  jessibuca.on('buffer', function (buffer: any) {
    console.log('buffer', buffer);
  })

  jessibuca.on('stats', function (stats: any) {
    console.log('stats', stats);
  })

  jessibuca.on('kBps', function (kBps: any) {
    console.log('kBps', kBps);
  });
  // 显示时间戳 PTS
  jessibuca.on('videoFrame', function () {

  })
  //
  jessibuca.on('metadata', function () {

  });
}

const closeDialog = () => {
  jessibuca && jessibuca.destroy();
}

const controlPtz = (direction:string) => {
  const query = {
    id: state.deviceOptions.ID,
    channel: state.currentChannel.DeviceID,
    ptzcmd: direction
  }
  service({
    url: '/gb28181/api/control',
    method: 'get',
    params: query
  }).then((res:any)=>{
    console.log("控制命令",res)
  })
}

onMounted(()=>{
  handleQuery()
})

</script>

<style scoped lang="scss">

.control-wrapper {
  position: relative;
  width: 6.25rem;
  height: 6.25rem;
  max-width: 6.25rem;
  max-height: 6.25rem;
  border-radius: 100%;
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  float: left;
}

.control-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  position: absolute;
  width: 44%;
  height: 44%;
  border-radius: 5px;
  border: 1px solid var(--color-primary);
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transition: all .3s linear;
  transition: all .3s linear;
  i {
    font-size: 20px;
    color: var(--color-primary);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
}

.control-inner-btn {
  position: absolute;
  width: 60%;
  height: 60%;
  background: #fafafa;
}

.control-top {
  top: -8%;
  left: 27%;
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
  border-radius: 5px 100% 5px 0;
  &:hover{
    cursor: pointer
  }
  .icon-top{
    transform: rotate(45deg);
    top: 20%;
    left: 0%;
  }
  .control-inner {
    left: -1px;
    bottom: 0;
    border-top: 1px solid var(--color-primary);
    border-right: 1px solid var(--color-primary);
    border-radius: 0 100% 0 0;
  }
}

.control-left {
  top: 27%;
  left: -8%;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  border-radius: 5px 0 5px 100%;
  &:hover{
    cursor: pointer
  }
  .icon-left{
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    top:20%;
  }
  .control-inner {
    right: -1px;
    top: -1px;
    border-bottom: 1px solid var(--color-primary);
    border-left: 1px solid var(--color-primary);
    border-radius: 0 0 0 100%;
  }
}

.control-bottom {
  left: 27%;
  bottom: -8%;
  transform: rotate(45deg);
  border-radius: 0 5px 100% 5px;
  &:hover{
    cursor: pointer
  }
  .icon-bottom{
    transform: rotate(-45deg);
    top: 20%;
  }
  .control-inner {
    top: -1px;
    left: -1px;
    border-bottom: 1px solid var(--color-primary);
    border-right: 1px solid var(--color-primary);
    border-radius: 0 0 100% 0;
  }
}

.control-right {
  top: 27%;
  right: -8%;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  border-radius: 5px 100% 5px 0;
  &:hover{
    cursor: pointer
  }
  .icon-right{
    transform: rotate(-45deg);
    top:20%;
  }
  .control-inner {
    left: -1px;
    bottom: -1px;
    border-top: 1px solid var(--color-primary);
    border-right: 1px solid var(--color-primary);
    border-radius: 0 100% 0 0;
  }
}


.control-round {
  position: absolute;
  top: 21%;
  left: 21%;
  width: 58%;
  height: 58%;
  background: #fff;
  border-radius: 100%;

  .control-round-inner {
    position: absolute;
    left: 13%;
    top: 13%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    width: 70%;
    height: 70%;
    font-size: 40px;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    border-radius: 100%;
    -webkit-transition: all .3s linear;
    transition: all .3s linear;
  }
}

</style>
