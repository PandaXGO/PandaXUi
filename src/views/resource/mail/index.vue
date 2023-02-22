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
        <el-form-item label="分类" prop="category">
          <el-select
              v-model="state.queryParams.category"
              placeholder="分类"
              clearable
          >
            <el-option
                v-for="dict in state.mailOptions"
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
          <span class="card-header-text">邮件列表</span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenAddModule"
                v-auth="'resource:mail:add'"
            >
              <SvgIcon name="elementPlus"/>
              新增
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'resource:mail:delete'"
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
        <el-table-column label="编号" align="center" prop="mailId"/>
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
            >{{ mailFormat(scope.row) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户名称" align="center" prop="from"/>
        <el-table-column label="服务器地址" align="center" width="250" prop="host"/>
        <el-table-column label="端口号" align="center" prop="port"/>
        <el-table-column label="发件人" align="center" prop="nickname"/>
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
                <el-button text type="primary" @click="onOpenEditModule(scope.row)" v-auth="'resource:mail:edit'">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button v-if="scope.row.parentId != 0" text type="primary" @click="onTabelRowDel(scope.row)" v-auth="'resource:mail:delete'">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="onOpenDebugModule(scope.row)" v-auth="'resource:mail:debug'">
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

    <el-dialog title="测试发送邮件" v-model="state.debugOpen" width="769px" center>
      <el-form label-width="80px" :model="state.debugForm" :rules="state.debugRules" ref="debugFormRef">
        <el-form-item label="邮箱编号">
          <el-input v-model="state.debugForm.mailId" :disabled="true"/>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input placeholder="请输入要发送给谁" v-model="state.debugForm.to"/>
        </el-form-item>
        <el-form-item label="发送主题">
          <el-input placeholder="请输入发送主题" v-model="state.debugForm.subject"/>
        </el-form-item>
        <el-form-item label="发送内容">
          <el-input type="textarea" placeholder="请输入发送内容" v-model="state.debugForm.body"/>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                 <el-button type="primary" @click="submitDebug">确 定</el-button>
                <el-button @click="cancelDebug">取 消</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted, unref,
} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {listResEmails, delResEmails, changeMailStatus, debugMail} from "@/api/resource/email";
import EditModule from "./component/editModule.vue";

const {proxy} = getCurrentInstance() as any;
const editModuleRef = ref();
const debugFormRef = ref();
const state: any = reactive({
  // 遮罩层
  loading: true,
  debugOpen: false,
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
  mailOptions: [],
  debugForm: {
    to: "",
    subject: "",
    body: ""
  },
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    category: undefined,
    status: undefined,
  },
  debugRules: {
    to: [
      {required: true, message: "联系人不能为空", trigger: "blur"}
    ],
    subject: [
      {required: true, message: "主题不能为空", trigger: "blur"}
    ],
    body: [
      {required: true, message: "内容不能为空", trigger: "blur"}
    ],
  },
});

/** 查询岗位列表 */
const handleQuery = () => {
  state.loading = true;
  listResEmails(state.queryParams).then((response) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.category = undefined;
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

const mailFormat = (row: any) => {
  return proxy.selectDictLabel(state.mailOptions, row.category);
};

// 打开新增弹窗
const onOpenAddModule = () => {
  state.title = "添加ResEmails";
  editModuleRef.value.openDialog({});
};
// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改ResEmails";
  editModuleRef.value.openDialog(row);
};

// 打开调试弹窗
const onOpenDebugModule = (row: any) => {
  state.debugOpen = true
  state.debugForm.mailId = row.mailId
};
// 提交测试
const submitDebug = () => {
  const formWrap = unref(debugFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      debugMail(state.debugForm).then((response) => {
        ElMessage.success("测试成功");
        cancelDebug(); // 关闭弹窗
      });
    }
  });
};
const cancelDebug = () => {
  state.debugOpen = false
  state.debugForm = {}
}
// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status === "0" ? "启用" : "停用";
  ElMessageBox({
    message: '确认要"' + text + '""' + row.mailId + '"吗?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
      .then(function () {
        return changeMailStatus({mailId: row.mailId, status: row.status});
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
  const mailIds = row.mailId || state.ids;
  ElMessageBox({
    message: '是否确认删除岗位编号为"' + mailIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delResEmails(mailIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.mailId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();
  // 查询状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  proxy.getDicts("res_mail_category").then((response: any) => {
    state.mailOptions = response.data;
  });
  proxy.mittBus.on("onEditResEmailsModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditResEmailsModule");
});
</script>
