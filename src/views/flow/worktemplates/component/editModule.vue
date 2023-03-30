<template>
  <div class="system-worktemplates-container">
    <el-dialog v-model="state.isShowDialog" fullscreen center >
      <template #title>
        <div style="font-size: large" >{{title}}</div>
      </template>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="名称:" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述:" prop="remarks">
          <el-input v-model="state.ruleForm.remarks" type="textarea" placeholder="请输入描述 " />
        </el-form-item>
        <el-form-item label="模板:" prop="remarks">
          <FormDesign ref="vfdRef"></FormDesign>
        </el-form-item>
      </el-form>
<!--      <div style="width: 100%;height: 100%">
        <FormDesign ref="vfdRef"></FormDesign>
      </div>-->

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="editWorkTemplates">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateWorkTemplates, addWorkTemplates } from "@/api/flow/worktemplates";
import { ElMessage } from "element-plus";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const vfdRef = ref()
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  ruleForm: {
    remarks: "",
    id: undefined,
    name: "",
    creator: 0,
    form_structure: undefined
  },
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
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
  proxy.mittBus.emit("onEditWorkTemplatesModule", row);
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
      const data = vfdRef.value.getJson()
      state.ruleForm.form_structure = data
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        updateWorkTemplates(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addWorkTemplates(state.ruleForm).then((response) => {
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
