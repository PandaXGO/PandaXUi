<!--整个面板信息-->
<template>
  <h2>{{ title }}</h2>
  <el-divider/>
  <el-timeline>
    <el-timeline-item timestamp="步骤1" color="#0bbd87" placement="top">
      <el-card>
        <h4>拖拽节点到画布</h4>
        <p>拖拽左侧节点到右侧画布</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="步骤2" color="#6b1b6b" placement="top">
      <el-card>
        <h4>节点流程连线</h4>
        <p>将前后两个节点进行连线</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="步骤3" color="#b03977" placement="top">
      <el-card>
        <h4>节点内容配置</h4>
        <p>根据业务逻辑编辑节点内容</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="步骤4" color="#bd7c39" placement="top">
      <el-card>
        <h4>节点保存</h4>
        <p>全部完成后可预览查看，最后保存</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { usePropertiesPanelData } from '../../../useapi';
import { ref } from 'vue';
import './style.css';
const data = usePropertiesPanelData()
const title = ref('流程详细信息')
</script>
