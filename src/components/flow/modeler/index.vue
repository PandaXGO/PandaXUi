<template>
  <el-container class="layout full-height">
    <el-header class="layout-header"><Toolbar /></el-header>
    <el-main>
      <splitpanes class="default-theme" @resized="onResize" :dbl-click-splitter="false" :push-other-panes="false">
        <pane :size="propertiesPanel.collapsed ? 90 - paneSize / 90 : 90 - paneSize">
          <div ref="container" class="layout-container"></div>
        </pane>
        <pane :size="propertiesPanel.collapsed ? paneSize / 90 : paneSize" v-show="!propertiesPanel.collapsed"
              style="padding: 10px;background-color: #f8f8f8;overflow: hidden auto">
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
  const emit = defineEmits(["getCode"])

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

  const setCode = () => {
    let c:any = modeler.lf?.getGraphRawData()
    if (typeof c == 'object') c = JSON.stringify(c, null, 2)
    code.value = c
    emit('getCode',c)
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
  provide('modeler_context', Object.assign(modeler, { codeDrawerVisible }))

  // init
  onMounted(() => {
    if (!container.value) {
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

<style lang="scss" scoped>

  .el-container.layout{
    height: 100px;
    width: 100%;
    :deep(aside) {  /* 防止aside样式被外部样式覆盖！！ */
      margin: 0;
      padding: 0;
      background: inherit;
    }
  }

  .el-container.full-height {
    height: 100%;
    overflow-y: hidden;
  }

  .layout-header{
    height: 40px;
    width: 100%;
    line-height: 32px;
    padding: 5px 5px
  }
  .layout-container{
    height: 100%;
    width: 100%;
    padding: 4px;
    box-shadow: 0 0 4px rgb(0 0 0 / 30%) inset;
    background: #fff;
    z-index: 999;
  }
</style>