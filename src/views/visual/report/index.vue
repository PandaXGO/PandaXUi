<template>
  <div class="app-container">
    <el-card class="box-card">
      <div class="content_box">
        <div v-for="data in state.tableData" class="content_item">
          <el-card :body-style="{ padding: '0px' }" class="ft-card">
            <el-image class="ft-image" :src="nilImg" fit="fill"></el-image>
            <div class="ft-foot">
              <dev class="ft-item-name">{{data.name}}</dev>
              <div>
                <span style="margin-right: 5px">
                  {{data.updateDate}}
                </span>
                <el-popover  >
                  <template #reference>
                    <el-button type="primary" circle size="small"><SvgIcon name="elementStar"/></el-button>
                  </template>
                  <div>
                    <router-link
                        v-auth="'visual:report:design'" target="_blank"
                        :to="{ path: '/report/edit', query: { name: data.name } }"
                    >
                      <el-button text type="primary">
                        <SvgIcon name="elementDiscount"/>设计
                      </el-button>
                    </router-link>
                  </div>
                  <div>
                    <router-link
                        v-auth="'visual:report:view'" target="_blank"
                        :to="{ path: '/report/view', query: { name: data.name }}"
                    >
                      <el-button text type="primary">
                        <SvgIcon name="elementView"/>预览
                      </el-button>
                    </router-link>
                  </div>
                  <div>
                    <el-button text type="primary" v-auth="'visual:report:delete'" @click="onTabelRowDel(data)">
                      <SvgIcon name="elementDelete" />删除
                    </el-button>
                  </div>
                </el-popover>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="Chain">
import {
  ref,
  reactive,
  onMounted,
  getCurrentInstance,
} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import axios from 'axios';

import nilImg from '@/assets/nil-img.png'
const { proxy } = getCurrentInstance() as any;
const editModuleRef = ref();
const service = axios.create({
  baseURL: import.meta.env.VITE_REPORT_URL as any,
  timeout: 50000,
});
const state:any = reactive({
  // 遮罩层
  loading: true,
  // 表格数据
  tableData: [],
});

/** 查询列表 */
const handleQuery = () => {
  state.loading = true;
  service({
    url: "/designer/getList",
    method: "post"
  }).then((res)=>{
    state.tableData = res.data;
    state.loading = false
  })
};

/** 删除按钮操作 */
const onTabelRowDel = (row: any) => {
  const name = row.name
  ElMessageBox({
    message: '是否确认删除名称为为"' + name + '"的数据项?',
    title: "警告",
    showCancelButton: true,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    service({
      url: "/designer/remove?file=file:"+name,
      method: "post"
    }).then((res)=>{
      handleQuery();
      ElMessage.success("删除成功");
    })
  });
};

// 页面加载时
onMounted(() => {
  // 查询岗位信息
  handleQuery();
});

</script>

<style lang="scss" scoped>

</style>
