<template>
    <div class="system-notice-container">
        <el-dialog title="公告内容" v-model="conOpen" width="769px" center>
            <el-descriptions
                    :column="2"
                    border
            >
                <el-descriptions-item width="100" label="标题">
                    {{content.title}}
                </el-descriptions-item>
                <el-descriptions-item width="100" label="通知类型">
                    {{noticeTypeFormat(content)}}
                </el-descriptions-item>
                <el-descriptions-item width="100" label="通知内容">
                    <editor id="view" v-model="content.content" :isDisable="true"></editor>
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import Editor from '@/components/editor/index.vue';
    import {getCurrentInstance, reactive, toRefs} from "vue";
    export default {
        name: "viewModule",
        components: {
            Editor,
        },
        setup() {
            const { proxy } = getCurrentInstance() as any;
            const state = reactive({
                noticeTypeOptions: [],
                conOpen:false,
                content: "",
            });
            const openDialog = (row: any) => {
                console.log(row)
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
            return {
                openDialog,
                noticeTypeFormat,
                ...toRefs(state),
            };
        }
    }
</script>

<style scoped>

</style>