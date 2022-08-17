<template>
  <div class="personal">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" header="个人信息">
          <div class="personal-user">
            <div class="personal-user-left">
              <el-upload
                class="h100 personal-user-left-upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :limit="1"
              >
                <img :src="getUserInfos.photo" />
              </el-upload>
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col :span="24" class="personal-title mb18"
                  >{{ currentTime }}，{{
                    getUserInfos.username || "匿名"
                  }}，生活变的再糟糕，也不妨碍我变得更好！
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">昵称：</div>
                      <div class="personal-item-value">
                        {{ getUserInfos.username || "匿名" }}
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">当前角色：</div>
                      <div class="personal-item-value">超级管理</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">登录IP：</div>
                      <div class="personal-item-value">
                        {{ getUserInfos.lastLoginIp || "192.168.1.1" }}
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">登录时间：</div>
                      <div class="personal-item-value">
                        {{ parseTime(getUserInfos.lastLoginTime) }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>消息通知</span>
            <span class="personal-info-more">更多</span>
          </template>
          <div class="personal-info-box">
            <ul class="personal-info-ul">
              <li v-for="(v, k) in state.newsInfoList" :key="k" class="personal-info-li">
                <a :href="v.link" target="_block" class="personal-info-li-title">{{
                  v.title
                }}</a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 营销推荐 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15" header="精通语言">
          <el-row :gutter="15" class="personal-recommend-row">
            <el-col
              :sm="6"
              v-for="(v, k) in state.recommendList"
              :key="k"
              class="personal-recommend-col"
            >
              <div class="personal-recommend" :style="{ 'background-color': v.bg }">
                <SvgIcon :name="v.icon" :style="{ color: v.iconColor }" />
                <div class="personal-recommend-auto">
                  <div>{{ v.title }}</div>
                  <div class="personal-recommend-msg">{{ v.msg }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 更新信息 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
          <div class="personal-edit-title">基本信息</div>
          <el-form :model="personalForm" label-width="40px" class="mt35 mb35">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="昵称">
                  <el-input
                    v-model="personalForm.name"
                    placeholder="请输入昵称"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="邮箱">
                  <el-input
                    v-model="personalForm.email"
                    placeholder="请输入邮箱"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="签名">
                  <el-input
                    v-model="personalForm.autograph"
                    placeholder="请输入签名"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="手机">
                  <el-input
                    v-model="personalForm.phone"
                    placeholder="请输入手机"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="性别">
                  <el-select
                    v-model="personalForm.sex"
                    placeholder="请选择性别"
                    clearable
                    class="w100"
                  >
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="4">
                <el-form-item>
                  <el-button type="primary">
                    <el-icon>
                      <elementPosition />
                    </el-icon>
                    更新个人信息
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="personal-edit-title mb15">账号安全</div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">账户密码</div>
                <div class="personal-edit-safe-item-left-value">当前密码强度：强</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary" @click="handler('password', true)"
                  >立即修改</el-button
                >
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">切换角色</div>
                <div class="personal-edit-safe-item-left-value">
                  如果所属多个角色可更换角色
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary" @click="handler('role', true)">立即更换</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">切换岗位</div>
                <div class="personal-edit-safe-item-left-value">
                  如果所属多个岗位可更换岗位
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary" @click="handler('post', true)">立即更换</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog v-model="state.dialogVisiblePassWord" title="密码修改" width="650px">
      <el-form :model="state.password" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="state.password.oldPassword" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="state.password.newPassword" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handler('password', false)">取消</el-button>
          <el-button type="primary" @click="updatePassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="state.dialogVisibleRole" title="切换角色" width="650px">
      <el-select v-model="state.roleId" placeholder="请选择">
        <el-option
          v-for="item in state.roleOptions"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        ></el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handler('role', false)">取消</el-button>
          <el-button type="primary" @click="updateRole">确认切换</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="state.dialogVisiblePost" title="切换岗位" width="650px">
      <el-select v-model="state.postId" placeholder="请选择">
        <el-option
          v-for="item in state.postOptions"
          :key="item.postId"
          :label="item.postName"
          :value="item.postId"
        ></el-option>
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handler('post', false)">取消</el-button>
          <el-button type="primary" @click="updatePost">确认切换</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { toRefs, reactive, computed, onMounted } from "vue";
import { formatAxis } from "@/utils/formatTime";

import { useUserInfosState } from "@/stores/userInfos";
import { newsInfoList, recommendList } from "./mock";
import { updateUserPwd, getRoPo, updateUser } from "@/api/system/user";
import { ElMessage } from "element-plus";
import { Session } from "@/utils/storage";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { t } = useI18n();

const userInfos = useUserInfosState();
const state = reactive({
  newsInfoList,
  recommendList,
  dialogVisiblePassWord: false,
  dialogVisiblePost: false,
  dialogVisibleRole: false,
  password: {
    newPassword: "",
    oldPassword: "",
  },
  roleId: "",
  postId: "",
  roleOptions: [],
  postOptions: [],
  personalForm: {
    name: "",
    email: "",
    autograph: "",
    phone: "",
    sex: "",
  },
});
const { personalForm } = toRefs(state);
// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());bito
});
// 获取用户信息 vuex
const getUserInfos = computed(() => {
  return userInfos.userInfos;
});
const handler = (ty: string, bl: boolean) => {
  switch (ty) {
    case "password":
      state.dialogVisiblePassWord = bl;
      break;
    case "role":
      state.dialogVisibleRole = bl;
      break;
    case "post":
      state.dialogVisiblePost = bl;
      break;
  }
};

