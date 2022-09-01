<template>
    <div style="width:170px;margin: 5px 0 0 10px;">
        <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in nodeList" :title="item.title" :name="item.name" >
          <el-tooltip
              effect="dark"
              v-for="(baseNode, index) in item.baseNodes"
              :content="baseNode.content"
              placement="right"
          >
              <Dnd :normal="baseNode.normal" :baseNode="baseNode" @mousedown="startDrag(baseNode)"></Dnd>
          </el-tooltip>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<script lang="ts" setup>
    import {Search} from '@element-plus/icons-vue';
    import { endIcon, gatewayIcon, serviceTaskIcon, startIcon, userTaskIcon,selectIcon } from '../icons';
    import LogicFlow from "@logicflow/core"
    import { ref,watch } from 'vue'
    import Dnd from "@/components/flow/dndPanel/dnd.vue"
    const props = defineProps({
        lf: {
            type: LogicFlow,
            required: true,
        }
    })
    const nodeText = ref("")
    const activeNames = ref(['base'])
    const startDrag = (item:any) => {
        const { lf } = props;
        if (item.type == "bpmn:select"){
            lf.extension.selectionSelect.openSelectionSelect();
            lf.on("selection:selected", (data) => {
                lf.extension.selectionSelect.closeSelectionSelect();
            });
        }else {
            lf.dnd.startDrag({
                type: item.type,
                text: item.text
            })
        }
    }

    const nodeList = ref([
      {
         "title": "工具节点",
         "name": "tools",
         "baseNodes": [
            {
              type: 'bpmn:select',
              text: '选框',
              content: "选框工具，点击选框可在右侧画布选择",
              background: 'rgb(166, 187, 207)',
              icon: selectIcon,
              normal: "none",
            },
         ]
        },
      {
        "title": "基础节点",
        "name": "base",
        "baseNodes": [
          {
            type: 'start-node',
            text: '开始',
            content: "这个节点是开始",
            background: 'rgb(166, 187, 207)',
            icon: startIcon,
            normal: "right",
          },
          {
            type: 'stop-node',
            text: '结束',
            content: "这个节点是结束",
            background: 'rgb(193, 75, 51)',
            icon: endIcon,
            normal: "left",
          },
        ]
      },
      {
        "title": "任务节点",
        "name": "task",
        "baseNodes": [
            {
                type: 'user-node',
                text: '用户任务',
                content: "这个节点是用户任务",
                background: 'rgb(253, 208, 162)',
                icon: userTaskIcon
            },
            {
                type: 'service-node',
                text: '服务任务',
                content: "这个节点是服务任务",
                background: 'rgb(226, 217, 110)',
                icon: serviceTaskIcon
            },
        ]
      },
      {
          "title": "网关节点",
          "name": "gateway",
          "baseNodes": [
              {
                  type: 'gateway-node',
                  text: '网关',
                  content: "这个节点是网关节点",
                  background: 'rgb(32, 174, 137)',
                  icon: gatewayIcon
              }
          ]
      }
    ])
</script>
<style scoped>

</style>
