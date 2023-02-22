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
                        <el-form-item label="Mail分类" prop="category">
                            <el-radio-group v-model="state.ruleForm.category">
                                <el-radio
                                        v-for="dict in state.mailOptions"
                                        :key="dict.dictValue"
                                        :label="dict.dictValue"
                                >{{ dict.dictLabel }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="用户名称" prop="from">
                            <el-input
                                    v-model="state.ruleForm.from"
                                    placeholder="请输入用户名"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="密码" prop="secret">
                            <el-input
                                    v-model="state.ruleForm.secret"
                                    placeholder="请输入密码"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="主机地址" prop="host">
                            <el-input
                                    v-model="state.ruleForm.host"
                                    placeholder="请输入主机地址"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="端口" prop="port">
                            <el-input-number v-model="state.ruleForm.port" :min="10" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="发件人" prop="nickname">
                            <el-input
                                    v-model="state.ruleForm.nickname"
                                    placeholder="请输入发件人"
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

<script lang="ts" setup name="editResEmails">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { updateResEmails, addResEmails } from "@/api/resource/email";
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
  ruleForm: {
    mailId: 0, // ID
    category: "",
    host: "",
    port: 0,
    from: "",
    nickname: "",
    secret: "",
    isSsl: false,
    status: "0"  //状态
  },
  // 状态数据字典
  statusOptions: [],
  // mail字典
  mailOptions: [],
  // 表单校验
  ruleRules: {
    host: [
      { required: true, message: "邮件服务器不能为空", trigger: "blur" }
    ],
    port: [
      { required: true, message: "端口号不能为空", trigger: "blur" }
    ],
    from: [
      { required: true, message: "账号不能为空", trigger: "blur" }
    ],
    secret: [
      { required: true, message: "密码不能为空", trigger: "blur" }
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
  // 查询状态数据字典
  proxy.getDicts("res_mail_category").then((response: any) => {
    state.mailOptions = response.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditResEmailsModule", row);
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
      if (state.ruleForm.mailId != undefined && state.ruleForm.mailId != 0) {
        updateResEmails(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addResEmails(state.ruleForm).then((response) => {
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
