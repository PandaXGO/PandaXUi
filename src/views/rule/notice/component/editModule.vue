<template>
  <div class="system-notice-container">
    <el-dialog v-model="isShowDialog" width="769px" center>
      <template #title>
        <div style="font-size: large" v-drag="['.system-notice-container .el-dialog', '.system-notice-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
      <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="ruleForm.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
         <el-select v-model="ruleForm.category" placeholder="请选择分类">
             <el-option
                 v-for="dict in categoryOptions"
                 :key="dict.dictValue"
                 :label="dict.dictLabel"
             >{{ dict.dictLabel }}</el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="模型" prop="model">
         <el-select v-model="ruleForm.model" placeholder="请选择模型">
             <el-option
                 v-for="dict in modelOptions"
                 :key="dict.dictValue"
                 :label="dict.dictLabel"
             >{{ dict.dictLabel }}</el-option>
         </el-select>
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
import { updateNotice, addNotice } from "@/api/rule/notice";
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
          description: "",
          name: "",
          exParam: undefined,
          category: "",
          model: "",
          id: undefined,
      },
      // categoryOptions字典数据
      categoryOptions: [],
      // modelOptions字典数据
      modelOptions: [],
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
        state.ruleForm.description = row.description
        state.ruleForm.name = row.name
        state.ruleForm.exParam = row.exParam
        state.ruleForm.category = row.category
        state.ruleForm.model = row.model
        // 更多参数
      } else {
        initForm();
      }
      state.isShowDialog = true;
      state.loading = false;
     proxy.getDicts("rule_notice_category").then((response: any) => {
         state.categoryOptions = response.data;
     });
     proxy.getDicts("rule_notice_model").then((response: any) => {
         state.modelOptions = response.data;
     });
    }

    // 关闭弹窗
    const closeDialog = (row?: object) => {
      proxy.mittBus.emit("onEditNoticeModule", row);
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
            updateNotice(state.ruleForm).then((response) => {
              ElMessage.success("修改成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          } else {
            addNotice(state.ruleForm).then((response) => {
              ElMessage.success("新增成功");
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          }
        }
      });
    };
    // 表单初始化，方法：`resetFields()` 无法使用
    const initForm = () => {
      state.ruleForm.description = "";
      state.ruleForm.name = "";
      state.ruleForm.exParam = undefined;
      state.ruleForm.category = "";
      state.ruleForm.model = "";
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
