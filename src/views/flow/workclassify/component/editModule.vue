<template>
  <div class="system-workclassify-container">
    <el-dialog v-model="isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-workclassify-container .el-dialog', '.system-workclassify-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="Name" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入Name" />
      </el-form-item>
      <el-form-item label="Creator" prop="creator">
          <el-input v-model="ruleForm.creator" placeholder="请输入Creator" />
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

<script lang="ts">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updateClassify, addClassify } from "@/api/flow/workclassify";
import { ElMessage } from "element-plus";

export default {
  name: "editMenu",
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: () => "",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const ruleFormRef = ref<HTMLElement | null>(null);
    const state = reactive({
      // 是否显示弹出层
      isShowDialog: false,
      loading: false,
      ruleForm: {
      name: "",
      creator: 0,
      id: undefined,
      },
      // 表单校验
      ruleRules: {
        name: [
          { required: true, message: "Name不能为空", trigger: "blur" }
        ],
      },
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      if (row.id && row.id != undefined && row.id != 0) {
        state.ruleForm.id=row.id; // ID
        state.ruleForm.name = row.name
        state.ruleForm.creator = row.creator
        // 更多参数
      } else {
        initForm();
      }
      state.isShowDialog = true;
      state.loading = false;
    }

    // 关闭弹窗
    const closeDialog = (row?: object) => {
      proxy.mittBus.emit("onEditClassifyModule", row);
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
            updateClassify(state.ruleForm).then((response) => {
              ElMessage.success("修改成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          } else {
            addClassify(state.ruleForm).then((response) => {
              ElMessage.success("新增成功");
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          }
        }
      });
    };
    // 表单初始化，方法：`resetFields()` 无法使用
    const initForm = () => {
      state.ruleForm.id = 0; // ID
      state.ruleForm.name = "";
      state.ruleForm.creator = 0;
      state.ruleForm.id = undefined;
    };

    return {
      ruleFormRef,
      openDialog,
      closeDialog,
      onCancel,
      initForm,
      onSubmit,
      ...toRefs(state),
    };
  },
};
</script>
