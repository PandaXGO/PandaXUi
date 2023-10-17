<template>
  <div style="margin: 10px">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="handleQuery()">刷新状态</el-button>
    </div>
    <el-tabs v-model="activeName" :tab-position="tabPosition" type="border-card" style="height: 700px" @tab-change="changTab">
      <el-tab-pane label="属性" name="attributes">
        <div style="display: flex;flex-wrap: wrap;">
          <el-card v-if="deviceStatusOptions.length > 0" v-for="status in deviceStatusOptions" style="width: 300px;margin: 10px;">
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div style="font-size: large">{{status.name}}</div>
                <div v-if="status.define && (status.define.rw === 'w' || status.define.rw === 'rw')">
                  <el-tooltip effect="dark" content="属性下发" placement="top">
                    <el-button type="primary" circle size="small" @click="downAttributes(status)"><SvgIcon name="elementBottom"/></el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <div style="margin-bottom: 10px;font-weight: bold;font-size: 20px">{{status.value ? status.value : status.define.default_value}}</div>
            <div>
              {{ dateStrFormat(status.time) }}
            </div>
          </el-card>
          <el-empty v-else description="请去产品中设置属性" style="margin-left: 40%;"/>
        </div>

      </el-tab-pane>
      <el-tab-pane label="遥测" name="telemetry">
        <div style="display: flex;flex-wrap: wrap;">
          <el-card v-if="deviceStatusOptions.length > 0" v-for="status in deviceStatusOptions" style="width: 300px;margin: 10px;">
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div style="font-size: large">{{status.name}}</div>
                <div>
                  <el-tooltip effect="dark" content="历史趋势" placement="top">
                    <el-button type="primary" circle size="small" @click="showHistory(status)"><SvgIcon name="elementOdometer"/></el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <div style="margin-bottom: 10px;font-weight: bold;font-size: 20px">
              {{  (status.value === null || status.value === undefined || status.value === "") ? "遥测未上报" : status.value }} {{( status.value  && (status.type ==='int64'|| status.type ==='float64')) ? status.define.unit: ''}}
            </div>
            <div>
              {{ status.time ? dateStrFormat(status.time) : '' }}
            </div>
          </el-card>
          <el-empty v-else description="请去产品中设置遥测" style="margin-left: 40%;"/>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="isShowDialog" width="769px" title="属性下发" center draggable>
      <el-form label-width="80px">
        <el-form-item label="设置值" prop="name">
          <el-input-number
              v-if="currentAttribute.type==='int64' || currentAttribute.type==='float64'"
              v-model="currentAttribute.value" />
          <el-select v-else-if="currentAttribute.type==='bool'" v-model="currentAttribute.value" placeholder="请选择">
            <el-option label="0-关" value="0"/>
            <el-option label="1-开" value="1"/>
          </el-select>
          <el-input
              v-else
              v-model="currentAttribute.value"
              placeholder="请输入下发值"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="onDown" >确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowHistoryDialog" width="800px" title="历史数据" center draggable>
      <el-card shadow="always">
        <el-form :model="historyForm" label-width="80px" :inline="true">
          <el-form-item label="日期选择">
            <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
            />
          </el-form-item>
          <el-form-item label="最大条数" prop="limit">
            <el-input-number v-model="historyForm.limit" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getPropertyHistory">
              <SvgIcon name="elementSearch" />搜索</el-button>
            <el-button @click="resetHistory">
              <SvgIcon name="elementRefresh" />
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="box-card">
        <el-tabs v-model="activeTableName" @tab-click="getPropertyHistory">
          <el-tab-pane label="图表" name="charts" style="width: 100%; height: 300px">
            <div ref="historyRef" style="width: 100%; height: 300px"></div>
          </el-tab-pane>
          <el-tab-pane label="列表" name="table">
            <el-table :data="devicePropertyHistoryOptions" style="width: 100%;height: 300px">
              <el-table-column :prop="currentProperty.key.toLowerCase()" :label="currentProperty.name" />
              <el-table-column prop="ts" label="时间"  >
                <template #default="scope">
                  {{ dateStrFormat(scope.row.ts) }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="isShowHistoryDialog = false" >确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue";
import {downAttribute, getDeviceStatus,getDevicePropertyHistory} from "@/api/device/device";
import {ElMessage} from "element-plus";
import {formatDate} from "@/utils/formatTime";
import * as echarts from "echarts";

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})

const time = new Date()
const startTime = new Date(time.setDate(time.getDate()-7))
const loading = ref(false)
const deviceStatusOptions = ref([])
const devicePropertyHistoryOptions = ref([])
const tabPosition = ref('left')
const activeName = ref('attributes')
const activeTableName = ref('charts')
const isShowDialog = ref(false)
const isShowHistoryDialog = ref(false)
const historyRef = ref()
const timeValue:any = ref([startTime, new Date()])
const currentProperty = ref({})
const myChart = ref(null)
const historyForm = ref({
  key: "",
  limit: 100,
  startTime: "",
  endTime: ""
})

const currentAttribute = ref({})

const handleQuery = () => {
  getDeviceStatus(props.rowData.id, {classify: activeName.value}).then((res:any)=>{
    if (res.code === 200){
      deviceStatusOptions.value = res.data
    }
  })
}

const showHistory = (row:any) => {
  isShowHistoryDialog.value = true
  currentProperty.value = row
  console.log(currentProperty.value.name.toLowerCase())
  historyForm.value.key = row.key
  timeValue.value = [startTime, new Date()]
  nextTick(()=>{
    getPropertyHistory()
  })
}
const resetHistory = () => {
  timeValue.value = [startTime, new Date()]
  historyForm.value.limit = 100;
  getPropertyHistory();
};

const getPropertyHistory = () => {
  if (timeValue.value !== null && timeValue.value.length>0){
    historyForm.value.startTime = formatDate(timeValue.value[0],"YYYY-mm-dd HH:MM:SS")
    historyForm.value.endTime = formatDate(timeValue.value[1],"YYYY-mm-dd HH:MM:SS")
  }
  getDevicePropertyHistory(props.rowData.id,historyForm.value).then((res:any)=>{
    if (res.code === 200){
      devicePropertyHistoryOptions.value = res.data || []
      getEchart()
    }
  })
}

const downAttributes = (row:any) => {
  currentAttribute.value = row
  isShowDialog.value = true
}

const changTab = (val:any) => {
  handleQuery()
}


const getEchart = () => {
  if (!myChart.value){
    myChart.value = echarts.init(historyRef.value);
  }
 let data = [];
  devicePropertyHistoryOptions.value.forEach((item:any)=>{
    data.push([+new Date(item.ts), item[currentProperty.value.key.toLowerCase()]])
  })
  const option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%'];
      }
    },
    title: {
      left: 'center',
      text: currentProperty.value.name + '历史变化图'
    },
    xAxis: {
      type: 'time',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: [
      {
        type: 'inside'
      }, {
        start: 0,
        end: 20
      }
    ],
    series: [
      {
        name: currentProperty.value.name,
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: data
      }
    ]
  };
  myChart.value.setOption(option);
}

const onDown = () => {
  loading.value = true
  downAttribute(props.rowData.id ,{key: currentAttribute.value.key, value: currentAttribute.value.value}).then((res:any)=>{
    if (res.code === 200){
      ElMessage.success("属性下发成功")
      isShowDialog.value = false
    }
    loading.value = false
  })
}

onMounted(()=>{
  handleQuery()
})
</script>

<style scoped>

</style>
