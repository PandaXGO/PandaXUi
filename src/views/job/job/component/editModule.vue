<template>
  <div class="system-job-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center draggable>
      <template #header>
        <div style="font-size: large">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="state.ruleForm.jobName" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="目标类型" prop="targetInvoke">
          <el-radio-group v-model="state.ruleForm.targetInvoke" @change="getTarget">
            <el-radio label="cronDevice" border>设备</el-radio>
            <el-radio label="cronProduct" border>产品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选中目标" prop="targetArgs">
          <el-select v-model="state.ruleForm.targetArgs" filterable placeholder="请选中目标">
            <el-option
                v-for="item in state.targetOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click="state.currentTarget = item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="自定义数据流" prop="jobContent">
          <el-input v-model="state.ruleForm.jobContent" type="textarea"/>
        </el-form-item>

        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input
            v-model="state.ruleForm.cronExpression"
            placeholder="请输入cron执行表达式"
          />
        </el-form-item>
        <el-form-item label="执行策略" prop="misfirePolicy">
          <el-radio-group v-model="state.ruleForm.misfirePolicy">
            <el-radio-button label="0">立即执行</el-radio-button>
            <el-radio-button label="1">执行一次</el-radio-button>
            <el-radio-button label="2">放弃执行</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="state.ruleForm.status">
            <el-radio
              v-for="dict in state.statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio
            >
          </el-radio-group>
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

<script lang="ts" setup>
import { reactive, ref, unref, getCurrentInstance } from "vue";
import { addJob, updateJob } from "@/api/job/job";
import { ElMessage } from "element-plus";
import {listDeviceAll} from "@/api/device/device";
import {listProductAll} from "@/api/device/product";

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
  // 表单参数对象
  ruleForm: {
    id: 0, // 定时任务ID
    jobName: "", // 定时任务名称
    targetInvoke: "", //调用方法
    jobContent: "",
    targetArgs: "", //调用方法 传参
    cronExpression: "", // cron表达式
    misfirePolicy: "1", //错误策略
    status: "", //状态
  },
  contentForm: {
    type: "",
    key: "",
    value: "",
  },
  currentTarget: {},
  targetOptions: [],
  // 状态字典
  statusOptions: [],
  // 表单校验
  ruleRules: {
    jobName: [
      { required: true, message: "任务名称不能为空", trigger: "blur" },
    ],
    jobContent: [
      { required: true, message: "自定义数据不能为空", trigger: "blur" },
    ],
    targetInvoke: [
      {
        required: true,
        message: "调用目标不能为空",
        trigger: "blur",
      },
    ],
    targetArgs: [
      {
        required: true,
        message: "目标参数不能为空",
        trigger: "blur",
      },
    ],
    cronExpression: [
      {
        required: true,
        message: "cron执行表达式不能为空",
        trigger: "blur",
      },
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  state.ruleForm = JSON.parse(JSON.stringify(row));
  if (state.ruleForm.jobContent) {
    state.contentForm = JSON.parse(state.ruleForm.jobContent);
  }
  state.isShowDialog = true;
  state.loading = false;
  // 查询定时任务状态数据定时任务
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
};

// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditJobModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};

// 保存
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if (state.ruleForm.id != undefined && state.ruleForm.id != 0) {
        //state.ruleForm.jobContent = JSON.stringify(state.contentForm,null,"")
        updateJob(state.ruleForm).then((res:any) => {
          if (res.code === 200){
            ElMessage.success("修改成功");
            closeDialog(state.ruleForm); // 关闭弹窗
          }
          state.loading = false;
        });
      } else {
        addJob(state.ruleForm).then((res:any) => {
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


const getTarget = (val:string) => {
  if (val === "cronDevice"){
    listDeviceAll({}).then((res:any)=>{
      if (res.code === 200){
        state.targetOptions = res.data
      }
    })
  }
  if (val === "cronProduct"){
    listProductAll({}).then((res:any)=>{
      if (res.code === 200){
        state.targetOptions = res.data
      }
    })
  }
}

defineExpose({
  openDialog,
});
</script>
