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
    <el-form-item label="json对应字段" prop="jsonField">
        <el-input
           v-model="state.queryParams.jsonField"
           placeholder="请输入json对应字段"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="字段名" prop="name">
        <el-input
           v-model="state.queryParams.name"
           placeholder="请输入字段名"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="表id" prop="tableId">
        <el-input
           v-model="state.queryParams.tableId"
           placeholder="请输入表id"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="字段描述" prop="comment">
        <el-input
           v-model="state.queryParams.comment"
           placeholder="请输入字段描述"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
    <el-form-item label="go对应字段" prop="goField">
        <el-input
           v-model="state.queryParams.goField"
           placeholder="请输入go对应字段"
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
             <span class="card-header-text">数据集字段列表</span>
             <div>
               <el-button
                  type="primary"
                  plain
                  v-auth="'visual:datasetfield:add'"
                  @click="onOpenAddModule"
                  ><SvgIcon name="elementPlus" />新增</el-button>
               <el-button
                 type="danger"
                 plain
                 v-auth="'visual:datasetfield:delete'"
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
      <el-table-column label="json对应字段" align="center" prop="jsonField" />
      <el-table-column label="CreateTime" align="center" prop="createTime" width="180">
        <template #default="scope">
             <span>{{ dateStrFormat(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="字段名" align="center" prop="name" />
      <el-table-column label="表id" align="center" prop="tableId" />
      <el-table-column label="字段描述" align="center" prop="comment" />
      <el-table-column label="go字段类型" align="center" prop="goType" />
      <el-table-column label="字段类型" align="center" prop="type" />
      <el-table-column label="go对应字段" align="center" prop="goField" />
      <el-table-column label="编号" align="center" prop="fieldId" />
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
              <el-button text type="primary" v-auth="'visual:datasetfield:edit'" @click="onOpenEditModule(scope.row)">
                <SvgIcon name="elementEdit" />修改
              </el-button>
            </div>
            <div>
              <el-button text type="primary" v-auth="'visual:datasetfield:delete'" @click="onTabelRowDel(scope.row)">
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

<script lang="ts" setup name="DataSetField">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { listDataSetField, delDataSetField } from "@/api/visual/datasetfield";
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
    jsonField: undefined,
    name: undefined,
    tableId: undefined,
    comment: undefined,
    goType: undefined,
    type: undefined,
    goField: undefined,
    fieldId: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listDataSetField(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
   state.queryParams.jsonField = undefined;
   state.queryParams.name = undefined;
   state.queryParams.tableId = undefined;
   state.queryParams.comment = undefined;
   state.queryParams.goType = undefined;
   state.queryParams.type = undefined;
   state.queryParams.goField = undefined;
   state.queryParams.fieldId = undefined;
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
  state.title = "添加数据集字段";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改数据集字段";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const fieldIds = row.fieldId || state.ids;
  ElMessageBox({
    message: '是否确认删除编号为"' + fieldIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delDataSetField(fieldIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.fieldId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();

  proxy.mittBus.on("onEditDataSetFieldModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDataSetFieldModule");
});
</script>
