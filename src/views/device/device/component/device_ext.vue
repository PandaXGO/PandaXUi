<template>
  <div style="margin: 10px">
    <div class="ext_title">设备定位</div>
    <el-form :model="locationForm">
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="经度">
          <el-input v-model="locationForm.lng" disabled />
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度">
            <el-input v-model="locationForm.lat" disabled />
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
    <div style="margin: 10px 0 10px 0; height: 600px" id="map">
    </div>
  </div>

</template>

<script  lang="ts" setup>
import AMapLoader from '@amap/amap-jsapi-loader' // 使用加载器加载JSAPI，可以避免异步加载、重复加载等常见错误加载错误
import {onMounted, ref} from "vue";
import {updateDevice} from "@/api/device/device";
import {ElMessage} from "element-plus";

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})

const locationForm:any = ref({})

const getMarkerPosition = () => {
  if (props.rowData.ext && props.rowData.ext.location){
    locationForm.value =  props.rowData.ext.location
  }else {
    locationForm.value = {
      lng: 116.39,
      lat: 39.9,
      address: ""
    }
  }
}

let marker = null
// 初始化地图
function initMap() {
  AMapLoader.load({
    key: "86fc3e60687d0a24e4badd8c1b0f4ea0", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [
      'AMap.Geocoder', // 逆向地理解码插件
      'AMap.Marker', // 点标记插件
      "AMap.Scale", //工具条，控制地图的缩放、平移等
      "AMap.ToolBar", //比例尺，显示当前地图中心的比例尺
      "AMap.Geolocation", //定位，提供了获取用户当前准确位置、所在城市的方法
      "AMap.MapType",
    ],
  })
      .then((AMap) => {
        const map = new AMap.Map("map", {//设置地图容器id
          zoom: 12, //初始化地图层级
          center: [locationForm.value.lng, locationForm.value.lat], //初始化地图中心点位置
          scrollWheel: true, //鼠标滚轮放大缩小
        });
        map.setDefaultCursor("pointer"); //使用CSS默认样式定义地图上的鼠标样式（default/pointer/move/crosshair）
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Geolocation());
        map.addControl(new AMap.MapType());

        //为地图注册click事件获取鼠标点击出的经纬度坐标
        map.on("click", function (e) {
          locationForm.value =  {
            lng: e.lnglat.lng,
            lat: e.lnglat.lat,
            address: ""
          }
          getAddress()
        });

       function  getAddress() {
          // 这里通过高德 SDK 完成。
          const geocoder = new AMap.Geocoder({
            city: '全国', //地理编码时，设置地址描述所在城市; 默认全国; 可选值：城市名（中文或中文全拼）、citycode、adcode
            radius: 1000, //逆地理编码时，以给定坐标为中心点; 默认1000; 取值范围(0-3000)
            extensions: 'all' //逆地理编码时，返回信息的详略; 默认值：base，返回基本地址信息; 默认值：base，返回基本地址信息
          })
          //调用逆解析方法 个人开发者调用量上限5000（次/日）
         geocoder.getAddress([locationForm.value.lng,locationForm.value.lat], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                locationForm.value.address = result.regeocode.formattedAddress
                addMarker()
                updateExt()
              }
            }
          })
        }
        function addMarker() {
          if (checkLngLat){
            if (marker) {
              marker.setMap(null)
              marker = null
            }
            marker = new AMap.Marker({
              icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
              position: [locationForm.value.lng,locationForm.value.lat],
              offset: new AMap.Pixel(-13, -30),//标记点相对偏移量，可以固定其地址，不随着地图缩放而偏移
            });
            marker.setMap(map)
          }
        }
        addMarker()
      })
      .catch((e) => {});
}

const checkLngLat = () => {
  if (locationForm.value.lng === 0 && locationForm.value.lat === 0) {
    return false
  }
  return true
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
  getMarkerPosition()
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
