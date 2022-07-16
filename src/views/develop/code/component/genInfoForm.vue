<template>
    <el-form ref="genInfoFormRef" :model="info" :rules="ruleRules" label-width="150px">
        <el-row>
            <el-col :span="12">
                <el-form-item prop="packageName">
                    <template #label>
                    指定应用名
                    <el-tooltip content="应用名，例如：在app文件夹下将该功能发到那个应用中，默认：system" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-input v-model="info.packageName" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="moduleName">
                    <template #label>
                    生成模块名
                    <el-tooltip content="可理解为子系统名，接口路径、前端文件夹名称和js名称使用 例如 sys-user" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                  <el-input v-model="info.moduleName" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="businessName">
                    <template #label>
                    生成业务名
                    <el-tooltip content="可理解为功能英文名,使用在 js路径，权限标识等，例如 user" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                  <el-input v-model="info.businessName" />
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="functionName">
                    <template #label>
                    生成功能名
                    <el-tooltip content="用作类描述（函数名），例如 User" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-input v-model="info.functionName" />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script lang="ts">
import {getCurrentInstance, reactive, ref, toRefs} from "vue";

export default {
        name: 'GenInfoForm',
        props: {
            info: {
                type: Object,
                default: null
            }
        },
        setup() {
            const { proxy } = getCurrentInstance() as any;
            const genInfoFormRef = ref();
            const state = reactive({
                ruleRules: {
                    tableName: [
                        { required: true, message: '请输入表名称', trigger: 'blur' }
                    ],
                    tableComment: [
                        { required: true, message: '请输入表描述', trigger: 'blur' }
                    ],
                    className: [
                        { required: true, message: '请输入实体类名称', trigger: 'blur' }
                    ],
                    functionAuthor: [
                        { required: true, message: '请输入作者', trigger: 'blur' }
                    ]
                },
            })
            return {
                genInfoFormRef,
                ...toRefs(state),
            };
        },
}
</script>
