<template>
  <div class="system-user-container app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-card shadow="always">
          <div class="head-container">
            <el-input
                v-model="state.name"
                placeholder="请输入分组名称"
                clearable
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
                :data="state.groupOptions"
                :props="state.defaultProps"
                node-key="id"
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
            <el-form-item label="大屏名称" prop="screenName">
              <el-input
                  placeholder="大屏名称模糊查询"
                  clearable
                  @keyup.enter="handleQuery"
                  style="width: 240px"
                  v-model="state.queryParams.screenName"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                  v-model="state.queryParams.status"
                  placeholder="状态"
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
              <span class="card-header-text">大屏列表</span>
              <div>
                <el-button type="primary" v-auth="'visual:screen:add'" plain @click="handleAdd">
                  <SvgIcon name="elementPlus"/>
                  新增
                </el-button>
                <el-button type="danger" v-auth="'visual:screen:delete'" plain :disabled="state.multiple" @click="handleDelete">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <div v-loading="state.loading" class="content_box">
            <div v-for="data in state.tableData.data" class="content_item">
              <el-card :body-style="{ padding: '0px' }" class="ft-card">
                <el-image v-if="data.screenBase64" class="ft-image" :src="data.screenBase64" fit="fill">
                  <template #error>
                    <div class="image-slot">
                      <SvgIcon name="elementPicture" :size="50"/>
                    </div>
                  </template>
                </el-image>
                <el-image v-else class="ft-image" :src="nilImg" fit="fill" />
                <div class="ft-foot">
                  <dev class="ft-item-name">{{data.screenName}}</dev>
                  <div>
                    <span style="margin-right: 5px">
                      <el-switch
                          v-model="data.status"
                          :width="60"
                          inline-prompt
                          active-value="1"
                          inactive-value="0"
                          active-text="已发布"
                          inactive-text="未发布"
                          @click="handleStatusChange(data)"
                      />
                    </span>
                    <el-popover  >
                      <template #reference>
                        <el-button type="primary" circle size="small"><SvgIcon name="elementStar"/></el-button>
                      </template>
                      <div>
                        <el-button text type="primary" v-auth="'visual:screen:clone'" @click="onClonesScreen(data)">
                          <SvgIcon name="elementConnection" />克隆
                        </el-button>
                      </div>
                      <div>
                        <router-link
                            v-auth="'visual:screen:design'" target="_blank"
                            :to="{ path: '/screen/edit', query: { id: data.screenId } }"
                        >
                          <el-button text type="primary">
                            <SvgIcon name="elementDiscount"/>设计
                          </el-button>
                        </router-link>
                      </div>
                      <div>
                        <router-link
                            v-auth="'visual:screen:view'" target="_blank"
                            :to="{ path: '/screen/view', query: { id: data.screenId }}"
                        >
                          <el-button text type="primary">
                            <SvgIcon name="elementView"/>预览
                          </el-button>
                        </router-link>
                      </div>
                      <div>
                        <el-button text type="primary" v-auth="'visual:screen:edit'" @click="handleUpdate(data)">
                          <SvgIcon name="elementEdit" />修改
                        </el-button>
                      </div>
                      <div>
                        <el-button text type="primary" v-auth="'visual:screen:delete'" @click="handleDelete(data)">
                          <SvgIcon name="elementDelete" />删除
                        </el-button>
                      </div>
                    </el-popover>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
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
import {reactive, onMounted, ref, watch, getCurrentInstance, onUnmounted,} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {getDicts} from "@/api/system/dict/data";
import EditModule from "./component/editModule.vue";
import {addScreen, changeScreenStatus, delScreen, listScreen} from "@/api/visual/screen";
import {listScreenGroupTree} from "@/api/visual/screen_group";

import nilImg from '@/assets/nil-img.png'
const {proxy} = getCurrentInstance() as any;
const userFormRef = ref();
const state: any = reactive({
  tableData: {
    data: [],
    total: 0,
  },
  loading: false,
  defaultProps: {
    children: "children",
    label: "name",
  },
  // 状态数据字典
  statusOptions: [],
  // 分组名称
  groupName: undefined,
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 选中数组
  ids: [],
  // 弹出层标题
  title: "",
  // 部门树选项
  groupOptions: undefined,
  // 查询参数
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    screenName: undefined,
    status: undefined,
    groupId: undefined,
  },
});

watch(
    () => state.groupName,
    (newValue) => {
      proxy.$refs.tree.filter(newValue);
    }
);
/** 查询大屏列表 */
const getList = async () => {
  state.loading = true;
  listScreen(state.queryParams).then(
      (response: any) => {
        if (response.code != 200) {
          state.loading = false;
          return
        }
        state.tableData.data = response.data.data;
        state.tableData.total = response.data.total;
        state.loading = false;
      }
  );
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.screenId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
/** 搜索按钮操作 */
const handleQuery = async () => {
  getList();
};
/** 重置按钮操作 */
const resetQuery = async () => {
  // 表单初始化，方法：`resetFields()` 无法使用
  state.queryParams.pageNum = 1;
  state.queryParams.pageSize = 10;
  state.queryParams.screenName = "";
  state.queryParams.status = "0";
  state.queryParams.groupId = 0;
  handleQuery();
};
/** 新增按钮操作 */
const handleAdd = () => {
  state.title = "添加大屏";
  userFormRef.value.openDialog({});
};
/** 修改按钮操作 */
const handleUpdate = (row: any) => {
  state.title = "修改大屏";
  userFormRef.value.openDialog(row);
};
/** 克隆按钮操作 */
const onClonesScreen = (row: any) => {
  ElMessageBox.confirm('确定要克隆该大屏么？', '克隆确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const form = {
      screenName: row.screenName+"-克隆",
      status: row.status,
      groupId: row.groupId,
      screenBase64: row.screenBase64,
      screenDataJson: row.screenDataJson,
      screenRemark: row.screenRemark,
    }
    addScreen(form).then((response:any) => {
      if (response.code === 200) {
        ElMessage.success("克隆成功");
        handleQuery()
      }
    });
  })
}

/** 查询分组下拉树结构 */
const getTreeselect = async () => {
  listScreenGroupTree().then((response) => {
    state.groupOptions = response.data;
  });
};
// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status == "0" ? "取消发布" : "发布" ;
  ElMessageBox({
    title: "警告",
    message: '确认要"' + text + '""' + row.screenName + '"吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action: string, instance: any, done: any) => {
      if (action === "confirm") {
        return changeScreenStatus(row.screenId, row.status).then(() => {
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
  const screenIds = row.screenId || state.ids;
  ElMessageBox({
    message: '是否确认删除用户编号为"' + screenIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(function () {
    return delScreen(screenIds).then(() => {
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
  return data.groupName.includes(value);
};
// 节点单击事件
const handleNodeClick = (data: any) => {
  state.queryParams.groupId = data.id;
  getList();
  state.queryParams.groupId = 0
};

// 页面加载时
onMounted(() => {
  getList();
  getTreeselect();
  // 查询显示状态数据字典
  getDicts("sys_release_type").then((response) => {
    state.statusOptions = response.data;
  });

  proxy.mittBus.on("onEditScreenModule", (res: any) => {
    handleQuery();
  });
});

// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditScreenModule");
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
