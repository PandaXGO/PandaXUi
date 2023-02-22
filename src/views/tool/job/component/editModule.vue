<template>
  <div class="system-job-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.system-job-container .el-dialog', '.system-job-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="state.ruleForm.jobName" placeholder="请输入任务名称" />
        </el-form-item>

        <el-form-item label="任务分组" prop="jobGroup">
          <el-select v-model="state.ruleForm.jobGroup" placeholder="请选择">
            <el-option
              v-for="dict in state.jobGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="invokeTarget">
          <template #label>
            <span>
              调用方法
              <el-tooltip placement="top">
                <template #content>
                 使用示例：cronHandle 方法后端实现逻辑, 接口类型直接填写接口
                </template>
                <i class="fa fa-exclamation-circle"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input
            v-model="state.ruleForm.invokeTarget"
            placeholder="请输入调用目标"
          />
        </el-form-item>
        <el-form-item prop="args">
          <template #label>
            <span>
              调用参数
              <el-tooltip placement="top">
                <template #content>
                 使用示例：类型string
                </template>
                <i class="fa fa-exclamation-circle"></i>
              </el-tooltip>
            </span>
          </template>
          <el-input v-model="state.ruleForm.args" placeholder="调用参数" />
        </el-form-item>
        <el-form-item label="cron表达式" prop="cronExpression">
          <el-input
            v-model="state.ruleForm.cronExpression"
            placeholder="请输入cron执行表达式"
          />
        </el-form-item>

        <el-form-item label="任务类型" prop="jobType">
          <el-radio-group v-model="state.ruleForm.jobType">
            <el-radio-button label="1">接口</el-radio-button>
            <el-radio-button label="2">函数</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="错误策略" prop="misfirePolicy">
          <el-radio-group v-model="state.ruleForm.misfirePolicy">
            <el-radio-button label="1">立即执行</el-radio-button>
            <el-radio-button label="2">执行一次</el-radio-button>
            <el-radio-button label="3">放弃执行</el-radio-button>
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
          <el-button type="primary" @click="onSubmit" :loading="state.loading">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { addJob, updateJob } from "@/api/job/job";
import { ElMessage } from "element-plus";

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
    jobId: 0, // 定时任务ID
    jobName: "", // 定时任务名称
    jobGroup: "", // 任务分组
    jobType: "1", // 任务类型
    invokeTarget: "", //调用方法
    args: "", //调用方法 传参
    cronExpression: "", // cron表达式
    concurrent: "", //是否并发
    misfirePolicy: "1", //错误策略
    status: "", //状态
    remark: "", // 备注
  },
  // 任务组名字典
  jobGroupOptions: [],
  // 状态字典
  statusOptions: [],
  // 表单校验
  ruleRules: {
    jobName: [
      { required: true, message: "任务名称不能为空", trigger: "blur" },
    ],
    invokeTarget: [
      {
        required: true,
        message: "调用目标不能为空",
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

  state.isShowDialog = true;
  state.loading = false;
  // 查询定时任务状态数据定时任务
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
  // 查询定时任务的任务组名字典
  proxy.getDicts("sys_job_group").then((response: any) => {
    state.jobGroupOptions = response.data;
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
      if (state.ruleForm.jobId != undefined && state.ruleForm.jobId != 0) {
        updateJob(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      } else {
        addJob(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          state.loading = false;
          closeDialog(state.ruleForm); // 关闭弹窗
        });
      }
    }
  });
};

defineExpose({
  openDialog,
});
</script>
