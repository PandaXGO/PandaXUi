<template>
    <div class="app-container">
        <el-card shadow="always">
            <!-- 查询 -->
            <el-form
                    :model="queryParams"
                    ref="queryForm"
                    :inline="true"
                    label-width="68px"
            >
                <el-form-item label="资源编号" prop="ossCode">
                    <el-input
                            placeholder="请输入资源编号糊查询"
                            clearable
                            size="small"
                            @keyup.enter="handleQuery"
                            style="width: 240px"
                            v-model="queryParams.ossCode"
                    />
                </el-form-item>
                <el-form-item label="分类" prop="category">
                    <el-select
                            v-model="queryParams.category"
                            placeholder="分类"
                            clearable
                            size="small"
                    >
                        <el-option
                                v-for="dict in ossOptions"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select
                            v-model="queryParams.status"
                            placeholder="状态"
                            clearable
                            size="small"
                            style="width: 240px"
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
                            type="primary"
                            plain
                            size="mini"
                            @click="onOpenAddModule"
                    ><SvgIcon name="elementPlus" />新增</el-button
                    >
                </el-col>
                <el-col :span="1.5">
                    <el-button
                            type="danger"
                            plain
                            size="mini"
                            :disabled="multiple"
                            @click="onTabelRowDel"
                    ><SvgIcon name="elementDelete" />删除</el-button
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
                <el-table-column label="编号" align="center" prop="ossId" />
                <el-table-column
                        label="分类"
                        align="center"
                        width="80"
                        prop="category"
                >
                    <template #default="scope">
                        <el-tag
                                :type="scope.row.category === '0' ? 'danger' : scope.row.category === '0'? 'success':'warning'"
                                disable-transitions
                        >{{ ossFormat(scope.row)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="资源编号" align="center" prop="ossCode" />
                <el-table-column label="资源地址" align="center" width="250" prop="endpoint" />
                <el-table-column label="空间名" align="center" prop="bucketName" />
                <el-table-column label="accessKey" align="center" prop="accessKey" />
                <el-table-column label="secretKey" align="center" prop="secretKey" />
                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <el-switch
                                v-model="scope.row.status"
                                active-value="0"
                                inactive-value="1"
                                @click="handleStatusChange(scope.row)"
                        ></el-switch>
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
                                @click="onOpenEditModule(scope.row)"
                        ><SvgIcon name="elementEdit" />修改</el-button>
                        <el-button
                                size="mini"
                                type="text"
                                @click="onOpenDebugModule(scope.row)"
                        ><SvgIcon name="elementEdit" />调试</el-button>
                        <el-button
                                v-if="scope.row.parentId != 0"
                                size="mini"
                                type="text"
                                @click="onTabelRowDel(scope.row)"
                        ><SvgIcon name="elementDelete" />删除</el-button>
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
                        :page-size="queryParams.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
        </el-card>
        <!-- 添加或修改岗位对话框 -->
        <EditModule ref="editModuleRef" :title="title" />
    </div>
</template>

<script lang="ts">
    import {
        ref,
        toRefs,
        reactive,
        onMounted,
        getCurrentInstance,
        onUnmounted,
    } from "vue";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { listResOsses, delResOsses,changeOssStatus } from "/@/api/resource/oss";
    import EditModule from "./component/editModule.vue";

    export default {
        name: "index",
        components: { EditModule },
        setup() {
            const { proxy } = getCurrentInstance() as any;
            const editModuleRef = ref();
            const state = reactive({
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
                // 岗位表格数据
                tableData: [],
                // 总条数
                total: 0,
                // 状态数据字典
                statusOptions: [],
                // oss分类数据字典
                ossOptions: [],
                // 查询参数
                queryParams: {
                    // 页码
                    pageNum: 1,
                    // 每页大小
                    pageSize: 10,
                    // 以下为参数
                    category: undefined,
                    ossCode: undefined,
                    status: undefined,
                },
            });

            /** 查询岗位列表 */
            const handleQuery = () => {
                state.loading = true;
                listResOsses(state.queryParams).then((response:any) => {
                    state.tableData = response.data.data;
                    state.total = response.data.total;
                    state.loading = false;
                });
            };
            /** 重置按钮操作 */
            const resetQuery = () => {
                state.queryParams.category = undefined;
                state.queryParams.ossCode = undefined;
                state.queryParams.status = undefined;
                handleQuery();
            };

            const handleCurrentChange = (val:number) => {
                state.queryParams.pageNum = val
                handleQuery()
            }
            const handleSizeChange = (val:number) => {
                state.queryParams.pageSize = val
                handleQuery()
            }

            const statusFormat = (row: any) => {
                return proxy.selectDictLabel(state.statusOptions, row.status);
            };

            const ossFormat = (row: any) => {
                return proxy.selectDictLabel(state.ossOptions, row.category);
            };

            // 打开新增弹窗
            const onOpenAddModule = (row: object) => {
                row = [];
                state.title = "添加ResOss";
                editModuleRef.value.openDialog(row);
            };
            // 打开编辑弹窗
            const onOpenEditModule = (row: object) => {
                state.title = "修改ResOss";
                editModuleRef.value.openDialog(row);
            };
            // 打开调试弹窗
            const onOpenDebugModule = (row: object) => {
                console.log(row)
            };
            // 状态修改
            const handleStatusChange = (row: any) => {
                let text = row.status === "0" ? "启用" : "停用";
                ElMessageBox({
                    message: '确认要"' + text + '""' + row.jobName + '"Oss吗?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(function () {
                        return changeOssStatus({ossId: row.ossId,status: row.status});
                    })
                    .then(() => {
                        ElMessage({
                            message: text + "成功",
                            type: 'success',
                        });
                    })
                    .catch(function () {
                        row.status = row.status === "0" ? "1" : "0";
                    });
            };
            /** 删除按钮操作 */
            const onTabelRowDel = (row: any) => {
                const ossIds = row.ossId || state.ids;
                ElMessageBox({
                    message: '是否确认删除岗位编号为"' + ossIds + '"的数据项?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    return delResOsses(ossIds).then(() => {
                        handleQuery();
                        ElMessage.success("删除成功");
                    });
                });
            };
            // 多选框选中数据
            const handleSelectionChange = (selection: any) => {
                state.ids = selection.map((item: any) => item.ossId);
                state.single = selection.length != 1;
                state.multiple = !selection.length;
            };
            // 页面加载时
            onMounted(() => {
                // 查询岗位信息
                handleQuery();
                // 查询状态数据字典
                proxy.getDicts("sys_normal_disable").then((response: any) => {
                    state.statusOptions = response.data;
                });
                proxy.getDicts("res_oss_category").then((response: any) => {
                    state.ossOptions = response.data;
                });
                proxy.mittBus.on("onEditResOssesModule", (res: any) => {
                    handleQuery();
                });
            });
            // 页面卸载时
            onUnmounted(() => {
                proxy.mittBus.off("onEditResOssesModule");
            });
            return {
                editModuleRef,
                ossFormat,
                handleSelectionChange,
                handleQuery,
                handleCurrentChange,
                handleSizeChange,
                resetQuery,
                statusFormat,
                onOpenAddModule,
                onOpenEditModule,
                onOpenDebugModule,
                handleStatusChange,
                onTabelRowDel,
                ...toRefs(state),
            };
        },
    };
</script>
