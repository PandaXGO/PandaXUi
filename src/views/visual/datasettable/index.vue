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
    <el-form-item label="数据圆ID" prop="dataSourceId">
        <el-input
           v-model="state.queryParams.dataSourceId"
           placeholder="请输入数据圆ID"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="原始表信息" prop="mode">
        <el-input
           v-model="state.queryParams.mode"
           placeholder="请输入原始表信息"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="原始表信息" prop="info">
        <el-input
           v-model="state.queryParams.info"
           placeholder="请输入原始表信息"
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
             <span class="card-header-text">数据集表列表</span>
             <div>
               <el-button
                  type="primary"
                  plain
                  v-auth="'visual:datasettable:add'"
                  @click="onOpenAddModule"
                  ><SvgIcon name="elementPlus" />新增</el-button>
               <el-button
                 type="danger"
                 plain
                 v-auth="'visual:datasettable:delete'"
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
      <el-table-column label="CreateTime" align="center" prop="createTime" width="180">
        <template #default="scope">
             <span>{{ dateStrFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编号" align="center" prop="tableId" />
      <el-table-column label="数据圆ID" align="center" prop="dataSourceId" />
      <el-table-column label="db,sql,excel,custom,api" align="center" prop="tableType" />
      <el-table-column label="原始表信息" align="center" prop="mode" />
      <el-table-column label="原始表信息" align="center" prop="info" />
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
              <el-button text type="primary" v-auth="'visual:datasettable:edit'" @click="onOpenEditModule(scope.row)">
                <SvgIcon name="elementEdit" />修改
              </el-button>
            </div>
            <div>
              <el-button text type="primary" v-auth="'visual:datasettable:delete'" @click="onTabelRowDel(scope.row)">
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

<script lang="ts" setup name="DataSetTable">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { listDataSetTable, delDataSetTable } from "@/api/visual/datasettable";
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
    tableId: undefined,
    dataSourceId: undefined,
    tableType: undefined,
    mode: undefined,
    info: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listDataSetTable(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
   state.queryParams.tableId = undefined;
   state.queryParams.dataSourceId = undefined;
   state.queryParams.tableType = undefined;
   state.queryParams.mode = undefined;
   state.queryParams.info = undefined;
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
  state.title = "添加数据集表";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改数据集表";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const tableIds = row.tableId || state.ids;
  ElMessageBox({
    message: '是否确认删除编号为"' + tableIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delDataSetTable(tableIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.tableId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();

  proxy.mittBus.on("onEditDataSetTableModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDataSetTableModule");
});
</script>
