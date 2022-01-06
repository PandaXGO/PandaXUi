<template>
  <div class="system-menu-container">
    <el-dialog v-model="isShowDialog" width="769px">
      <template #title>
        <div style="font-size: large" v-drag="['.system-menu-container .el-dialog', '.system-menu-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-row>



        <el-form
                :model="queryParams"
                :inline="true"
                label-width="80px"
        >
          <el-col :span="9">
            <el-form-item label="表名称" prop="tableName">
              <el-input
                      v-model="queryParams.tableName"
                      placeholder="请输入表名称"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="表描述" prop="tableComment">
              <el-input
                      v-model="queryParams.tableComment"
                      placeholder="请输入表描述"
                      clearable
                      size="small"
                      @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" size="mini" @click="handleQuery"><SvgIcon name="elementSearch" />搜索</el-button>
              <el-button size="mini" @click="resetQuery"> <SvgIcon name="elementRefresh" />重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>

      <el-row>
        <el-table v-loading="loading" ref="table" :data="dbTableList" height="260px" @row-click="clickRow" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="tableName" label="表名称" />
          <el-table-column prop="tableComment" label="表描述" />
          <el-table-column prop="createTime" label="创建时间" >
            <template #default="scope">
              <span>{{ dateStrFormat(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间">
            <template #default="scope">
              <span>{{ dateStrFormat(scope.row.updateTime) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
                v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageIndex"
                :limit.sync="queryParams.pageSize"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="small">取 消</el-button>
          <el-button type="primary" @click="onSubmit" size="small"
            >确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, getCurrentInstance } from "vue";
import {getDbList, insertTable} from '/@/api/gen/table'
import { ElMessage } from "element-plus";

export default {
  name: "editMenu",
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: () => "",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      // 是否显示弹出层
      isShowDialog: false,
      loading:false,
      visible: false,
      // 选中数组值
      tables: [],
      // 总条数
      total: 0,
      // 表数据
      dbTableList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: undefined,
        tableComment: undefined
      }
    });
    // 查询
    const handleQuery = () => {
      state.loading = true;
      getDbList(state.queryParams).then(response => {
        state.dbTableList = response.data.data
        state.total = response.data.total
        state.loading = false
      })
    };
    // 打开弹窗
    const openDialog = (row: any) => {
      handleQuery()
      state.isShowDialog = true;
    };
    // 重置
    const resetQuery = () => {
     state.queryParams.tableName = undefined;
     state.queryParams.tableComment = undefined;
     handleQuery();
    };
    // 关闭弹窗
    const closeDialog = (row?: object) => {     
      proxy.mittBus.emit("onEditTableModule", row);
      state.tables = []
      state.isShowDialog = false;
    };
    // 多选框选中数据
    const handleSelectionChange = (selection:any) => {
      state.tables = selection.map(item => item.tableName)
    };
    const handleCurrentChange = (val:number) => {
      state.queryParams.pageNum = val
      handleQuery()
    }
    const handleSizeChange = (val:number) => {
      state.queryParams.pageSize = val
      handleQuery()
    }

    // 取消
    const onCancel = () => {      
      closeDialog();       
    };
    
    // 保存
    const onSubmit = () => {
      insertTable({ tables: state.tables.join(',') }).then(response => {
        ElMessage.success("导入成功");
        closeDialog(); // 关闭弹窗
      })
    };

    return {
      openDialog,
      closeDialog,
      onCancel,
      resetQuery,
      handleQuery,
      handleSelectionChange,
      onSubmit,
      handleCurrentChange,
      handleSizeChange,
      ...toRefs(state),
    };
  },
};
</script>
