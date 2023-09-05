<template>
  <div class="app-container">
    <el-container v-loading="loading" style="height: 91vh;" element-loading-text="拼命加载中">
      <el-aside width="300px" style="background-color: #ffffff">
        <DeviceTree :clickEvent="clickEvent" :contextMenuEvent="contextMenuEvent"></DeviceTree>
      </el-aside>
      <el-container>
        <el-header height="5vh" style="text-align: left;font-size: 17px;line-height:5vh">
          分屏:
          <i class="el-icon-full-screen btn" :class="{active:spilt==1}" @click="spilt=1"/>
          <i class="el-icon-menu btn" :class="{active:spilt==4}" @click="spilt=4"/>
          <i class="el-icon-s-grid btn" :class="{active:spilt==9}" @click="spilt=9"/>
        </el-header>
        <el-main style="padding: 0;">
          <div style="width: 99%;height: 85vh;display: flex;flex-wrap: wrap;background-color: #000;">
            <div v-for="i in spilt" :key="i" class="play-box"
                 :style="liveStyle" :class="{redborder:playerIdx == (i-1)}"
                 @click="playerIdx = (i-1)">
              <div v-if="!videoUrl[i-1]" style="color: #ffffff;font-size: 30px;font-weight: bold;">{{ i }}</div>
              <player ref="player" v-else :videoUrl="videoUrl[i-1]" fluent autoplay @screenshot="shot"
                      @destroy="destroy"/>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>

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

.videoList {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

.video-item {
  position: relative;
  width: 15rem;
  height: 10rem;
  margin-right: 1rem;
  background-color: #000000;
}

.video-item-img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

.video-item-img:after {
  content: "";
  display: inline-block;
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  background-image: url("../assets/loading.png");
  background-size: cover;
  background-color: #000000;
}

.video-item-title {
  position: absolute;
  bottom: 0;
  color: #000000;
  background-color: #ffffff;
  line-height: 1.5rem;
  padding: 0.3rem;
  width: 14.4rem;
}
</style>
