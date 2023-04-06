<template>
  <div class="system-menu-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.app-container .el-dialog', '.app-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="路径" prop="path">
          <el-input
            v-model="state.ruleForm.path"
            placeholder="请输入路径"
          />
        </el-form-item>
        <el-form-item label="API描述" prop="description">
          <el-input v-model="state.ruleForm.description" placeholder="请输入API描述" />
        </el-form-item>
        <el-form-item label="API分组" prop="apiGroup">
          <el-input
            v-model="state.ruleForm.apiGroup"
            placeholder="请输入API分组"
          />
        </el-form-item>
        <el-form-item label="方法名" prop="method">
          <el-radio-group v-model="state.ruleForm.method">
            <el-radio
              v-for="dict in state.methodOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" >取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { addApi, updateApi } from "@/api/system/api";
import { ElMessage } from "element-plus";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  // 表单参数对象
  ruleForm: {
    id: 0,
    path: "",
    description: "",
    apiGroup: "",
    method: "",
  },
  // 类型数据配置参数
  methodOptions: [],
  // 表单校验
  ruleRules: {
    path: [
      { required: true, message: "API路径不能为空", trigger: "blur" },
    ],
    apiGroup: [
      { required: true, message: "API分组不能为空", trigger: "blur" },
    ],
    method: [
      { required: true, message: "API方法不能为空", trigger: "blur" },
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));
  state.isShowDialog = true;
  state.loading = false;
  // 查询配置参数状态数据配置参数
  proxy.getDicts("sys_method_api").then((response: any) => {
    state.methodOptions = response.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditApiModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        updateApi(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addApi(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          state.loading = false
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
