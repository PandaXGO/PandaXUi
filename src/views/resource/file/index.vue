<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
      >
        <el-form-item label="资源编号" prop="ossCode">
          <el-input
              placeholder="请输入资源编号糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.ossCode"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select
              v-model="state.queryParams.category"
              placeholder="分类"
              clearable
          >
            <el-option
                v-for="dict in state.ossOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
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
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">对象存储列表</span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenAddModule"
                v-auth="'resource:file:add'"
            >
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'resource:file:delete'"
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
        <el-table-column label="编号" align="center" prop="ossId"/>
        <el-table-column
            label="分类"
            align="center"
            width="80"
            prop="category"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.category === '0' ? 'danger' : scope.row.category === '0'? 'success':'warning'"
                disable-transitions
            >{{ ossFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="资源编号" align="center" prop="ossCode"/>
        <el-table-column label="资源地址" align="center" width="250" prop="endpoint"/>
        <el-table-column label="空间名" align="center" prop="bucketName"/>
        <el-table-column label="accessKey" align="center" prop="accessKey"/>
        <el-table-column label="secretKey" align="center" prop="secretKey"/>
        <el-table-column label="状态" align="center">
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
            label="操作"
            align="center"
            width="300"
            class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary" @click="onOpenEditModule(scope.row)" v-auth="'resource:file:edit'">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button v-if="scope.row.parentId != 0" text type="primary" @click="onTabelRowDel(scope.row)" v-auth="'resource:file:delete'">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="onOpenDebugModule(scope.row)" v-auth="'resource:file:debug'">
                  <SvgIcon name="elementUploadFilled"/>
                  调试
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
    <!-- 添加或修改岗位对话框 -->
    <EditModule ref="editModuleRef" :title="state.title"/>

    <el-dialog title="测试文件上传" v-model="state.debugOpen" width="769px" center>
      <el-form label-width="80px">
        <el-form-item label="资源编号">
          <el-input v-model="state.debugForm.ossCode" :disabled="true"/>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
              drag
              :action="state.url"
              :headers="state.headers"
              :auto-upload="true"
              :on-exceed="handleLimit"
              :on-success="handleUplaodSuccess"
          >
            <SvgIcon name="elementPlus"/>
            <div class="el-upload__text">
              拖拽文件到这或 <em>点击文件上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {listResOsses, delResOsses, changeOssStatus} from "@/api/resource/oss";
import EditModule from "./component/editModule.vue";
import {Session} from "@/utils/storage";

const {proxy} = getCurrentInstance() as any;
const editModuleRef = ref();

const baseURL = import.meta.env.VITE_API_URL
const state: any = reactive({
  // 遮罩层
  loading: true,
  debugOpen: false,
  url: '',
  headers: {},
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 弹出层标题
  title: "",
  // 岗位表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 状态数据字典
  statusOptions: [],
  // oss分类数据字典
  ossOptions: [],
  debugForm: {},
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    category: undefined,
    ossCode: undefined,
    status: undefined,
  },
});

/** 查询岗位列表 */
const handleQuery = () => {
  state.loading = true;
  listResOsses(state.queryParams).then((response: any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.category = undefined;
  state.queryParams.ossCode = undefined;
  state.queryParams.status = undefined;
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

const statusFormat = (row: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

const ossFormat = (row: any) => {
  return proxy.selectDictLabel(state.ossOptions, row.category);
};

// 打开新增弹窗
const onOpenAddModule = () => {
  state.title = "添加ResOss";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改ResOss";
  editModuleRef.value.openDialog(row);
};
// 打开调试弹窗
const onOpenDebugModule = (row: any) => {
  state.debugOpen = true
  state.debugForm = row
  state.url = baseURL + '/resource/oss/uploadFile?ossCode=' + row.ossCode
  state.headers = {'X-TOKEN': `${Session.get('token')}`}
};
// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox({
    message: '确认要"' + text + '""' + row.ossCode + '"Oss吗?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return changeOssStatus({ossId: row.ossId, status: row.status});
      })
      .then(() => {
        ElMessage({
          message: text + "成功",
          type: 'success',
        });
      })
      .catch(function () {
        row.status = row.status === "0" ? "1" : "0";
      });
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const ossIds = row.ossId || state.ids;
  ElMessageBox({
    message: '是否确认删除岗位编号为"' + ossIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delResOsses(ossIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.ossId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
const handleLimit = (e: any) => {
  if (e.length > state.limit) {
    ElMessage.warning(`最大单次只可上传${state.limit}条`);
  }
};
const handleUplaodSuccess = (res: any, file: any) => {
  if (res.code == 200) {
    ElMessage.success(`文件上传成功，路径为${res.data}`);
  } else {
    ElMessage.error(`文件上传失败`);
  }
}
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();
  // 查询状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.getDicts("res_oss_category").then((response: any) => {
    state.ossOptions = response.data;
  });
  proxy.mittBus.on("onEditResOssesModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditResOssesModule");
});

</script>
