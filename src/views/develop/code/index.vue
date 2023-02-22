<template>
  <div class="app-container">
    <el-card shadow="always">
      <!-- 查询 -->
      <el-form
          :model="state.queryParams"
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
              v-model="state.queryParams.tableName"
          />
        </el-form-item>
        <el-form-item label="表描述" prop="tableComment">
          <el-input
              placeholder="请输入表描述模糊查询"
              clearable
              @keyup.enter="handleQuery"
              style="width: 240px"
              v-model="state.queryParams.tableComment"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="handleQuery">
            <SvgIcon name="elementSearch"/>
            搜索
          </el-button>
          <el-button @click="resetQuery">
            <SvgIcon name="elementRefresh"/>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">生成表列表</span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenAddModule"
                v-auth="'develop:code:add'"
            >
              <SvgIcon name="elementDownload"/>
              导入
            </el-button>
            <el-button
                type="danger"
                plain
                :disabled="state.multiple"
                @click="onTabelRowDel"
                v-auth="'develop:code:delete'"
            >
              <SvgIcon name="elementDelete"/>
              删除
            </el-button>
          </div>
        </div>
      </template>
      <!--数据表格-->
      <el-table
          v-loading="state.loading"
          :data="state.tableList"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" width="55" align="center" prop="tableId"/>
        <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true"/>
        <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true"/>
        <el-table-column label="模型名称" align="center" prop="className" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" prop="updateTime">
          <template #default="scope">
            <span>{{ dateStrFormat(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            align="center"
        >
          <template #default="scope">
            <el-popover  placement="left">
              <template #reference>
                <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
              </template>
              <div>
                <el-button text type="primary"
                           v-auth="'develop:code:view'"
                           @click="handlePreview(scope.row)"
                >
                  <SvgIcon name="elementView"/>
                  预览
                </el-button>
              </div>
              <div>
                <el-button text type="primary"
                           v-auth="'develop:code:edit'"
                           @click="onOpenEditModule(scope.row)"
                >
                  <SvgIcon name="elementEdit"/>
                  参数编辑
                </el-button>
              </div>
                <div>
                  <el-button
                          slot="reference"
                          text type="primary"
                          v-auth="'develop:code:code'"
                          @click="handleToProject(scope.row)"
                  >
                    <SvgIcon name="elementDownload"/>
                    代码生成
                  </el-button>
                </div>
                <div>
                  <el-button
                          slot="reference"
                          text type="primary"
                          @click="openConfigureDialog(scope.row)"
                  ><SvgIcon name="elementView" />生成配置</el-button>
                </div>
                <div>
                  <el-button
                          text type="primary"
                          v-auth="'develop:code:delete'"
                          @click="onTabelRowDel(scope.row)"
                  >
                    <SvgIcon name="elementDelete"/>
                    删除
                  </el-button>
                </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页设置-->
      <div v-show="state.total > 0">
        <el-divider></el-divider>
        <el-pagination
            background
            :total="state.total"
            :current-page="state.queryParams.pageNum"
            :page-size="state.queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 添加或修改岗位对话框 -->
    <ImportTable ref="importTableRef" :title="state.title"/>
    <EditTable ref="editModelRef"/>
    <el-dialog v-model="state.isShowConfigureDialog" width="769px" center>
      <el-form :model="state.configureForm" label-width="80px">
        <el-form-item label="上级菜单" prop="parentId">
          <el-cascader
              v-model="state.configureForm.parentId"
              :options="state.menuOptions"
              class="w100"
              :props="{
                  label: 'menuName',
                  value: 'menuId',
                  checkStrictly: true,
                  emitPath: false,
                }"
              clearable
              filterable
              placeholder="选择上级菜单"
              :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="handleToDB" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog class="preview" :header="state.preview.title" v-model="state.preview.open" width="80%" center>
      <div class="el-dialog-container">
        <div class="tag-group">
          <el-tag v-for="(value, key) in state.preview.data" @click="codeChange(key)">
            <template #>
              {{ key.substring(key.lastIndexOf('/') + 1, key.indexOf('.template')) }}
            </template>
          </el-tag>
        </div>
        <div id="codemirror">
          <Codemirror ref="cmEditor" :value="state.codestr" border :options="state.cmOptions"/>
        </div>
      </div>
      <template #footer>
                <span class="dialog-footer">
                  <el-button type="primary" @click="state.preview.open = false">确 定</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  toRefs,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import {ElMessageBox, ElMessage} from "element-plus";
import {getTableList, deleteTable} from "@/api/gen/table";
import {preview, code, menuAndApi} from "@/api/gen/gen";
import { treeselect  } from "@/api/system/menu";
import ImportTable from "./component/importTable.vue";
import EditTable from "./component/editTable.vue";
import {downLoadFile} from '@/utils/zipdownload'
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/dracula.css";
import 'codemirror/mode/go/go.js'
import 'codemirror/mode/vue/vue.js'

const {proxy} = getCurrentInstance() as any;
const importTableRef = ref();
const editModelRef = ref();
const state: any = reactive({
  cmOptions: {
    tabSize: 4,
    theme: 'dracula',
    mode: 'text/x-go',
    lineNumbers: true,
    line: true,
    styleActiveLine: true,
  },
  isShowConfigureDialog: false,
  configureForm: {
    parentId: 0, // 父菜单ID
    tableId: 0,
  },
  menuOptions: [],
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

const handleQuery = () => {
  state.loading = true;
  getTableList(state.queryParams).then(response => {
        state.tableList = response.data.data
        state.total = response.data.total
        state.loading = false
      }
  )
};

const codeChange = (e: any) => {
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

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

const handleGenTable = (row: any) => {
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
const handlePreview = (row: any) => {
  preview(row.tableId).then(response => {
    state.preview.data = response.data
    state.preview.open = true
    codeChange('template/entity.template')
  })
};
// 代码生成
const handleToProject = (row: any) => {
  ElMessageBox({
    message: '是否确认生成编号为"' + row.tableId + '"的代码?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    code(row.tableId).then((response: any) => {
      ElMessage.success("代码生成成功");
    }).catch(function () {
    })
  });
};
// 生成配置
const handleToDB = () => {
  menuAndApi(state.configureForm.tableId,state.configureForm.parentId).then((response) => {
    ElMessage.success("菜单API生成成功");
  }).catch(function () {
  })
};
const openConfigureDialog = (row: any) => {
  state.isShowConfigureDialog = true
  state.configureForm.tableId = row.tableId
  treeselect().then((response: any) => {
    state.menuOptions = [];
    const menu = { menuId: 0, menuName: "主类目", children: [] };
    menu.children = response.data;
    state.menuOptions.push(menu);
  });
};
// 取消
const onCancel = () => {
  state.isShowConfigureDialog = false
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

</script>
<style lang="scss" scoped>
.el-dialog-container {
  overflow: hidden;

  .el-scrollbar__view {
    height: 100%;
  }

  .pre {
    height: 546px;
    overflow: hidden;

    .el-scrollbar {
      height: 100%;
    }
  }

  .el-scrollbar__wrap::-webkit-scrollbar {
    display: none;
  }
}

.el-dialog__body {
  padding: 0 20px;
  margin: 0;
}

.tag-group {
  margin: 0 0 10px -10px;
}

.tag-group .el-tag {
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