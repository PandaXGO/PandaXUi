<template>
    <div >
        <flow-model :code="code" :type="type" @onSave="onSave"></flow-model>
    </div>

</template>

<script setup lang="ts">
/*import FlowView from "@/components/flow/viewer/index.vue"*/
import FlowModel from "@/components/flow/modeler/index.vue"
import {ref} from "vue";

let codeData = {
  "bpmn": {
    "nodes": [
      {
        "id": "Event_3m8r8f6",
        "type": "start-node",
        "x": 260,
        "y": 260,
        "text": "开始",
        "properties": {}
      },
    ],
    "edges": [
    ]
  },
  "nodeRed": {
    nodes: [
      {
        id: 'node_1',
        type: 'start-node',
        x: 220,
        y: 200,
        text: 'start'
      }
    ],
    edges: [

    ]
  }
}

const code = ref(codeData.bpmn)
const type = ref("bpmn")

const onSave = (newCode:any) => {
  console.log(newCode)
}

</script>

<style scoped>

</style>
