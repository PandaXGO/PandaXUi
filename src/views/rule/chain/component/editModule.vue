<template>
  <div class="system-rulechain-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center draggable>
      <template #title>
        {{title}}
      </template>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="名称" prop="ruleName">
          <el-input v-model="state.ruleForm.ruleName" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="根链">
          <el-radio-group v-model="state.ruleForm.root">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明" prop="ruleRemark">
          <el-input v-model="state.ruleForm.ruleRemark" placeholder="请输入说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateChain, addChain } from "@/api/rule/rulechain";
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
    ruleName: "",
    root: false,
    status: "",
    ruleBase64: "",
    ruleDataJson: "",
    id: "",
    ruleRemark: "",
  },
  statusOptions: [],
  // 表单校验
  ruleRules: {
    ruleName: [
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

  proxy.getDicts("sys_release_type").then((response: any) => {
    state.statusOptions = response.data;
  });

  state.isShowDialog = true;
  state.loading = false;
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditChainModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  state.isShowDialog = false;
};

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if (state.ruleForm.id != undefined && state.ruleForm.id != "") {
        updateChain(state.ruleForm).then((response:any) => {
          if (response.code === 200){
            ElMessage.success("修改成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      } else {
        addChain(state.ruleForm).then((response:any) => {
          if (response.code === 200){
            ElMessage.success("新增成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
