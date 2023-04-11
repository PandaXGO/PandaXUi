<template>
  <div class="system-screen-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-screen-container .el-dialog', '.system-screen-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="Base64缩略图" prop="screenBase64">
          <el-input v-model="state.ruleForm.screenBase64" placeholder="请输入Base64缩略图" />
      </el-form-item>
      <el-form-item label="名称" prop="screenName">
          <el-input v-model="state.ruleForm.screenName" placeholder="请输入名称" />
      </el-form-item>
      
      <el-form-item label="说明" prop="screenRemark">
          <el-input v-model="state.ruleForm.screenRemark" placeholder="请输入说明" />
      </el-form-item>
      <el-form-item label="Creator" prop="creator">
          <el-input v-model="state.ruleForm.creator" placeholder="请输入Creator" />
      </el-form-item>
      <el-form-item label="Json数据" prop="screenDataJson">
          <el-input v-model="state.ruleForm.screenDataJson" placeholder="请输入Json数据" />
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

<script lang="ts" setup name="editScreen">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateScreen, addScreen } from "@/api/visual/screen";
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
  screenId: "",
  screenBase64: "",
  screenName: "",
  status: "",
  screenRemark: "",
  creator: "",
  screenDataJson: "",
  },
  // 表单校验
  ruleRules: {
    screenName: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditScreenModule", row);
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
      if (state.ruleForm.screenId != undefined && state.ruleForm.screenId != 0) {
        updateScreen(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addScreen(state.ruleForm).then((response) => {
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
