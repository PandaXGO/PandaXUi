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
        <el-form-item label="设备名称" prop="type">
          <el-input
              v-model="state.queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="消息类型" prop="state">
          <el-select v-model="state.queryParams.msgType" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in msgTypeOption"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">
            <SvgIcon name="elementSearch" />搜 索</el-button>
          <el-button type="warning" @click="handleDelete">
            <SvgIcon name="elementDelete" />删 除</el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="elementRefresh" />
            重 置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">日志列表</span>
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="消息编号" align="center" prop="messageId"/>
        <el-table-column label="消息类型" align="center" prop="msgType"/>
        <el-table-column label="设备名称" align="center" prop="deviceName"/>
        <el-table-column label="日志时间" align="center" prop="time">
          <template #default="scope">
            {{ dateStrFormat(scope.row.ts) }}
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
                <el-button text type="primary" @click="onOpenRuleLog(scope.row)">
                  <SvgIcon name="elementView"/>
                  查看
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
    <el-dialog v-model="state.isShowDialog" width="769px" title="日志数据" center draggable>
      <div class="json-viewer">
        <pre>{{ state.ruleLogDetail }}</pre>
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
import {delRuleLog, listRuleLog} from "@/api/rule/rulelog";
import {ElMessage, ElMessageBox} from "element-plus";

const msgTypeOption = [{
  label: "原始数据",
  value: "Row",
},{
  label: "遥测数据",
  value: "Telemetry",
},{
  label: "属性数据",
  value: "Attributes",
},{
  label: "连接",
  value: "Connect",
},{
  label: "断开连接",
  value: "Disconnect",
},{
  label: "设备RPC请求",
  value: "RpcRequest",
},{
  label: "告警",
  value: "Alarm",
}]

const state = reactive({
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
    deviceName: "",
    msgType: ""
  },
  isShowDialog: false,
  ruleLogDetail: {},
});
// 查询列表
const handleQuery = () => {
  state.loading = true;
  listRuleLog(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false;
  });
};

const handleDelete = () => {
  ElMessageBox({
    message: '是否确认删除数据项,删除后无法复原',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    delRuleLog(state.queryParams).then((response:any) => {
      if (response.code === 200) {
        ElMessage.success("删除成功");
        resetQuery()
      }
    });
  });
}

const resetQuery = () => {
  state.queryParams.deviceName = "";
  state.queryParams.msgType = "";
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

const onOpenRuleLog = (row: object) => {
  state.isShowDialog = true
  state.ruleLogDetail = row.content
}


onMounted(()=>{
  handleQuery()
})
</script>
<style scoped>
.json-viewer {
  height: 400px;
  font-family: monospace;
  color: #000000d9;
  font-size: 18px;
  overflow: auto;
  white-space: nowrap;
}
</style>
