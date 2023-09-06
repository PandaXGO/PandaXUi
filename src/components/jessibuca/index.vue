<template>
  <div :id="id" class="player" :style="{width: width,height: height}"  ref="container"></div>
</template>
<script setup>
import {onMounted, reactive,  onUnmounted, ref} from "vue";

const props = defineProps({
  id: {
    type: String,
    default: "tc-player",
  },
  width: {
    type: [Number, String],
    default: "100%",
  },
  height: {
    type: [Number, String],
    default: "100%",
  },
  live: {
    type: Boolean,
    default: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  src: {
    type: String,
    default: "",
  },
})
let jessibuca = null;
const container = ref();
const state = reactive({
  playing: false,
  version: '',
  loaded: false,
  wasm: false,
  vc: "ff",
  quieting: true,
  showOperateBtns: true,
  showBandwidth: true,
  forceNoOffscreen: true,
  err: "",
  speed: 0,
  performance: "",
  volume: 1,
  rotate: 0,
  recordType: 'webm',
  scale: 0,
  data: null,
  isNotMute: false,
});

/*watch(
    () => props.src, (newData, oldData) => {
      console.log("改变")
      this.play(newData)
    },
    {
      immediate: true,
    }
)*/

const createJessibuca = () => {
  jessibuca = new (window).Jessibuca({
    container: container.value,
    videoBuffer: 0.2, // 缓存时长
    isResize: false,
    debug: false,
    text: "",
    loadingText: "加载中。。。",
    showBandwidth: state.showBandwidth, // 显示网速
    supportDblclickFullscreen: true,
    operateBtns: {
      fullscreen: state.showOperateBtns,
      screenshot: state.showOperateBtns,
      play: state.showOperateBtns,
      audio: state.showOperateBtns,
    },
    forceNoOffscreen: state.forceNoOffscreen,
    isNotMute: false,
  })

  jessibuca.on("load", function () {

  });

  jessibuca.on("log", function (msg) {
    console.log("on log", msg);
  });
  jessibuca.on("record", function (msg) {

  });
  jessibuca.on("pause", function () {
    state.playing = false;
  });
  jessibuca.on("play", function () {
    state.playing = true;
    state.loaded = true;
    state.quieting = jessibuca.isMute();
  });
  jessibuca.on("fullscreen", function (msg) {

  });

  jessibuca.on("mute", function (msg) {
    quieting.value = msg;
  });

  jessibuca.on("audioInfo", function (msg) {
  });

  jessibuca.on("videoInfo", function (info) {
  });

  jessibuca.on("error", function (error) {

  });

  jessibuca.on("timeout", function () {
  });

  jessibuca.on('start', function () {
  })

  jessibuca.on("performance", function (performance) {
    //console.log('流畅度检测', show);
  });
  jessibuca.on('buffer', function (buffer) {
  })

  jessibuca.on('stats', function (stats) {
  })

  jessibuca.on('kBps', function (kBps) {

  });
  // 显示时间戳 PTS
  jessibuca.on('videoFrame', function () {

  })
  //
  jessibuca.on('metadata', function () {

  });
  if (props.autoplay){
    jessibuca.play(props.src);
  }
}

const destroy = () => {
  console.log("已清除ID", props.id)
  jessibuca && jessibuca.destroy();
}

onUnmounted(()=>{
  destroy()
})

onMounted(()=>{
  createJessibuca()
})
</script>

<style scoped>

.player {
  background: url(../../assets/logo.png) center center no-repeat #353535;
  background-size: 60px 60px;
}
</style>
