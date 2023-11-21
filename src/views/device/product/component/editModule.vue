<template>
  <div class="system-product-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center draggable>
      <template #title>
        <div style="font-size: large" >{{title}}</div>
      </template>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="100px"
      >
        <el-row :gutter="35">
          <el-col :span="24">
            <el-form-item label="产品图片" prop="photoUrl">
              <el-upload
                  class="uploader"
                  :action="state.upUrl"
                  name="file"
                  :headers="state.headers"
                  :show-file-list="false"
                  :on-success="handleUplaodSuccess"
                  :before-upload="beforeUplaodUpload"
              >
                <img v-if="state.ruleForm.photoUrl" :src="baseURL + '/upload/get/'+ state.ruleForm.photoUrl" class="uploader-image" fit="contain"/>
                <el-icon v-else class="uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="state.ruleForm.name" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="产品类型" prop="productCategoryId">
              <el-cascader v-model="state.ruleForm.productCategoryId" :options="state.categoryOptions" :props="state.defaultProps" :show-all-levels="false" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="state.ruleForm.status">
                  <el-radio
                      v-for="dict in state.statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select v-model="state.ruleForm.deviceType" placeholder="请选择">
                <el-option label="直连设备" value="direct"></el-option>
                <el-option label="网关设备" value="gateway"></el-option>
                <el-option label="网关子设备" value="gatewayS"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议名称" prop="protocolName">
              <el-select v-model="state.ruleForm.protocolName" placeholder="请选择">
                <el-option label="MQTT" value="MQTT"></el-option>
                <el-option label="CoAP" value="CoAP"></el-option>
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="HTTP" value="HTTP"></el-option>
                <el-option label="LwM2M" value="LwM2M"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则链" prop="ruleChainId">
              <el-select v-model="state.ruleForm.ruleChainId" placeholder="请选择">
                <el-option v-for="rule in state.ruleOptions" :label="rule.ruleName" :value="rule.id">
                  <span style="float: left">{{ rule.ruleName }}</span>
                  <span style=" float: right;color: var(--el-text-color-secondary);font-size: 13px;">{{ rule.root === '1'? "根链": '普通链' }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="产品说明" prop="description">
              <el-input v-model="state.ruleForm.description" :rows="4" type="textarea" placeholder="请输入产品说明" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup name="editProduct">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { updateProduct, addProduct } from "@/api/device/product";
import { ElMessage } from "element-plus";
import {Session} from "@/utils/storage";
import {listProductCategoryLabel} from "@/api/device/product_category";
import {listChainLabel} from "@/api/rule/rulechain";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const baseURL = import.meta.env.VITE_API_URL
const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  upUrl: "",
  headers: {},
  ruleForm: {
    status: "",
    productCategory: {},
    productCategoryId: "",
    deviceType: "",
    ruleChainId: "",
    id: "",
    owner: "",
    protocolName: "Default",
    description: "",
    name: "",
    photoUrl: "",
  },
  categoryOptions: undefined,
  ruleOptions: undefined,
  defaultProps: {
    children: "children",
    label: "name",
    value: "id"
  },
  // statusOptions字典数据
  statusOptions: [],
  // 表单校验
  ruleRules: {
    name: [
      { required: true, message: "产品名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    productCategoryId: [
      { required: true, message: "产品类型不能为空", trigger: "blur" }
    ],
    deviceType: [
      { required: true, message: "设备类型不能为空", trigger: "blur" }
    ],
    protocolName: [
      { required: true, message: "协议名称不能为空", trigger: "blur" }
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));
  state.upUrl = baseURL + '/upload/up'
  state.headers = {'X-TOKEN': `${Session.get('token')}`}

  state.isShowDialog = true;
  state.loading = false;
  getTreeselect()
  getRuleChain()
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
}

const getTreeselect = () => {
  listProductCategoryLabel().then((response:any) => {
    if (response.code === 200){
      state.categoryOptions = response.data;
    }
  });
};

const getRuleChain = () => {
  listChainLabel({}).then((response:any) => {
    if (response.code === 200){
      state.ruleOptions = response.data;
    }
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditProductModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  state.isShowDialog = false;
};

const handleUplaodSuccess = (res: any, file: any) => {
  if (res.code == 200) {
    state.ruleForm.photoUrl = res.data.fileName
  } else {
    ElMessage.error(`文件上传失败,请检查后端服务`);
  }
}

const beforeUplaodUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/gif') {
    ElMessage.error('图片只能为jpg,png,jpeg,gif!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if ( Array.isArray(state.ruleForm.productCategoryId)){
        state.ruleForm.productCategoryId = state.ruleForm.productCategoryId[state.ruleForm.productCategoryId.length - 1]
      }
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        delete state.ruleForm.productCategory
        updateProduct(state.ruleForm).then((res:any) => {
          if (res.code === 200){
            ElMessage.success("修改成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      } else {
        addProduct(state.ruleForm).then((res:any) => {
          if (res.code === 200){
            ElMessage.success("新增成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      }
      state.loading = false;
    }
  });
};

defineExpose({
  openDialog,
});
</script>

<style>
.uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploader .el-upload:hover {
  border-color: var(--color-primary);
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
}

.uploader-image{
  height: 120px;
}
</style>
