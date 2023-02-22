<template>
  <div class="system-menu-container">
    <el-dialog v-model="isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.system-menu-container .el-dialog', '.system-menu-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="ruleRules"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="字典类型">
          <el-input v-model="ruleForm.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="ruleForm.dictLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据键值" prop="dictValue">
          <el-input v-model="ruleForm.dictValue" placeholder="请输入数据键值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number
            v-model="ruleForm.dictSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="ruleForm.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { addData, updateData } from "@/api/system/dict/data";
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
      // 表单参数对象
      ruleForm: {
        dictCode: 0, // 字典编码 字典数据主键
        dictType: "", // 字典类型
        dictLabel: "", //数据标签
        dictValue: "", //数据键值
        dictSort: 0, // 显示排序
        status: "", //字典状态
        remark: "", // 备注
      },
      // 字典状态数据字典
      statusOptions: [{
        dictValue: "0",
        dictLabel: "正常"
        },{
        dictValue: "1",
        dictLabel: "禁用"
        }],
      // 字典树选项
      deptOptions: [],
      // 表单校验
      ruleRules: {
         dictLabel: [
          { required: true, message: "数据标签不能为空", trigger: "blur" }
        ],
        dictValue: [
          { required: true, message: "数据键值不能为空", trigger: "blur" }
        ],
        dictSort: [
          { required: true, message: "数据顺序不能为空", trigger: "blur" }
        ]
      },
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      state.ruleForm = JSON.parse(JSON.stringify(row));
      state.ruleForm.dictType = row.dictType; // 字典类型

      state.isShowDialog = true;
      state.loading = false;
    };

    // 关闭弹窗
    const closeDialog = (row?: object) => {
      proxy.mittBus.emit("onEditDictItemModule", row);
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
          if (state.ruleForm.dictCode != undefined && state.ruleForm.dictCode != 0) {
            updateData(state.ruleForm).then((response) => {
              ElMessage.success("修改成功");
              state.loading = false;
              closeDialog(state.ruleForm);
            });
          } else {
            addData(state.ruleForm).then((response) => {
              ElMessage.success("新增成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          }
        }
      });
    };
    // 表单初始化，方法：`resetFields()` 无法使用
    const initForm = () => {
      state.ruleForm.dictCode = 0; // 字典编码
      state.ruleForm.dictLabel = ""; // 数据标签

      state.ruleForm.dictValue = ""; // 数据键值
      state.ruleForm.dictSort = 0; // 显示排序

      state.ruleForm.dictType = ""; // 字典类型
      state.ruleForm.status = "0"; //字典状态
      state.ruleForm.remark = ""; // 备注
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
