<template>
  <div style="margin: 10px">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="handleQuery()">刷新状态</el-button>
    </div>
    <el-tabs v-model="activeName" :tab-position="tabPosition" type="border-card" style="height: 700px" @tab-change="changTab">
      <el-tab-pane label="属性" name="attributes">
        <div style="display: flex;flex-wrap: wrap;">
          <el-card v-for="status in deviceStatusOptions" style="width: 300px;margin: 10px;">
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div style="font-size: large">{{status.name}}</div>
                <div v-if="status.define.rw === 'w' || status.define.rw === 'rw'">
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
        </div>

      </el-tab-pane>
      <el-tab-pane label="遥测" name="telemetry">
        <div style="display: flex;flex-wrap: wrap;">
          <el-card v-for="status in deviceStatusOptions" style="width: 300px;margin: 10px;">
            <template #header>
              <div style="display: flex;justify-content: space-between;">
                <div style="font-size: large">{{status.name}}</div>
                <div>
                  <el-tooltip effect="dark" content="历史趋势" placement="top">
                    <el-button type="primary" circle size="small" @click="isShowHistoryDialog = true"><SvgIcon name="elementOdometer"/></el-button>
                  </el-tooltip>
                </div>
              </div>
            </template>
            <div style="margin-bottom: 10px;font-weight: bold;font-size: 20px">
              {{status.value ? status.value : "遥测未上报"}} {{(status.type ==='int64'|| status.type ==='float64') ? status.define.unit: ''}}
            </div>
            <div>
              {{ dateStrFormat(status.time) }}
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="isShowDialog" width="769px" title="属性下发" center draggable>
      <el-form
          :model="attributesForm"
          label-width="80px"
      >
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
          <el-button type="primary" @click="onDown">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="isShowHistoryDialog" width="769px" title="历史数据" center draggable>
      历史数据开发中
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="onDown" :loading="loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {downAttribute, getDeviceStatus} from "@/api/device/device";
import {ElMessage} from "element-plus";

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const loading = ref(false)
const deviceStatusOptions = ref()
const tabPosition = ref('left')
const activeName = ref('attributes')
const isShowDialog = ref(false)
const isShowHistoryDialog = ref(false)

const currentAttribute = ref({})

const handleQuery = () => {
  getDeviceStatus(props.rowData.id, {classify: activeName.value}).then((res:any)=>{
    if (res.code === 200){
      deviceStatusOptions.value = res.data
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
