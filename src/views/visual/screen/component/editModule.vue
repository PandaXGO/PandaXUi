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
      <el-form-item label="名称" prop="screenName">
          <el-input v-model="state.ruleForm.screenName" placeholder="请输入名称" />
      </el-form-item>
        <el-form-item label="所属分组" prop="deptId">
        <el-cascader
            v-model="state.ruleForm.groupId"
            :options="state.groupOptions"
            :props="{
                  label: 'name',
                  value: 'id',
                  checkStrictly: true,
                  emitPath: false,
                }"
            class="w100"
            clearable
            filterable
            placeholder="请选择所属分组"
            :show-all-levels="false"
        ></el-cascader>
        </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="state.ruleForm.status">
          <el-radio
              v-for="dict in state.statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
          >{{ dict.dictLabel }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="说明" prop="screenRemark">
          <el-input v-model="state.ruleForm.screenRemark" type="textarea" placeholder="请输入说明" />
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
import {treeselect} from "@/api/system/dept";
import {listScreenGroupTree} from "@/api/visual/screen_group";

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
    groupId:0,
    screenName: "",
    status: "0",
    screenRemark: "",
    creator: "",
    screenDataJson: "",
  },
  groupOptions: [],
  // 状态数据字典
  statusOptions: [],
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
  getTreeselect()
  // 查询显示狀態数据字典
  proxy.getDicts("sys_release_type").then((response: any) => {
    state.statusOptions = response.data;
  });
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

/** 查询部门下拉树结构 */
const getTreeselect = async () => {
  listScreenGroupTree().then((response) => {
    state.groupOptions = response.data;
  });
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
