<template>
    <div class="system-user-container app-container">
        <el-card shadow="always">
            <!-- 查询 -->
            <el-form
                    :model="queryParams"
                    ref="queryForm"
                    :inline="true"
                    label-width="68px"
            >
                <el-form-item label="系统模块" prop="title">
                    <el-input
                            placeholder="请输入系统模块模糊查询"
                            clearable
                            size="small"
                            @keyup.enter="handleQuery"
                            style="width: 240px"
                            v-model="queryParams.title"
                    />
                </el-form-item>
                <el-form-item label="操作人员" prop="operName">
                    <el-input
                            placeholder="请输入操作人员模糊查询"
                            clearable
                            size="small"
                            @keyup.enter="handleQuery"
                            style="width: 240px"
                            v-model="queryParams.operName"
                    />
                </el-form-item>
                <el-form-item label="类型" prop="businessType">
                    <el-select
                            v-model="queryParams.businessType"
                            placeholder="操作类型"
                            clearable
                            size="small"
                            style="width: 240px"
                    >
                        <el-option
                                v-for="dict in typeOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                            type="primary"
                            size="mini"
                            @click="handleQuery"
                    >
                        <SvgIcon name="elementSearch" />
                        搜索</el-button>
                    <el-button size="mini" @click="resetQuery">
                        <SvgIcon name="elementRefresh" />
                        重置
                    </el-button>
                </el-form-item>
            </el-form>

            <!-- 操作按钮 -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button
                            type="danger"
                            plain
                            size="mini"
                            :disabled="multiple"
                            @click="onTabelRowDel"
                            v-auth="'log:operation:delete'"
                    ><SvgIcon name="elementDelete" />删除</el-button
                    >
                </el-col>
                <el-col :span="1.5">
                    <el-button
                            type="danger"
                            plain
                            size="mini"
                            @click="handleClean"
                            v-auth="'log:operation:clean'"
                    ><SvgIcon name="elementDelete" />清空</el-button
                    >
                </el-col>
            </el-row>

            <!--数据表格-->
            <el-table
                    v-loading="loading"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="日志编号" align="center" prop="operId"/>
                <el-table-column label="系统模块" align="center" prop="title"/>
                <el-table-column
                        label="操作类型"
                        align="center"
                        prop="businessType"
                        :formatter="typeFormat"
                />
                <el-table-column label="请求方法" align="center" prop="method"/>
                <el-table-column label="操作人员" align="center" prop="operName"/>
                <el-table-column
                        label="主机"
                        align="center"
                        prop="operIp"
                        width="130"
                        :show-overflow-tooltip="true"
                />
                <el-table-column
                        label="操作地点"
                        align="center"
                        prop="operLocation"
                        :show-overflow-tooltip="true"
                />
                <el-table-column
                        label="操作状态"
                        align="center"
                        prop="status"
                >
                    <template #default="scope">
                        <el-tag
                                :type="scope.row.status === '1' ? 'danger' : 'success'"
                                disable-transitions
                        >{{ statusFormat(scope.row)}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作日期"
                        align="center"
                >
                    <template #default="scope">
                        <span>{{ dateStrFormat(scope.row.create_time) }}</span>
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
                                @click="handleView(scope.row)"
                        ><SvgIcon name="elementView" />详细</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页设置-->
            <div v-show="total > 0">
                <el-divider></el-divider>
                <el-pagination
                        background
                        :total="total"
                        :current-page="queryParams.pageNum"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="queryParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
        <!-- 操作日志详细 -->
        <el-dialog title="操作日志详细" v-model="open" width="700px" append-to-body>
            <el-form
                    ref="ruleFormRef"
                    :model="modelForm"
                    label-width="100px"
                    size="mini"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="操作模块："
                        >{{ modelForm.title }} / {{ typeFormat(modelForm) }}
                        </el-form-item
                        >
                        <el-form-item label="登录信息："
                        >{{ modelForm.operName }} / {{ modelForm.operIp }} /
                            {{ modelForm.operLocation }}
                        </el-form-item
                        >
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="请求地址：">{{
                            modelForm.operUrl
                            }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="操作方法：">{{
                            modelForm.method
                            }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="请求参数：">{{
                            modelForm.operParam
                            }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作状态：">
                            {{ statusFormat(modelForm) }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作时间：">{{
                            dateStrFormat(modelForm.create_time)
                            }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="异常信息：" v-if="modelForm.status === '1'">{{
                            modelForm.errorMsg
                            }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="open = false" size="small">关 闭</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import {reactive, onMounted, toRefs, ref, getCurrentInstance} from "vue";
    import {
        listOperInfo,
        delOperInfo,
        cleanOpernfo,
    } from "/@/api/log/oper";
    import {ElMessageBox, ElMessage} from "element-plus";

    export default {
        name: "Operlog",
        setup() {
            const {proxy} = getCurrentInstance() as any;
            const ruleFormRef = ref<HTMLElement | null>(null);
            const state = reactive({
                // 遮罩层
                loading: true,
                // 总条数
                total: 0,
                // 列表表格数据
                tableData: [],
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
                // 类型数据字典
                typeOptions: [],
                // 类型数据字典
                statusOptions: [],
                // 查询参数
                queryParams: {
                    pageNo: 1,
                    pageSize: 10,
                    title: undefined,
                    operName: undefined,
                    businessType: undefined,
                },
            });

            /** 查询定时任务列表 */
            const handleQuery = () => {
                state.loading = true;
                listOperInfo(state.queryParams).then(
                    (response) => {
                        state.tableData = response.data.data;
                        state.total = response.data.total;
                        state.loading = false;
                    }
                );
            };

            /** 重置按钮操作 */
            const resetQuery = () => {
                state.queryParams.title = undefined;
                state.queryParams.operName = undefined;
                state.queryParams.businessType = undefined;
                handleQuery();
            };

            /** 清空按钮操作 */
            const handleClean = () => {
                ElMessageBox({
                    message: "是否确认清空所有操作日志数据项?",
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(function () {
                        return cleanOpernfo();
                    })
                    .then(() => {
                        handleQuery();
                        ElMessage.success("清空成功");
                    });
            };

            /** 删除按钮操作 */
            const onTabelRowDel = (row: any) => {
                const operIds = row.operId || state.ids;
                ElMessageBox({
                    message: '是否确认删除日志编号为"' + operIds + '"的数据项?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    return delOperInfo(operIds).then(() => {
                        handleQuery();
                        ElMessage.success("删除成功");
                    });
                });
            };

            /** 详细按钮操作 */
            const handleView = (row: any) => {
                state.open = true;
                state.modelForm = row;
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

            // 操作日志状态字典翻译
            const statusFormat = (row: any, column: any) => {
                return proxy.selectDictLabel(state.statusOptions, row.status);
            };

            // 操作日志类型字典翻译
            const typeFormat = (row: any, column: any) => {
                return proxy.selectDictLabel(state.typeOptions, row.businessType);
            };
            // 多选框选中数据
            const handleSelectionChange = (selection: any) => {
                state.ids = selection.map((item: any) => item.operId);
                state.single = selection.length != 1;
                state.multiple = !selection.length;
            };

            // 页面加载时调用
            onMounted(() => {
                //   proxy.mittBus.on("onEditPostModule", (res: any) => {
                //     handleQuery();
                //   });
                // 查询列表数据信息
                handleQuery();
                proxy.getDicts("sys_common_status").then((response: any) => {
                    state.statusOptions = response.data;
                });
                proxy.getDicts("sys_oper_type").then((response: any) => {
                    state.typeOptions = response.data;
                });
            });

            return {
                ruleFormRef,
                statusFormat,
                typeFormat,
                handleView,
                handleSelectionChange,
                handleSizeChange,
                handleCurrentChange,
                resetQuery,
                handleQuery,
                handleClean,
                onTabelRowDel,
                ...toRefs(state),
            };
        },
    };
</script>

<style>
</style>