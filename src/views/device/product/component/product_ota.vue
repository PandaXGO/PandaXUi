<template>
  <div style="margin: 10px">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-header-text">固件列表</span>
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
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="固件名称" align="center" prop="name"/>
        <el-table-column label="固件版本" align="center" prop="version"/>
        <el-table-column label="固件地址" align="center" prop="url">
          <template #default="scope">
           <a :href="baseURL + '/upload/get/' + scope.row.url" download>{{baseURL + '/upload/get/' + scope.row.url}}</a>
          </template>
        </el-table-column>
        <el-table-column label="最新固件" align="center" prop="isLatest">
          <template #default="scope">
            <el-tag
                :type="scope.row.isLatest ? 'primary' : 'success'"
                disable-transitions
            >{{ scope.row.isLatest ? '是': '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="校验和" align="center" prop="check"/>
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
        <el-form-item label="固件名称" prop="name">
          <el-input
              v-model="state.ruleForm.name"
              placeholder="请输入固件名称"
          />
        </el-form-item>
        <el-form-item label="固件版本" prop="version">
          <el-input
              v-model="state.ruleForm.version"
              placeholder="请输入固件名称"
          />
        </el-form-item>
        <el-form-item label="固件上传" prop="url">
          <el-upload
              class="uploader"
              :action="state.upUrl"
              :accept="'.zip,.tar,.sh,.bin'"
              :headers="state.headers"
              :show-file-list="false"
              :on-success="handleUplaodSuccess"
              :before-upload="beforeUplaodUpload"
          >
            <el-button type="primary">上传固件</el-button>{{state.ruleForm.url}}
            <template #tip>
              <div class="el-upload__tip">
                请上传 大小不超过 <span style="color: red">10MB</span> 格式为 <span style="color: red">shell/zip/tar/bin</span> 的文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="最新固件" prop="isLatest">
          <el-radio-group v-model="state.ruleForm.isLatest" >
            <el-radio :label="true" >是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="固件说明" prop="description">
          <el-input v-model="state.ruleForm.description" :rows="4" type="textarea" placeholder="请输入固件说明" />
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
import {ElMessage, ElMessageBox} from "element-plus";
import {Session} from "@/utils/storage";
import {addOta, delOta, listOta, updateOta} from "@/api/device/product_ota";

const props:any = defineProps({
  rowData: {
    type: Object,
  },
})
const ruleFormRef = ref<HTMLElement | null>(null);
const baseURL = import.meta.env.VITE_API_URL
const state = reactive({
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
    pid: ""  //产品Id
  },
  isShowDialog: false,
  upUrl: baseURL + '/upload/up',
  headers: {'X-TOKEN': `${Session.get('token')}`},
  ruleForm: {
    id: "",
    pid: "",
    name: "",
    version: "",
    url: "",
    isLatest: false,
    description: "",
  },
  ruleRules: {
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    version: [
      { required: true, message: "版本不能为空", trigger: "blur" }
    ],
    url: [
      { required: true, message: "固件路径不能为空", trigger: "blur" }
    ],
  },
});
// 查询列表
const handleQuery = () => {
  state.loading = true;
  state.queryParams.pid = props.rowData.id
  listOta(state.queryParams).then((response:any) => {
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
}


const handleUplaodSuccess = (res: any, file: any) => {
  if (res.code == 200) {
    state.ruleForm.url = res.data.fileName
  } else {
    ElMessage.error(`文件上传失败,请检查后端服务`);
  }
}

const beforeUplaodUpload = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('固件文件大小不能超过 10MB!')
    return false
  }
  return true
}

// 取消
const onCancel = () => {
  state.isShowDialog = false
  //handleQuery()
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
    return delOta(ids).then((res:any) => {
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
      if (state.ruleForm.id != undefined && state.ruleForm.id != "") {
        updateOta(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          onCancel(); // 关闭弹窗
        });
      } else {
        addOta(state.ruleForm).then((response) => {
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
