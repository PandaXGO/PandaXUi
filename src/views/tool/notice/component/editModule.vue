<template>
  <div class="system-notice-container">
    <el-dialog v-model="isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.system-notice-container .el-dialog', '.system-notice-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        :model="ruleForm"
        :rules="ruleRules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-row class="mb20">
        <el-col :span="24">
          <el-form-item label="公告标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请输入公告标题" />
          </el-form-item>
        </el-col>
        </el-row>
        <el-row class="mb20">
        <el-col :span="12">
          <el-form-item label="公告类型" prop="noticeType">
            <el-select v-model="ruleForm.noticeType" placeholder="请选择">
              <el-option
                      v-for="dict in noticeTypeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="通知部门" prop="deptId">
            <el-cascader
                    v-model="ruleForm.deptId"
                    :options="deptOptions"
                    class="w100"
                    :props="{
                  value: 'deptId',
                  label: 'deptName',
                  checkStrictly: true,
                  emitPath: false,
                }"
                    clearable
                    placeholder="选择通知部门"
                    :show-all-levels="false"
            ></el-cascader>
          </el-form-item>
        </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="通知内容" prop="content">
            <Editor v-model="ruleForm.content"></Editor>
          </el-form-item>
        </el-col>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, unref, getCurrentInstance } from "vue";
import { addNotice, updateNotice } from "@/api/system/notice";
import { ElMessage } from "element-plus";
import {treeselect} from "@/api/system/dept";
import Editor from '@/components/editor/index.vue';

export default {
  name: "editMenu",
  components: {
    Editor,
  },
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: () => "",
    },
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const ruleFormRef = ref<HTMLElement | null>(null);
    const state = reactive({
      // 是否显示弹出层
      isShowDialog: false,
      loading: false,
      // 表单参数对象
      ruleForm: {
        noticeId: 0,  // 公告ID
        title: "",    // 公告名称
        noticeType: "", // 公告类型
        deptId: 0,      // 指派部门
        content: "",     //内容
      },
      // 公告类型字典
      noticeTypeOptions: [],
      // 部门
      deptOptions: [],
      // 表单校验
      ruleRules: {
        title: [
          { required: true, message: "公告名称不能为空", trigger: "blur" },
        ],
        noticeType: [
                {required: true, message: "公告类型不能为空", trigger: "blur",},
        ],
      },
    });
    // 打开弹窗
    const openDialog = (row: any) => {
      // 初始化编辑器
      if (row.noticeId && row.noticeId != undefined && row.noticeId != "") {
        state.ruleForm = row;
        state.ruleForm.noticeId = row.noticeId;
        state.ruleForm.title = row.title;
        state.ruleForm.noticeType = row.noticeType;
        state.ruleForm.deptId = row.deptId;
        state.ruleForm.content = row.content;
      } else {
        initForm();
        state.ruleForm.content = "";
      }

      state.isShowDialog = true;
      state.loading = false;
      // 查询公告类型名字典
      proxy.getDicts("sys_notice_type").then((response: any) => {
        state.noticeTypeOptions = response.data;
      });
      // 查询部门下拉树结构
      treeselect().then((response: any) => {
        state.deptOptions = [];
        const dept = { deptId: 0, deptName: '全部部门', children: [] }
        dept.children = response.data
        state.deptOptions.push(dept)
      });
    };
    const getWangEditorValue = (str:string) => {
      state.ruleForm.content = str;
    }
    // 关闭弹窗
    const closeDialog = (row?: object) => {
      proxy.mittBus.emit("onEditNoticeModule", row);
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
          if (state.ruleForm.noticeId != undefined && state.ruleForm.noticeId != 0) {
            updateNotice(state.ruleForm).then((response) => {
              ElMessage.success("修改成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          } else {
            addNotice(state.ruleForm).then((responseya) => {
              ElMessage.success("新增成功");
              state.loading = false;
              closeDialog(state.ruleForm); // 关闭弹窗
            });
          }
        }
      });
    };
    // 表单初始化，方法：`resetFields()` 无法使用
    const initForm = () => {
      state.ruleForm.noticeId = 0;
      state.ruleForm.title = "";
      state.ruleForm.noticeType = "";
      state.ruleForm.deptId = 0;
      state.ruleForm.content = "";
    };

    return {
      ruleFormRef,
      openDialog,
      closeDialog,
      onCancel,
      initForm,
      onSubmit,
      getWangEditorValue,
      ...toRefs(state),
    };
  },
};
</script>
