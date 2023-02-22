<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
              placeholder="请输入部门名称模糊查询"
              clearable
              @keyup.enter.native="handleQuery"
              v-model="state.queryParams.deptName"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="部门状态"
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
          <span class="card-header-text">部门列表</span>
          <div>
            <el-button type="primary"
                       plain
                       v-auth="'system:dept:add'"
                       @click="onOpenAddModule">
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
          </div>
        </div>
      </template>
      <!--数据表格-->
      <el-table
          v-loading="state.loading"
          :data="state.tableData"
          row-key="deptId"
          border
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
            prop="deptName"
            label="部门名称"
            width="260"
        ></el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="300"
        >
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
            width="200"
        ></el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="100"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '1' ? 'danger' : 'success'"
                disable-transitions
            >{{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center" prop="leader" width="200">
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
                <el-button text type="primary" v-auth="'system:dept:edit'" @click="onOpenEditModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'system:dept:add'" @click="onOpenAddModule(scope.row)">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
              </div>
              <div>
                <el-button v-if="scope.row.parentId != 0" text type="primary" v-auth="'system:dept:delete'" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改部门对话框 -->
    <EditModule ref="editModuleRef" :title="state.title"/>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, getCurrentInstance, onUnmounted,} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {listDept, delDept} from "@/api/system/dept";
import EditModule from "./component/editModule.vue";

const {proxy} = getCurrentInstance() as any;
const editModuleRef = ref();
const state = reactive({
  // 遮罩层
  loading: true,
  // 弹出层标题
  title: "",
  // 部门表格树数据
  tableData: [] as any,
  // 状态数据字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    deptName: undefined,
    status: undefined,
  },
});

/** 查询部门列表 */
const handleQuery = () => {
  state.loading = true;
  listDept(state.queryParams).then((response: any) => {
    state.tableData = response.data;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.deptName = undefined;
  state.queryParams.status = undefined;
  handleQuery();
};

// 部门状态字典翻译
const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 打开新增部门弹窗
const onOpenAddModule = (row: any) => {
  let parentId = row.deptId;
  row = {};
  row.parentId = parentId;
  state.title = "添加部门";
  editModuleRef.value.openDialog(row);
};
// 打开编辑部门弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改部门";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  ElMessageBox({
    message: '是否确认删除名称为"' + row.deptName + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delDept(row.deptId).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 页面加载时
onMounted(() => {
  // 查询部门信息
  handleQuery();
  // 查询部门状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.mittBus.on("onEditDeptModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDeptModule");
});
</script>
