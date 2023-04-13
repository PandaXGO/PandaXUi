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
        <el-form-item label="名称" prop="ruleName">
          <el-input
              v-model="state.queryParams.ruleName"
              placeholder="请输入名称"
              clearable
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
              v-model="state.queryParams.status"
              placeholder="状态"
              clearable
              style="width: 240px"
          >
            <el-option
                v-for="dict in state.statusOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="ruleRemark">
          <el-input
              v-model="state.queryParams.ruleRemark"
              placeholder="请输入说明"
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
          <span class="card-header-text">规则链列表</span>
          <div>
            <el-button
                type="primary"
                plain
                v-auth="'visual:rulechain:add'"
                @click="onOpenAddModule"
            ><SvgIcon name="elementPlus" />新增</el-button>
            <el-button
                type="danger"
                plain
                v-auth="'visual:rulechain:delete'"
                :disabled="state.multiple"
                @click="onTabelRowDel"
            ><SvgIcon name="elementDelete" />删除</el-button>
          </div>
        </div>
      </template>
      <div class="content_box">
        <div v-for="data in state.tableData" class="content_item">
          <el-card :body-style="{ padding: '0px' }" class="ft-card">
            <el-image class="ft-image" :src="data.ruleBase64" fit="fill">
              <template #error>
                <div class="image-slot">
                  <SvgIcon name="elementPicture" :size="50"/>
                </div>
              </template>
            </el-image>
            <div class="ft-foot">
              <dev class="ft-item-name">{{data.ruleName}}</dev>
              <div>
                <span style="margin-right: 5px">
                   <el-switch
                       v-model="data.status"
                       :width="60"
                       inline-prompt
                       active-value="1"
                       inactive-value="0"
                       active-text="已发布"
                       inactive-text="未发布"
                       @click="handleStatusChange(data)"
                   />
                </span>
                <el-popover  >
                  <template #reference>
                    <el-button type="primary" circle size="small"><SvgIcon name="elementStar"/></el-button>
                  </template>
                  <div>
                    <el-button text type="primary" v-auth="'visual:rulechain:clone'" @click="onCloneRule(data)">
                      <SvgIcon name="elementConnection" />克隆
                    </el-button>
                  </div>
                  <div>
                    <router-link
                        v-auth="'visual:rulechain:design'" target="_blank"
                        :to="{ path: '/rule/edit', query: { id: data.ruleId } }"
                    >
                      <el-button text type="primary">
                        <SvgIcon name="elementDiscount"/>设计
                      </el-button>
                    </router-link>
                  </div>
                  <div>
                    <router-link
                        v-auth="'visual:rulechain:view'" target="_blank"
                        :to="{ path: '/rule/view', query: { id: data.ruleId }}"
                    >
                      <el-button text type="primary">
                        <SvgIcon name="elementView"/>预览
                      </el-button>
                    </router-link>
                  </div>
                  <div>
                    <el-button text type="primary" v-auth="'visual:rulechain:edit'" @click="onOpenEditModule(data)">
                      <SvgIcon name="elementEdit" />修改
                    </el-button>
                  </div>
                  <div>
                    <el-button text type="primary" v-auth="'visual:rulechain:delete'" @click="onTabelRowDel(data)">
                      <SvgIcon name="elementDelete" />删除
                    </el-button>
                  </div>
                </el-popover>
              </div>
            </div>
          </el-card>
        </div>
      </div>

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
    <EditModule ref="editModuleRef" :title="state.title" />
  </div>
</template>

<script lang="ts" setup name="Chain">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import {listChain, delChain, addChain, changeChainStatus} from "@/api/visual/rulechain";
import EditModule from "./component/editModule.vue";
import { Session } from '@/utils/storage';
import {getDicts} from "@/api/system/dict/data";
import {changeScreenStatus} from "@/api/visual/screen";

const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const state:any = reactive({
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
  statusOptions: [],
  // 总条数
  total: 0,
  // 查询参数
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    // 以下为参数
    ruleName: undefined,
    status: undefined,
    ruleBase64: undefined,
    ruleDataJson: undefined,
    creator: undefined,
    deviceId: undefined,
    ruleId: undefined,
    ruleRemark: undefined,
    userId: undefined,
  },
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  listChain(state.queryParams).then((response:any) => {
    state.tableData = response.data.data;
    state.total = response.data.total;
    state.loading = false;
  });
};
/** 重置按钮操作 */
const resetQuery = () => {
  state.queryParams.ruleName = undefined;
  state.queryParams.status = undefined;
  state.queryParams.ruleBase64 = undefined;
  state.queryParams.ruleDataJson = undefined;
  state.queryParams.creator = undefined;
  state.queryParams.deviceId = undefined;
  state.queryParams.ruleId = undefined;
  state.queryParams.ruleRemark = undefined;
  state.queryParams.userId = undefined;
  handleQuery();
};

// 状态修改
const handleStatusChange = (row: any) => {
  let text = row.status == "0" ? "取消发布" : "发布" ;
  ElMessageBox({
    title: "警告",
    message: '确认要"' + text + '""' + row.ruleName + '"吗?',
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    beforeClose: (action: string, instance: any, done: any) => {
      if (action === "confirm") {
        return changeChainStatus(row.ruleId, row.status).then(() => {
          ElMessage.success(text + "成功");
          done();
        });
      } else {
        done();
      }
    },
  }).catch(() => {
    row.status = row.status === "0" ? "1" : "0";
  });
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
const onOpenAddModule = () => {
  state.title = "添加规则链";
  editModuleRef.value.openDialog({});
};
//克隆
const onCloneRule = (row: any) => {
  ElMessageBox.confirm('确定要克隆该规则链么？', '克隆确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
  }).then(() => {
    const form = {
      ruleName: row.ruleName+"-克隆",
      status: row.status,
      ruleBase64: row.ruleBase64,
      ruleDataJson: row.ruleDataJson,
      ruleRemark: row.ruleRemark,
    }
    addChain(form).then((response:any) => {
      if (response.code === 200) {
        ElMessage.success("克隆成功");
        handleQuery()
      }
    });
  })
};

// 打开编辑弹窗
const onOpenEditModule = (row: object) => {
  state.title = "修改规则链";
  editModuleRef.value.openDialog(row);
};
/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const ruleIds = row.ruleId || state.ids;
  ElMessageBox({
    message: '是否确认删除编号为"' + ruleIds + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delChain(ruleIds).then(() => {
      handleQuery();
      ElMessage.success("删除成功");
    });
  });
};
// 多选框选中数据
const handleSelectionChange = (selection: any) => {
  state.ids = selection.map((item: any) => item.ruleId);
  state.single = selection.length != 1;
  state.multiple = !selection.length;
};
// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();

  getDicts("sys_release_type").then((response) => {
    state.statusOptions = response.data;
  });

  proxy.mittBus.on("onEditChainModule", (res: any) => {
    handleQuery();
  });
});
// 页面卸载时
onUnmounted(() => {
  proxy.mittBus.off("onEditChainModule");
});
</script>

<style lang="scss" scoped>

</style>
