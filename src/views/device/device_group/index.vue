<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form :model="state.queryParams" ref="queryForm" :inline="true" label-width="68px">
        <el-form-item label="名称" prop="name">
          <el-input
              placeholder="请输入名称模糊查询"
              clearable
              @keyup.enter.native="handleQuery"
              v-model="state.queryParams.name"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="状态"
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
          <span class="card-header-text">设备分组列表</span>
          <div>
            <el-button type="primary"
                       plain
                       v-auth="'device:group:add'"
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
          row-key="id"
          border
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="名称" ></el-table-column>
        <el-table-column prop="sort" label="排序" width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '1' ? 'danger' : 'success'"
                disable-transitions
            >{{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="600"></el-table-column>
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
                <el-button text type="primary" v-auth="'device:group:edit'" @click="onOpenEditModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'device:group:add'" @click="onOpenAddModule(scope.row)">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'device:group:delete'" @click="onTabelRowDel(scope.row)">
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
import EditModule from "./component/editModule.vue";
import {delDeviceGroup, listDeviceGroup} from "@/api/device/device_group";

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
    name: undefined,
    status: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listDeviceGroup(state.queryParams).then((response: any) => {
    state.tableData = response.data;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.name = undefined;
  state.queryParams.status = undefined;
  handleQuery();
};

// 状态字典翻译
const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 打开新增弹窗
const onOpenAddModule = (row: any) => {
  let parentId = row.id;
  row = {};
  row.pid = parentId;
  state.title = "添加设备分组";
  editModuleRef.value.openDialog(row);
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改设备分组";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  ElMessageBox({
    message: '是否确认删除名称为"' + row.name + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delDeviceGroup(row.id).then(() => {
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
  proxy.mittBus.on("onEditDeviceGroupModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDeviceGroupModule");
});
</script>
