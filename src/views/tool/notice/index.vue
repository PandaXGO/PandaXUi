<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="公告标题" prop="title">
          <el-input
              placeholder="请输入公告标题模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.title"
          />
        </el-form-item>
        <el-form-item label="通知类型" prop="noticeType">
          <el-select
              v-model="state.queryParams.noticeType"
              placeholder="请选择通知类型"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="dict in state.noticeTypeOptions"
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
          <span class="card-header-text">公告列表</span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenAddModule"
                v-auth="'tool:notice:add'"
            >
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'tool:notice:delete'"
            >
              <SvgIcon name="elementDelete"/>
              删除
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
        <el-table-column label="通知编号" align="center" prop="noticeId"/>
        <el-table-column
            label="通知标题"
            align="center"
            prop="title"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="通知类型"
            align="center"
            prop="noticeType"
            :formatter="noticeTypeFormat"
        >

        </el-table-column>
        <el-tabl-column
            label="发布人"
            align="center"
            prop="userName"
        />
        <el-table-column
            label="发布时间"
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
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" v-auth="'tool:notice:view'" @click="handleRun(scope.row)">
                  <SvgIcon name="elementView"/>
                  查看
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'tool:notice:edit'" @click="onOpenEditModule(scope.row)">
                <SvgIcon name="elementEdit"/>
                编辑
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'tool:notice:delete'" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
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
    <EditModule ref="editModuleRef" :title="state.title"/>
    <ViewModule ref="viewModuleRef"/>
  </div>
</template>

<script lang="ts" setup name="Notice">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {
  listNotice,
  delNotice,
} from "@/api/system/notice";
import EditModule from "./component/editModule.vue";
import ViewModule from "./component/viewModule.vue";

const {proxy} = getCurrentInstance() as any;
const editModuleRef = ref();
const viewModuleRef = ref();
const ruleFormRef = ref<HTMLElement | null>(null);
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
  // 状态字典
  noticeTypeOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    title: undefined,
    noticeType: undefined,
  },
});

/** 查询定时任务列表 */
const handleQuery = () => {
  state.loading = true;
  listNotice(state.queryParams).then((response) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.title = undefined;
  state.queryParams.noticeType = undefined;
  handleQuery();
};

// 定时任务状态定时任务翻译
const noticeTypeFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.noticeTypeOptions, row.noticeType);
};

// 打开新增定时任务弹窗
const onOpenAddModule = () => {
  state.title = "添加公告";
  editModuleRef.value.openDialog({});
};
// 打开编辑定时任务弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改公告";
  editModuleRef.value.openDialog(row);
};
const handleRun = (row: any) => {
  viewModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const noticeIds = row.noticeId || state.ids;
  ElMessageBox({
    message: '是否确认删除公告编号为"' + noticeIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delNotice(noticeIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};

// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.noticeId);
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
// 页面加载时
onMounted(() => {
  // 查询定时任务信息
  handleQuery();
  proxy.getDicts("sys_notice_type").then((response: any) => {
    state.noticeTypeOptions = response.data;
  });
  proxy.mittBus.on("onEditNoticeModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditNoticeModule");
});
</script>

<style scoped lang="scss">
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  width: 100px;
  display: flex;
  align-items: center;
}
</style>