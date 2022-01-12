<template>
    <el-form ref="genInfoFormRef" :model="info" :rules="ruleRules" label-width="150px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="生成模板" prop="tplCategory">
                    <el-select v-model="info.tplCategory">
                        <el-option label="单表（增删改查）" value="crud" />
                        <el-option label="关系表（增删改查）" value="tree" />
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="12">
                <el-form-item prop="packageName">
                    <template #label>
                    指定应用名
                    <el-tooltip content="应用名，例如：在app文件夹下将该功能发到那个应用中，默认：admin" placement="top">
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
                    <el-tooltip content="可理解为子系统名，例如 system" placement="top">
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
                    <el-tooltip content="可理解为功能英文名，例如 user" placement="top">
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
                    <el-tooltip content="用作类描述，例如 用户" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-input v-model="info.functionName" />
                </el-form-item>
            </el-col>
        </el-row>

        <el-row v-show="info.tplCategory == 'tree'">
            <h4 class="form-header">其他信息</h4>
            <el-divider></el-divider>
            <el-col :span="12">
                <el-form-item>
                    <template #label>
                    树编码字段
                    <el-tooltip content="树显示的编码字段名， 如：dept_id" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-select v-model="info.treeCode" placeholder="请选择">
                        <el-option
                                v-for="column in info.columns"
                                :key="column.columnName"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item>
                    <template #label>
                    树父编码字段
                    <el-tooltip content="树显示的父编码字段名， 如：parent_Id" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-select v-model="info.treeParentCode" placeholder="请选择">
                        <el-option
                                v-for="column in info.columns"
                                :key="column.columnName"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                        />
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item>
                    <template #label>
                    树名称字段
                    <el-tooltip content="树节点的显示名称字段名， 如：dept_name" placement="top">
                        <i class="fa fa-exclamation-circle"></i>
                    </el-tooltip>
                    </template>
                    <el-select v-model="info.treeName" placeholder="请选择">
                        <el-option
                                v-for="column in info.columns"
                                :key="column.columnName"
                                :label="column.columnName + '：' + column.columnComment"
                                :value="column.columnName"
                        />
                    </el-select>
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
