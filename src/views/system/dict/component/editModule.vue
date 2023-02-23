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
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="ruleForm.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="ruleForm.dictType" placeholder="请输入字典类型" />
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
import { addType, updateType } from "@/api/system/dict/type";
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
        dictId: 0, // 字典ID
        dictName: "", // 字典名称
        dictType: "", // 字典类型
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
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
      },
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      state.ruleForm = JSON.parse(JSON.stringify(row));

      state.isShowDialog = true;
      state.loading =false;
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
          state.loading =true;
          if (state.ruleForm.dictId != undefined && state.ruleForm.dictId != 0) {
            updateType(state.ruleForm).then((response) => {
              ElMessage.success("修改成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          } else {
            addType(state.ruleForm).then((response) => {
              ElMessage.success("新增成功");
              state.loading =false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          }
        }
      });
    };

    return {
      ruleFormRef,
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      ...toRefs(state),
    };
  },
};
</script>
