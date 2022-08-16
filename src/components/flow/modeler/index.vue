<template>
  <el-container class="layout">
    <el-header class="layout-header"><toolbar /></el-header>
    <el-main class="layout-main">
      <splitpanes class="default-theme" @resized="onResize" :dbl-click-splitter="false" :push-other-panes="false" >
        <pane :size="propertiesPanel.collapsed ? 100 - paneSize / 100 : 100 - paneSize">
         <div ref="container" class="layout-container"></div>
        </pane>
        <pane class="layout-pane" :size="propertiesPanel.collapsed ? paneSize / 100 : paneSize" v-show="!propertiesPanel.collapsed">
          <keep-alive>
            <component :is="propertiesPanel.component" />
          </keep-alive>
        </pane>
      </splitpanes>
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
  import { Definition } from '@logicflow/core'
  import { InsertNodeInPolyline, Menu, MiniMap, SelectionSelect, Snapshot } from '@logicflow/extension'
  import { PropertiesPanelConfig, useModeler } from '../useapi'
  import { addListener } from 'resize-detector'
  import { Pane, Splitpanes } from 'splitpanes'
  import highlightjs from "@highlightjs/vue-plugin"
  import hljs from 'highlight.js/lib/core'
  import json from 'highlight.js/lib/languages/json'
  import xml from 'highlight.js/lib/languages/xml'
  import {nextTick, onMounted, provide, ref, watch} from 'vue'
  import models from '../models'
  import propertiesPanelConfigs from '../models/propertiesPanel'
  import Toolbar from './toolbar.vue'

  import dndExtension from '../models/dndPanel'
  const props = defineProps({
      code: String,
      type: String
  })
  const emit = defineEmits(["onSave"])

  const container = ref<HTMLElement>()
  const paneSize = ref(20)
  const codeDrawerVisible = ref(false)

  const code = ref(props.code)
  const type = ref(props.type)

  watch(() => props.code, () => { code.value = props.code })

  const getModel = () => {
    let model  = models.find(m => m.name === type.value) || models[0]
    model.newData = code.value
    return model
  }
  const propertiesPanelConfig: PropertiesPanelConfig = propertiesPanelConfigs[getModel().name]

  const dndExtensionPlus = dndExtension[getModel().name]
  // Modeler
  const modeler = useModeler(getModel(), propertiesPanelConfig)
  const { propertiesPanel } = modeler

  const getCode = () => {
    let c:any = modeler.lf?.getGraphRawData()
    if (typeof c == 'object') c = JSON.stringify(c, null, 2)
    return c
  }

  const setCode = () => {
    code.value = getCode()

  }

  const onSave = () => {
    emit('onSave',getCode())
  }

  hljs.registerLanguage('json', json);
  hljs.registerLanguage('xml', xml);
  const highlight = highlightjs.component

  function containerResize() {
    if (container.value && modeler.lf) {
      const { width, height } = container.value.getBoundingClientRect()
      modeler.lf.resize(width - 8, height - 8)
    }
  }

  async function onResize(e: any) {
    if (!container.value || !modeler.lf) return
    // console.log('onResize', e, modeler.lf.graphModel.width)
    if (e[1] && e[1].size) {
      const size = e[1].size
      propertiesPanel.collapsed = (size < 5)
      paneSize.value = size
    }
  }

  // provide context
  provide('modeler_context', Object.assign(modeler, { onSave, codeDrawerVisible }))

  // init
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
      adjustEdgeStartAndEnd: true,
      adjustEdge: false,
      hoverOutline: false,
      edgeSelectedOutline: false,
      // nodeTextDraggable: true,
      edgeTextDraggable: true,
      multipleSelectKey: 'meta',
      style: {
        nodeText: {
          overflowMode: 'autoWrap'
        },
      },
      keyboard: {
        enabled: true,
      },
      plugins: [
        dndExtensionPlus, InsertNodeInPolyline, Menu, MiniMap, SelectionSelect, Snapshot
      ]
    }
    modeler.initLogicFlow(_logicflow_options)

    // 探测 container 大小改变
    let _listenerRunning = false
    addListener(container.value, () => {
      if (_listenerRunning) return
      _listenerRunning = true
      // 减少短时间重复调用
      setTimeout(async () => {
        _listenerRunning = false
        await nextTick()
        containerResize()
      }, 500)
    })
  })
</script>

<style scoped lang="scss">
  .layout{
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
  }

  .layout-header{
    height: 42px;
    line-height: 32px;
    padding: 5px 10px;
    width: 100%;
    padding: 5px 10px
  }

  .layout-main{
    background: #fff;
    padding: 5px 10px
  }

  .layout-container{
    min-height: calc(100vh - 80px);
    width: 100%;
    padding: 4px;
    box-shadow: 0 0 4px rgb(0 0 0 / 30%) inset;
    background: #fff;
    z-index: 999;
  }

  .layout-pane{
    min-height: calc(100vh - 80px);
    padding: 0px 10px 10px 10px;
  }
</style>