const updatePassword = async () => {
  updateUserPwd(state.password).then((res: any) => {
    ElMessage.success("密码修改成功");
    state.dialogVisiblePassWord = false;
  });
};
const updateRole = async () => {
  updateUser({
    userId: userInfos.userInfos.userId,
    roleId: state.roleId,
  }).then((res: any) => {
    ElMessage.success("角色切换成功");
    state.dialogVisibleRole = false;

    Session.clear(); // 清除缓存/token等
    router.push("/login");
    setTimeout(() => {
      ElMessage.success(t("message.user.logOutSuccess"));
    }, 300);
  });
};

const updatePost = async () => {
  updateUser({
    userId: userInfos.userInfos.userId,
    postId: state.postId,
  }).then((res: any) => {
    ElMessage.success("岗位切换成功");
    state.dialogVisiblePost = false;
  });
};
onMounted(() => {
  getRoPo().then((res: any) => {
    state.roleOptions = res.data.roles;
    state.postOptions = res.data.posts;
  });
  state.roleId = userInfos.userInfos.roleId;
  state.postId = userInfos.userInfos.postId;
});
</script>

<style scoped lang="scss">
@import "../../theme/mixins/mixins.scss";
.personal {
  .personal-user {
    height: 130px;
    display: flex;
    align-items: center;
    .personal-user-left {
      width: 100px;
      height: 100px;
      border-radius: 3px;
      ::v-deep(.el-upload) {
        height: 100%;
      }
      .personal-user-left-upload {
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
        &:hover {
          img {
            animation: logoAnimation 0.3s ease-in-out;
          }
        }
      }
    }
    .personal-user-right {
      flex: 1;
      padding: 0 15px;
      .personal-title {
        font-size: 18px;
        @include text-ellipsis(1);
      }
      .personal-item {
        display: flex;
        align-items: center;
        font-size: 13px;
        .personal-item-label {
          color: var(--el-text-color-secondary);
          @include text-ellipsis(1);
        }
        .personal-item-value {
          @include text-ellipsis(1);
        }
      }
    }
  }
  .personal-info {
    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;
      &:hover {
        color: var(--color-primary);
        cursor: pointer;
      }
    }
    .personal-info-box {
      height: 130px;
      overflow: hidden;
      .personal-info-ul {
        list-style: none;
        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;
          .personal-info-li-title {
            display: inline-block;
            @include text-ellipsis(1);
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }
          & a:hover {
            color: var(--color-primary);
            cursor: pointer;
          }
        }
      }
    }
  }
  .personal-recommend-row {
    .personal-recommend-col {
      .personal-recommend {
        position: relative;
        height: 100px;
        color: var(--color-whites);
        border-radius: 3px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          i {
            right: 0px !important;
            bottom: 0px !important;
            transition: all ease 0.3s;
          }
        }
        i {
          position: absolute;
          right: -10px;
          bottom: -10px;
          font-size: 70px;
          transform: rotate(-30deg);
          transition: all ease 0.3s;
        }
        .personal-recommend-auto {
          padding: 15px;
          position: absolute;
          left: 0;
          top: 5%;
          .personal-recommend-msg {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .personal-edit {
    .personal-edit-title {
      position: relative;
      padding-left: 10px;
      color: var(--el-text-color-regular);
      &::after {
        content: "";
        width: 2px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: var(--color-primary);
      }
    }
    .personal-edit-safe-box {
      border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
      padding: 15px 0;
      .personal-edit-safe-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .personal-edit-safe-item-left {
          flex: 1;
          overflow: hidden;
          .personal-edit-safe-item-left-label {
            color: var(--el-text-color-regular);
            margin-bottom: 5px;
          }
          .personal-edit-safe-item-left-value {
            color: var(--el-text-color-secondary);
            @include text-ellipsis(1);
            margin-right: 15px;
          }
        }
      }
      &:last-of-type {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}
</style>
