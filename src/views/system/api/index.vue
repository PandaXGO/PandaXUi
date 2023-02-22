<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
      >
        <el-form-item label="路径" prop="path">
          <el-input
              placeholder="Api路径模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.path"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
              placeholder="描述模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.description"
          />
        </el-form-item>
        <el-form-item label="分组" prop="apiGroup">
          <el-input
              placeholder="分组查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.apiGroup"
          />
        </el-form-item>
        <el-form-item label="方法" prop="method">
          <el-select
              v-model="state.queryParams.method"
              placeholder="方法"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="dict in state.methodOptions"
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
          <span class="card-header-text">API列表</span>
          <div>
            <el-button
                type="primary"
                plain
                v-auth="'system:api:add'"
                @click="onOpenAddModule"
            >
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                v-auth="'system:api:delete'"
                @click="onTabelRowDel"
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
        <el-table-column label="id" align="center" prop="id"/>
        <el-table-column label="路径" align="center" prop="path" :show-overflow-tooltip="true"/>
        <el-table-column label="分组" align="center" prop="apiGroup"/>
        <el-table-column label="简介" align="center" prop="description"/>
        <el-table-column label="请求" align="center" prop="method" :show-overflow-tooltip="true">
          <template #default="scope">
            <el-tag type="success">
              {{ scope.row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            width="200"
            class-name="medium-padding fixed-width"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" v-auth="'system:api:edit'" @click="onOpenEditModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button v-if="scope.row.parentId != 0" text type="primary" v-auth="'system:api:delete'" @click="onTabelRowDel(scope.row)">
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
    <!-- 添加或修改配置参数对话框 -->
    <EditModule ref="editModuleRef" :title="state.title"/>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {listApi, delApi} from "@/api/system/api";
import EditModule from "./component/editModule.vue";
const {proxy} = getCurrentInstance() as any;
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
  // 配置参数表格数据
  tableData: [],
  // 总条数
  total: 0,
  methodOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    path: undefined,
    description: undefined,
    method: undefined,
    apiGroup: undefined,
  },
});

/** 查询配置参数列表 */
const handleQuery = () => {
  state.loading = true;
  listApi(state.queryParams).then(
      (response) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.path = undefined;
  state.queryParams.description = undefined;
  state.queryParams.method = undefined;
  state.queryParams.apiGroup = undefined;
  handleQuery();
};

// 打开新增配置参数弹窗
const onOpenAddModule = () => {
  state.title = "添加Api参数";
  editModuleRef.value.openDialog({});
};
// 打开编辑配置参数弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改Api参数";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const ids = row.id || state.ids;
  ElMessageBox({
    message: '是否确认删除配置参数编号为"' + ids + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delApi(ids).then(() => {
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
  // 查询配置参数信息
  handleQuery();
  proxy.getDicts("sys_method_api").then((response: any) => {
    state.methodOptions = response.data;
  });
  proxy.mittBus.on("onEditApiModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditApiModule");
});
</script>
