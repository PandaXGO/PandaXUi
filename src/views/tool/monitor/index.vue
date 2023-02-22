<template>
  <div>
    <el-row :gutter="15" class="system_state">
      <el-col v-if="state.os" :span="12">
        <el-card class="card_item">
          <template #header>
            <div>运行资源</div>
          </template>
          <div>
            <el-row :gutter="10" class="row">
              <el-col :span="12">操作系统:</el-col>
              <el-col :span="12" v-text="state.os.goOs" />
            </el-row>
            <el-row :gutter="10" class="row">
              <el-col :span="12">arch:</el-col>
              <el-col :span="12" v-text="state.os.arch" />
            </el-row>
            <el-row :gutter="10" class="row">
              <el-col :span="12">compiler:</el-col>
              <el-col :span="12" v-text="state.os.compiler" />
            </el-row>
            <el-row :gutter="10" class="row">
              <el-col :span="12">Go语言版本:</el-col>
              <el-col :span="12" v-text="state.os.version" />
            </el-row>
            <el-row :gutter="10" class="row">
              <el-col :span="12">协程数:</el-col>
              <el-col :span="12" v-text="state.os.numGoroutine" />
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="state.disk" :span="12">
        <el-card class="card_item">
          <template #header>
            <div>硬盘资源</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-row :gutter="10" class="row">
                  <el-col :span="12">总数 (GB)</el-col>
                  <el-col :span="12" v-text="state.disk.total" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">已使用 (GB)</el-col>
                  <el-col :span="12" v-text="state.disk.used" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">剩余 (GB)</el-col>
                  <el-col :span="12" v-text="state.disk.free" />
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress
                  type="dashboard"
                  :percentage="state.disk.progress"
                  :color="state.colors"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="system_state">
      <el-col v-if="state.cpu" :span="12">
        <el-card
          class="card_item"
          :body-style="{ height: '180px', 'overflow-y': 'scroll' }"
        >
          <template #header>
            <div>CPU</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-row :gutter="10" class="row">
                  <el-col :span="12">核数 (个)</el-col>
                  <el-col :span="12" v-text="state.cpu.num" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">用户态比率 (%)</el-col>
                  <el-col :span="12" v-text="state.cpu.used" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">空闲比率 (%)</el-col>
                  <el-col :span="12" v-text="state.cpu.free" />
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress
                  type="dashboard"
                  :percentage="state.cpu.used"
                  :color="state.colors"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="state.mem" :span="12">
        <el-card class="card_item">
          <template #header>
            <div>内存</div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-row :gutter="10" class="row">
                  <el-col :span="12">总数 (GB)</el-col>
                  <el-col :span="12" v-text="state.mem.total" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">已使用 (GB)</el-col>
                  <el-col :span="12" v-text="state.mem.used" />
                </el-row>
                <el-row :gutter="10" class="row">
                  <el-col :span="12">剩余 (GB)</el-col>
                  <el-col :span="12" v-text="state.mem.free" />
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-progress
                  type="dashboard"
                  :percentage="state.mem.progress"
                  :color="state.colors"
                />
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { getServer } from "@/api/tool/monitor";
import {ElMessage} from "element-plus";

const state = reactive({
  os: undefined,
  mem: undefined,
  cpu: undefined,
  disk: undefined,
  colors: [
    { color: "#5cb87a", percentage: 20 },
    { color: "#e6a23c", percentage: 40 },
    { color: "#f56c6c", percentage: 80 },
  ],
});
const handle = () => {
  getServer().then((res: any) => {
    if (res.code == 200) {
      state.os = res.os;
      state.mem = res.mem;
      state.cpu = res.cpu;
      state.disk = res.disk;
    } else {
      ElMessage.error("获取服务信息失败");
    }
  });
};
onMounted(() => {
  handle();
});
</script>

<style scoped>
.system_state {
  padding: 10px;
}
.card_item {
  height: 280px;
}
.row {
  margin-bottom: 20px;
}
</style>
