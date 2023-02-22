<template>
  <div class="app-container">
    <el-card shadow="always">
      <!--查询-->
      <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
              placeholder="菜单名称模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="queryParams.menuName"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="queryParams.status"
              placeholder="菜单状态"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="dict in statusOptions"
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
          <span class="card-header-text">菜单列表</span>
          <div>
            <el-button type="primary"
                       plain
                       v-auth="'system:dept:add'"
                       @click="onOpenAddMenu">
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
          </div>
        </div>
      </template>
      <!--数据表格-->
      <el-table
          v-loading="loading"
          :data="menuList"
          row-key="menuId"
          border
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
            prop="menuName"
            label="菜单名称"
            :show-overflow-tooltip="true"
            width="150"
        ></el-table-column>
        <el-table-column prop="icon" label="图标" align="center" width="100">
          <template #default="scope">
            <SvgIcon :name="scope.row.icon"></SvgIcon>
          </template>
        </el-table-column>
        <el-table-column
            prop="sort"
            label="排序"
            width="60"
        ></el-table-column>
        <el-table-column prop="icon" label="分类" align="center" width="100">
          <template #default="scope">
            <el-tag
                :type="scope.row.menuType === 'M' ? 'danger' : scope.row.menuType === 'C'? 'success': 'warning'"
                disable-transitions
            >{{ typeFormat(scope.row) || '-- --' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="permission"
            label="权限标识"
            :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
            prop="component"
            label="组件路径"
            :show-overflow-tooltip="true"
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
            >{{ statusFormat(scope.row) || '-- --' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="显示隐藏"
            width="100"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '1' ? 'danger' : 'success'"
                disable-transitions
            >{{ isHideFormat(scope.row) || '-- --' }}
            </el-tag>
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
                <el-button text type="primary" v-auth="'system:menu:edit'" @click="onOpenEditMenu(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'system:menu:edit'" @click="onOpenAddMenu(scope.row)">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
              </div>
              <div>
                <el-button text type="primary" v-auth="'system:menu:delete'" @click="handleDelete(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改菜单对话框 -->
    <EditMenu ref="editMenuRef" :title="title"/>
  </div>
</template>

<script setup lang="ts">
import {toRefs, getCurrentInstance, onMounted, onUnmounted, reactive, ref} from "vue";
import {listMenu, delMenu} from "@/api/system/menu";
import EditMenu from "./component/editMenu.vue";
import {ElMessage, ElMessageBox} from "element-plus";

const {proxy} = getCurrentInstance() as any;
const editMenuRef = ref();
const state: any = reactive({
  // 遮罩层
  loading: true,
  // 菜单表格树数据
  menuList: [] as any,
  // 菜单树选项
  menuOptions: [],
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  // 显示状态数据字典
  isHideOptions: [],
  // 菜单状态数据字典
  statusOptions: [],
  // 菜单类型数据字典
  menuTypeOptions: [],
  // 查询参数
  queryParams: {
    menuName: undefined,
    status: undefined,
  },
});
const {
  loading,
  menuList,
  menuOptions,
  title,
  open,
  isHideOptions,
  statusOptions,
  menuTypeOptions,
  queryParams
} = toRefs(state)
/** 查询菜单列表 */
const getList = () => {
  state.loading = true;
  listMenu(state.queryParams).then((response: any) => {
    state.menuList = response.data;
    state.loading = false;
  });
};
/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.menuName = "";
  state.queryParams.status = "";
  state.queryParams.menuType = "";
  handleQuery();
};

// 打开新增菜单弹窗
const onOpenAddMenu = (row: any) => {
  state.title = "添加菜单";
  let parentId = row.menuId;
  row = {};
  row.parentId = parentId;
  editMenuRef.value.openDialog(row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (row: object) => {
  state.title = "修改菜单";
  editMenuRef.value.openDialog(row);
};
/** 删除按钮操作 */
const handleDelete = (row: any) => {
  ElMessageBox({
    message: '是否确认删除名称为"' + row.menuName + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delMenu(row.menuId).then(() => {
      getList();
      ElMessage.success("删除成功");
    });
  });
};
// 菜单显示隐藏字典翻译
const isHideFormat = (row: any) => {
  if (row.menuType == "F") {
    return "";
  }
  return proxy.selectDictLabel(state.isHideOptions, row.isHide);
};
// 菜单状态字典翻译
const statusFormat = (row: any) => {
  if (row.menuType == "F") {
    return "";
  }
  return proxy.selectDictLabel(state.statusOptions, row.status);
};
// 菜单类型字典翻译
const typeFormat = (row: any) => {
  return proxy.selectDictLabel(state.menuTypeOptions, row.menuType);
};
// 页面加载时
onMounted(() => {
  getList();
  // 查询显示状态数据字典
  proxy.getDicts("sys_show_hide").then((response: any) => {
    state.isHideOptions = response.data;
  });
  proxy.getDicts("sys_menu_type").then((response: any) => {
    state.menuTypeOptions = response.data;
  });
  // 查询菜单状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.mittBus.on("onEditMenuModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDeptModule");
});
</script>

<style scoped>
</style>
