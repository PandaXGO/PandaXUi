<template>
  <FlowModeler :code="code" :type="type" @getCode="getCode"></FlowModeler>
</template>

<script setup lang="ts">
import  FlowModeler  from '@/components/flow/modeler/index.vue'
import {ref} from "vue";

let codeData = {
  "bpmn": {
    "nodes": [
      {
        "id": "Event_3m8r8f6",
        "type": "bpmn:startEvent",
        "x": 260,
        "y": 260,
        "properties": {}
      },
      {
        "id": "Activity_1ioo5if",
        "type": "bpmn:userTask",
        "x": 420,
        "y": 260,
        "properties": {}
      },
      {
        "id": "Activity_1j9h95q",
        "type": "bpmn:serviceTask",
        "x": 620,
        "y": 260,
        "properties": {}
      },
      {
        "id": "Event_340rvte",
        "type": "bpmn:endEvent",
        "x": 780,
        "y": 260,
        "properties": {}
      }
    ],
    "edges": [
      {
        "id": "Flow_098qupl",
        "type": "bpmn:sequenceFlow",
        "sourceNodeId": "Event_3m8r8f6",
        "targetNodeId": "Activity_1ioo5if",
        "startPoint": {
          "x": 278,
          "y": 260
        },
        "endPoint": {
          "x": 370,
          "y": 260
        },
        "properties": {},
        "pointsList": [
          {
            "x": 278,
            "y": 260
          },
          {
            "x": 370,
            "y": 260
          }
        ]
      },
      {
        "id": "Flow_0su6amd",
        "type": "bpmn:sequenceFlow",
        "sourceNodeId": "Activity_1ioo5if",
        "targetNodeId": "Activity_1j9h95q",
        "startPoint": {
          "x": 470,
          "y": 260
        },
        "endPoint": {
          "x": 570,
          "y": 260
        },
        "properties": {},
        "pointsList": [
          {
            "x": 470,
            "y": 260
          },
          {
            "x": 570,
            "y": 260
          }
        ]
      },
      {
        "id": "Flow_2lkq3kj",
        "type": "bpmn:sequenceFlow",
        "sourceNodeId": "Activity_1j9h95q",
        "targetNodeId": "Event_340rvte",
        "startPoint": {
          "x": 670,
          "y": 260
        },
        "endPoint": {
          "x": 763,
          "y": 260
        },
        "properties": {},
        "pointsList": [
          {
            "x": 670,
            "y": 260
          },
          {
            "x": 763,
            "y": 260
          }
        ]
      }
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
      },
      {
        id: 'node_2',
        type: 'fetch-node',
        x: 420,
        y: 200,
        text: 'fetch data'
      },
      {
        id: 'node_3',
        type: 'function-node',
        x: 620,
        y: 200,
        text: 'function'
      },
      {
        id: 'node_4',
        type: 'delay-node',
        x: 420,
        y: 300,
        text: 'delay'
      },
      {
        id: 'node_5',
        type: 'switch-node',
        x: 820,
        y: 200,
        text: 'switch'
      },
      {
        id: 'node_6',
        type: 'function-node',
        x: 1020,
        y: 200,
        text: 'function'
      },
      {
        id: 'node_7',
        type: 'function-node',
        x: 1020,
        y: 300,
        text: 'function'
      }
    ],
    edges: [
      {
        type: 'flow-link',
        sourceNodeId: 'node_1',
        targetNodeId: 'node_2'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_2',
        targetNodeId: 'node_3'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_3',
        startPoint: {
          x: 680,
          y: 200
        },
        targetNodeId: 'node_4'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_4',
        startPoint: {
          x: 370,
          y: 300
        },
        targetNodeId: 'node_2'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_3',
        targetNodeId: 'node_5'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_5',
        targetNodeId: 'node_6'
      },
      {
        type: 'flow-link',
        sourceNodeId: 'node_5',
        targetNodeId: 'node_7'
      }
    ]
  }
}

const code = ref(codeData.nodeRed)
const type = ref("nodeRed")

const getCode = (newCode:any) => {
  console.log(newCode)
}

</script>

<style scoped>

</style>