<template>
  <div style="margin: 10px">
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
        <el-form-item label="设备状态" prop="status">
          <el-select v-model="state.queryParams.linkStatus" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in linkStatusOption"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
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
          <span class="card-header-text">子设备列表</span>
<!--          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenModule({})"
            ><SvgIcon name="elementPlus" />新增</el-button>
          </div>-->
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="设备名称" align="center" prop="name">
          <template #default="scope">
            <div class="device_name" @click="openDeviceDetail(scope.row)">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备别名" align="center" prop="alias"/>
        <el-table-column label="连接状态" align="center" prop="linkStatus">
          <template #default="scope">
            <el-tag
                :type="scope.row.linkStatus === 'inactive' ? 'warning' : scope.row.linkStatus === 'online' ? 'primary' : 'danger'"
                disable-transitions
            >{{ scope.row.linkStatus ==='inactive'? "未激活": scope.row.linkStatus ==='online' ? '在线': "离线" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" align="center" prop="status">
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '0' ? 'primary' : 'success'"
                disable-transitions
            >{{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="最后连接时间" align="center" prop="lastTime">
          <template #default="scope">
            {{ dateStrFormat(scope.row.lastTime) }}
          </template>
        </el-table-column>
      </el-table>
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
    <View ref="viewRef" />
  </div>
</template>

<script lang="ts" setup>
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {listDevice} from "@/api/device/device";
import View from "./view.vue";

const props:any = defineProps({
  rowData: {
    type: Object,
  },
})
const {proxy} = getCurrentInstance() as any;
const viewRef = ref();
const linkStatusOption = [{
  label: "未激活",
  value: "inactive",
},{
  label: "离线",
  value: "offline",
},{
  label: "在线",
  value: "online",
}]

const state = reactive({
  // 遮罩层
  loading: false,
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  statusOptions: [],
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    parentId: "",  //父设备Id
    linkStatus: "",
    name: "",
  },
  isShowDialog: false,
});
// 查询列表
const handleQuery = () => {
  state.loading = true;
  state.queryParams.parentId = props.rowData.id
  listDevice(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false;
  });
};

const resetQuery = () => {
  state.queryParams.name = "";
  state.queryParams.linkStatus = "";
  handleQuery();
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}
// 状态字典翻译
const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

const openDeviceDetail = (row: object) => {
  viewRef.value.openDrawer(row);
}

onMounted(()=>{
  handleQuery()
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
})
</script>
<style scoped>
.device_name{
  color: var(--color-primary-light-1);
  cursor: pointer;
}
</style>
