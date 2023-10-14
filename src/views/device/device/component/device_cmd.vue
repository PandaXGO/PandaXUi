<template>
  <div style="margin: 10px">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
      >
        <el-form-item label="命令状态" prop="state">
          <el-select v-model="state.queryParams.state" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in stateOption"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <SvgIcon name="elementSearch" />搜索</el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="elementRefresh" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">命令下发日志</span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenCmd()"
            ><SvgIcon name="elementPlus" />命令下发</el-button>
          </div>
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="命令名称" align="center" prop="cmdName">
          <template #default="scope">
            <div class="cmd_name" @click="openDeviceCmdDetail(scope.row)">{{scope.row.cmdName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="命令状态" align="center" prop="state">
          <template #default="scope">
            <el-tag
                :type="scope.row.state === '0' ? 'success' : scope.row.state === '1' ? 'danger' : 'primary'"
                disable-transitions
            >{{ scope.row.state ==='0'? "执行成功": scope.row.state ==='1' ? '执行失败': "执行中" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下发时间" align="center" prop="requestTime">
          <template #default="scope">
            {{ dateStrFormat(scope.row.requestTime) }}
          </template>
        </el-table-column>
        <el-table-column label="响应时间" align="center" prop="responseTime">
          <template #default="scope">
            {{ scope.row.responseTime}}
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
    <el-dialog v-model="state.isShowCmdDetailDialog" width="769px" title="命令详情" center draggable>
      <div>
         下发内容:
        <div class="json-viewer">
          <Codemirror ref="cmEditor" :value="state.cmdDetail.cmdContent" border :options="state.cmOptions"/>
        </div>
      </div>
      <div>
        响应内容:
        <div class="json-viewer">
          <Codemirror ref="cmEditor" :value="state.cmdDetail.responseContent" border :options="state.cmOptions"/>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowCmdDetailDialog = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="state.isShowDialog" width="769px" title="命令下发" center draggable>
      <el-form :model="state.cmdForm" label-width="120px">
        <el-form-item label="下发模式" prop="mode">
          <el-select v-model="state.cmdForm.mode" placeholder="请选择模式" >
            <el-option label="单向" value="single"/>
            <el-option label="双向" value="double"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择命令" prop="cmdName">
          <el-select v-model="state.cmdForm.cmdName" placeholder="请选择命令" >
            <el-option
                v-for="cmd in state.cmdsOptions"
                :key="cmd.key"
                :label="cmd.name"
                :value="cmd.key"
                @click="onSelectCmd(cmd)"
            />
          </el-select>
        </el-form-item>
        <el-form-item  v-for="input in state.cmdInputOptions" :key="input.key" :label="input.name">
          <el-input-number
              v-if="input.type==='int64' || input.type==='float64' || input.type==='bool'"
              v-model="state.cmdForm.cmdContent[input.key]" />
          <el-input
              v-else
              v-model="state.cmdForm.cmdContent[input.key]"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit()" :loading="state.loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive,} from "vue";
import {addCmd, listCmdLog} from "@/api/device/device_cmd";
import {listTemplateAll} from "@/api/device/product_template";
import {ElMessage} from "element-plus";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";

const props:any = defineProps({
  rowData: {
    type: Object,
  },
})
const stateOption = [{
  label: "执行成功",
  value: "0",
},{
  label: "执行失败",
  value: "1",
},{
  label: "执行中",
  value: "2",
}]

const state = reactive({
  cmOptions: {
    tabSize: 4,
    theme: 'dracula',
    mode: 'text/javascript',
    lineNumbers: false,
    line: true,
    styleActiveLine: true,
  },
  // 遮罩层
  loading: false,
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  statusOptions: [],
  cmdsOptions: [],
  cmdInputOptions: [],
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    deviceId: "",  //父设备Id
    state: "",
    type: ""
  },
  cmdForm: {
    deviceId: "",
    mode: "single",
    cmdName: "",
    cmdContent: {},
  },
  isShowDialog: false,
  isShowCmdDetailDialog: false,
  cmdDetail: {
    responseContent: "",
    cmdContent: ""
  }
});
// 查询列表
const handleQuery = () => {
  state.loading = true;
  state.queryParams.deviceId = props.rowData.id
  listCmdLog(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false
    state.isShowDialog = false
  });
};

const resetQuery = () => {
  state.queryParams.state = "";
  handleQuery();
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

const onOpenCmd = () => {
  state.isShowDialog = true
  listTemplateAll({pid: props.rowData.pid, classify: "commands"}).then((res:any)=>{
    if (res.code === 200){
      state.cmdsOptions = res.data
    }
  })
}

const openDeviceCmdDetail = (row: any) => {
  state.isShowCmdDetailDialog = true
  state.cmdDetail.cmdContent = JSON.stringify(JSON.parse(row.cmdContent),null, " ")
  state.cmdDetail.responseContent = JSON.stringify(JSON.parse(row.responseContent),null, " ")
}

const onSelectCmd = (cmd:any) => {
  state.cmdInputOptions = cmd.define.input
}

const onSubmit = () => {
  state.loading = true;
  state.cmdForm.deviceId = props.rowData.id
  state.cmdForm.cmdContent.deviceNum = props.rowData.name
  state.cmdForm.cmdContent = JSON.stringify(state.cmdForm.cmdContent, null, "")
  addCmd(state.cmdForm).then((res:any) => {
    console.log(res)
    state.loading = false;
    if (res.code == 200){
      ElMessage.success("新增成功");
      handleQuery()
    }
  });
};


onMounted(()=>{
  handleQuery()
})
</script>
<style scoped>
.cmd_name{
  color: var(--color-primary-light-1);
  cursor: pointer;
}
.json-viewer {
  height: 200px;
}
</style>
