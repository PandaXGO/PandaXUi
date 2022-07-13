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
                        <el-form-item label="Mail分类" prop="category">
                            <el-radio-group v-model="ruleForm.category">
                                <el-radio
                                        v-for="dict in mailOptions"
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
                                    v-model="ruleForm.from"
                                    placeholder="请输入用户名"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="密码" prop="secret">
                            <el-input
                                    v-model="ruleForm.secret"
                                    placeholder="请输入密码"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="主机地址" prop="host">
                            <el-input
                                    v-model="ruleForm.host"
                                    placeholder="请输入主机地址"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="端口" prop="port">
                            <el-input-number v-model="ruleForm.port" :min="10" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
                        <el-form-item label="发件人" prop="nickname">
                            <el-input
                                    v-model="ruleForm.nickname"
                                    placeholder="请输入发件人"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" >
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
    import { updateResEmails, addResEmails } from "@/api/resource/email";
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
                if (row.mailId && row.mailId != undefined && row.mailId != 0) {
                    state.ruleForm = row;
                    state.ruleForm.mailId=row.mailId; // ID
                    // 更多参数
                    state.ruleForm.category=row.category;
                    state.ruleForm.host=row.host;
                    state.ruleForm.port=row.port;
                    state.ruleForm.from=row.from;
                    state.ruleForm.nickname=row.nickname;
                    state.ruleForm.secret=row.secret;
                    state.ruleForm.isSsl=row.isSsl;
                    state.ruleForm.status=row.status;
                } else {
                    initForm();
                }
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
            // 表单初始化，方法：`resetFields()` 无法使用
            const initForm = () => {
                state.ruleForm.mailId = 0; // ID
                // 更多参数初始化
                state.ruleForm.category="";
                state.ruleForm.host="";
                state.ruleForm.port=0;
                state.ruleForm.from="";
                state.ruleForm.nickname="";
                state.ruleForm.secret="";
                state.ruleForm.isSsl=false;
                state.ruleForm.status="0";
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
