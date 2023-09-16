<template>
  <el-dialog v-model="state.isShowAllot" width="769px" title="分配给组织" center draggable>
    <el-form
        :model="state.ruleForm"
        :rules="state.ruleRules"
        ref="ruleFormRef"
        label-width="80px"
    >
      <el-form-item label="归属组织" prop="organizationId">
        <el-cascader
            v-model="state.ruleForm.orgId"
            :options="state.organizationOptions"
            :props="{
                  label: 'organizationName',
                  value: 'organizationId',
                  checkStrictly: true,
                  emitPath: false,
                }"
            class="w100"
            clearable
            filterable
            placeholder="请选择归属组织"
            :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="state.loading">分 配</el-button>
        </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup name="allotDevice">
import {reactive,ref, unref, getCurrentInstance} from "vue";
import {treeselect} from "@/api/system/organization";
import {ElMessage} from "element-plus";
import {allotDevice} from "@/api/device/device";

const { proxy } = getCurrentInstance() as any;
const ruleFormRef = ref()
const state = reactive({
  loading: false,
  isShowAllot: false,
  organizationOptions: [],
  ruleForm: {
    id: "",
    orgId: ""
  },
  ruleRules: {
    orgId: [
      { required: true, message: "所属组织不能为空", trigger: "blur" },
    ],
  }
})

const openDialog = (row: any) => {
  console.log(row.orgId)
  state.isShowAllot = true;
  state.ruleForm.id = row.id
  state.ruleForm.orgId = row.orgId
  getTreeselect()
}

const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditDeviceModule", row);
  state.isShowAllot = false;
};

const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      allotDevice(state.ruleForm.id, {orgId: state.ruleForm.orgId}).then((res:any)=>{
        if (res.code === 200){
          ElMessage.success("分配成功");
          closeDialog(); // 关闭弹窗
        }
        state.loading = false;
      })
    }
  });
};

/** 查询组织下拉树结构 */
const getTreeselect = async () => {
  treeselect().then((response) => {
    state.organizationOptions = response.data;
  });
};

defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>
