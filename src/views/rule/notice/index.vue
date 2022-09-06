<template>
  <div class="app-container">
    <el-card shadow="always">
    <!-- 查询 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
    <el-form-item label="描述" prop="description">
    <el-input
       v-model="queryParams.description"
       placeholder="请输入描述"
       clearable
       @keyup.enter.native="handleQuery"
    />
     </el-form-item>
    <el-form-item label="名称" prop="name">
        <el-input
           v-model="queryParams.name"
           placeholder="请输入名称"
           clearable
           @keyup.enter.native="handleQuery"
        />
     </el-form-item>
     <el-form-item label="分类" prop="category">
       <el-select v-model="queryParams.category" placeholder="请选择分类" clearable>
           <el-option
               v-for="dict in categoryOptions"
               :key="dict.dictValue"
               :label="dict.dictLabel"
               :value="dict.dictValue"
           />
       </el-select>
     </el-form-item>
     <el-form-item label="模型" prop="model">
       <el-select v-model="queryParams.model" placeholder="请选择模型" clearable>
           <el-option
               v-for="dict in modelOptions"
               :key="dict.dictValue"
               :label="dict.dictLabel"
               :value="dict.dictValue"
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
             <span class="card-header-text">规则通知配置列表</span>
             <div>
               <el-button
                  type="primary"
                  plain
                  v-auth="'rule:notice:add'"
                  @click="onOpenAddModule"
                  ><SvgIcon name="elementPlus" />新增</el-button>
               <el-button
                 type="danger"
                 plain
                 v-auth="'rule:notice:delete'"
                 :disabled="multiple"
                 @click="onTabelRowDel"
                 ><SvgIcon name="elementDelete" />删除</el-button>
             </div>
           </div>
        </template>
    <!--数据表格-->
    <el-table
      v-loading="loading"
      :data="tableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="描述" align="center" prop="description" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="分类" align="center" prop="category" >
      <template #default="scope">
          <el-tag :type="scope.row.category === '0' ? 'success': 'warning'" disable-transitions>{{ categoryFormat(scope.row) || '-- --' }}</el-tag>
      </template>
      </el-table-column>
      <el-table-column label="模型" align="center" prop="model" >
      <template #default="scope">
          <el-tag :type="scope.row.model === '0' ? 'success': 'warning'" disable-transitions>{{ modelFormat(scope.row) || '-- --' }}</el-tag>
      </template>
      </el-table-column>
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
              <el-button text type="primary" v-auth="'rule:notice:edit'" @click="onOpenEditModule(scope.row)">
                <SvgIcon name="elementEdit" />修改
              </el-button>
            </div>
            <div>
              <el-button text type="primary" v-auth="'rule:notice:delete'" @click="onTabelRowDel(scope.row)">
                <SvgIcon name="elementDelete" />删除
              </el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页设置-->
    <div v-show="total > 0">
        <el-divider></el-divider>
        <el-pagination
            background
            :total="total"
            :current-page="queryParams.pageNum"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    </el-card>
    <!-- 添加或修改岗位对话框 -->
    <EditModule ref="editModuleRef" :title="title" />
  </div>
</template>

<script lang="ts">
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { listNotice, delNotice } from "@/api/rule/notice";
import EditModule from "./component/editModule.vue";

export default {
  name: "Notice",
  components: { EditModule },
  setup() {
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
      // categoryOptions字典数据
      categoryOptions: [],
      // modelOptions字典数据
      modelOptions: [],
      // 查询参数
      queryParams: {
        // 页码
        pageNum: 1,
        // 每页大小
        pageSize: 10,
        // 以下为参数
        description: undefined,
        name: undefined,
        exParam: undefined,
        category: undefined,
        model: undefined,
        id: undefined,
      },
    });

    /** 查询列表 */
    const handleQuery = () => {
      state.loading = true;
      listNotice(state.queryParams).then((response:any) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      });
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
       state.queryParams.description = undefined;
       state.queryParams.name = undefined;
       state.queryParams.exParam = undefined;
       state.queryParams.category = undefined;
       state.queryParams.model = undefined;
       state.queryParams.id = undefined;
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
    const categoryFormat = (row: any) => {
       return proxy.selectDictLabel(state.categoryOptions, row.category);
    };
    const modelFormat = (row: any) => {
       return proxy.selectDictLabel(state.modelOptions, row.model);
    };

    // 打开新增弹窗
    const onOpenAddModule = (row: object) => {
      row = [];
      state.title = "添加规则通知配置";
      editModuleRef.value.openDialog(row);
    };
    // 打开编辑弹窗
    const onOpenEditModule = (row: object) => {
      state.title = "修改规则通知配置";
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
        return delNotice(ids).then(() => {
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
      proxy.getDicts("rule_notice_category").then((response: any) => {
          state.categoryOptions = response.data;
      });
      proxy.getDicts("rule_notice_model").then((response: any) => {
          state.modelOptions = response.data;
      });

      proxy.mittBus.on("onEditNoticeModule", (res: any) => {
        handleQuery();
      });
    });
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off("onEditNoticeModule");
    });
    return {
      editModuleRef,
      handleSelectionChange,
      handleQuery,
      handleCurrentChange,
      handleSizeChange,
      resetQuery,
      categoryFormat,
      modelFormat,
      onOpenAddModule,
      onOpenEditModule,
      onTabelRowDel,
      ...toRefs(state),
    };
  },
};
</script>
