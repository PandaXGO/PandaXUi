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
    <el-tab-pane label="网关配置" name="second">
      <el-form :model="data.properties" label-position="left" label-width="80px">
        <el-form-item label="网关分类">
          <el-select v-model="data.properties.gatewayType" placeholder="请选择网关">
            <el-option value="exclude" label="排他网关"/>
            <el-option value="parallel" label="并行网关"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.properties.gatewayType == 'exclude'" label="网关条件" >
          <el-input v-model="data.properties.condition"/>
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
import { userTaskIcon } from '../icons';
import Help from './help.vue'
import './style.css';

const data = usePropertiesPanelData()
const content = {
  "title": "网关",
  "sketch": "网关组件主要包含两个排他网关、并行网关",
  "description": "排他网关：在平时的业务中，有的时候需要根据表单数据的值来判断跳转到啥位置。例如：如果申请的服务器价格低于1000元就是部门领导审批，如果超过1000元，那么就是CTO审批。为兼容这种情况因此加入了排他网关的概念。" +
          "\n" +
          "此外还需注意，如果使用了排他网关，则必须有一个条件判断是正确的，否则流程将无法进行下去，报错失败。并行网关：在日常的工作中，可能会有需要多个处理人并行进行处理，只有所有的处理人都完成处理才可以跳转到下一个阶段。基于这种情况的出现，因此有了并行网关的概念"
}
</script>
