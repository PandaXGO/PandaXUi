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
                <el-form-item label="表名称" prop="tableName">
                    <el-input
                            placeholder="请输入表名称模糊查询"
                            clearable
                            @keyup.enter="handleQuery"
                            style="width: 240px"
                            v-model="queryParams.tableName"
                    />
                </el-form-item>
                <el-form-item label="表描述" prop="tableComment">
                    <el-input
                            placeholder="请输入表描述模糊查询"
                            clearable
                            @keyup.enter="handleQuery"
                            style="width: 240px"
                            v-model="queryParams.tableComment"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button
                            type="primary"
                            @click="handleQuery"
                    >
                        <SvgIcon name="elementSearch" />
                        搜索</el-button>
                    <el-button @click="resetQuery">
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
                            @click="onOpenAddModule"
                            v-auth="'develop:code:add'"
                    ><SvgIcon name="elementDownload" />导入</el-button
                    >
                </el-col>
                <el-col :span="1.5">
                    <el-button
                            type="danger"
                            plain
                            :disabled="multiple"
                            @click="onTabelRowDel"
                            v-auth="'develop:code:delete'"
                    ><SvgIcon name="elementDelete" />删除</el-button
                    >
                </el-col>
            </el-row>

            <!--数据表格-->
            <el-table
                    v-loading="loading"
                    :data="tableList"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="序号"  width="55" align="center" prop="tableId" />
                <el-table-column label="表名称" align="center" prop="tableName"  :show-overflow-tooltip="true"/>
                <el-table-column label="表描述" align="center" prop="tableComment"  :show-overflow-tooltip="true" />
                <el-table-column label="模型名称" align="center" prop="className" :show-overflow-tooltip="true" />
                <el-table-column label="创建时间" align="center" prop="create_time">
                    <template #default="scope">
                        <span>{{ dateStrFormat(scope.row.create_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" prop="update_time">
                    <template #default="scope">
                        <span>{{ dateStrFormat(scope.row.update_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="300"
                        class-name="small-padding fixed-width"
                >
                    <template #default="scope">
                        <el-button
                                type="text"
                                size="small"
                                v-auth="'develop:code:view'"
                                @click="handlePreview(scope.row)"
                        ><SvgIcon name="elementView" />预览</el-button>
                        <el-button
                                size="mini"
                                type="text"
                                v-auth="'develop:code:edit'"
                                @click="onOpenEditModule(scope.row)"
                        ><SvgIcon name="elementEdit" />修改</el-button>
                        <el-button
                                slot="reference"
                                type="text"
                                size="small"
                                v-auth="'develop:code:code'"
                                @click="handleToProject(scope.row)"
                        ><SvgIcon name="elementDownload" />代码生成</el-button>
<!--                        <el-tooltip-->
<!--                                class="box-item"-->
<!--                                effect="dark"-->
<!--                                content="自动生成菜单和API"-->
<!--                                placement="top"-->
<!--                        >-->
<!--                            <el-button-->
<!--                                    slot="reference"-->
<!--                                    type="text"-->
<!--                                    size="small"-->
<!--                                    @click="handleToDB(scope.row)"-->
<!--                            ><SvgIcon name="elementView" />生成配置</el-button>-->
<!--                        </el-tooltip>-->

                        <el-button
                                v-if="scope.row.parentId != 0"
                                size="mini"
                                type="text"
                                v-auth="'develop:code:delete'"
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
        <ImportTable ref="importTableRef" :title="title" />
        <EditTable ref="editModelRef"/>

        <el-dialog class="preview" :title="preview.title" v-model="preview.open" width="80%" center>
            <div class="el-dialog-container">
                <div class="tag-group">
                    <el-tag v-for="(value, key) in preview.data" @click="codeChange(key)">
                        <template #>
                            {{ key.substring(key.lastIndexOf('/')+1,key.indexOf('.template')) }}
                        </template>
                    </el-tag>
                </div>
                <div id="codemirror">
                    <Codemirror ref="cmEditor" :value="codestr" border :options="cmOptions" @change="change" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="preview.open = false">确 定</el-button>
                </span>
            </template>
        </el-dialog>
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
    import { getTableList, deleteTable } from "/@/api/gen/table";
    import { preview, code, menuAndApi } from "/@/api/gen/gen";
    import ImportTable from "./component/importTable.vue";
    import EditTable from "./component/editTable.vue";
    import { downLoadFile } from '/@/utils/zipdownload'
    import Codemirror from "codemirror-editor-vue3";
    import "codemirror/mode/javascript/javascript.js";
    import "codemirror/theme/dracula.css";
    import 'codemirror/mode/go/go.js'
    import 'codemirror/mode/vue/vue.js'
    import { useRouter} from "vue-router";

    export default {
        name: "index",
        components: { ImportTable,EditTable,Codemirror},
        setup() {
            const { proxy } = getCurrentInstance() as any;
            const router = useRouter();
            const importTableRef = ref();
            const editModelRef = ref();
            const state:any = reactive({
                cmOptions: {
                    tabSize: 4,
                    theme: 'dracula',
                    mode: 'text/x-go',
                    lineNumbers: true,
                    line: true,
                    styleActiveLine: true,
                },
                codestr: '',
                // 遮罩层
                loading: true,
                // 唯一标识符
                uniqueId: '',
                // 选中数组
                ids: [],
                // 选中表数组
                tableNames: [],
                // 非单个禁用
                single: true,
                // 非多个禁用
                multiple: true,
                // 总条数
                total: 0,
                // 表数据
                tableList: [],
                // 查询参数
                queryParams: {
                    pageNum: 1,
                    pageSize: 10,
                    tableName: undefined,
                    tableComment: undefined
                },
                // 预览参数
                preview: {
                    open: false,
                    title: '代码预览',
                    data: {},
                    activeName: 'entity.go'
                }
            });

            /** 查询岗位列表 */
            const handleQuery = () => {
                state.loading = true;
                getTableList(state.queryParams).then(response => {
                    state.tableList = response.data.data
                    state.total = response.data.total
                    state.loading = false
                    }
                )
            };

            const codeChange = (e:any) => {
                if (e.indexOf('js') > -1) {
                    state.cmOptions.mode = 'text/javascript'
                }
                if (e.indexOf('entity') > -1 || e.indexOf('router') > -1 || e.indexOf('api') > -1 || e.indexOf('service') > -1 || e.indexOf('dto') > -1) {
                    state.cmOptions.mode = 'text/x-go'
                }
                if (e.indexOf('vue') > -1) {
                    state.cmOptions.mode = 'text/x-vue'
                }
                state.codestr = state.preview.data[e]
            };

            /** 重置按钮操作 */
            const resetQuery = () => {
                state.queryParams.tableName = undefined;
                state.queryParams.tableComment = undefined;
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

            const handleGenTable = (row:any) => {
                const ids = row.tableId || state.ids
                    ElMessageBox({
                        message: '是否确认生成编号为"' + ids + '"的代码?',
                        title: "警告",
                        showCancelButton: true,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }).then(function () {
                        downLoadFile('/develop/code/gen/code/' + ids)
                    });

            };


            // 打开新增table弹窗
            const onOpenAddModule = (row: object) => {
                row = [];
                state.title = "导入表";
                importTableRef.value.openDialog(row);
            };
            /** 修改按钮操作 */
            const onOpenEditModule = (row: object) => {
                editModelRef.value.openDialog(row);
            };

            // 预览
            const handlePreview = (row:any) => {
                 preview(row.tableId).then(response => {
                    state.preview.data = response.data
                    state.preview.open = true
                    codeChange('template/entity.template')
                })
            };
            // 代码生成
            const handleToProject = (row:any) => {
                ElMessageBox({
                    message: '是否确认生成编号为"' + row.tableId + '"的代码?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    code(row.tableId).then((response:any) => {
                        ElMessage.success("代码生成成功");
                    }).catch(function() {})
                });
            };
            // 生成配置
            const handleToDB = (row:any) => {
                menuAndApi(row.tableId).then((response) => {
                    ElMessage.success("菜单API生成成功");
                }).catch(function() {})
            };
            /** 删除按钮操作 */
            const onTabelRowDel = (row: any) => {
                const tableIds = row.tableId || state.ids;
                ElMessageBox({
                    message: '是否确认删除TABLE编号为"' + tableIds + '"的数据项?',
                    title: "警告",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }).then(function () {
                    return deleteTable(tableIds).then(() => {
                        ElMessage.success("删除成功");
                        handleQuery();
                    });
                });
            };

            // 多选框选中数据
            const handleSelectionChange = (selection: any) => {
                state.ids = selection.map((item: any) => item.postId);
                state.single = selection.length != 1;
                state.multiple = !selection.length;
            };

            // 页面加载时
            onMounted(() => {
                // 查询表信息
                handleQuery();
                proxy.mittBus.on("onEditTableModule", (res: any) => {
                    handleQuery();
                });
            });
            // 页面卸载时
            onUnmounted(() => {
                proxy.mittBus.off("onEditTableModule");
            });
            return {
                importTableRef,
                editModelRef,
                handleSelectionChange,
                handleQuery,
                handleCurrentChange,
                handleSizeChange,
                resetQuery,
                onOpenAddModule,
                onOpenEditModule,
                handleGenTable,
                codeChange,
                onTabelRowDel,
                handleToDB,
                handleToProject,
                handlePreview,
                ...toRefs(state),
            };
        },
    };
</script>
<style lang="scss" scoped>
    .el-dialog-container{
        overflow: hidden;
        .el-scrollbar__view{
            height: 100%;
        }
        .pre{
            height: 546px;
            overflow: hidden;
            .el-scrollbar{
                height: 100%;
            }
        }
        .el-scrollbar__wrap::-webkit-scrollbar{
            display: none;
        }
    }
    .el-dialog__body{
        padding: 0 20px;
        margin:0;
    }
    .tag-group {
        margin: 0 0 10px -10px;
    }
    .tag-group .el-tag{
        margin-left: 10px;
    }
    .el-tag {
        cursor: pointer;
    }
</style>

<style lang="scss">
    #codemirror {
        height: auto;
        margin: 0;
        overflow: auto;
    }
    .CodeMirror {
        border: 1px solid #eee;
        height: 600px;
    }
</style>