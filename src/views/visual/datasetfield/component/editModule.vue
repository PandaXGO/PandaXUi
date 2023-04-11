<template>
  <div class="system-datasetfield-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-datasetfield-container .el-dialog', '.system-datasetfield-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="json对应字段" prop="jsonField">
          <el-input v-model="state.ruleForm.jsonField" placeholder="请输入json对应字段" />
      </el-form-item>
      <el-form-item label="字段名" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入字段名" />
      </el-form-item>
      <el-form-item label="字段描述" prop="comment">
          <el-input v-model="state.ruleForm.comment" placeholder="请输入字段描述" />
      </el-form-item>
      
      
      <el-form-item label="go对应字段" prop="goField">
          <el-input v-model="state.ruleForm.goField" placeholder="请输入go对应字段" />
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

<script lang="ts" setup name="editDataSetField">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateDataSetField, addDataSetField } from "@/api/visual/datasetfield";
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
  jsonField: "",
  name: "",
  comment: "",
  goType: "",
  type: "",
  goField: "",
  fieldId: "",
  },
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "字段名不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditDataSetFieldModule", row);
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
      if (state.ruleForm.fieldId != undefined && state.ruleForm.fieldId != 0) {
        updateDataSetField(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addDataSetField(state.ruleForm).then((response) => {
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
