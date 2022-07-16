<template>
    <el-dialog v-model="isShowDialog" title="编辑表结构" width="90%" center>
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="basic">
                <BasicInfoForm ref="basicInfoRef" :info="info" />
            </el-tab-pane>
            <el-tab-pane label="字段信息" name="cloum">
                <el-table ref="dragTable" :data="columns" row-key="columnId" height="450px">
                    <el-table-column label="序号" type="index" width="50" />
                    <el-table-column
                            label="字段列名"
                            prop="columnName"
                            width="150"
                            :show-overflow-tooltip="true"
                    />
                    <el-table-column fixed label="字段描述" width="150">
                        <template #default="scope">
                            <el-input v-model="scope.row.columnComment" />
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="物理类型"
                            prop="columnType"
                            width="120"
                            :show-overflow-tooltip="true"
                    />
                    <el-table-column label="go类型" width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.goType">
                                <el-option label="int" value="int" />
                                <el-option label="uint" value="uint" />
                                <el-option label="int64" value="int64" />
                                <el-option label="uint64" value="uint64" />
                                <el-option label="float64" value="float64" />
                                <el-option label="string" value="string" />
                                <el-option label="Time" value="Time" />
                                <el-option label="byte" value="byte" />
                                <!--<el-option label="bool" value="bool" /> -->
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="go属性" width="150">
                        <template #default="scope">
                            <el-input v-model="scope.row.goField" />
                        </template>
                    </el-table-column>
                    <el-table-column label="json属性" width="150">
                        <template #default="scope">
                            <el-input v-model="scope.row.jsonField" />
                        </template>
                    </el-table-column>

                    <el-table-column label="插入" width="50">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.isInsert" true-label="1" false-label="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="编辑" width="70"  :cell-style="{'text-align':'center'}">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.isEdit" true-label="1" false-label="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="列表" width="70"  :cell-style="{'text-align':'center'}">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.isList" true-label="1" false-label="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="查询" width="70"  :cell-style="{'text-align':'center'}">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.isQuery" true-label="1" false-label="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="必填" width="50">
                        <template #default="scope">
                            <el-checkbox v-model="scope.row.isRequired" true-label="1" false-label="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="查询方式" width="120">
                        <template #default="scope">
                            <el-select v-model="scope.row.queryType">
                                <el-option label="=" value="EQ" />
                                <el-option label="!=" value="NE" />
                                <el-option label=">" value="GT" />
                                <el-option label=">=" value="GTE" />
                                <el-option label="<" value="LT" />
                                <el-option label="<=" value="LTE" />
                                <el-option label="LIKE" value="LIKE" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="显示类型" width="140">
                        <template #default="scope">
                            <el-select v-model="scope.row.htmlType">
                                <el-option label="文本框" value="input" />
                                <el-option label="下拉框" value="select" />
                                <el-option label="开关" value="switch" />
                                <el-option label="单选框" value="radio" />
                                <el-option label="多选框" value="checkbox" />
                                <el-option label="文件选择" value="file" />
                                <el-option label="文本域" value="textarea" />
                                <el-option label="日期控件" value="datetime" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="字典类型" width="160">
                        <template #default="scope">
                            <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="dict in dictOptions"
                                        :key="dict.dictType"
                                        :label="dict.dictName"
                                        :value="dict.dictType"
                                >
                                    <span style="float: left">{{ dict.dictName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="关系表" width="160">
                        <template #default="scope">
                            <el-select v-model="scope.row.linkTableName" clearable filterable placeholder="请选择">
                                <el-option
                                        v-for="table in tableTree"
                                        :key="table.tableName"
                                        :label="table.tableName"
                                        :value="table.tableName"
                                >
                                    <span style="float: left">{{ table.tableName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ table.tableComment }}</span>
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="生成信息" name="genInfo">
                <GenInfoForm ref="genInfoRef" :info="info" />
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
                <el-button @click="closeDialog">返回</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
    import {ref, toRefs, getCurrentInstance, reactive} from "vue";
    import { getTableInfo, updateTable, getTableTree } from '@/api/gen/table'
    import { listType as getDictOptionselect } from '@/api/system/dict/type'

    import BasicInfoForm from './basicInfoForm.vue'
    import GenInfoForm from './genInfoForm.vue'
    import { ElMessage } from "element-plus";

    export default {
        name: 'genEdit',
        components: {
            BasicInfoForm,
            GenInfoForm
        },
        setup() {
            const { proxy } = getCurrentInstance();
            const genInfoRef = ref()
            const basicInfoRef = ref()
            const state = reactive({
                // 是否显示弹出层
                isShowDialog: false,
                loading: false,
                // 选中选项卡的 name
                activeName: 'cloum',
                // 表列信息
                columns: [],
                tableTree: [],
                // 字典信息
                dictOptions: [],
                // 表详细信息
                info: {}
            });


            // 打开弹窗
            const openDialog = (row) => {
                if (row.tableId) {
                    // 获取表详细信息
                    getTableInfo(row.tableId).then((res) => {
                        let columns = res.data.list.filter((item)=>{
                            return !['createTime','update_time','delete_time'].includes(item.columnName)
                        })
                        state.columns = columns;
                        state.info = res.data.info;
                        state.info.columns = state.columns;
                        state.isShowDialog = true;
                    });
                    state.loading = false;
                    /** 查询字典下拉列表 */
                    getDictOptionselect({pageNum: 1, pageSize: 100}).then(response => {
                        state.dictOptions = response.data.data;
                    });
                    getTableTree().then(response => {
                        state.tableTree = response.data
                        if (state.tableTree.length === 0) {
                          state.tableTree.unshift({ tableId: 0, className: '请选择' })
                        }
                    })
                }

            };

            /** 提交按钮 */
            const submitForm = () => {
                const basicForm = basicInfoRef.value.basicInfoForm
                const genForm = genInfoRef.value.genInfoFormRef
                Promise.all([basicForm, genForm].map(getFormPromise)).then(res => {
                    const validateResult = res.every(item => !!item)
                    if (validateResult) {
                        const genTable = Object.assign({}, basicInfoRef.value.info, genInfoRef.value.info)
                        genTable.columns = state.columns
                        state.loading = true;
                        updateTable(genTable).then((res) =>{
                                ElMessage.success("修改成功");
                            state.loading = false;
                                closeDialog();
                        });
                    } else {
                        ElMessage.error('表单校验未通过，请重新检查提交内容')
                    }
                })
            };
            const getTables = () => {
                getTableTree().then(response => {
                    state.tableTree = response.data
                    state.tableTree.unshift({ tableId: 0, className: '请选择' })
                })
            };
            const getTablesCol = (tableName) => {
                return state.tableTree.filter(function(item) {
                    if (item.tableName === tableName) {
                        return item.columns
                    }
                })
            };
            const getFormPromise = (form) => {
                return new Promise(resolve => {
                    form.validate((res) => {
                        resolve(res)
                    })
                })
            };
            // 关闭弹窗
            const closeDialog = (row) => {
                proxy.mittBus.emit("onEditTableModule", row);
                state.isShowDialog = false;
            };
            return {
                genInfoRef,
                basicInfoRef,
                openDialog,
                closeDialog,
                getTablesCol,
                getTables,
                submitForm,
                getFormPromise,
                ...toRefs(state),
            };
        },
    }
</script>