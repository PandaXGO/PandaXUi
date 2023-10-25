<template>
  <div class="app-container">
    <el-container v-loading="state.loading" style="height: 91vh;" element-loading-text="拼命加载中">
      <el-aside width="300px" style="background-color: #ffffff">
        <el-tabs v-model="state.activeName" stretch>
          <el-tab-pane label="国标设备" name="gb28181">
            <el-tree :data="state.deviceOptions" :props="gbDefaultProps" @node-click="handleGbNodeClick" />
          </el-tab-pane>
          <el-tab-pane label="萤石设备" name="ys">萤石设备</el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-header height="5vh" style="text-align: left;font-size: 17px;line-height:5vh">
          分屏:
          <SvgIcon name="elementFullScreen" class="btn" :class="{active:state.spilt===1}" @click="state.spilt=1"/>
          <SvgIcon name="elementMenu" class="btn" :class="{active:state.spilt===4}" @click="state.spilt=4"/>
          <SvgIcon name="elementGrid" class="btn" :class="{active:state.spilt===9}" @click="state.spilt=9"/>
        </el-header>
        <el-main style="padding: 0;">
          <div style="width: 99%;height: 85vh;display: flex;flex-wrap: wrap;background-color: #000;">
            <div v-for="i in state.spilt" :key="i" class="play-box"
                 :style="liveStyle" :class="{redborder:state.playerIdx == (i-1)}"
                 @click="state.playerIdx = (i-1)">
<!--              <div v-if="!state.videoUrl[i-1]" style="color: #ffffff;font-size: 30px;font-weight: bold;">{{ i }}</div>-->
              <JessibucaPlay ref="playerRef"  :src="state.videoUrl[i-1]" :autoplay="true"/>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, computed, onMounted} from "vue";
import axios from "axios";
import JessibucaPlay from "@/components/jessibuca/index.vue";

const MEDIA_API_URL = import.meta.env.VITE_MEDIA_API_URL as any
const service = axios.create({
  baseURL: MEDIA_API_URL,
  timeout: 50000,
});
const playerRef = ref()
const state = reactive({
  activeName: "gb28181",
  videoUrl: ['http://flv.bdplay.nodemedia.cn/live/bbb.flv'],
  spilt: 1,//分屏
  playerIdx: 0,//激活播放器
  updateLooper: 0, //数据刷新轮训标志
  count: 15,
  total: 0,
  deviceOptions: [],
  //channel
  loading: false
})

const gbDefaultProps = {
  children: 'Channels',
  label: 'Name',
}

const handleQuery = () => {
  service({
    url: '/gb28181/api/list',
    method: 'get',
  }).then((res:any)=>{
    //state.deviceOptions = res.data;
    state.deviceOptions = [{
      ID: "aas",
      Name: "测试",
      Channels: [{
        DeviceID: "s3453",
        Name: "chan1"
      }]
    }]
  })
};


const liveStyle = computed(()=> {
  let style = {width: '100%', height: '100%'}
  switch (state.spilt) {
    case 4:
      style = {width: '50%', height: '50%'}
      break
    case 9:
      style = {width: '33%', height: '33%'}
      break
  }
  return style
})

const handleGbNodeClick = (data) => {
  if (data.Channels && data.Channels.length>0){
    data.Channels.forEach((currentChannel)=>{
      state.videoUrl.push(MEDIA_API_URL.replace(/^http/, 'ws') + "/jessica/" + currentChannel.LivePublisher.StreamPath)
    })
  }else {
    state.videoUrl = [MEDIA_API_URL.replace(/^http/, 'ws') + "/jessica/" + data.LivePublisher.StreamPath]
  }
}

onMounted(()=>{
  handleQuery()
})
</script>

<style scoped>
.btn {
  margin: 0 10px;

}

.btn:hover {
  color: #409EFF;
}

.btn.active {
  color: #409EFF;

}

.redborder {
  border: 2px solid red !important;
}

.play-box {
  background-color: #000000;
  border: 2px solid #505050;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
