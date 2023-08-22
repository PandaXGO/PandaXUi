<template>
  <div class="system-datasettabletask-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-datasettabletask-container .el-dialog', '.system-datasettabletask-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="state.ruleForm.startTime" placeholder="请输入开始时间" />
      </el-form-item>
      <el-form-item label="结束限制 0 无限制 1 设定结束时间" prop="end">
          <el-input v-model="state.ruleForm.end" placeholder="请输入结束限制 0 无限制 1 设定结束时间" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="state.ruleForm.endTime" placeholder="请输入结束时间" />
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="cron表达式" prop="cron">
          <el-input v-model="state.ruleForm.cron" placeholder="请输入cron表达式" />
      </el-form-item>
      
      <el-form-item label="执行频率：0 一次性 1 cron" prop="rate">
          <el-input v-model="state.ruleForm.rate" placeholder="请输入执行频率：0 一次性 1 cron" />
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

<script lang="ts" setup name="editDataSetTableTask">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateDataSetTableTask, addDataSetTableTask } from "@/api/visual/datasettabletask";
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
  startTime: undefined,
  end: "",
  endTime: undefined,
  name: "",
  cron: "",
  type: "",
  rate: "",
  },
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "任务名称不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditDataSetTableTaskModule", row);
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
        updateDataSetTableTask(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addDataSetTableTask(state.ruleForm).then((response) => {
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
