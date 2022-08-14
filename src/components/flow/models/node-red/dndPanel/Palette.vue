<template>
  <div style="width:150px;margin: 5px 0 0 5px">
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
    import {delayIcon, fetchIcon, functionIcon, startIcon, switchIcon, swapIcon, zan} from "../icons";
    import LogicFlow from "@logicflow/core"
    import { ref } from 'vue'
    import {selectIcon} from "../../bpmn/icons";
    import Dnd from "@/components/dndPanel/dnd.vue"
    const props = defineProps({
        lf: {
            type: LogicFlow,
            required: true,
        }
    })
    const activeNames = ref(['base'])
    const startDrag = (item:any) => {
      const { lf } = props;
      if (item.type == "select"){
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
            type: 'select',
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
            text: 'start',
            content: "这个节点是start",
            background: 'rgb(166, 187, 207)',
            icon: startIcon
          },
          {
            type: 'fetch-node',
            text: 'fetch',
            content: "这个节点是fetch",
            background: 'rgb(231, 231, 174)',
            icon: fetchIcon
          },
          {
            type: 'function-node',
            text: 'function',
            content: "这个节点是function",
            background: 'rgb(253, 208, 162)',
            icon: functionIcon
          },
          {
            type: 'switch-node',
            text: 'switch',
            content: "这个节点是switch",
            background: 'rgb(226, 217, 110)',
            icon: switchIcon
          },
          {
            type: 'swap-node',
            text: 'swap',
            content: "这个节点是swap",
            background: 'rgb(226, 217, 110)',
            icon: swapIcon
          },
          {
            type: 'delay-node',
            text: 'delay',
            content: "这个节点是delay",
            background: 'rgb(230, 224, 248)',
            icon: delayIcon
          }
        ]
      },
      {
        "title": "高级节点",
        "name": "expert",
        "baseNodes": [
          {
            type: 'fetch-node',
            text: 'zan',
            content: "这个节点是zan",
            background: 'rgb(231, 231, 174)',
            icon: zan
          },
        ]
      }
    ])
</script>
<style scoped>

</style>