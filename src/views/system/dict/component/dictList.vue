<template>
    <!-- 抽屉 -->
    <el-drawer title="字典列表" :direction="direction" :size="screenWidth" v-model="isShowDrawer">

      <!-- 抽屉内容的border -->
      <div
        :style="{
          padding: '10px',
          border: '1px solid #e9e9e9',
          background: '#fff',
        }"
      >
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
        >
          <el-row>
              <el-form-item label="标签" prop="dictName">
                <el-input
                  placeholder="标签查询"
                  clearable
                  @keyup.enter="handleQuery"
                  v-model="queryParams.dictLabel"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="状态"
                  clearable
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
                  @click="handleQuery"
                  ><SvgIcon name="elementSearch" />搜索</el-button
                >
                <el-button
                  @click="resetQuery"
                  ><SvgIcon name="elementRefresh" />重置</el-button
                >
                <el-button
                        style="margin-bottom: 10px; margin-top: 10px"
                        type="primary"
                        v-auth="'system:dictD:add'"
                        @click="onOpenAddModule"
                ><SvgIcon name="elementPlus" />新增</el-button>
              </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div>
        <!--数据表格-->
        <el-table v-loading="loading" :data="tableData">
          <el-table-column
            label="键值"
            align="center"
            prop="dictValue"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="标签"
            align="center"
            prop="dictLabel"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="类型"
            align="center"
            prop="dictType"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
          >
            <template #default="scope">
              <el-tag
                      :type="scope.row.status === '1' ? 'danger' : 'success'"
                      disable-transitions
              >{{ scope.row.status === '1' ? '停用' : '正常' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="排序"
            align="center"
            width="50"
            prop="dictSort"
          />

          <el-table-column
            label="操作"
            align="center"
            width="150"
            class-name="medium-padding fixed-width"
          >
            <template #default="scope">
              <el-popover  placement="left">
                <template #reference>
                  <el-button type="primary" circle ><SvgIcon name="elementStar"/></el-button>
                </template>
                <div>
                  <el-button text type="primary"
                             v-auth="'system:dictD:edit'"
                             @click="onOpenEditModule(scope.row)"
                  ><SvgIcon name="elementEdit" />修改</el-button>
                </div>
                <div>
                  <el-button text type="primary"
                             v-auth="'system:dictD:delete'"
                             @click="onTabelRowDel(scope.row)"
                  ><SvgIcon name="elementDelete" />删除</el-button>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或修改字典对话框 -->
      <editDictItem ref="dictItemModuleRef" :title="title" />
    </el-drawer>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  onUnmounted,
  onMounted,
} from "vue";
import { delData, listData } from "@/api/system/dict/data";
import { ElMessageBox, ElMessage } from "element-plus";
import editDictItem from "./editDictItem.vue";

export default {
  name: "dictList",
  components: { editDictItem },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const dictItemModuleRef = ref();
    const state = reactive({
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      // 字典表格数据
      tableData: [],
      // 是否显示抽屉
      isShowDrawer: false,
      direction: "rtl",
      //   抽屉的宽度
      screenWidth: 800,
      // 状态数据字典
      statusOptions: [{
        dictValue: "0",
        dictLabel: "正常"
      },{
        dictValue: "1",
        dictLabel: "禁用"
      }],

      // 查询参数
      queryParams: {
        dictType: undefined,
        dictLabel: undefined,
        status: undefined,
      },
    });

    // 页面加载时
    const openDrawer = (row: any) => {
      resetScreenSize();
      state.queryParams.dictType = row.dictType;
      proxy.getDicts(row.dictType).then((response: any) => {
        state.tableData = response.data;
        state.loading = false;
      });
      state.isShowDrawer = true;
    };

    /** 查询字典列表 */
    const handleQuery = () => {
      state.loading = true;
      listData(state.queryParams).then((response) => {
        state.tableData = response.data;
        state.loading = false;
      });
    };
    // 抽屉的宽度随着屏幕大小来改变
    const resetScreenSize = () => {
      let screenWidth = document.body.clientWidth;
      if (screenWidth < 600) {
        state.screenWidth = screenWidth;
      } else {
        state.screenWidth = 600;
      }
    };
    /** 重置按钮操作 */
    const resetQuery = () => {
      state.queryParams.dictLabel = undefined;
      state.queryParams.status = undefined;
      handleQuery();
    };
    // 打开新增字典数据弹窗
    const onOpenAddModule = (row: any) => {
      row ={}
      row.dictType = state.queryParams.dictType;
      state.title = "添加字典数据";
      dictItemModuleRef.value.openDialog(row);
    };
    // 打开编辑字典数据弹窗
    const onOpenEditModule = (row: object) => {
      state.title = "修改字典数据";
      dictItemModuleRef.value.openDialog(row);
    };
    /** 删除按钮操作 */
    const onTabelRowDel = (row: any) => {
      const dictCode = row.dictCode;
      ElMessageBox({
        message: '是否确认删除字典编号为"' + dictCode + '"的数据项?',
        title: "警告",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(function () {
        return delData(dictCode).then(() => {
          handleQuery();
          ElMessage.success("删除成功");
        });
      });
    };
    // 页面加载时
    onMounted(() => {
      proxy.mittBus.on("onEditDictItemModule", (res: any) => {
        handleQuery();
      });
    });
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off("onEditDictItemModule");
    });
    return {
      dictItemModuleRef,
      resetScreenSize,
      onOpenAddModule,
      onOpenEditModule,
      onTabelRowDel,
      resetQuery,
      openDrawer,
      handleQuery,
      ...toRefs(state),
    };
  },
};
</script>
