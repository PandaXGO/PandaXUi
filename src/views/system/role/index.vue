<template>
  <div class="app-container">
    <el-card shadow="always">
      <!--查询-->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
              placeholder="角色名称模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.roleName"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input
              placeholder="权限字符模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.roleKey"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="角色状态"
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
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">角色列表</span>
          <div>
            <el-button
                type="primary"
                plain
                v-auth="'system:role:add'"
                @click="handleAdd"
            >
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
            <el-button
                type="danger"
                plain
                v-auth="'system:role:delete'"
                :disabled="state.multiple"
                @click="handleDelete"
            >
              <SvgIcon name="elementDelete"/>
              删除
            </el-button>
            <el-button
                type="warning"
                plain
                v-auth="'system:role:export'"
                @click="handleExport"
            >
              <SvgIcon name="elementDownload"/>
              导出
            </el-button>
          </div>
        </div>
      </template>
      <!--数据表格-->
      <el-table
          v-loading="state.loading"
          :data="state.roleList"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="角色编号" prop="roleId" />
        <el-table-column
            label="角色名称"
            prop="roleName"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="权限字符"
            prop="roleKey"
            :show-overflow-tooltip="true"
        />
        <el-table-column label="显示顺序" prop="roleSort" />
        <el-table-column label="状态" align="center" >
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
            label="创建时间"
            align="center"
            prop="createTime"
        >
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" v-auth="'system:role:edit'" @click="handleUpdate(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="handleDataScope(scope.row)">
                  <SvgIcon name="elementCircleCheck"/>
                  数据权限
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'system:role:delete'" @click="handleDelete(scope.row)">
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
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="state.title" v-model="state.open" width="769px" center>
      <div v-drag="['.app-container .el-dialog', '.app-container .el-dialog__header']"></div>
      <el-form
          ref="roleFormRef"
          :model="state.roleForm"
          :rules="state.rules"
          label-width="120px"
          label-position="right"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="state.roleForm.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="state.roleForm.roleKey" placeholder="请输入权限字符"/>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number
              v-model="state.roleForm.roleSort"
              controls-position="right"
              :min="0"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="state.roleForm.status">
            <el-radio
                v-for="dict in state.statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="权限设置">
          <el-tabs v-model="state.activeName">
            <el-tab-pane label="菜单权限" name="first">
              <el-checkbox
                  v-model="state.menuExpand"
                  @change="handleCheckedTreeExpand($event, 'menu')"
              >展开/折叠
              </el-checkbox
              >
              <el-checkbox
                  v-model="state.menuNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'menu')"
              >全选/全不选
              </el-checkbox
              >
              <el-tree
                  class="tree-border"
                  :data="state.menuOptions"
                  show-checkbox
                  ref="menuRef"
                  node-key="menuId"
                  empty-text="加载中，请稍后"
                  :props="{
                                         label: 'menuName',
                                         children: 'children',
                                    }"
                  :default-checked-keys="state.menuCheckedKeys"
              ></el-tree>
            </el-tab-pane>
            <el-tab-pane label="API权限" name="second">
              <el-checkbox
                  v-model="state.apiExpand"
                  @change="handleCheckedTreeExpand($event, 'api')"
              >展开/折叠
              </el-checkbox
              >
              <el-checkbox
                  v-model="state.apiNodeAll"
                  @change="handleCheckedTreeNodeAll($event, 'api')"
              >全选/全不选
              </el-checkbox>
              <el-tree
                  class="tree-border"
                  :data="state.apiOptions"
                  show-checkbox
                  ref="apiRef"
                  node-key="onlyId"
                  empty-text="加载中，请稍后"
                  :props="{
                                        children: 'children',
                                        label: 'description'
                                      }"
                  :default-checked-keys="state.apiCheckedKeys"
              ></el-tree>
            </el-tab-pane>
            <el-tab-pane label="工单权限" name="work"/>
          </el-tabs>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
              v-model="state.roleForm.remark"
              type="textarea"
              placeholder="请输入内容"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
         <el-button type="primary" :loading="state.bunLoading" @click="submitForm">确 定</el-button>
        <el-button  @click="cancel">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="state.title" v-model="state.openDataScope" width="769px">
      <div v-drag="['.app-container .el-dialog', '.app-container .el-dialog__header']"></div>
      <el-form :model="state.roleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="state.roleForm.roleName" :disabled="true"/>
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="state.roleForm.roleKey" :disabled="true"/>
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select
              v-model="state.roleForm.dataScope"
              @change="dataScopeSelectChange"
          >
            <el-option
                v-for="item in state.dataScopeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="state.roleForm.dataScope == 2">
            <el-checkbox
                    v-model="state.deptExpand"
                    @change="handleCheckedTreeExpand($event, 'dept')"
            >展开/折叠
            </el-checkbox
            >
            <el-checkbox
                    v-model="state.deptNodeAll"
                    @change="handleCheckedTreeNodeAll($event, 'dept')"
            >全选/全不选
            </el-checkbox>
            <el-tree
                    class="tree-border"
                    :data="state.deptOptions"
                    show-checkbox
                    default-expand-all
                    ref="deptRef"
                    node-key="deptId"
                    empty-text="加载中，请稍后"
                    :props="{
              label: 'deptName',
              children: 'children',
            }"
            ></el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                 <el-button type="primary" @click="submitDataScope">确 定</el-button>
                <el-button  @click="cancelDataScope">取 消</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs,
  unref,
  nextTick,
} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  listRole,
  getRole,
  delRole,
  dataScope,
  addRole,
  updateRole,
  exportRole,
  changeRoleStatus,
} from "@/api/system/role";
import {
  treeselect as menuTreeselect,
  roleMenuTreeselect,
} from "@/api/system/menu";
import {
  listApiAll, getPolicyPathByRoleId
} from "@/api/system/api";
import {
  roleDeptTreeselect,
} from "@/api/system/dept";
import {handleFileError} from "@/utils/export";
import DictList from "@/views/system/dict/component/dictList.vue";

