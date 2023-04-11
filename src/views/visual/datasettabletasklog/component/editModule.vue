<template>
  <div class="system-datasettabletasklog-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-datasettabletasklog-container .el-dialog', '.system-datasettabletasklog-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      
      <el-form-item label="错误信息" prop="info">
          <el-input v-model="state.ruleForm.info" placeholder="请输入错误信息" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="state.ruleForm.endTime" placeholder="请输入结束时间" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="state.ruleForm.startTime" placeholder="请输入开始时间" />
      </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="editDataSetTableTaskLog">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateDataSetTableTaskLog, addDataSetTableTaskLog } from "@/api/visual/datasettabletasklog";
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
  id: "",
  status: "",
  info: "",
  endTime: undefined,
  startTime: undefined,
  },
  // 表单校验
  ruleRules: {
    status: [
      { required: true, message: "执行状态不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditDataSetTableTaskLogModule", row);
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
        updateDataSetTableTaskLog(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addDataSetTableTaskLog(state.ruleForm).then((response) => {
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
