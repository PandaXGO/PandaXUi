<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--组织数据-->
      <el-col :span="4" :xs="24">
        <el-card shadow="always">
          <div class="head-container">
            <el-input
                v-model="state.groupName"
                placeholder="请输入设备分组"
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
          <!-- 查询 -->
          <el-form
              :model="state.queryParams"
              ref="queryForm"
              :inline="true"
              label-width="68px"
          >
            <el-form-item label="设备名称" prop="name">
              <el-input
                  v-model="state.queryParams.name"
                  placeholder="请输入设备名称"
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
            <el-form-item label="所属产品" prop="pid">
              <el-select v-model="state.queryParams.pid" filterable  placeholder="请选择所属产品" clearable >
                <el-option v-for="product in state.productAllOptions" :key="product.id" :label="product.name" :value="product.id"></el-option>
              </el-select>
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
              <span class="card-header-text">设备列表</span>
              <div>
                <el-button
                    type="primary"
                    plain
                    v-auth="'device:device:add'"
                    @click="onOpenAddModule"
                ><SvgIcon name="elementPlus" />新增</el-button>
                <el-button
                    type="danger"
                    plain
                    v-auth="'device:device:delete'"
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
                    <el-tag class="ml-3" :type="data.linkStatus ==='inactive'? 'warning': data.linkStatus ==='online' ? 'primary': 'danger'">
                      {{data.linkStatus ==='inactive'? "未激活": data.linkStatus ==='online' ? '在线': "离线"}}
                    </el-tag>
                    <el-tag class="ml-3" type="warning">{{data.otaVersion ? data.otaVersion: "未识别版本"}}</el-tag>
                  </div>
                  <div class="ft-body">
                    <div class="ft-body-image" >
                      <el-image  style="height: 100%" :src="getImage(data)" :preview-src-list="[getImage(data)]" :initial-index="0" :zoom-rate="1.2" fit="fill"></el-image>
                    </div>
                    <div class="ft-body-item">
                      <div class="item-mb">设备分组： {{data.deviceGroup.name}}</div>
                      <div class="item-mb">设备类型： {{data.deviceType ==='direct' ? '直连设备': data.deviceType ==='gateway' ? '网关设备': '网关子设备'}}</div>
                      <div class="item-mb">所属产品： {{data.product.name || "未分配"}}</div>
                      <div class="item-mb">创建时间： {{ dateStrFormat(data.createTime) }}</div>
                    </div>
                  </div>
                </div>

                <div class="ft-foot">
                  <div class="ft-item-name" style="width: 260px">
                    {{ data.name }} {{ data.alias ? '-'+data.alias: ""}}
                  </div>
                  <div>
                    <el-switch
                        v-model="data.status"
                        style="margin-right: 5px"
                        :width="60"
                        inline-prompt
                        active-value="0"
                        inactive-value="1"
                        active-text="正常"
                        inactive-text="禁用"
                        @click="handleStatusChange(data)"
                    />
                    <el-popover  >
                      <template #reference>
                        <el-button type="primary" circle size="small"><SvgIcon name="elementStar"/></el-button>
                      </template>
                      <div>
                        <el-button text type="primary" v-auth="'device:device:allot'" @click="onAllotDevice(data)">
                          <SvgIcon name="elementConnection" />分配组织
                        </el-button>
                      </div>
                      <div>
                        <el-button text type="primary" v-auth="'device:device:view'" @click="onViewDevice(data)">
                          <SvgIcon name="elementView" />查看
                        </el-button>
                      </div>
                      <div>
                        <el-button text type="primary" v-auth="'device:device:edit'" @click="onOpenEditModule(data)">
                          <SvgIcon name="elementEdit" />修改
                        </el-button>
                      </div>
                      <div>
                        <el-button text type="primary" v-auth="'device:device:delete'" @click="onTabelRowDel(data)">
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
    <Allot ref="allotRef"/>
  </div>
</template>

<script lang="ts" setup name="Device">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted, watch,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {listDevice, delDevice, updateDevice} from "@/api/device/device";
import EditModule from "./component/editModule.vue";
import View from "./component/view.vue";
import Allot from "./component/allot.vue";
import {listDeviceGroupTreeLabel} from "@/api/device/device_group";
import {listProductAll} from "@/api/device/product";

import gatewayImg from '@/assets/gateway.png'
import gatewayDImg from '@/assets/gateway_d.png'
import monitorImg from '@/assets/monitor.png'
const baseURL = import.meta.env.VITE_API_URL

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const viewRef = ref();
const allotRef = ref();
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
  groupName: undefined,
  groupOptions: undefined,
  productAllOptions: [],
  defaultProps: {
    children: "children",
    label: "name",
    value: "id"
  },
  // statusOptions字典数据
  statusOptions: [],
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    name: undefined,
    status: undefined,
    gid: "",
    pid: ""
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listDevice(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.gid = "";
  state.queryParams.name = undefined;
  state.queryParams.status = undefined;

  handleQuery();
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
  state.title = "添加设备";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改设备";
  editModuleRef.value.openDialog(row);
};

const onAllotDevice = (row: object) => {
  allotRef.value.openDialog(row);
}

// 打开视图
const onViewDevice = (row: object) => {
  viewRef.value.openDrawer(row);
}

// 获取所有在线的产品
const geyProductAll = () => {
  listProductAll({status: "0"}).then((res:any)=>{
    if (res.code === 200)
      state.productAllOptions = res.data
  })
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
    return delDevice(ids).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};

/** 查询分组下拉树结构 */
const getTreeselect = async () => {
  listDeviceGroupTreeLabel().then((response) => {
    state.groupOptions = response.data;
  });
};

const getImage = (row:any) => {
  return row.product.photoUrl ? baseURL + '/upload/get/'+ row.product.photoUrl : row.deviceType ==='direct' ? monitorImg : row.deviceType ==='gatewayS' ? gatewayDImg : gatewayImg
}

watch(
    () => state.groupName,
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
  state.queryParams.gid = data.id;
  handleQuery();
  state.queryParams.gid = ""
};

// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status == "0" ? "取消要禁用" : "使用" ;
  ElMessageBox({
    title: "警告",
    message: '确认要"' + text + '""' + row.ruleName + '"吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action: string, instance: any, done: any) => {
      if (action === "confirm") {
        return updateDevice({id: row.id,status: row.status}).then(() => {
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
  geyProductAll();
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });

  proxy.mittBus.on("onEditDeviceModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditDeviceModule");
});
</script>