const {proxy} = getCurrentInstance() as any;
const roleFormRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const apiRef = ref<HTMLElement | null>(null);
const deptRef = ref<HTMLElement | null>(null);
const state: any = reactive({
  activeName: 'first',
  // 遮罩层
  loading: true,
  bunLoading: false,
  // 选中数组
  ids: [],
  // 总条数
  total: 0,
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  // 角色表格数据
  roleList: [],
  // 显示搜索条件
  showSearch: true,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 状态数据字典
  statusOptions: [],
  // 菜单列表
  menuOptions: [],
  // 菜单列表
  apiOptions: [],
  //角色具有的菜单列表
  menuCheckedKeys: [],
  //角色具有的api列表
  apiCheckedKeys: [],
  // 部门列表
  deptOptions: [],
  // 是否显示弹出层（数据权限）
  openDataScope: false,
  menuExpand: false,
  menuNodeAll: false,
  apiExpand: false,
  apiNodeAll: false,
  deptExpand: true,
  deptNodeAll: false,
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roleName: undefined,
    roleKey: undefined,
    status: undefined,
  },
  // 数据范围选项
  dataScopeOptions: [
    {
      value: "1",
      label: "全部数据权限",
    },
    {
      value: "2",
      label: "自定数据权限",
    },
    {
      value: "3",
      label: "本部门数据权限",
    },
    {
      value: "4",
      label: "本部门及以下数据权限",
    },
    {
      value: "5",
      label: "仅本人数据权限",
    },
  ],
  // 表单参数
  roleForm: {},
  // 表单校验
  rules: {
    roleName: [
      {required: true, message: "角色名称不能为空", trigger: "blur"},
    ],
    roleKey: [
      {required: true, message: "权限字符不能为空", trigger: "blur"},
    ],
    roleSort: [
      {required: true, message: "角色顺序不能为空", trigger: "blur"},
    ],
  },
});
// 表单重置
const reset = () => {
  (state.menuExpand = false),
      (state.menuNodeAll = false),
      (state.apiExpand = false),
      (state.apiNodeAll = false),
      (state.deptExpand = true),
      (state.deptNodeAll = false),
      (state.roleForm = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        apiIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
      });
  state.roleForm = {};
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.pageNum = 1;
  state.queryParams.pageSize = 10;
  state.queryParams.roleName = "";
  state.queryParams.roleKey = "";
  state.queryParams.status = "";
  handleQuery();
};
/** 查询角色列表 */
const getList = () => {
  state.loading = true;
  listRole(state.queryParams).then(
      (response) => {
        state.roleList = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
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
/** 提交按钮（数据权限） */
const submitDataScope = () => {
  if (state.roleForm.roleId != undefined) {
    state.roleForm.deptIds = getDeptAllCheckedKeys();
    dataScope(state.roleForm).then((response) => {
      ElMessage.success("修改成功");
      state.openDataScope = false;
      getList();
    });
  }
};
// 所有部门节点数据
const getDeptAllCheckedKeys = () => {
  const formWrap = unref(deptRef) as any;
  // 目前被选中的部门节点
  let checkedKeys = formWrap.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = formWrap.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
/** 搜索按钮操作 */
const handleQuery = () => {
  state.queryParams.pageNum = 1;
  getList();
};
/** 查询菜单树结构 */
const getMenuTreeselect = () => {
  menuTreeselect().then((response) => {
    state.menuOptions = response.data;
  });
};
/** 查询Api树结构 */
const getApiTreeselect = () => {
  listApiAll({}).then((response) => {
    const apis = response.data
    state.apiOptions = buildApiTree(apis)
  });
};
// 创建api树方法
const buildApiTree = (apis: any[]) => {
  const apiObj: any = new Object()
  apis && apis.map(item => {
    item.onlyId = "p:" + item.path + "m:" + item.method
    if (Object.prototype.hasOwnProperty.call(apiObj, item.apiGroup)) {
      apiObj[item.apiGroup].push(item)
    } else {
      Object.assign(apiObj, {[item.apiGroup]: [item]})
    }
  })
  const apiTree = []
  for (const key in apiObj) {
    const treeNode = {
      onlyId: key,
      description: key + '组',
      children: apiObj[key]
    }
    apiTree.push(treeNode)
  }
  return apiTree
};

// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.roleId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 角色状态修改
const handleStatusChange = (row: any) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox({
    closeOnClickModal: false,
    closeOnPressEscape: false,
    title: "警告",
    message: '确认要"' + text + '""' + row.roleName + '"角色吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
      .then(function () {
        return changeRoleStatus(row.roleId, row.status);
      })
      .then(() => {
        ElMessage.success(text + "成功");
      })
      .catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
};
/** 分配数据权限操作 */
const handleDataScope = (row: any) => {
  reset();
  const roleDeptTreeselect = getRoleDeptTreeselect(row.roleId);
  getRole(row.roleId).then((response) => {
    state.roleForm = response.data;
    state.openDataScope = true;
    nextTick(() => {
      roleDeptTreeselect.then((res) => {
        const formWrap = unref(deptRef) as any;
        formWrap.setCheckedKeys(res.checkedKeys);
      });
    });
    state.title = "分配数据权限";
  });
};
/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  getMenuTreeselect();
  getApiTreeselect()
  state.open = true;
  state.title = "添加角色";
};
/** 修改按钮操作 */
const handleUpdate = (row: any) => {
  const roleId = row.roleId;
  getApiTreeselect()
  const roleMenu = getRoleMenuTreeselect(roleId);
  getRole(roleId).then((response) => {
    state.roleForm = response.data;
    state.open = true;
    state.title = "修改角色";
    nextTick(() => {
      roleMenu.then((res) => {
        state.menuCheckedKeys = res.checkedKeys;
        const formWrap = unref(menuRef) as any;
        formWrap.setCheckedKeys(res.checkedKeys);
      });
      getPolicyPathByRoleId({
        roleKey: state.roleForm.roleKey
      }).then((res) => {
        let apiKes: any[] = []
        res.data && res.data.map((item) => {
          apiKes.push("p:" + item.path + "m:" + item.method)
        })
        console.log("apiKes", apiKes)
        const formWrap = unref(apiRef) as any;
        formWrap.setCheckedKeys(apiKes);
      })
    });
  });
  state.bunLoading = false;
};
/** 删除按钮操作 */
const handleDelete = (row: any) => {
  const roleIds = row.roleId || state.ids;
  ElMessageBox({
    message: '是否确认删除角色编号为"' + roleIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
      .then(function () {
        return delRole(roleIds);
      })
      .then(() => {
        getList();
        ElMessage.success("删除成功");
      });
};
/** 导出按钮操作 */
const handleExport = () => {
  const queryParams = state.queryParams;
  let data:any = new Date().getTime() / 1000
  let time = parseInt(data) + '';
  queryParams.filename = "角色表_" + time +".xlsx"
  ElMessageBox({
    message: "是否确认导出所有角色数据项?",
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
      .then(function () {
        return exportRole(queryParams);
      })
      .then((response: any) => {
        handleFileError(response, queryParams.filename)
      });
};
/** 根据角色ID查询部门树结构 */
const getRoleDeptTreeselect = (roleId: number) => {
  return roleDeptTreeselect(roleId).then((response) => {
    state.deptOptions = response.data.depts;
    return response.data;
  });
};
/** 根据角色ID查询菜单树结构 */
const getRoleMenuTreeselect = (roleId: number) => {
  return roleMenuTreeselect(roleId).then((response) => {
    state.menuOptions = response.data.menus;
    return response.data;
  });
};
/** 提交按钮 */
const submitForm = () => {
  const formWrap = unref(roleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.bunLoading = true;
      if (state.roleForm != null && state.roleForm.roleId != undefined) {
        state.roleForm.menuIds = getMenuAllCheckedKeys();
        state.roleForm.apiIds = getApiAllCheckedKeys();
        updateRole(state.roleForm).then(() => {
          ElMessage.success("修改成功");
          state.bunLoading = true;
          state.open = false;
          getList();
        });
      } else {
        state.roleForm.menuIds = getMenuAllCheckedKeys();
        state.roleForm.apiIds = getApiAllCheckedKeys();
        addRole(state.roleForm).then(() => {
          ElMessage.success("新增成功");
          state.bunLoading = true;
          state.open = false;
          getList();
        });
      }
    }
  });
};
// 取消按钮
const cancel = () => {
  state.open = false;
  reset();
};
// 所有菜单节点数据
const getMenuAllCheckedKeys = () => {
  const formWrap = unref(menuRef) as any;
  if (!formWrap) return;
  // 目前被选中的菜单节点
  let checkedKeys = formWrap.getCheckedKeys();
  // 半选中的菜单节点
  let halfCheckedKeys = formWrap.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
};
// 所有菜单节点数据
const getApiAllCheckedKeys = () => {
  const formWrap = unref(apiRef) as any;
  if (!formWrap) return;
  let checkArr: any[] = formWrap.getCheckedNodes(true)
  let casbinInfos: any[] = []
  checkArr && checkArr.map(item => {
    let casbinInfo = {
      path: item.path,
      method: item.method
    }
    casbinInfos.push(casbinInfo)
  })
  return casbinInfos;
};

// 取消按钮（数据权限）
const cancelDataScope = () => {
  state.openDataScope = false;
  reset();
};
/** 选择角色权限范围触发 */
const dataScopeSelectChange = (value: any) => {
  const formWrap = unref(deptRef) as any;
  if (value !== "2") {
    formWrap.setCheckedKeys([]);
  }
};
// 树权限（展开/折叠）
const handleCheckedTreeExpand = (value: any, type: any) => {
  if (type == "menu") {
    let treeList = state.menuOptions;
    for (let i = 0; i < treeList.length; i++) {
      const formWrap = unref(menuRef) as any;
      console.log("treeList", treeList[i])
      formWrap.store.nodesMap[treeList[i].menuId].expanded = value;
    }
  } else if (type == "api") {
    let treeList = state.apiOptions;
    for (let i = 0; i < treeList.length; i++) {
      const formWrap = unref(apiRef) as any;
      console.log("treeList", treeList[i])
      console.log("formWrap", formWrap)
      formWrap.store.nodesMap[treeList[i].onlyId].expanded = value;
    }
  } else if (type == "dept") {
    let treeList = state.deptOptions;
    for (let i = 0; i < treeList.length; i++) {
      const formWrap = unref(deptRef) as any;
      formWrap.store.nodesMap[treeList[i].deptId].expanded = value;
    }
  }
};
// 树权限（全选/全不选）
const handleCheckedTreeNodeAll = (value: any, type: any) => {
  if (type == "menu") {
    const formWrap = unref(menuRef) as any;
    formWrap.setCheckedNodes(value ? state.menuOptions : []);
  } else if (type == "api") {
    const formWrap = unref(apiRef) as any;
    formWrap.setCheckedNodes(value ? state.apiOptions : []);
  } else if (type == "dept") {
    const formWrap = unref(deptRef) as any;
    formWrap.setCheckedNodes(value ? state.deptOptions : []);
  }
};
// 页面加载时
onMounted(() => {
  getList();
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
});

</script>

<style scoped>
</style>
