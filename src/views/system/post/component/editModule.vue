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
        <el-row :gutter="35">
          <el-col :span="24" >
            <el-form-item label="岗位名称" prop="postName">
              <el-input
                v-model="ruleForm.postName"
                placeholder="请输入岗位名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="岗位编码" prop="postCode">
              <el-input
                v-model="ruleForm.postCode"
                placeholder="请输入编码名称"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24" >
            <el-form-item label="岗位顺序" prop="sort">
              <el-input-number
                v-model="ruleForm.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" >
            <el-form-item label="岗位状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio
                  v-for="dict in statusOptions"
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
                v-model="ruleForm.remark"
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
          <el-button type="primary" @click="onSubmit" :loading="loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updatePost, addPost } from "@/api/system/post";
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
  // 岗位对象
  ruleForm: {
    postId: 0, // 岗位ID
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
