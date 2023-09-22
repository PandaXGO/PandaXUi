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
        <el-form-item label="告警类型" prop="type">
          <el-input
              v-model="state.queryParams.type"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="告警状态" prop="state">
          <el-select v-model="state.queryParams.state" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in stateOption"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="告警级别" prop="level">
          <el-select v-model="state.queryParams.level" placeholder="请选择告警级别" clearable>
            <el-option
                v-for="dict in levelOption"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期选择" prop="level">
          <el-date-picker
              v-model="timeValue"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="defaultTime"
          />
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
          <span class="card-header-text">告警列表</span>
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="告警类型" align="center" prop="type"/>
        <el-table-column label="告警状态" align="center" prop="state">
          <template #default="scope">
            <el-tag
                :type="scope.row.state === '0' ? 'danger' : scope.row.state === '1' ? 'primary' : scope.row.state ==='2' ? 'info': 'warning'"
                disable-transitions
            >{{ scope.row.state ==='0'? "告警中": scope.row.state ==='1' ? '已确认': scope.row.state ==='2' ? '已清除': "已关闭" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="告警级别" align="center" prop="level">
          <template #default="scope">
            {{ scope.row.level ==='CRITICAL'? "危险": scope.row.level ==='MAJOR' ? '重要': scope.row.level ==='MINOR' ? '次要': scope.row.level ==='WARNING' ? "警告": "不确定" }}
          </template>
        </el-table-column>
        <el-table-column label="告警时间" align="center" prop="time">
          <template #default="scope">
            {{ dateStrFormat(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" @click="onOpenAlarm(scope.row)">
                  <SvgIcon name="elementView"/>
                  查看
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="onCloseAlarm(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  关闭
                </el-button>
              </div>
            </el-popover>
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
    <el-dialog v-model="state.isShowDialog" width="769px" title="告警原始数据" center draggable>
      <div class="json-viewer">
        <Codemirror ref="cmEditor" :value="state.alarmDetail" border :options="state.cmOptions"/>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.isShowDialog = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive,ref} from "vue";
import {listAlarm, updateAlarm} from "@/api/device/device_alarm";
import {formatDate} from "@/utils/formatTime";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";

const stateOption = [{
  label: "告警中",
  value: "0",
},{
  label: "已确认",
  value: "1",
},{
  label: "已清除",
  value: "2",
},{
  label: "已关闭",
  value: "3",
}]
const levelOption = [{
  label: "危险",
  value: "CRITICAL",
},{
  label: "重要",
  value: "MAJOR",
},{
  label: "次要",
  value: "MINOR",
},{
  label: "警告",
  value: "WARNING",
},{
  label: "不确定",
  value: "INDETERMINATE",
}]
const defaultTime = new Date()
const timeValue = ref([])
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
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    type: "",
    state: "",
    level: "",
    startTime: "",
    endTime: "",
  },
  isShowDialog: false,
  alarmDetail: '',
});
// 查询列表
const handleQuery = () => {
  state.loading = true;
  console.log("timeValue.value",timeValue.value)
  if (timeValue.value !== null && timeValue.value.length>0){
    state.queryParams.startTime = formatDate(timeValue.value[0],"YYYY-mm-dd HH:MM:SS")
    state.queryParams.endTime = formatDate(timeValue.value[1],"YYYY-mm-dd HH:MM:SS")
  }
  listAlarm(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false;
  });
};

const resetQuery = () => {
  state.queryParams.type = "";
  state.queryParams.state = "";
  state.queryParams.level = "";
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

const onOpenAlarm = (row: any) => {
  // 修改告警状态为 已确认
  if (row.state === "0"){
    row.state = "1"
    updateAlarm(row)
  }
  state.isShowDialog = true
  state.alarmDetail = JSON.stringify(JSON.parse(row.details), null,2 )
}

const onCloseAlarm = (row: object) => {
  if (row.state != "3"){
    row.state = "3"
    updateAlarm(row)
  }
}

onMounted(()=>{
  handleQuery()
})
</script>
<style scoped>
.json-viewer {
  height: 400px;
}
</style>
