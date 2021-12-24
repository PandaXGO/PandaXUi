<template>
    <div class="app-container">
        <!-- 查询 -->
        <el-form
                :model="queryParams"
                ref="queryForm"
                :inline="true"
                label-width="68px"
        >
            <el-form-item label="任务名称" prop="jobName">
                <el-input
                        placeholder="请输入任务名称模糊查询"
                        clearable
                        size="small"
                        @keyup.enter="handleQuery"
                        style="width: 240px"
                        v-model="queryParams.jobName"
                />
            </el-form-item>
            <el-form-item label="任务组名" prop="jobGroup">
                <el-select
                        v-model="queryParams.jobGroup"
                        placeholder="请选择任务组名"
                        clearable
                        size="small"
                >
                    <el-option
                            v-for="dict in jobGroupOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="任务状态" prop="status">
                <el-select
                        v-model="queryParams.status"
                        placeholder="请选择任务状态"
                        clearable
                        size="small"
                >
                    <el-option
                            v-for="dict in statusOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作按钮 -->
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="onTabelRowDel"
                >删除</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="el-icon-delete"
                        size="mini"
                        @click="handleClean"
                >清空</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                >导出</el-button
                >
            </el-col>
        </el-row>
        <!--数据表格-->
        <el-table
                v-loading="loading"
                :data="tableData"
                @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
                    label="日志编号"
                    width="80"
                    align="center"
                    prop="jobLogId"
            />
            <el-table-column
                    label="任务名称"
                    align="center"
                    prop="jobName"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="任务组名"
                    align="center"
                    prop="jobGroup"
                    :formatter="jobGroupFormat"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="调用目标字符串"
                    align="center"
                    prop="invokeTarget"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="日志信息"
                    align="center"
                    prop="jobMessage"
                    :show-overflow-tooltip="true"
            />
            <el-table-column
                    label="执行状态"
                    align="center"
                    prop="status"
                    :formatter="statusFormat"
            />
            <el-table-column
                    label="执行时间"
                    align="center"
                    prop="createTime"
                    width="180"
            >
                <template #default="scope">
                    <span>{{ parseTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
            >
                <template #default="scope">
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-view"
                            @click="handleView(scope.row)"
                    >详细</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页设置-->
        <el-pagination
                v-show="total > 0"
                :total="total"
                :current-page="queryParams.pageNo"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
        />

        <!-- 调度日志详细 -->
        <el-dialog title="调度日志详细" v-model="open" width="700px" append-to-body>
            <el-form
                    ref="ruleFormRef"
                    :model="modelForm"
                    label-width="100px"
                    size="mini"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="日志序号：">{{
                            modelForm.jobLogId
                            }}</el-form-item>
                        <el-form-item label="任务名称：">{{
                            modelForm.jobName
                            }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务分组：">{{
                            modelForm.jobGroup
                            }}</el-form-item>
                        <el-form-item label="执行时间：">{{
                            modelForm.createTime
                            }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="调用方法：">{{
                            modelForm.invokeTarget
                            }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="日志信息：">{{
                            modelForm.jobMessage
                            }}</el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="执行状态：">
                            <div v-if="modelForm.status == 0">正常</div>
                            <div v-else-if="modelForm.status == 1">失败</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="异常信息：" v-if="modelForm.status == 1">{{
                            form.exceptionInfo
                            }}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="open = false">关 闭</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {
        reactive,
        onMounted,
        onUnmounted,
        toRefs,
        ref,
        getCurrentInstance,
    } from "vue";
    import {
        listJobLog,
        delJobLog,
        exportJobLog,
        cleanJobLog,
    } from "@/api/monitor/jobLog";
    import { ElMessageBox, ElMessage } from "element-plus";

    export default {
        name: "JobLog",
        setup() {
            const { proxy } = getCurrentInstance() as any;
            const ruleFormRef = ref<HTMLElement | null>(null);
            const state = reactive({
                // 参数
                // 总条数
                total: 0,
                // 列表表格数据
                tableData: [],
                // 遮罩层
                loading: true,
                // 选中数组
                ids: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 弹出层标题
                title: "",
                // 是否显示弹出层
                open: false,
                // 表单参数
                modelForm: {},
                // 任务组名字典
                jobGroupOptions: [],
                //任务名称字典
                JobOptions: [],
                // 状态字典
                statusOptions: [],
                // 日期范围
                dateRange: [],
                // 查询参数
                queryParams: {
                    pageNo: 1,
                    pageSize: 10,
                    jobName: undefined,
                    jobGroup: undefined,
                    status: undefined,
                },
                // 表单参数对象
                //// 表单校验
            });
            // 定义方法
            /** 重置按钮操作 */
            const resetQuery = () => {
                state.queryParams.jobName = undefined;
                state.queryParams.jobGroup = undefined;
                state.queryParams.status = undefined;
                handleQuery();
            };
            /** 查询定时任务列表 */
            const handleQuery = () => {
                state.loading = true;
                listJobLog(proxy.addDateRange(state.queryParams, state.dateRange)).then(
                    (response) => {
                        state.tableData = response.data.records;
                        state.total = response.data.total;
                        state.loading = false;
                    }
                );
            };

            /** 删除按钮操作 */
            const onTabelRowDel = (row: any) => {
                const jobLogIds = row.jobLogId || state.ids;
                ElMessageBox({
                    message: '是否确认删除定时任务编号为"' + jobLogIds + '"的数据项?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    return delJobLog(jobLogIds).then(() => {
                        handleQuery();
                        ElMessage.success("删除成功");
                    });
                });
            };
            /** 清空按钮操作 */
            const handleClean = () => {
                ElMessageBox({
                    message: "是否确认清空所有调度日志数据项?",
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(function () {
                        return cleanJobLog();
                    })
                    .then(() => {
                        handleQuery();
                        ElMessage.success("清空成功");
                    });
            };
            // 多选框选中数据
            const handleSelectionChange = (selection: any) => {
                state.ids = selection.map((item: any) => item.jobLogId);
                state.single = selection.length != 1;
                state.multiple = !selection.length;
            };

            //分页页面大小发生变化
            const handleSizeChange = (val: any) => {
                state.queryParams.pageSize = val;
                handleQuery();
            };
            //当前页码发生变化
            const handleCurrentChange = (val: any) => {
                state.queryParams.pageNo = val;
                handleQuery();
            };
            // 定时任务状态定时任务翻译
            const statusFormat = (row: any, column: any) => {
                return proxy.selectDictLabel(state.statusOptions, row.status);
            };
            // 任务组名字典翻译
            const jobGroupFormat = (row: any, column: any) => {
                return proxy.selectDictLabel(state.jobGroupOptions, row.status);
            };
            /** 详细按钮操作 */
            const handleView = (row: any) => {
                state.open = true;
                state.modelForm = row;
            };
            // 页面加载时调用
            onMounted(() => {
                //   proxy.mittBus.on("onEditPostModule", (res: any) => {
                //     handleQuery();
                //   });
                // 查询列表数据信息
                handleQuery();
                proxy.getDicts("sys_job_status").then((response: any) => {
                    state.statusOptions = response.data;
                });
                proxy.getDicts("sys_job_group").then((response: any) => {
                    state.jobGroupOptions = response.data;
                });
            });
            /** 导出按钮操作 */
            const handleExport = () => {
                const queryParams = state.queryParams;
                ElMessageBox({
                    message: "是否确认导出所有调度日志数据项?",
                    title: "警告",
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(function () {
                        return exportJobLog(queryParams);
                    })
                    .then((response) => {
                        console.log("导出按钮操作", response);
                        proxy.download(response.data);
                    });
            };

            // 页面卸载时
            onUnmounted(() => {
                //   proxy.mittBus.off("onEditPostModule");
            });

            return {
                ruleFormRef,
                handleExport,
                resetQuery,
                handleQuery,
                handleClean,
                statusFormat,
                jobGroupFormat,
                handleView,
                handleSelectionChange,
                handleCurrentChange,
                handleSizeChange,
                onTabelRowDel,
                ...toRefs(state),
            };
        },
    };
</script>
