<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input
              placeholder="请输入任务名称模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.name"
          />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroup">
          <el-select
              v-model="state.queryParams.jobGroup"
              placeholder="请选择任务组名"
              clearable
          >
            <el-option
                v-for="dict in state.jobGroupOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="请选择任务状态"
              clearable
          >
            <el-option
                v-for="dict in state.statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="handleQuery">
            <SvgIcon name="elementSearch"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="elementRefresh"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">任务日志</span>
          <div>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'log:job:delete'"
            >
              <SvgIcon name="elementDelete"/>
              删除
            </el-button>
            <el-button
                type="danger"
                plain
                @click="handleClean"
                v-auth="'log:job:clean'"
            >
              <SvgIcon name="elementDelete"/>
              清空
            </el-button>
          </div>
        </div>
      </template>
      <!--数据表格-->
      <el-table
          v-loading="state.loading"
          :data="state.tableData"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column
            label="日志编号"
            width="80"
            align="center"
            prop="logId"
        />
        <el-table-column
            label="任务名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="任务组名"
            align="center"
            prop="jobGroup"
            :formatter="jobGroupFormat"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="调用目标"
            align="center"
            prop="invokeTarget"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="日志信息"
            align="center"
            prop="logInfo"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="执行状态"
            align="center"
            prop="status"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '0' ? 'success': 'warning'"
                disable-transitions
            >{{ statusFormat(scope.row) || '-- --' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="执行时间"
            align="center"
            prop="createTime"
            width="180"
        >
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
                text type="primary"
                @click="handleView(scope.row)"
            >
              <SvgIcon name="elementView"/>
              详细
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页设置-->
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
    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详细" v-model="state.open" width="700px" center append-to-body>
      <el-form
          ref="ruleFormRef"
          :model="state.modelForm"
          label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ state.modelForm.logId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ state.modelForm.jobGroup }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称：">{{ state.modelForm.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行时间：">{{ state.modelForm.createTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调用方法：">{{
                state.modelForm.invokeTarget
              }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日志信息：">{{
                state.modelForm.logInfo
              }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="state.modelForm.status == 0">正常</div>
              <div v-else-if="state.modelForm.status == 1">失败</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="state.open === false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="JobLog">
import {
  reactive,
  onMounted,
  onUnmounted,
  toRefs,
  ref,
  getCurrentInstance,
} from "vue";
import {
  listJobLog,
  delJobLog,
  cleanJobLog,
} from "@/api/log/job";
import {ElMessageBox, ElMessage} from "element-plus";

const {proxy} = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 参数
  // 总条数
  total: 0,
  // 列表表格数据
  tableData: [],
  // 遮罩层
  loading: true,
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  // 表单参数
  modelForm: {},
  // 任务组名字典
  jobGroupOptions: [],
  //任务名称字典
  JobOptions: [],
  // 状态字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    jobGroup: undefined,
    status: undefined,
  },
  // 表单参数对象
  //// 表单校验
});
// 定义方法
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.name = undefined;
  state.queryParams.jobGroup = undefined;
  state.queryParams.status = undefined;
  handleQuery();
};
/** 查询定时任务列表 */
const handleQuery = () => {
  state.loading = true;
  listJobLog(state.queryParams).then((response) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
};

/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const logIds = row.logId || state.ids;
  ElMessageBox({
    message: '是否确认删除定时任务编号为"' + logIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delJobLog(logIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox({
    message: "是否确认清空所有调度日志数据项?",
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return cleanJobLog();
      })
      .then(() => {
        handleQuery();
        ElMessage.success("清空成功");
      });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.logId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};

//分页页面大小发生变化
const handleSizeChange = (val: any) => {
  state.queryParams.pageSize = val;
  handleQuery();
};
//当前页码发生变化
const handleCurrentChange = (val: any) => {
  state.queryParams.pageNum = val;
  handleQuery();
};
// 定时任务状态定时任务翻译
const statusFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};
// 任务组名字典翻译
const jobGroupFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.jobGroupOptions, row.jobGroup);
};
/** 详细按钮操作 */
const handleView = (row: any) => {
  state.open = true;
  state.modelForm = row;
};
// 页面加载时调用
onMounted(() => {
  handleQuery();
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.getDicts("sys_job_group").then((response: any) => {
    state.jobGroupOptions = response.data;
  });
});

// 页面卸载时
onUnmounted(() => {
  //   proxy.mittBus.off("onEditPostModule");
});
</script>
