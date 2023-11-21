<template>
  <div class="system-device-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center draggable>
      <template #title>
        <div style="font-size: large">{{title}}</div>
      </template>
      <el-form
          :model="state.ruleForm"
          :rules="state.ruleRules"
          ref="ruleFormRef"
          label-width="80px"
      >
        <el-form-item label="设备编码" prop="name">
          <el-input v-model="state.ruleForm.name" placeholder="以字母数字命名例如 iot2233c" />
        </el-form-item>
        <el-form-item label="设备别名" prop="alias">
          <el-input v-model="state.ruleForm.alias" placeholder="请输入设备别名, 中文名称" />
        </el-form-item>
        <el-form-item label="设备组" prop="gid">
          <el-cascader v-model="state.ruleForm.gid" :options="state.deviceGroupOptions" :props="state.defaultProps" :show-all-levels="false" />
        </el-form-item>
        <el-form-item label="所属产品" prop="pid">
          <el-select v-model="state.ruleForm.pid" filterable  placeholder="请选择产品">
            <el-option v-for="product in state.productAllOptions" :key="product.id" :label="product.name" :value="product.id" @click="getAllGateway($event,product.deviceType)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="state.ruleForm.pid" label="设备类型" prop="deviceType">
          <el-select v-model="state.ruleForm.deviceType" disabled>
            <el-option label="直连设备" value="direct"></el-option>
            <el-option label="网关设备" value="gateway"></el-option>
            <el-option label="网关子设备" value="gatewayS"></el-option>
            <el-option label="监控设备" value="monitor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="state.ruleForm.pid && state.ruleForm.deviceType==='gatewayS'" label="网关设备" prop="parentId">
          <el-select v-model="state.ruleForm.parentId" :rules="[
          {
            required: true,
            message: '父网关必选，如果没有请先创建',
            trigger: 'blur',
          },]">
            <el-option v-for="device in state.devicesOptions" :label="device.name" :value="device.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="state.ruleForm.status">
            <el-radio
                v-for="dict in state.statusOptions"
                :key="dict.dictValue"
                :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备说明" prop="description">
          <el-input v-model="state.ruleForm.description" :rows="4" type="textarea" placeholder="请输入设备说明" />
        </el-form-item>
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

<script lang="ts" setup name="editDevice">
import { reactive, ref, unref, getCurrentInstance } from "vue";
import {updateDevice, addDevice, listDeviceAll} from "@/api/device/device";
import { ElMessage } from "element-plus";
import {listProductAll} from "@/api/device/product";
import {listDeviceGroupTreeLabel} from "@/api/device/device_group";

const props = defineProps({
  title: {
    type: String,
    default: () => "",
  },
})

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref<HTMLElement | null>(null);
const state = reactive({
  // 是否显示弹出层
  isShowDialog: false,
  loading: false,
  ruleForm: {
    alias: "",
    ext: {},
    id: "",
    pid: "",
    gid: "",
    deviceType: "",
    name: "",
    description: "",
    parentId: "",
    status: "",
  },
  productAllOptions: [],
  deviceGroupOptions: [],
  devicesOptions: [],
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
      { required: true, message: "设备名称不能为空", trigger: "blur" },
      { pattern: /^[a-zA-Z0-9]*$/, message: '标识格式不正确,支持英文、数字的组合,首位字符不能是数字', trigger: 'blur' }
    ],
    alias: [
      { required: true, message: "设备中文名不能为空", trigger: "blur" },
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    gid: [
      { required: true, message: "产品是必选的", trigger: "blur" }
    ],
    pid: [
      { required: true, message: "产品是必选的", trigger: "blur" }
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));

  state.isShowDialog = true;
  state.loading = false;
  geyProductAll()
  geyDeviceGroupTree()
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
}

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditDeviceModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 获取所有在线的产品
const geyProductAll = () => {
  listProductAll({status: "0"}).then((res:any)=>{
    if (res.code === 200)
    state.productAllOptions = res.data
  })
}
// 获取所有设备分组
const geyDeviceGroupTree = () => {
  listDeviceGroupTreeLabel().then((res:any)=>{
    if (res.code === 200)
      state.deviceGroupOptions = res.data
  })
}
// 设备为子网关，查询所有网关类型设备
const getAllGateway = (val, deviceType) => {
  state.ruleForm.deviceType = deviceType
  if (deviceType === "gatewayS") {
    //查询所有父网关
    listDeviceAll({"deviceType": "gateway"}).then((res:any)=>{
      if (res.code === 200){
        state.devicesOptions = res.data
      }
    })
  }
}

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if ( Array.isArray(state.ruleForm.gid)){
        state.ruleForm.gid = state.ruleForm.gid[state.ruleForm.gid.length - 1]
      }
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        updateDevice(state.ruleForm).then((res:any) => {
          if (res.code === 200){
            ElMessage.success("修改成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      } else {
        addDevice(state.ruleForm).then((res:any) => {
          if (res.code === 200){
            ElMessage.success("新增成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
