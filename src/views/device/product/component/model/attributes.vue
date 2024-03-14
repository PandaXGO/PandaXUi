<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">
             <el-input v-model="state.queryParams.name" placeholder="名称搜索" clearable>
                <template #append>
                  <el-button :icon="Search" @click="handleQuery"></el-button>
                </template>
              </el-input>
          </span>
          <div>
            <el-button
                type="primary"
                plain
                @click="onOpenModule({})"
            ><SvgIcon name="elementPlus" />新增</el-button>
          </div>
        </div>
      </template>
      <el-table
          v-loading="state.loading"
          border
          :data="state.tableData"
      >
        <el-table-column label="属性名称" align="center" prop="name"/>
        <el-table-column label="属性标识" align="center" prop="key"/>
        <el-table-column label="数据类型" align="center" prop="type"/>
        <el-table-column label="默认值" align="center" prop="define">
          <template #default="scope">
            {{ scope.row.define.default_value }}
          </template>
        </el-table-column>
        <el-table-column label="读写类型" align="center" prop="isLatest">
          <template #default="scope">
            <el-tag type="primary" disable-transitions>
              {{ scope.row.define.rw ==='r'? '只读': scope.row.define.rw ==='w' ? '只写':'读写' }}
            </el-tag>
          </template>
        </el-table-column>
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
                <el-button text type="primary" @click="onOpenModule(scope.row)">
                  <SvgIcon name="elementEdit"/>
                  修改
                </el-button>
              </div>
              <div>
                <el-button text type="primary" @click="onTabelRowDel(scope.row)">
                  <SvgIcon name="elementDelete"/>
                  删除
                </el-button>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog v-model="state.isShowDialog" width="769px" center draggable>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="属性名称" prop="name">
          <el-input
              v-model="state.ruleForm.name"
              placeholder="请输入属性名称"
          />
        </el-form-item>
        <el-form-item label="属性标识" prop="key">
          <el-input
              v-model="state.ruleForm.key"
              placeholder="请输入属性标识, 第一个字符不能是数字，支持英文、数字、下划线的组合"
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="type">
          <el-radio-group v-model="state.ruleForm.type" fill="var(--color-primary)">
            <el-radio-button label="int64" >整数型</el-radio-button>
            <el-radio-button label="float64">浮点型</el-radio-button>
            <el-radio-button label="bool" >布尔型</el-radio-button>
            <el-radio-button label="string" >字符串</el-radio-button>
            <el-radio-button label="enum" >枚举整型</el-radio-button>
            <el-radio-button label="date" >时间</el-radio-button>
            <el-radio-button label="struct">结构体</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="读写类型" prop="rw">
          <el-radio-group v-model="state.define.rw" fill="var(--color-primary)">
            <el-radio-button label="r" >只读</el-radio-button>
            <el-radio-button label="w">只写</el-radio-button>
            <el-radio-button label="rw" >读写</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="默认值" prop="default_value">
          <el-input-number
              v-if="state.ruleForm.type==='int64' || state.ruleForm.type==='float64' || state.ruleForm.type==='bool'"
                             v-model="state.define.default_value" />
          <el-input
             v-else
              v-model="state.define.default_value"
          />
        </el-form-item>
        <el-form-item label="属性说明" prop="description">
          <el-input v-model="state.ruleForm.description" :rows="4" type="textarea" placeholder="请输入属性说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref, unref} from "vue";
import {addTemplate, delTemplate, listTemplate, updateTemplate} from "@/api/device/product_template";
import {ElMessage, ElMessageBox} from "element-plus";
import { Search } from '@element-plus/icons-vue'

const props:any = defineProps({
  rowData: {
    type: Object,
    default: () => {},
  },
})
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive<any>({
  // 遮罩层
  loading: false,

  // 岗位表格数据
  tableData: [],
  // 总条数
  total: 0,
  queryParams: {
    // 页码
    pageNum: 1,
    // 每页大小
    pageSize: 10,
    pid: "",  //产品Id
    name: "",
    classify: "attributes",
  },
  isShowDialog: false,
  ruleForm: {
    id: "",
    pid: "",
    name: "",
    key: "",
    type: "string",
    description: "",
  },
  define: {
    default_value: "",
    rw: "r",
  },
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    key: [
      { required: true, message: "标识不能为空", trigger: "blur" },
      { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '标识格式不正确,支持英文、数字、下划线的组合,首位字符不能是数字', trigger: 'blur' }
    ],
    type: [
      { required: true, message: "类型不能为空", trigger: "blur" }
    ],
  },
});

// 查询列表
const handleQuery = () => {
  state.loading = true;
  state.queryParams.pid = props.rowData.id
  listTemplate(state.queryParams).then((response:any) => {
    if (response.code === 200) {
      state.tableData = response.data.data;
      state.total = response.data.total;
    }
    state.loading = false;
  });
};

const handleCurrentChange = (val: number) => {
  state.queryParams.pageNum = val
  handleQuery()
}
const handleSizeChange = (val: number) => {
  state.queryParams.pageSize = val
  handleQuery()
}

const onOpenModule = (row: any) => {
  state.isShowDialog = true
  state.ruleForm = row
  state.ruleForm.classify = "attributes"
  if (row.define){
    state.define = row.define
  }

}
// 取消
const onCancel = () => {
  state.isShowDialog = false
  handleQuery()
};
const onTabelRowDel = (row: any) => {
  const ids = row.id
  ElMessageBox({
    message: '是否确认删除编号为"' + ids + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    return delTemplate(ids).then((res:any) => {
      if (res.code === 200){
        handleQuery();
        ElMessage.success("删除成功");
      }else {
        ElMessage.error("删除失败");
      }
    });
  });
};
// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      state.ruleForm.pid = props.rowData.id
      state.ruleForm.define = state.define
      if (state.ruleForm.id != undefined && state.ruleForm.id != "") {
        updateTemplate(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          onCancel(); // 关闭弹窗
        });
      } else {
        addTemplate(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          state.loading = false;
          onCancel(); // 关闭弹窗
        });
      }
    }
  });
};
onMounted(()=>{
  handleQuery()
})
</script>

<style scoped>

</style>
