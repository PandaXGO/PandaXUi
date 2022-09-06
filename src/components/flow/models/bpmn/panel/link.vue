<template>
  <h2>{{ title }}</h2>
  <el-divider/>
  <el-tabs model-value="first">
    <el-tab-pane label="常规" name="first">
      <el-form :model="data" label-position="left" label-width="50px">
        <el-form-item label="编号" prop="id">
          <el-input v-model:value="data.id" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="text">
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
    <el-tab-pane label="连线配置" name="second">
      <el-form :model="data.properties" label-position="left" label-width="100px">
        <el-form-item label="连线属性" >
          <el-select v-model="data.properties.attribute" placeholder="选择流转属性">
            <el-option value="yes" label="YES"/>
            <el-option value="no" label="NO"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="帮助" name="third">
      <help :content="content"></help>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { usePropertiesPanelData } from '../../../useapi';
import { ref} from 'vue';
import Help from '../../../help/help.vue'
import './style.css';

const data = usePropertiesPanelData()
const title = ref('连线面板')
const content = {
  "title": "连线",
  "sketch": "组件之间的关联通过连线完成",
  "description":"将上一个组件的锚点与后一个组件锚点进行连接, 完成流程的连接"
}
</script>
