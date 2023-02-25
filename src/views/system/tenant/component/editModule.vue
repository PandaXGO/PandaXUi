<template>
    <div class="system-tenants-container">
        <el-dialog v-model="state.isShowDialog" width="769px" center>
            <template #title>
                <div style="font-size: large" v-drag="['.system-tenants-container .el-dialog', '.system-tenants-container .el-dialog__header']">{{title}}</div>
            </template>
            <el-form
                    :model="state.ruleForm"
                    :rules="state.ruleRules"
                    ref="ruleFormRef"
                    label-width="80px"
            >
                <el-form-item label="租户名" prop="tenantName">
                    <el-input v-model="state.ruleForm.tenantName" placeholder="请输入租户名" />
                </el-form-item>
                <el-form-item label="过期时间" prop="expireTime">
                    <el-date-picker clearable style="width: 200px"
                                    v-model="state.ruleForm.expireTime"
                                    type="datetime"
                                    placeholder="选择过期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="state.ruleForm.remark" placeholder="请输入备注" />
                </el-form-item>
            </el-form>
            <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit">编 辑</el-button>
        </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateSysTenants, addSysTenants } from "@/api/system/tenant";
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
  ruleForm: {
    expireTime: undefined,
    tenantName: "",
    remark: "",
    id: 0,
  },
  // 表单校验
  ruleRules: {
    tenantName: [
      { required: true, message: "租户名不能为空", trigger: "blur" }
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {

  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditTenantsModule", row);
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
      state.loading = true;
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        updateSysTenants(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addSysTenants(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
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
