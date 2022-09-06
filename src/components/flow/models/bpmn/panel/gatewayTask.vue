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
          <el-radio-group v-model="data.properties.modelRelation">
            <el-radio label="and">AND</el-radio>
            <el-radio label="or">OR</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="data.properties.gatewayType == 'exclude'">
          <el-table :data="data.properties.modelList" size="mini" border fit>
            <el-table-column label="参数" prop="modelParam" width="100" />
            <el-table-column label="比较" prop="modelCompare" width="60" show-overflow-tooltip />
            <el-table-column label="参数值" prop="modelValue" width="80" show-overflow-tooltip />
            <el-table-column label="操作">
              <template #default="scope">
                <el-popover  placement="left">
                  <template #reference>
                    <el-button size="small" type="primary" circle ><SvgIcon name="elementStar"/></el-button>
                  </template>
                  <div>
                    <el-button text type="primary" size="small" @click="openAttributesForm(scope.row, scope.$index)">
                      <SvgIcon name="elementEdit"/>
                      修改
                    </el-button>
                  </div>
                  <div>
                    <el-button text type="primary"  size="small" @click="removeAttributes(scope.row, scope.$index)">
                      <SvgIcon name="elementDelete"/>
                      移除
                    </el-button>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="element-drawer__button">
            <el-button size="small" type="primary" @click="openAttributesForm(null, -1)">
              <SvgIcon name="elementPlus"/>添加属性
            </el-button>
          </div>
        </template>

      </el-form>
    </el-tab-pane>
    <el-tab-pane label="帮助" name="third">
      <help :content="content"></help>
    </el-tab-pane>
  </el-tabs>

  <el-dialog v-model="propertyFormModelVisible" title="属性配置" width="600px" append-to-body destroy-on-close>
    <el-form :model="propertyForm" label-width="80px" center>
      <el-form-item label="参数：" prop="modelParam">
        <el-select v-model="propertyForm.modelParam" placeholder="请选择参数">
          <el-option value="exclude" label="年龄"/>
          <el-option value="parallel" label="金额"/>
        </el-select>
      </el-form-item>
      <el-form-item label="比较：" prop="modelCompare">
        <el-select v-model="propertyForm.modelCompare" placeholder="请选择参数比较">
          <el-option value=">" label=">"/>
          <el-option value="<" label="<"/>
        </el-select>
      </el-form-item>
      <el-form-item label="参数值：" prop="modelValue">
        <el-input v-model="propertyForm.modelValue" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="propertyFormModelVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAttribute">编 辑</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import {ref,nextTick} from 'vue'
import { usePropertiesPanelData } from '../../../useapi';
import { userTaskIcon } from '../icons';
import Help from '../../../help/help.vue'
import './style.css';

const propertyList= ref([])
const propertyForm =ref(null)
const editingPropertyIndex = ref(0)
const propertyFormModelVisible = ref(false)


const data = usePropertiesPanelData()
const content = {
  "title": "网关",
  "sketch": "网关组件主要包含两个排他网关、并行网关",
  "description": "排他网关：在平时的业务中，有的时候需要根据表单数据的值来判断跳转到啥位置。例如：如果申请的服务器价格低于1000元就是部门领导审批，如果超过1000元，那么就是CTO审批。为兼容这种情况因此加入了排他网关的概念。" +
          "\n" +
          "此外还需注意，如果使用了排他网关，则必须有一个条件判断是正确的，否则流程将无法进行下去，报错失败。<br/>并行网关：在日常的工作中，可能会有需要多个处理人并行进行处理，只有所有的处理人都完成处理才可以跳转到下一个阶段。基于这种情况的出现，因此有了并行网关的概念"
}

const openAttributesForm = (row:any, index:number) => {
   propertyFormModelVisible.value = true;
   propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(row));
   editingPropertyIndex.value = index
}

const removeAttributes = (row:any, index:number) => {
  propertyList.value.splice(index, 1);
  data.properties.modelList = propertyList.value
  console.log(data.properties.modelList)
}

const saveAttribute = () => {
  console.log(propertyForm)
    if (editingPropertyIndex.value !== -1) {
      propertyList.value[editingPropertyIndex.value] = propertyForm.value
    } else {
      propertyList.value.push(propertyForm.value)
    }
    console.log(propertyList)
    data.properties.modelList = propertyList.value
    propertyFormModelVisible.value = false;
    console.log(data.properties.modelList)
 }
</script>
