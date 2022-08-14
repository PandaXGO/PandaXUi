<template>
  <h2>{{ title }}</h2>
  <el-divider/>
  <el-form :model="data" label-width="50px">
    <el-form-item label="编号" prop="id">
      <el-input v-model:value="data.id" />
    </el-form-item>
    <el-form-item label="名称" prop="text">
      <el-input v-model="data.text"/>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { usePropertiesPanelData } from '../../../useapi';
import { ref } from 'vue';
import './style.css';

const data = usePropertiesPanelData()
const title = ref('默认面板')
</script>
