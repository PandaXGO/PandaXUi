<template>
    <div class="system-notice-container">
        <el-dialog title="公告内容" v-model="state.conOpen" width="769px" center>
            <el-descriptions
                    :column="2"
                    border
            >
                <el-descriptions-item width="100" label="标题">
                    {{state.content.title}}
                </el-descriptions-item>
                <el-descriptions-item width="100" label="通知类型">
                    {{noticeTypeFormat(state.content)}}
                </el-descriptions-item>
                <el-descriptions-item width="100" label="通知内容">
                    <editor id="view" v-model="state.content.content" :isDisable="true"></editor>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup name="viewModule">
import Editor from '@/components/editor/index.vue';
import {getCurrentInstance, reactive} from "vue";

const { proxy } = getCurrentInstance() as any;
const state = reactive({
  noticeTypeOptions: [],
  conOpen:false,
  content: {},
});
const openDialog = (row: any) => {
  state.content = row
  state.conOpen =true
  proxy.getDicts("sys_notice_type").then((response: any) => {
    state.noticeTypeOptions = response.data;
  });
};
// 定时任务状态定时任务翻译
const noticeTypeFormat = (row: any, column: any) => {
  return proxy.selectDictLabel(state.noticeTypeOptions, row.noticeType);
};

defineExpose({
  openDialog,
});

</script>

<style scoped>

</style>