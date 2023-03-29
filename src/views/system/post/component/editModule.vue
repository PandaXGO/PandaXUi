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
        <el-row :gutter="35">
          <el-col :span="24" >
            <el-form-item label="岗位名称" prop="postName">
              <el-input
                v-model="state.ruleForm.postName"
                placeholder="请输入岗位名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="岗位编码" prop="postCode">
              <el-input
                v-model="state.ruleForm.postCode"
                placeholder="请输入编码名称"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="state.ruleForm.tenantId > 0" :span="24" >
            <el-form-item label="归属租户" prop="tenantId">
              <el-cascader
                  v-model="state.ruleForm.tenantId"
                  :options="state.tenantOptions"
                  :props="{
                        label: 'tenantName',
                        value: 'id',
                        checkStrictly: true,
                        emitPath: false,
                      }"
                  class="w100"
                  clearable
                  filterable
                  placeholder="请选择归属租户"
                  :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>

          <el-col :span="24" >
            <el-form-item label="岗位顺序" prop="sort">
              <el-input-number
                v-model="state.ruleForm.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="岗位状态" prop="status">
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
          <el-col :span="24" >
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="state.ruleForm.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>
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
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updatePost, addPost } from "@/api/system/post";
import { ElMessage } from "element-plus";
import {allSysTenants} from "@/api/system/tenant";

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
  // 岗位对象
  ruleForm: {
    postId: 0, // 岗位ID
    tenantId: 0, //租户
    postName: "", // 岗位名称
    postCode: "",// 岗位编码
    sort: 0, // 岗位排序
    status: "", //岗位状态
    remark: "", // 备注
  },
  // 岗位状态数据字典
  statusOptions: [],
  // 岗位树选项
  deptOptions: [],
  tenantOptions: [],
  // 表单校验
  ruleRules: {
    postName: [
      { required: true, message: "岗位名称不能为空", trigger: "blur" }
    ],
    postCode: [
      { required: true, message: "岗位编码不能为空", trigger: "blur" }
    ],
    postSort: [
      { required: true, message: "岗位顺序不能为空", trigger: "blur" }
    ]
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
  getTenants();
  // 查询岗位状态数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
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

const getTenants = async () => {
  allSysTenants().then((response) => {
    state.tenantOptions = response.data;
  });
};
// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if (state.ruleForm.postId != undefined && state.ruleForm.postId != 0) {
        updatePost(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addPost(state.ruleForm).then((response) => {
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
