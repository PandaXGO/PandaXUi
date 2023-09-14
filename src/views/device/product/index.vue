<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--组织数据-->
      <el-col :span="4" :xs="24">
        <el-card shadow="always">
          <div class="head-container">
            <el-input
                v-model="state.categoryName"
                placeholder="请输入产品分类"
                clearable
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
            />
          </div>
          <div class="head-container">
            <el-tree
                :data="state.categoryOptions"
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
          <!-- 查询 -->
          <el-form
              :model="state.queryParams"
              ref="queryForm"
              :inline="true"
              label-width="80"
          >
            <el-form-item label="产品名称" prop="name">
              <el-input
                  v-model="state.queryParams.name"
                  placeholder="请输入产品名称"
                  clearable
                  @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="state.queryParams.status" placeholder="请选择状态" clearable>
                <el-option
                    v-for="dict in state.statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="deviceType">
              <el-input
                  v-model="state.queryParams.deviceType"
                  placeholder="请输入设备类型"
                  clearable
                  @keyup.enter.native="handleQuery"
              />
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
              <span class="card-header-text">产品列表</span>
              <div>
                <el-button
                    type="primary"
                    plain
                    v-auth="'device:product:add'"
                    @click="onOpenAddModule"
                ><SvgIcon name="elementPlus" />新增</el-button>
                <el-button
                    type="danger"
                    plain
                    v-auth="'device:product:delete'"
                    :disabled="state.multiple"
                    @click="onTabelRowDel"
                ><SvgIcon name="elementDelete" />删除</el-button>
              </div>
            </div>
          </template>
          <div class="content_box">
            <div v-for="data in state.tableData" class="content_table_item">
              <el-card :body-style="{ padding: '0px' }" class="ft-card">
                <div class="ft-head">
                  <div class="ft-tag">
                    <el-tag class="ml-3" type="warning">{{data.selfLearn ? "自学习": "非自学习"}}</el-tag>
                    <el-tag class="ml-3" type="success">{{data.protocolName}}</el-tag>
                  </div>
                  <div class="ft-body">
                    <div class="ft-body-image" >
                      <el-image :src="baseURL + '/upload/get/'+ data.photoUrl" :preview-src-list="[baseURL + '/upload/get/'+ data.photoUrl]" :initial-index="0" :zoom-rate="1.2" fit="fill">
                        <template #error>
                          <div class="image-slot">
                            <el-image :src="data.deviceType ==='direct' ? monitorImg : data.deviceType ==='gatewayS' ? gatewayDImg : gatewayImg" fit="fill" />
                          </div>
                        </template>
                      </el-image>
                    </div>
                    <div class="ft-body-item">
                        <div class="item-mb">所属分类： {{data.productCategory.name}}</div>
                        <div class="item-mb">设备类型： {{data.deviceType ==='direct' ? '直连设备': data.deviceType ==='gateway' ? '网关设备': '网关子设备'}}</div>
                        <div class="item-mb">规则链库： Root Rule Chain</div>
                        <div class="item-mb">创建时间： {{ dateStrFormat(data.createTime) }}</div>
                    </div>
                  </div>
                </div>

                <div class="ft-foot">
                  <div class="ft-item-name" style="width: 260px">
                    {{data.name}}
                  </div>
                  <div>
                     <el-switch
                         v-model="data.status"
                         style="margin-right: 5px"
                         :width="60"
                         inline-prompt
                         active-value="0"
                         inactive-value="1"
                         active-text="已发布"
                         inactive-text="已禁用"
                         @click="handleStatusChange(data)"
                     />
                      <el-popover  >
                        <template #reference>
                          <el-button type="primary" circle size="small"><SvgIcon name="elementStar"/></el-button>
                        </template>
                        <div>
                          <el-button text type="primary" v-auth="'device:product:view'" @click="onViewProduct(data)">
                            <SvgIcon name="elementConnection" />查看
                          </el-button>
                        </div>
                        <div>
                          <el-button text type="primary" v-auth="'device:product:edit'" @click="onOpenEditModule(data)">
                            <SvgIcon name="elementEdit" />修改
                          </el-button>
                        </div>
                        <div>
                          <el-button text type="primary" v-auth="'device:product:delete'" @click="onTabelRowDel(data)">
                            <SvgIcon name="elementDelete" />删除
                          </el-button>
                        </div>
                      </el-popover>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
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
      </el-col>
    </el-row>
    <!-- 添加或修改岗位对话框 -->
    <EditModule ref="editModuleRef" :title="state.title" />
    <View ref="viewRef" />
  </div>
</template>

<script lang="ts" setup name="Product">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted, watch,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {listProduct, delProduct, updateProduct} from "@/api/device/product";
import {listProductCategoryLabel} from "@/api/device/product_category";
import EditModule from "./component/editModule.vue";
import View from "./component/view.vue";

import gatewayImg from '@/assets/gateway.png'
import gatewayDImg from '@/assets/gateway_d.png'
import monitorImg from '@/assets/monitor.png'

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const viewRef = ref();
const baseURL = import.meta.env.VITE_API_URL
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
  categoryName: undefined,
  categoryOptions: undefined,
  defaultProps: {
    children: "children",
    label: "name",
  },
  // statusOptions字典数据
  statusOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 9,
    // 以下为参数
    status: undefined,
    deviceType: "",
    productCategoryId: "",
    protocolName: undefined,
    name: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listProduct(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.status = undefined;
  state.queryParams.deviceType = "";
  state.queryParams.productCategoryId = "";
  state.queryParams.protocolName = undefined;
  state.queryParams.name = undefined;
  handleQuery();
};

/** 查询分组下拉树结构 */
const getTreeselect = async () => {
  listProductCategoryLabel().then((response) => {
    state.categoryOptions = response.data;
  });
};

const handleCurrentChange = (val:number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val:number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

// 打开新增弹窗
const onOpenAddModule = () => {
  state.title = "添加产品";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改产品";
  editModuleRef.value.openDialog(row);
};
// 查看产品
const onViewProduct = (row: object) => {
  viewRef.value.openDrawer(row);
}

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
    return delProduct(ids).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};

watch(
    () => state.categoryName,
    (newValue) => {
      proxy.$refs.tree.filter(newValue);
    }
);
// 筛选节点
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};
// 节点单击事件
const handleNodeClick = (data: any) => {
  state.queryParams.productCategoryId = data.id;
  handleQuery();
  state.queryParams.productCategoryId = ""
};
// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status == "0" ? "禁用" : "使用" ;
  ElMessageBox({
    title: "警告",
    message: '确认要"' + text + '""' + row.name + '"吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action: string, instance: any, done: any) => {
      if (action === "confirm") {
        return updateProduct({id: row.id,status: row.status}).then(() => {
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

// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();
  getTreeselect();
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });

  proxy.mittBus.on("onEditProductModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditProductModule");
});
</script>
