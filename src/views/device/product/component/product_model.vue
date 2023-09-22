<template>
  <div style="margin: 10px">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="productTsl">物模型TSL</el-button>
    </div>
    <el-tabs v-model="activeName" :tab-position="tabPosition" type="border-card" style="height: 700px">
      <el-tab-pane label="属性模板" name="attributes">
        <Attributes v-if="activeName === 'attributes'" :rowData="rowData"/>
      </el-tab-pane>
      <el-tab-pane label="遥测模板" name="telemetry">
        <Telemetry v-if="activeName === 'telemetry'" :rowData="rowData" />
      </el-tab-pane>
      <el-tab-pane  label="命令服务" name="commands">
        <Commands v-if="activeName === 'commands'" :rowData="rowData"/>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="state.isShowDialog" width="750px" title="物模型详情" center draggable >
      <div style="height: 400px;" :loading="state.loading">
        <Codemirror ref="cmEditor" :value="state.tslDetail" border :options="state.cmOptions"/>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportTsl" type="primary">导 出</el-button>
          <el-button @click="state.isShowDialog = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import Attributes from "./model/attributes.vue"
import Telemetry from "./model/telemetry.vue"
import Commands from "./model/commands.vue"

import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import {getProductTsl} from "@/api/device/product";


const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const tabPosition = ref('left')
const activeName = ref('attributes')

const state = reactive({
  cmOptions: {
    tabSize: 4,
    theme: 'dracula',
    mode: 'text/javascript',
    lineNumbers: false,
    line: true,
    styleActiveLine: true,
    readOnly: true
  },
  isShowDialog: false,
  // 遮罩层
  loading: false,
  tslDetail: ""
})

const productTsl = () => {
  state.isShowDialog = true
  state.loading = true
  getProductTsl(props.rowData.id).then((res:any)=>{
    if (res.code === 200){
      state.tslDetail = JSON.stringify(res.data, null, 2)
    }
    state.loading = false
  })
}

const exportTsl = () => {
  const blob = new Blob([state.tslDetail], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'tsl.json';
  link.click();

// 清理URL对象
  URL.revokeObjectURL(url);
}

</script>

<style scoped>

</style>
