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
        <el-row :gutter="30">
          <el-col :span="24" >
            <el-form-item label="上级分组" prop="parentId">
              <el-cascader
                  v-model="state.ruleForm.pid"
                  :options="state.groupOptions"
                  class="w100"
                  :props="{
                  value: 'id',
                  label: 'name',
                  checkStrictly: true,
                  emitPath: false,
                }"
                  clearable
                  placeholder="选择上级分组"
                  :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="名称" prop="name">
              <el-input
                  v-model="state.ruleForm.name"
                  placeholder="请输入名称"
                  clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="state.ruleForm.status">
                <el-radio
                    v-for="dict in state.statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="排序" prop="sort">
              <el-input-number
                  v-model="state.ruleForm.sort"
                  placeholder="排序"
                  clearable
                  controls-position="right"
                  :min="0"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading"
          >编 辑</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive,  ref, unref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import {listScreenGroupTree,addScreenGroup,updateScreenGroup} from "@/api/visual/screen_group";

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
  // 对象
  ruleForm: {
    id: 0, // ID
    name: "", // 名称
    pid: 0, // 父ID
    sort: 0, // 排序
    status: "", //状态
  },
  // 状态数据字典
  statusOptions: [],
  // 树选项
  groupOptions: [],
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" },
    ],
    pid: [
      { required: true, message: "父不能为空", trigger: "blur" },
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" },
    ],
    sort: [
      { required: true, message: "顺序不能为空", trigger: "blur" },
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
  // 查询状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  // 查询部门下拉树结构
  listScreenGroupTree().then((response: any) => {
    state.groupOptions = [];
    const group = { id: 0, name: '主类目', children: [] }
    group.children = response.data
    state.groupOptions.push(group)
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditScreenGroupModule",row)
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
        updateScreenGroup(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addScreenGroup(state.ruleForm).then((response) => {
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
