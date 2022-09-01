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
      <el-form :model="data.properties" label-position="left" label-width="90px">
        <el-form-item label="参与者类型" >
          <el-select v-model="data.properties.assignType" placeholder="人员/角色/表达式">
            <el-option value="user" label="人员"/>
            <el-option value="role" label="角色"/>
            <el-option value="dept" label="部门"/>
          </el-select>
        </el-form-item>

        <el-form-item v-if="data.properties.assignType == 'user'" label="审批人" prop="properties">
          <el-select v-model="data.properties.assignValue" multiple placeholder="选择审批人">
            <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            />
          </el-select>
         </el-form-item>
        <el-form-item v-if="data.properties.assignType == 'dept'" label="审批部门" prop="properties">
          <el-select v-model="data.properties.assignValue" placeholder="选择审批部门">
            <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="data.properties.assignType == 'role'" label="审批角色" prop="properties">
          <el-select v-model="data.properties.assignValue" placeholder="选择审批角色">
            <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分配策略">
          <el-select v-model="data.properties.slg" placeholder="抢任务/会签">
            <el-option value="single" label="抢任务"/>
            <el-option value="counterSign" label="会签"/>
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
  import { ref } from 'vue'
import { usePropertiesPanelData } from '../../../useapi';
import { userTaskIcon } from '../icons';
  import Help from './help.vue'
import './style.css';

const data = usePropertiesPanelData()

const value = ref('')

const userOptions = [
    {
      value: 'Option1',
      label: 'Option1',
    },
    {
      value: 'Option2',
      label: 'Option2',
    },
    {
      value: 'Option3',
      label: 'Option3',
    },
    {
      value: 'Option4',
      label: 'Option4',
    },
    {
      value: 'Option5',
      label: 'Option5',
    },
  ]
const content = {
    "title": "用户任务",
    "sketch": "使不同的参与者进行审批",
    "description": "可以设置用户，角色，部门的进行流程审批"
}
</script>
