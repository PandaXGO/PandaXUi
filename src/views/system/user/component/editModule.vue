<template>
  <div class="system-menu-container">
    <el-dialog v-model="state.isShowDialog" width="769px" center>
      <template #header>
        <div style="font-size: large" v-drag="['.system-menu-container .el-dialog', '.system-menu-container .el-dialog__header']">{{title}}</div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="state.ruleForm"
        :rules="state.ruleRules"
        label-width="80px"
      >
        <el-row :gutter="35">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="state.ruleForm.nickName"
                placeholder="请输入用户昵称"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="归属租户" prop="tenantId">
              <el-cascader
                      v-model="state.ruleForm.tenantId"
                      :options="state.tenantOptions"
                      :props="{
                        label: 'tenantName',
                        value: 'id',
                        checkStrictly: true,
                        emitPath: false,
                      }"
                      class="w100"
                      clearable
                      filterable
                      placeholder="请选择归属租户"
                      :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col v-if="state.ruleForm.userId == undefined" :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item

                    label="用户名称"
                    prop="username"
            >
              <el-input
                      v-model="state.ruleForm.username"
                      placeholder="请输入用户名称"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="state.ruleForm.userId == undefined" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item
                    label="用户密码"
                    prop="password"
            >
              <el-input
                      v-model="state.ruleForm.password"
                      placeholder="请输入用户密码"
                      type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input
                v-model="state.ruleForm.phone"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="state.ruleForm.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="state.ruleForm.sex" placeholder="请选择">
                <el-option
                  v-for="dict in state.sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="角色">
              <el-select v-model="state.roleIds" multiple placeholder="请选择">
                <el-option
                        v-for="item in state.roleOptions"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                        :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" >
            <el-form-item label="归属部门" prop="deptId">
              <el-cascader
                  v-model="state.ruleForm.deptId"
                  :options="state.deptOptions"
                  :props="{
                  label: 'deptName',
                  value: 'deptId',
                  checkStrictly: true,
                  emitPath: false,
                }"
                  class="w100"
                  clearable
                  filterable
                  placeholder="请选择归属部门"
                  :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="岗位">
              <el-select v-model="state.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in state.postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="状态">
              <el-radio-group v-model="state.ruleForm.status">
                <el-radio
                        v-for="dict in state.statusOptions"
                        :key="dict.dictValue"
                        :label="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" >
            <el-form-item label="备注">
              <el-input
                v-model="state.ruleForm.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
import { treeselect } from "@/api/system/dept";
import { updateUser, addUser, getUser, getUserInit } from "@/api/system/user";
import { allSysTenants } from "@/api/system/tenant";
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
  // 默认密码
  // 性别状态字典
  sexOptions: [],
  // 角色选项
  roleOptions: [],
  // 状态数据字典
  statusOptions: [],
  // 部门树选项
  deptOptions: [],
  tenantOptions: [],
  // 岗位选项
  postOptions: [],
  ruleForm: {
    userId: undefined, // 用戶ID
    tenantId: undefined,
    username: "", // 用戶名称
    nickName: "", // 用戶昵称
    deptId: "", // 部门ID
    roleId: "", // 角色ID
    postId: "", // 岗位ID
    phone: "", // 手机号
    email: "", // 邮箱
    status: "", //用户状态
    password: "", // 用户密码
    avatar: "", // 用户头像
    sex: "", // 性别
    remark: "", // 备注
    postIds: "",
    roleIds: "",
  },
  postIds: [],
  roleIds: [],
  // 显示状态数据字典
  isHideOptions: [],
  // 菜单类型数据字典
  menuTypeOptions: [],
  // 数字是否数据字典
  yesOrNoOptions: [],
  // 菜单树选项
  menuOptions: [],
  // 表单校验
  ruleRules: {
    username: [
      { required: true, message: "用户名称不能为空", trigger: "blur" },
    ],
    nickName: [
      { required: true, message: "用户昵称不能为空", trigger: "blur" },
    ],
    password: [
      { required: true, message: "用户密码不能为空", trigger: "blur" },
    ],
    email: [
      {
        type: "email",
        message: "'请输入正确的邮箱地址",
        trigger: ["blur", "change"],
      },
    ],
    phone: [
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: "请输入正确的手机号码",
        trigger: "blur",
      },
    ],
  },
});
// 打开弹窗
const openDialog = (row: any) => {
  if (row && row.userId && row.userId != undefined && row.userId != 0) {
    getUser(row.userId).then((response: any) => {
      state.ruleForm = response.data.data;
      state.postOptions = response.data.posts;
      state.roleOptions = response.data.roles;
      state.deptOptions = response.data.depts;
      state.postIds = response.data.postIds.split(",").map((item: string)=>{
        return Number(item)
      });
      state.roleIds = response.data.roleIds.split(",").map((item: string)=>{
        return Number(item)
      });
      state.ruleForm.password = ""
    });
  } else {
    getUserInit().then(response => {
      state.postOptions = response.data.posts
      state.roleOptions = response.data.roles
    })
    state.ruleForm = JSON.parse(JSON.stringify(row));
  }
  //getTreeselect();
  getTenants();
  state.isShowDialog = true;
  state.loading = false;
  // 查询显示性別数据字典
  proxy.getDicts("sys_user_sex").then((response: any) => {
    state.sexOptions = response.data;
  });
  // 查询显示狀態数据字典
  proxy.getDicts("sys_normal_disable").then((response: any) => {
    state.statusOptions = response.data;
  });
};
// 关闭弹窗
const closeDialog = (row?: object) => {
  proxy.mittBus.emit("onEditUserModule", row);
  state.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
/** 查询部门下拉树结构 */
const getTreeselect = async () => {
  treeselect().then((response) => {
    state.deptOptions = response.data;
  });
};
/** 查询租户结构 */
const getTenants = async () => {
  allSysTenants().then((response) => {
    state.tenantOptions = response.data;
  });
};
/** 提交按钮 */
const onSubmit = () => {
  const formWrap = unref(ruleFormRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.ruleForm.postId = state.postIds[0]
      state.ruleForm.roleId = state.roleIds[0]
      state.ruleForm.postIds = state.postIds.join(',')
      state.ruleForm.roleIds = state.roleIds.join(',')
      state.loading = true;
      if (state.ruleForm.userId != undefined) {
        updateUser(state.ruleForm).then((response) => {
          ElMessage.success("修改成功");
          state.loading = false;
          closeDialog(); // 关闭弹窗
        });
      } else {
        addUser(state.ruleForm).then((response) => {
          ElMessage.success("新增成功");
          state.loading = false;
          closeDialog(); // 关闭弹窗
        });
      }
    }
  });
};

// 头像上传
const handleAvatarSuccess = (file: any) => {
  //   state.imageUrl = URL.createObjectURL(file.raw);
};
// 头像上传前校验
const beforeAvatarUpload = (file: any) => {
  const isJPG = file.type === "image/jpeg";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传头像图片只能是 JPG 格式!");
  }
  if (!isLt2M) {
    ElMessage.error("上传头像图片大小不能超过 2MB!");
  }
  return isJPG && isLt2M;
};

defineExpose({
  openDialog,
});

</script>
<style scoped lang="scss">
.updateUser {
  height: 100%;
  overflow: auto;
  padding-bottom: 53px;
  width: 600px;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 108px;
  height: 108px;
  margin: 8px;
  line-height: 108px;
  border-radius: 4px;
  text-align: center;
  background-color: #fafafa;
  border: 1px dashed #d9d9d9;
}

.avatar {
  width: 108px;
  height: 108px;
  margin: 8px;
  border-radius: 4px;
  display: block;
}
</style>