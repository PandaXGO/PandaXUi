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
                    label-width="100px"
            >
                <el-row :gutter="35">
                    <el-col :span="24" >
                        <el-form-item label="Oss分类" prop="category">
                            <el-radio-group v-model="state.ruleForm.category">
                                <el-radio
                                        v-for="dict in state.ossOptions"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                >{{ dict.dictLabel }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="资源编号" prop="ossCode">
                            <el-input
                                    v-model="state.ruleForm.ossCode"
                                    placeholder="请输入资源编号"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="资源地址" prop="endpoint">
                            <el-input
                                    v-model="state.ruleForm.endpoint"
                                    placeholder="请输入资源地址"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="空间名" prop="bucketName">
                            <el-input
                                    v-model="state.ruleForm.bucketName"
                                    placeholder="请输入空间名"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="accessKey" prop="accessKey">
                            <el-input
                                    v-model="state.ruleForm.accessKey"
                                    placeholder="请输入accessKey"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="secretKey" prop="secretKey">
                            <el-input
                                    v-model="state.ruleForm.secretKey"
                                    placeholder="请输入secretKey"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="state.ruleForm.category == '2'">
                        <el-form-item label="appId" prop="appId">
                            <el-input
                                    v-model="state.ruleForm.appId"
                                    placeholder="请输入appId"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="state.ruleForm.category == '2'">
                        <el-form-item label="region" prop="region">
                            <el-input
                                    v-model="state.ruleForm.region"
                                    placeholder="请输入岗位名称"
                            />
                        </el-form-item>
                    </el-col>

                    <el-col :span="24" >
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
          <el-button type="primary" @click="onSubmit" :loading="state.loading"
          >编 辑</el-button
          >
        </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="ediResOsses">
import { reactive, nextTick, ref, unref, getCurrentInstance } from "vue";
import { updateResOsses, addResOsses } from "@/api/resource/oss";
import { ElMessage } from "element-plus";
const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref();
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  // 岗位对象
  ruleForm: {
    ossId: 0, // ID
    category: "",
    appId: "",
    accessKey: "",
    secretKey: "",
    bucketName: "",     // 空间名
    endpoint: "",
    ossCode: "",
    region: "",
    remark: "",     //备注
    status: "0",  //状态
  },
  // 状态数据字典
  statusOptions: [],
  // oss字典
  ossOptions: [],
  // 表单校验
  ruleRules: {
    category: [
      { required: true, message: "分类不能为空", trigger: "blur" }
    ],
    ossCode: [
      { required: true, message: "资源编号不能为空", trigger: "blur" }
    ],
    appId: [
      { required: true, message: "appId不能为空", trigger: "blur" }
    ],
    accessKey: [
      { required: true, message: "accessKey不能为空", trigger: "blur" }
    ],
    secretKey: [
      { required: true, message: "secretKey不能为空", trigger: "blur" }
    ],
    bucketName: [
      { required: true, message: "空间名称不能为空", trigger: "blur" }
    ],
    endpoint: [
      { required: true, message: "oss地址不能为空", trigger: "blur" }
    ]
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
  // 查询oss分类数据字典
  proxy.getDicts("res_oss_category").then((response: any) => {
    state.ossOptions = response.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditResOssesModule", row);
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
      if (state.ruleForm.ossId != undefined && state.ruleForm.ossId != 0) {
        updateResOsses(state.ruleForm).then((response:any) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addResOsses(state.ruleForm).then((response:any) => {
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
