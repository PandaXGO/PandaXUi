<template>
  <div class="system-workinfo-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-workinfo-container .el-dialog', '.system-workinfo-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input v-model="state.ruleForm.classify" placeholder="请选择分类" />
        </el-form-item>
        <el-form-item label="抄送" prop="classify">
          <el-select v-model="state.ruleForm.cc" multiple placeholder="选择要抄送的人">
            <el-option label="张三" value="1"/>
            <el-option label="李四" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="state.ruleForm.icon" placeholder="请输入图标" />
        </el-form-item>
        <el-form-item label="描述" prop="remarks">
          <el-input v-model="state.ruleForm.remarks" placeholder="请输入描述" />
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

<script lang="ts" setup name="editWorkInfo">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateWorkInfo, addWorkInfo } from "@/api/flow/workinfo";
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
    name: "",
    creator: 0,
    cc: [],
    remarks: "",
    icon: "",
    id: undefined,
    structure: undefined,
    classify: 0,
  },
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    icon: [
      { required: true, message: "图标不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditWorkInfoModule", row);
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
        updateWorkInfo(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addWorkInfo(state.ruleForm).then((response) => {
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
