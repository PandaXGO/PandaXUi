<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="组织名称" prop="organizationName">
          <el-input
              placeholder="请输入组织名称模糊查询"
              clearable
              @keyup.enter.native="handleQuery"
              v-model="state.queryParams.organizationName"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="组织状态"
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
          <span class="card-header-text">组织列表</span>
          <div>
            <el-button type="primary"
                       plain
                       v-auth="'system:organization:add'"
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
          row-key="organizationId"
          border
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
            prop="organizationName"
            label="组织名称"
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
                <el-button text type="primary" v-auth="'system:organization:edit'" @click="onOpenEditModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'system:organization:add'" @click="onOpenAddModule(scope.row)">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
              </div>
              <div>
                <el-button v-if="scope.row.parentId != 0" text type="primary" v-auth="'system:organization:delete'" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改组织对话框 -->
    <EditModule ref="editModuleRef" :title="state.title"/>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, getCurrentInstance, onUnmounted,} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {listOrganization, delOrganization} from "@/api/system/organization";
import EditModule from "./component/editModule.vue";

const {proxy} = getCurrentInstance() as any;
const editModuleRef = ref();
const state = reactive({
  // 遮罩层
  loading: true,
  // 弹出层标题
  title: "",
  // 组织表格树数据
  tableData: [] as any,
  // 状态数据字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    organizationName: undefined,
    status: undefined,
  },
});

/** 查询组织列表 */
const handleQuery = () => {
  state.loading = true;
  listOrganization(state.queryParams).then((response: any) => {
    state.tableData = response.data;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.organizationName = undefined;
  state.queryParams.status = undefined;
  handleQuery();
};

// 组织状态字典翻译
const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 打开新增组织弹窗
const onOpenAddModule = (row: any) => {
  let parentId = row.organizationId;
  row = {};
  row.parentId = parentId;
  state.title = "添加组织";
  editModuleRef.value.openDialog(row);
};
// 打开编辑组织弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改组织";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  ElMessageBox({
    message: '是否确认删除名称为"' + row.organizationName + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delOrganization(row.organizationId).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 页面加载时
onMounted(() => {
  // 查询组织信息
  handleQuery();
  // 查询组织状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.mittBus.on("onEditOrganizationModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditOrganizationModule");
});
</script>
