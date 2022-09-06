<template>
  <h2>
    <img :src="serviceTaskIcon" />
    服务任务
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
    <el-tab-pane label="服务配置" name="second">
      <el-form :model="data.properties" label-position="left" label-width="80px">
        <el-form-item label="服务分类">
          <el-select v-model="data.properties.serviceType" placeholder="要操作的服务类型">
            <el-option value="mail" label="发邮件"/>
            <el-option value="rest" label="HTTP调用"/>
            <el-option value="task" label="脚本执行"/>
          </el-select>
        </el-form-item>
        <el-form-item label="选择服务" >
          <el-select v-model="data.properties.serviceValue" placeholder="请选择要操作的服务">
            <el-option value="dingTalk" label="钉钉消息提醒"/>
            <el-option value="weChat" label="企业微信消息提醒"/>
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
import { serviceTaskIcon } from '../icons';
import Help from '../../../help/help.vue'
import './style.css';

const data = usePropertiesPanelData()

const content = {
  "title": "服务任务",
  "sketch": "主要包括发邮件，发钉钉机器人，执行脚本等",
  "description": "根据运行结果进行服务的运行，例如想要将结果发送邮件的形式发送给用户，选择服务类型之前需要先在外部配置服务分类及服务"
}
</script>
