<template>
  <div class="system-menu-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.system-menu-container .el-dialog', '.system-menu-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="参数名称" prop="configName">
          <el-input
            v-model="state.ruleForm.configName"
            placeholder="请输入参数名称"
          />
        </el-form-item>
        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="state.ruleForm.configKey" placeholder="请输入参数键名" />
        </el-form-item>
        <el-form-item label="参数键值" prop="configValue">
          <el-input
            v-model="state.ruleForm.configValue"
            placeholder="请输入参数键值"
          />
        </el-form-item>
        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="state.ruleForm.configType">
            <el-radio
              v-for="dict in state.typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="state.ruleForm.remark"
            type="textarea"
            placeholder="请输入内容"
          />
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

<script lang="ts" setup>
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { addConfig, updateConfig } from "@/api/system/config";
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
  // 表单参数对象
  ruleForm: {
    configId: 0, // 配置参数ID
    configName: "", // 配置参数名称
    configKey: "", // 配置参数键名
    configValue: "", //配置参数键值
    configType: "", // 是否系统内置参数
    remark: "", // 备注
  },
  // 类型数据配置参数
  typeOptions: [],
  // 表单校验
  ruleRules: {
    dictName: [
      { required: true, message: "配置参数名称不能为空", trigger: "blur" },
    ],
    dictType: [
      { required: true, message: "配置参数类型不能为空", trigger: "blur" },
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
  // 查询配置参数状态数据配置参数
  proxy.getDicts("sys_yes_no").then((response: any) => {
    state.typeOptions = response.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditPostModule", row);
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
      if (state.ruleForm.configId != undefined && state.ruleForm.configId != 0) {
        updateConfig(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addConfig(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          state.loading = false;
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
