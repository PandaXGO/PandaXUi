<template>
  <div style="margin: 10px">
    <div class="ext_title">设备定位</div>
    <el-form :model="locationForm">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="经度">
          <el-input v-model="locationForm.position[0]" disabled />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度">
            <el-input v-model="locationForm.position[1]" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="位置">
            <el-input v-model="locationForm.address" disabled />
          </el-form-item>
        </el-col>
<!--        <el-col :span="2">
          <el-button>编 辑</el-button>
        </el-col>-->
      </el-row>
    </el-form>
    <div :style="{ width: '100%', height: '600px',margin: '10px 0 10px 0' }" >
      <el-amap vid="map" style="margin: 10px 0 10px 0; height: 600px" v-bind="mapConfig" viewMode="3D" @click="clickMap">
        <el-amap-control-tool-bar visible ></el-amap-control-tool-bar>
        <el-amap-control-control-bar visible></el-amap-control-control-bar>
        <el-amap-control-map-type visible ></el-amap-control-map-type>
        <el-amap-marker :position="locationForm.position" :content="locationForm.content" :label="locationForm.label"></el-amap-marker>

      </el-amap>
    </div>
<!--    <div style="margin: 10px 0 10px 0; height: 600px" id="map"></div>-->
  </div>

</template>

<script  lang="ts" setup>
//import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
import {onMounted, ref,shallowRef} from "vue";
import {updateDevice} from "@/api/device/device";
import {ElMessage} from "element-plus";

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})

const locationForm:any = ref<{
  position: Array<number>,
  content: string,
  label: string,
  address: string,
}>({
  position: [],
  content: "",
  label: "",
  address: ""
})

const mapConfig = ref({
  zoom: 12,
  center: [116.39, 39.9],
  // 地图插件
  plugin: [
    'MapType'
  ],
})

const clickMap = (e)=>{
  console.log(e)
  locationForm.value.position= [e.lnglat.lng,e.lnglat.lat]
  getAddress()
}

const getMarkerPosition = () => {
  if (props.rowData.ext && props.rowData.ext.location){
    locationForm.value =  props.rowData.ext.location
  }else {
    locationForm.value.position = [116.39,39.9]
  }
}

const getAddress = () => {
  const AMap = (window as any).AMap;
  const geocoder = new AMap.Geocoder({
    city: '全国', //地理编码时，设置地址描述所在城市; 默认全国; 可选值：城市名（中文或中文全拼）、citycode、adcode
    radius: 1000, //逆地理编码时，以给定坐标为中心点; 默认1000; 取值范围(0-3000)
    extensions: 'all' //逆地理编码时，返回信息的详略; 默认值：base，返回基本地址信息; 默认值：base，返回基本地址信息
  })
  //调用逆解析方法 个人开发者调用量上限5000（次/日）
  geocoder.getAddress(locationForm.value.position, function(status, result) {
    if (status === 'complete' && result.info === 'OK') {
      if (result && result.regeocode) {
        console.log("result.regeocode.formattedAddress",result.regeocode.formattedAddress)
        locationForm.value.address = result.regeocode.formattedAddress
        updateExt()
      }
    }
  })
};

// 初始化地图
function initMap() {
  getMarkerPosition()
  mapConfig.value.center = locationForm.value.position
}

const updateExt = () => {
  const data:any = props.rowData
  if (!data.ext){
    data.ext = {"location" :{}}
  }
  data.ext.location = locationForm.value
  updateDevice(data).then((res:any) => {
    if (res.code === 200){
      ElMessage.success("位置信息更新成功");
    }
  });
}

onMounted(()=>{
  initMap()
})
</script>
<style scoped>
.ext_title{
  color: var(--el-text-color-primary);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

</style>
