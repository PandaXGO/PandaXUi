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
                <el-form-item label="过期时间" prop="expireTime">
                    <el-date-picker clearable style="width: 200px"
                                    v-model="queryParams.expireTime"
                                    type="datetime"
                                    placeholder="选择过期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="租户名" prop="tenantName">
                    <el-input
                            v-model="queryParams.tenantName"
                            placeholder="请输入租户名"
                            clearable
                            @keyup.enter.native="handleQuery"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">
                        <SvgIcon name="elementSearch" />搜索</el-button>
                    <el-button @click="resetQuery">
                        <SvgIcon name="elementRefresh" />
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <span class="card-header-text">岗位列表</span>
                    <div>
                        <el-button
                                type="primary"
                                plain
                                v-auth="'system:tenant:add'"
                                @click="onOpenAddModule"
                        ><SvgIcon name="elementPlus" />新增</el-button>
                        <el-button
                                type="danger"
                                plain
                                v-auth="'system:tenant:delete'"
                                :disabled="multiple"
                                @click="onTabelRowDel"
                        ><SvgIcon name="elementDelete" />删除</el-button>
                    </div>
                </div>
            </template>
            <!--数据表格-->
            <el-table
                    v-loading="loading"
                    :data="tableData"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="租户名" align="center" prop="tenantName" />
                <el-table-column label="过期时间" align="center" prop="expireTime" width="180">
                    <template #default="scope">
                        <span>{{ dateStrFormat(scope.row.expireTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建事件" align="center" prop="createTime" width="180">
                    <template #default="scope">
                        <span>{{ dateStrFormat(scope.row.createTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" />
                <el-table-column label="编号" align="center" prop="id" />
                <el-table-column
                        label="操作"
                        align="center"
                        class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-popover  placement="left">
                            <template #reference>
                                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
                            </template>
                            <div>
                                <el-button text type="primary" v-auth="'system:tenant:edit'" @click="onOpenEditModule(scope.row)"
                                ><SvgIcon name="elementEdit" />修改</el-button>
                            </div>
                            <div>
                                <el-button text type="primary" v-auth="'system:tenant:delete'" @click="onTabelRowDel(scope.row)"
                                ><SvgIcon name="elementDelete" />删除</el-button>
                            </div>
                        </el-popover>
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
    import { listSysTenants, delSysTenants } from "@/api/system/tenant";
    import EditModule from "./component/editModule.vue";

    export default {
        name: "Tenants",
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
                // 表格数据
                tableData: [],
                // 总条数
                total: 0,
                // 查询参数
                queryParams: {
                    // 页码
                    pageNum: 1,
                    // 每页大小
                    pageSize: 10,
                    // 以下为参数
                    expireTime: undefined,
                    tenantName: undefined,
                    id: undefined,
                },
            });

            /** 查询岗位列表 */
            const handleQuery = () => {
                state.loading = true;
                listSysTenants(state.queryParams).then((response:any) => {
                    state.tableData = response.data.data;
                    state.total = response.data.total;
                    state.loading = false;
                });
            };
            /** 重置按钮操作 */
            const resetQuery = () => {
                state.queryParams.expireTime = undefined;
                state.queryParams.tenantName = undefined;
                state.queryParams.id = undefined;
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

            // 打开新增弹窗
            const onOpenAddModule = (row: object) => {
                row = [];
                state.title = "添加租户";
                editModuleRef.value.openDialog(row);
            };
            // 打开编辑弹窗
            const onOpenEditModule = (row: object) => {
                state.title = "修改租户";
                editModuleRef.value.openDialog(row);
            };
            /** 删除按钮操作 */
            const onTabelRowDel = (row: any) => {
                const ids = row.id || state.ids;
                ElMessageBox({
                    message: '是否确认删除编号为"' + ids + '"的数据项?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    return delSysTenants(ids).then(() => {
                        handleQuery();
                        ElMessage.success("删除成功");
                    });
                });
            };
            // 多选框选中数据
            const handleSelectionChange = (selection: any) => {
                state.ids = selection.map((item: any) => item.id);
                state.single = selection.length != 1;
                state.multiple = !selection.length;
            };
            // 页面加载时
            onMounted(() => {
                // 查询岗位信息
                handleQuery();

                proxy.mittBus.on("onEditTenantsModule", (res: any) => {
                    handleQuery();
                });
            });
            // 页面卸载时
            onUnmounted(() => {
                proxy.mittBus.off("onEditTenantsModule");
            });
            return {
                editModuleRef,
                handleSelectionChange,
                handleQuery,
                handleCurrentChange,
                handleSizeChange,
                resetQuery,
                onOpenAddModule,
                onOpenEditModule,
                onTabelRowDel,
                ...toRefs(state),
            };
        },
    };
</script>
