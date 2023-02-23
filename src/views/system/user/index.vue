<template>
  <div class="system-user-container app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <el-card shadow="always">
          <div class="head-container">
            <el-input
                v-model="state.deptName"
                placeholder="请输入部门名称"
                clearable
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
                :data="state.deptOptions"
                :props="state.defaultProps"
                node-key="deptId"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-card shadow="always">
          <!-- 查询-->
          <el-form
              :model="state.queryParams"
              ref="queryForm"
              :inline="true"
              label-width="78px"
          >
            <el-form-item label="用户名称" prop="username">
              <el-input
                  placeholder="用户名称模糊查询"
                  clearable
                  @keyup.enter="handleQuery"
                  style="width: 240px"
                  v-model="state.queryParams.username"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input
                  v-model="state.queryParams.phone"
                  placeholder="请输入手机号码"
                  clearable
                  style="width: 240px"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                  v-model="state.queryParams.status"
                  placeholder="用户状态"
                  clearable
                  style="width: 240px"
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
        <!-- 操作按钮 -->
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span class="card-header-text">用户列表</span>
              <div>
                <el-button type="primary" plain @click="handleAdd">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
                <el-button
                    type="danger"
                    plain
                    :disabled="state.multiple"
                    @click="handleDelete"
                >
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
                <el-button
                    type="warning"
                    plain
                    @click="handleExport"
                >
                  <SvgIcon name="elementDownload"/>
                  导出
                </el-button>
              </div>
            </div>
          </template>
          <el-table v-loading="state.loading" :data="state.tableData.data" stripe @selection-change="handleSelectionChange"
                    style="width: 100%">
            <el-table-column type="selection" width="45" align="center"/>
            <el-table-column
                label="用户编号"
                align="center"
                key="userId"
                prop="userId"
            />
            <el-table-column
                label="用户名"
                prop="username"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                    label="所属租户"
                    prop="tenants.tenantName"
                    show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="头像" show-overflow-tooltip>
              <template #default="scope">
                <el-image
                    class="system-user-photo"
                    :src="
                  scope.row.avatar
                    ? scope.row.avatar
                    : letterAvatar(scope.row.username)
                "
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column
                label="用户性别"
                align="center"
                prop="sex"
                :formatter="sexFormat"
            />
            <el-table-column
                prop="phone"
                label="手机"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="状态" align="center" key="status">
              <template #default="scope">
                <el-switch
                    v-model="scope.row.status"
                    active-value="0"
                    inactive-value="1"
                    @click="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间"
                show-overflow-tooltip
            >
              <template #default="scope">
                {{ dateStrFormat(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="path" align="center" label="操作">
              <template #default="scope">
                <el-popover  placement="left">
                  <template #reference>
                    <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
                  </template>
                  <div>
                    <el-button text type="primary" v-auth="'system:user:edit'" @click="handleUpdate(scope.row)">
                      <SvgIcon name="elementEdit"/>
                      修改
                    </el-button>
                  </div>
                  <div>
                    <el-button text type="primary" v-auth="'system:user:delete'" @click="handleDelete(scope.row)">
                      <SvgIcon name="elementDelete"/>
                      删除
                    </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="state.tableData.total > 0" >
            <el-divider></el-divider>
            <el-pagination
                background
                :total="state.tableData.total"
                :page-sizes="[10, 20, 30]"
                :current-page="state.queryParams.pageNum"
                :page-size="state.queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="onHandleSizeChange"
                @current-change="onHandleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加或修改参数配置对话框 -->
    <EditModule ref="userFormRef" :title="state.title"/>

  </div>
</template>

<script lang="ts" setup>
import {
  toRefs,
  reactive,
  onMounted,
  ref,
  watch,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {
  listUser,
  changeUserStatus,
  delUser,
  exportUser,
} from "@/api/system/user";
import {treeselect} from "@/api/system/dept";
import {ElMessageBox, ElMessage} from "element-plus";
import {getDicts} from "@/api/system/dict/data";
import MDInput from "@/components/panda/MDInput.vue";
import EditModule from "./component/editModule.vue";
import {letterAvatar} from '@/utils/string';
import {handleFileError} from "@/utils/export";

const {proxy} = getCurrentInstance() as any;
const userFormRef = ref();
const state: any = reactive({
  tableData: {
    data: [],
    total: 0,
  },
  loading: false,
  // 岗位选项
  postOptions: [],
  defaultProps: {
    children: "children",
    label: "deptName",
  },
  // 性别状态字典
  sexOptions: [],
  // 角色选项
  roleOptions: [],
  // 状态数据字典
  statusOptions: [],
  // 部门名称
  deptName: undefined,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 选中数组
  ids: [],
  // 弹出层标题
  title: "",
  // 部门树选项
  deptOptions: undefined,
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    phone: undefined,
    status: undefined,
    deptId: undefined,
  },
});

watch(
    () => state.deptName,
    (newValue) => {
      proxy.$refs.tree.filter(newValue);
    }
);
/** 查询用户列表 */
const getList = async () => {
  state.loading = true;
  listUser(state.queryParams).then(
      (response: any) => {
        if (response.code != 200) {
          state.loading = false;
        }
        state.tableData.data = response.data.data;
        state.tableData.total = response.data.total;
        state.loading = false;
      }
  );
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.userId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
/** 搜索按钮操作 */
const handleQuery = async () => {
  // console.log("查询用户列表", state.queryParams.userName);
  state.queryParams.pageNum = 1;
  await getList();
};
/** 重置按钮操作 */
const resetQuery = async () => {
  // 表单初始化，方法：`resetFields()` 无法使用
  state.queryParams.pageNum = 1;
  state.queryParams.pageSize = 10;
  state.queryParams.username = "";
  state.queryParams.phone = "";
  state.queryParams.status = "";
  state.queryParams.deptId = 0;
  handleQuery();
};
/** 新增按钮操作 */
const handleAdd = () => {
  state.title = "添加用戶";
  userFormRef.value.openDialog({});
};
/** 修改按钮操作 */
const handleUpdate = (row: any) => {
  state.title = "修改用户";
  userFormRef.value.openDialog(row);
};

/** 查询部门下拉树结构 */
const getTreeselect = async () => {
  treeselect().then((response) => {
    state.deptOptions = response.data;
  });
};
// 用户状态修改
const handleStatusChange = (row: any) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox({
    title: "警告",
    message: '确认要"' + text + '""' + row.username + '"用户吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action: string, instance: any, done: any) => {
      if (action === "confirm") {
        return changeUserStatus(row.userId, row.status).then(() => {
          ElMessage.success(text + "成功");
          done();
        });
      } else {
        done();
      }
    },
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0";
  });
};
/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const userIds = row.userId || state.ids;
  ElMessageBox({
    message: '是否确认删除用户编号为"' + userIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(function () {
    return delUser(userIds).then(() => {
      getList();
      ElMessage.success("删除成功");
    });
  });
};

// 分页改变
const onHandleSizeChange = (val: number) => {
  state.queryParams.pageSize = val;
  handleQuery();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val;
  handleQuery();
};
// 筛选节点
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.deptName.includes(value);
};
// 节点单击事件
const handleNodeClick = (data: any) => {
  state.queryParams.deptId = data.deptId;
  getList();
  state.queryParams.deptId = 0
};

/** 导出按钮操作 */
const handleExport = () => {
  const queryParams = state.queryParams;
  let data:any = new Date().getTime() / 1000
  let time = parseInt(data) + '';
  queryParams.filename = "用户表_" + time +".xlsx"
  ElMessageBox({
    message: "是否确认导出所有用户数据项?",
    title: "警告",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return exportUser(queryParams);
      })
      .then((response: any) => {
        handleFileError(response, queryParams.filename)
      });
};
// 字典状态字典翻译
const sexFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.sexOptions, row.sex);
};
// 页面加载时
onMounted(() => {
  getList();
  getTreeselect();
  // 查询显示状态数据字典
  getDicts("sys_normal_disable").then((response) => {
    state.statusOptions = response.data;
  });
  // 查询显示性別数据字典
  proxy.getDicts("sys_user_sex").then((response: any) => {
    state.sexOptions = response.data;
  });

  proxy.mittBus.on("onEditUserModule", (res: any) => {
    handleQuery();
  });
});

// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditUserModule");
});
</script>

<style scoped lang="scss">

.system-user-container {
  .system-user-search {
    text-align: left;

    .system-user-search-btn {
      text-align: center;
      margin-left: 70px;
    }
  }

  .system-user-photo {
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
}
</style>
