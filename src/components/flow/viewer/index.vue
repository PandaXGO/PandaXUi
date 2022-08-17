<template>
    <el-container class="main-container full-height">
      <el-header class="layout-header"><toolbar /></el-header>
      <el-main class="layout-main">
           <div ref="container" class="layout-container"></div>
      </el-main>
    </el-container>
  <el-drawer
          v-model="codeDrawerVisible"
          title="Json代码!"
          size="40%"
          @open="setCode"
  >
    <highlight autodetect :code="code" />
  </el-drawer>

</template>

<script setup lang="ts">
import {provide, ref, onMounted, watch} from "vue";
 import highlightjs from "@highlightjs/vue-plugin"
 import { Definition } from '@logicflow/core'
 import { MiniMap } from '@logicflow/extension'
 import hljs from 'highlight.js/lib/core'
 import json from 'highlight.js/lib/languages/json'
 import xml from 'highlight.js/lib/languages/xml'
 import '@logicflow/extension/lib/style/index.css'
 import '@logicflow/core/dist/style/index.css'
 import 'highlight.js/styles/stackoverflow-light.css'
 import 'splitpanes/dist/splitpanes.css'
 import { useViewer } from '../useapi'
 import models from '../models'
 import Toolbar from "./toolbar.vue";

 const props = defineProps({
  code: String,
  type: String
 })

 const container = ref<HTMLElement>()
 const codeDrawerVisible = ref(false)

 const code = ref(props.code)
 const type = ref(props.type)

 watch(() => props.code, () => { code.value = props.code })

 const getModel = () => {
   let model  = models.find(m => m.name === type.value) || models[0]
   model.newData = code.value
   return model
 }

 const viewer = useViewer(getModel())

 const setCode = () => {
   let c:any = viewer.lf?.getGraphRawData()
   if (typeof c == 'object') c = JSON.stringify(c, null, 2)
   code.value = c
 }

  // codeViewer
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('xml', xml);
  const highlight = highlightjs.component

  provide('viewer_context', Object.assign(viewer, { codeDrawerVisible }))

  onMounted(() => {
    if (!container.value) {
      console.log('error container is null')
      return
    }
    const _logicflow_options: Definition = {
      container: container.value,
      grid: {
        visible: true,
        type: 'mesh',
        size: 20,
        config: {
          color: '#eeeeee'
        }
      },
      isSilentMode: true,
      adjustEdge: false,
      hoverOutline: false,
      edgeSelectedOutline: false,
      plugins: [
        MiniMap
      ]
    }
    viewer.initLogicFlow(_logicflow_options)
  })

</script>

<style lang="scss" scoped>
    .el-container.main-container {
        background: #fff;
        margin: 0;
        padding: 0 ;
        background: inherit;
    }

    .el-container.full-height {
        height: 100%;
        overflow-y: hidden;
    }

  .layout-header{
    width: 100%;
    height: 42px !important;
    line-height: 32px !important;
    padding: 5px 10px
  }

  .layout-main{
    padding: 5px 10px
  }

  .layout-container{
    height: 100%;
    width: 100%;
    padding: 4px;
    box-shadow: 0 0 4px rgb(0 0 0 / 30%) inset;
    z-index: 999;
  }

</style>
