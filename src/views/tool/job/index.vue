<template>
    <div class="app-container">
        <el-card shadow="always">
        <!-- 查询 -->
        <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="任务名称" prop="jobName">
                <el-input
                        placeholder="请输入任务名称模糊查询"
                        clearable
                        @keyup.enter="handleQuery"
                        style="width: 240px"
                        v-model="state.queryParams.jobName"
                />
            </el-form-item>
            <el-form-item label="任务组名" prop="jobGroup">
                <el-select
                        v-model="state.queryParams.jobGroup"
                        placeholder="请选择任务组名"
                        clearable
                        style="width: 240px"
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
                        style="width: 240px"
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
                <el-button
                        type="primary"
                        plain
                        @click="handleQuery"
                >
                    <SvgIcon name="elementSearch" />
                    搜索</el-button>
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
            <span class="card-header-text">定时任务列表</span>
            <div>
              <el-button
                  type="primary"
                  plain
                  @click="onOpenAddModule"
                  v-auth="'tool:job:add'"
              ><SvgIcon name="elementPlus" />新增</el-button>
              <el-button
                  type="danger"
                  plain
                  :disabled="state.multiple"
                  @click="onTabelRowDel"
                  v-auth="'tool:job:delete'"
              ><SvgIcon name="elementDelete" />删除</el-button>
            </div>
          </div>
        </template>
        <!--数据表格-->
        <el-table
                v-loading="state.loading"
                :data="state.tableData"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="任务编号" align="center" prop="jobId" />
            <el-table-column
                    label="任务名称"
                    align="center"
                    prop="jobName"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="任务组名"
                    align="center"
                    prop="jobGroup"
                    :formatter="jobGroupFormat"
            />
            <el-table-column
                    label="任务类型"
                    align="center"
                    prop="jobType"
            ><template #default="scope">
                {{ scope.row.jobType == 1 ? "接口": "函数"}}
            </template>

            </el-table-column>
            <el-table-column
                    label="调用目标"
                    align="center"
                    prop="invokeTarget"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="cron执行表达式"
                    align="center"
                    prop="cronExpression"
                    :show-overflow-tooltip="true"
            />
            <el-table-column label="状态" align="center">
                <template #default="scope">
                    <el-switch
                            v-model="scope.row.status"
                            active-value="0"
                            inactive-value="1"
                            @click="handleStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="300"
            >
                <template #default="scope">
                    <el-popover  placement="left">
                        <template #reference>
                            <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
                        </template>
                        <div>
                            <el-button  text type="primary" v-auth="'tool:job:run'" @click="handleRun(scope.row)"><SvgIcon name="elementSwitchButton" />{{ scope.row.entryId > 0 ? "停止":"启动"}}</el-button>
                        </div>
                        <div>
                            <el-button  text type="primary" v-auth="'tool:job:edit'" @click="onOpenEditModule(scope.row)"><SvgIcon name="elementEdit" />编辑</el-button>
                        </div>
                        <div>
                            <el-button  text type="primary" v-auth="'tool:job:delete'" @click="onTabelRowDel(scope.row)"><SvgIcon name="elementDelete" />删除</el-button>
                        </div>
                    </el-popover>
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
        <!-- 添加或修改定时任务对话框 -->
        <EditModule ref="editModuleRef" :title="state.title" />
    </div>
</template>

<script lang="ts" setup>
import {
    ref,
    reactive,
    onMounted,
    getCurrentInstance,
    onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {
    listJob,
    runStartJob,
    runStopJob,
    delJob,
    changeJobStatus,
} from "@/api/job/job";
import EditModule from "./component/editModule.vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const ruleFormRef = ref<HTMLElement | null>(null);
const router = useRouter();
const state = reactive({
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
  // 定时任务表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 是否显示弹出层
  open: false,
  // 表单参数
  modelForm: {},
  // 任务组名字典
  jobGroupOptions: [],
  // 状态字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    jobName: undefined,
    jobGroup: undefined,
    status: undefined,
  },
});

/** 查询定时任务列表 */
const handleQuery = () => {
  state.loading = true;
  listJob(state.queryParams).then((response) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.jobName = undefined;
  state.queryParams.jobGroup = undefined;
  state.queryParams.status = undefined;
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

// 打开新增定时任务弹窗
const onOpenAddModule = () => {
  state.title = "添加定时任务";
  editModuleRef.value.openDialog({});
};
// 打开编辑定时任务弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改定时任务";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const jobIds = row.jobId || state.ids;
  ElMessageBox({
    message: '是否确认删除定时任务编号为"' + jobIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delJob(jobIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};

// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.jobId);
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

// 任务状态修改
const handleStatusChange = (row: any) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox({
    message: '确认要"' + text + '""' + row.jobName + '"任务吗?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return changeJobStatus({jobId: row.jobId,status: row.status});
      })
      .then(() => {
        ElMessage({
          message: text + "成功",
          type: 'success',
        });
      })
      .catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
};
const handleRun = (row: any) => {
  let text = row.entryId >0 ? "停止" : "启动"
  ElMessageBox({
    message: '确认要立即'+ text +'"' + row.jobName + '"任务吗?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        if (row.entryId >0) {
          runStopJob(row.jobId).then((res:any) =>{
            handleQuery();
          })
        }else {
          return runStartJob(row.jobId).then((res:any) =>{
            handleQuery();
          })
        }
      })
      .then(() => {
        ElMessage({
          message: text + "执行成功",
          type: 'success',
        });
      });
};
// 页面加载时
onMounted(() => {
  // 查询定时任务信息
  handleQuery();
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.getDicts("sys_job_group").then((response: any) => {
    state.jobGroupOptions = response.data;
  });
  proxy.mittBus.on("onEditJobModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditJobModule");
});
</script>
