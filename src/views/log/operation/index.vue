<template>
  <div class="system-user-container app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
      >
        <el-form-item label="系统模块" prop="title">
          <el-input
              placeholder="请输入系统模块模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.title"
          />
        </el-form-item>
        <el-form-item label="操作人员" prop="operName">
          <el-input
              placeholder="请输入操作人员模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.operName"
          />
        </el-form-item>
        <el-form-item label="类型" prop="businessType">
          <el-select
              v-model="state.queryParams.businessType"
              placeholder="操作类型"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="dict in state.typeOptions"
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
          <span class="card-header-text">操作日志</span>
          <div>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'log:operation:delete'"
            >
              <SvgIcon name="elementDelete"/>
              删除
            </el-button>
            <el-button
                type="danger"
                plain
                @click="handleClean"
                v-auth="'log:operation:clean'"
            >
              <SvgIcon name="elementDelete"/>
              清空
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
        <el-table-column label="日志编号" align="center" prop="operId"/>
        <el-table-column label="系统模块" align="center" prop="title"/>
        <el-table-column
            label="操作类型"
            align="center"
            prop="businessType"
            :formatter="typeFormat"
        />
        <el-table-column label="请求方法" align="center" prop="method"/>
        <el-table-column label="操作人员" align="center" prop="operName"/>
        <el-table-column
            label="主机"
            align="center"
            prop="operIp"
            width="130"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="操作地点"
            align="center"
            prop="operLocation"
            :show-overflow-tooltip="true"
        />
        <el-table-column
            label="操作状态"
            align="center"
            prop="status"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.status === '1' ? 'danger' : 'success'"
                disable-transitions
            >{{ statusFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作日期"
            align="center"
        >
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
                text type="primary"
                @click="handleView(scope.row)"
            >
              <SvgIcon name="elementView"/>
              详细
            </el-button>
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
            :page-sizes="[10, 20, 30, 40]"
            :page-size="state.queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" v-model="state.open" width="700px" center append-to-body>
      <el-form
          ref="ruleFormRef"
          :model="state.modelForm"
          label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块："
            >{{ state.modelForm.title }} / {{ typeFormat(state.modelForm) }}
            </el-form-item
            >
            <el-form-item label="登录信息："
            >{{ state.modelForm.operName }} / {{ state.modelForm.operIp }} /
              {{ state.modelForm.operLocation }}
            </el-form-item
            >
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{
                state.modelForm.operUrl
              }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{
                state.modelForm.method
              }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{
                state.modelForm.operParam
              }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              {{ statusFormat(state.modelForm) }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{
                dateStrFormat(state.modelForm.createTime)
              }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="state.modelForm.status === '1'">{{
                state.modelForm.errorMsg
              }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                  <el-button @click="state.open = false">关 闭</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="Operlog">
import {reactive, onMounted, toRefs, ref, getCurrentInstance} from "vue";
import {
  listOperInfo,
  delOperInfo,
  cleanOpernfo,
} from "@/api/log/oper";
import {ElMessageBox, ElMessage} from "element-plus";

const {proxy} = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 遮罩层
  loading: true,
  // 总条数
  total: 0,
  // 列表表格数据
  tableData: [],
  // 选中数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  // 弹出层标题
  title: "",
  // 是否显示弹出层
  open: false,
  // 表单参数
  modelForm: {},
  // 类型数据字典
  typeOptions: [],
  // 类型数据字典
  statusOptions: [],
  // 查询参数
  queryParams: {
    pageNo: 1,
    pageSize: 10,
    title: undefined,
    operName: undefined,
    businessType: undefined,
  },
});

/** 查询定时任务列表 */
const handleQuery = () => {
  state.loading = true;
  listOperInfo(state.queryParams).then(
      (response) => {
        state.tableData = response.data.data;
        state.total = response.data.total;
        state.loading = false;
      }
  );
};

/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.title = undefined;
  state.queryParams.operName = undefined;
  state.queryParams.businessType = undefined;
  handleQuery();
};

/** 清空按钮操作 */
const handleClean = () => {
  ElMessageBox({
    message: "是否确认清空所有操作日志数据项?",
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return cleanOpernfo();
      })
      .then(() => {
        handleQuery();
        ElMessage.success("清空成功");
      });
};

/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const operIds = row.operId || state.ids;
  ElMessageBox({
    message: '是否确认删除日志编号为"' + operIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delOperInfo(operIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};

/** 详细按钮操作 */
const handleView = (row: any) => {
  state.open = true;
  state.modelForm = row;
};

//分页页面大小发生变化
const handleSizeChange = (val: any) => {
  state.queryParams.pageSize = val;
  handleQuery();
};
//当前页码发生变化
const handleCurrentChange = (val: any) => {
  state.queryParams.pageNo = val;
  handleQuery();
};

// 操作日志状态字典翻译
const statusFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.statusOptions, row.status);
};

// 操作日志类型字典翻译
const typeFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.typeOptions, row.businessType);
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.operId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};

// 页面加载时调用
onMounted(() => {
  //   proxy.mittBus.on("onEditPostModule", (res: any) => {
  //     handleQuery();
  //   });
  // 查询列表数据信息
  handleQuery();
  proxy.getDicts("sys_common_status").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.getDicts("sys_oper_type").then((response: any) => {
    state.typeOptions = response.data;
  });
});
</script>

<style>
</style>
