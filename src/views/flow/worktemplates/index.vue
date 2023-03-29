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

        <el-form-item label="名称" prop="name">
          <el-input
              v-model="state.queryParams.name"
              placeholder="请输入名称"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="描述 " prop="remarks">
          <el-input
              v-model="state.queryParams.remarks"
              placeholder="请输入描述 "
              clearable
              @keyup.enter.native="handleQuery"
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
          <span class="card-header-text">工作流模板列表</span>
          <div>
            <el-button
                type="primary"
                plain
                v-auth="'flow:worktemplates:add'"
                @click="onOpenAddModule"
            ><SvgIcon name="elementPlus" />新增</el-button>
            <el-button
                type="danger"
                plain
                v-auth="'flow:worktemplates:delete'"
                :disabled="state.multiple"
                @click="onTabelRowDel"
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
        <el-table-column label="编号" align="center" prop="id" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" v-auth="'flow:worktemplates:edit'" @click="onOpenEditModule(scope.row)">
                  <SvgIcon name="elementEdit" />修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'flow:worktemplates:delete'" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete" />删除
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
    <!-- 添加或修改岗位对话框 -->
    <EditModule ref="editModuleRef" :title="state.title" />
  </div>
</template>

<script lang="ts" setup name="WorkTemplates">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { listWorkTemplates, delWorkTemplates } from "@/api/flow/worktemplates";
import EditModule from "./component/editModule.vue";

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
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
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    remarks: undefined,
    id: undefined,
    name: undefined,
    creator: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listWorkTemplates(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.remarks = undefined;
  state.queryParams.id = undefined;
  state.queryParams.name = undefined;
  state.queryParams.creator = undefined;
  handleQuery();
};

const handleCurrentChange = (val:number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val:number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

// 打开新增弹窗
const onOpenAddModule = () => {
  state.title = "添加工作流模板";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改工作流模板";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const ids = row.id || state.ids;
  ElMessageBox({
    message: '是否确认删除编号为"' + ids + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delWorkTemplates(ids).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.id);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();

  proxy.mittBus.on("onEditWorkTemplatesModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditWorkTemplatesModule");
});
</script>
