<template>
  <h2>
    <img :src="userTaskIcon" />
    用户任务
  </h2>
  <el-divider/>
  <el-tabs model-value="first">
    <el-tab-pane label="常规" name="first">
      <el-form :model="data" label-position="left" label-width="50px">
        <el-form-item label="编号:" prop="id">
          <el-input v-model:value="data.id" disabled />
        </el-form-item>
        <el-form-item label="名称:" prop="text">
          <el-input v-model="data.text"/>
        </el-form-item>
        <el-form-item label="描述:" prop="text">
          <el-input
              v-model="data.properties.description"
              :rows="2"
              type="textarea"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="参与者" name="second">
      <el-form :model="data.properties" label-position="left" label-width="100px">
        <el-form-item label="分配策略">
          <el-select v-model="data.properties.fpcl" placeholder="抢任务/会签">
            <el-option value="single" label="抢任务"/>
            <el-option value="single" label="会签"/>
          </el-select>
        </el-form-item>
        <el-form-item label="参与者类型" >
          <el-select v-model="data.properties.zxrlx" placeholder="人员/角色/表达式">
            <el-option value="users" label="人员"/>
            <el-option value="roles" label="角色"/>
            <el-option value="complexus" label="表达式"/>
          </el-select>
        </el-form-item>
        <el-form-item label="表达式" prop="properties">
          <el-input
              v-model="data.properties.zxr"
              :rows="2"
              type="textarea"
          />
        </el-form-item>
        <el-form-item label="描述" prop="properties">
          <el-input
              v-model="data.properties.ms"
              :rows="2"
              type="textarea"
          />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="表单" name="third">
      <el-form :model="data.properties" label-position="left" label-width="100px">
        <el-form-item label="表单模式">
          <el-select v-model="data.properties.formtype" placeholder="单表单/工作台加">
            <el-option value="single" label="单表单"/>
            <el-option value="complexus" label="复合表单"/>
          </el-select>
        </el-form-item>
        <el-form-item label="表单">
          <el-input placeholder="请输入表单组件名称或者url" v-model:value="data.properties.formurl" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { usePropertiesPanelData } from '../../../useapi';
import { userTaskIcon } from '../icons';
import './style.css';

const data = usePropertiesPanelData()
</script>
