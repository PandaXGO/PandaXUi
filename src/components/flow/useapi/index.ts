import  { PointTuple } from '@logicflow/core';
import LogicFlow from '@logicflow/core';
import { computed, inject, nextTick, onActivated, onDeactivated, provide, reactive, ref, shallowReactive, watch } from 'vue';
import  { ModelerContext, ModelType, PropertiesPanelConfig, PropertiesPanelContext, PropertiesPanelData, PropertiesPanelView, ViewerContext } from './types';

const selectIcon = 'data:image/svg+xml;base64,PHN2ZyBjbGFzcz0icHJlZml4X19wcmVmaXhfX2ljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj48cGF0aCBkPSJNNTk4LjE4NyA5NTUuNzMzaC0uNDQ0YTE3LjExOCAxNy4xMTggMCAwMS0xNS4yNC0xMC4zMjVMNDc2Ljg2IDY5OS43MzNoLTUwLjE5M2ExNy4wNjcgMTcuMDY3IDAgMTEwLTM0LjEzM2gzNS41MzJMMzI1LjY2NiAzNDguMDc1YTE3LjA2NyAxNy4wNjcgMCAwMTIyLjQwOS0yMi40MDlMNjY1LjYgNDYyLjJ2LTM1LjUzMmExNy4wNjcgMTcuMDY3IDAgMTEzNC4xMzMgMHY1MC4xNTlsMjQ1LjY0IDEwNC44MDZhMTcuMDg0IDE3LjA4NCAwIDAxLjkyMiAzMC45NzZMNzk2LjgxIDY4Ny4zNmwxNTMuOTI0IDE1My45MjRhMTcuMDUgMTcuMDUgMCAwMTAgMjQuMTMzTDg2NS40IDk1MC43NWExNy4wNSAxNy4wNSAwIDAxLTI0LjEzMiAwTDY4Ny40MTEgNzk2Ljg5NGwtNzMuOTMzIDE0OS4zNWExNy4wNjcgMTcuMDY3IDAgMDEtMTUuMjkxIDkuNDl6bTg0LjQ4LTIwNC44YTE3LjA2NyAxNy4wNjcgMCAwMTEyLjA2NiA1bDE1OC42IDE1OC42MDEgNjEuMjAxLTYxLjItMTU4LjYtMTU4LjYwMWExNy4wMTUgMTcuMDE1IDAgMDE0LjQzNy0yNy4zMjRsMTM3LjY3Ny02OC44My0yMjIuMDM3LTk0LjczNy0uMTAzLS4wMzQtMzAxLjk3Ny0xMjkuODc3IDEyOS44NiAzMDEuOTk0LjAzNC4wNjkgOTUuNDU0IDIyMi4wMiA2OC4wOTYtMTM3LjU3NWExNy4wNjcgMTcuMDY3IDAgMDExNS4yOTItOS41MDZ6bS0zNDEuMzM0LTUxLjJIMjU2YTE3LjA2NyAxNy4wNjcgMCAxMTAtMzQuMTMzaDg1LjMzM2ExNy4wNjcgMTcuMDY3IDAgMTEwIDM0LjEzM3ptLTE3MC42NjYgMEg4NS4zMzNhMTcuMDY3IDE3LjA2NyAwIDAxLTE3LjA2Ni0xNy4wNjZ2LTg1LjMzNGExNy4wNjcgMTcuMDY3IDAgMTEzNC4xMzMgMFY2NjUuNmg2OC4yNjdhMTcuMDY3IDE3LjA2NyAwIDExMCAzNC4xMzN6TTg1LjMzMyA1MjkuMDY3QTE3LjA2NyAxNy4wNjcgMCAwMTY4LjI2NyA1MTJ2LTg1LjMzM2ExNy4wNjcgMTcuMDY3IDAgMDEzNC4xMzMgMFY1MTJhMTcuMDY3IDE3LjA2NyAwIDAxLTE3LjA2NyAxNy4wNjd6TTY4Mi42NjcgMzU4LjRhMTcuMDY3IDE3LjA2NyAwIDAxLTE3LjA2Ny0xNy4wNjdWMjU2YTE3LjA2NyAxNy4wNjcgMCAxMTM0LjEzMyAwdjg1LjMzM2ExNy4wNjcgMTcuMDY3IDAgMDEtMTcuMDY2IDE3LjA2N3ptLTU5Ny4zMzQgMGExNy4wNjcgMTcuMDY3IDAgMDEtMTcuMDY2LTE3LjA2N1YyNTZhMTcuMDY3IDE3LjA2NyAwIDAxMzQuMTMzIDB2ODUuMzMzQTE3LjA2NyAxNy4wNjcgMCAwMTg1LjMzMyAzNTguNHptNTk3LjMzNC0xNzAuNjY3YTE3LjA2NyAxNy4wNjcgMCAwMS0xNy4wNjctMTcuMDY2VjEwMi40aC02OC4yNjdhMTcuMDY3IDE3LjA2NyAwIDExMC0zNC4xMzNoODUuMzM0YTE3LjA2NyAxNy4wNjcgMCAwMTE3LjA2NiAxNy4wNjZ2ODUuMzM0YTE3LjA2NyAxNy4wNjcgMCAwMS0xNy4wNjYgMTcuMDY2em0tNTk3LjMzNCAwYTE3LjA2NyAxNy4wNjcgMCAwMS0xNy4wNjYtMTcuMDY2Vjg1LjMzM2ExNy4wNjcgMTcuMDY3IDAgMDExNy4wNjYtMTcuMDY2aDg1LjMzNGExNy4wNjcgMTcuMDY3IDAgMDEwIDM0LjEzM0gxMDIuNHY2OC4yNjdhMTcuMDY3IDE3LjA2NyAwIDAxLTE3LjA2NyAxNy4wNjZ6TTUxMiAxMDIuNGgtODUuMzMzYTE3LjA2NyAxNy4wNjcgMCAwMTAtMzQuMTMzSDUxMmExNy4wNjcgMTcuMDY3IDAgMTEwIDM0LjEzM3ptLTE3MC42NjcgMEgyNTZhMTcuMDY3IDE3LjA2NyAwIDAxMC0zNC4xMzNoODUuMzMzYTE3LjA2NyAxNy4wNjcgMCAwMTAgMzQuMTMzeiIvPjwvc3ZnPg=='

function download(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * 使用看图工具
 * 注意：对该函数返回值中的 lf 属性，请不要解构后使用
 */
export function useViewer(model: ModelType): ViewerContext {

  const viewer: { lf?: LogicFlow } = {}

  // export
  const exportGraphRawData = (filename: string) => {
    const text = JSON.stringify(viewer.lf?.getGraphRawData())
    download(filename, text)
  }

  const exportGraphData = (filename: string) => {
    const text = JSON.stringify(viewer.lf?.getGraphData())
    download(filename, text)
  }

  const exportPng = (filename: string, backgroundColor: string) => {
    if (filename && !filename.endsWith('.png')) {
      filename += '.png'
    }
    viewer.lf?.getSnapshot(filename, backgroundColor)
  }

  // miniMap
  const showMiniMap = ref(false)
  const toggleMiniMap = () => {
    const miniMap = viewer.lf?.extension.miniMap
    showMiniMap.value = !showMiniMap.value
    showMiniMap.value ? miniMap.show() : miniMap.hide()
  }
  // zoom
  const getCenter = (): PointTuple => {
    const gm = viewer.lf?.graphModel
    const x = gm ? gm.width / 2 : 0
    const y = gm ? gm.height / 2 : 0
    return [x, y]
  }
  const scale = reactive({
    value: 1,
    percentage: computed(() => {
      let p: number = scale.value
      return `${Number(p * 100).toFixed()}%`
    })
  })
  const zoomOut = () => {
    viewer.lf?.zoom(false, getCenter());
  }
  const zoomIn = () => {
    viewer.lf?.zoom(true, getCenter());
  }
  const resetZoom = () => {
    viewer.lf?.resetZoom();
    viewer.lf?.resetTranslate();
  }
  const fitView = (offset: number) => {
    viewer.lf?.fitView(offset);
  }

  // logicflow
  const initLogicFlow = (logicflowOptions: any) => {
    // TODO 默认插件
    // const plugins = [
    //   DndPanel, InsertNodeInPolyline, Menu, MiniMap, SelectionSelect, Snapshot
    // ]
    if (model.plugins) {
      if (!logicflowOptions.plugins) logicflowOptions.plugins = []
      logicflowOptions.plugins.push(...model.plugins)
    }

    viewer.lf = new LogicFlow(logicflowOptions)

    if (model.theme) viewer.lf?.setTheme(model.theme)

    model.nodeTypes.forEach(node => {
      viewer.lf?.register(node)
    })
    model.edgeTypes?.forEach(edge => {
      viewer.lf?.register(edge)
    })
    viewer.lf?.setDefaultEdgeType(model.defaultEdgeType)
    viewer.lf?.setZoomMaxSize(5)

    if (model.init) model.init(viewer.lf)

    viewer.lf?.renderRawData(model.newData)

    scale.value = viewer.lf?.getTransform().SCALE_X || 1

    viewer.lf?.on('graph:transform', (data) => {
      if (data.type === 'zoom' || data.type === 'resetZoom') {
        console.log(data)
        scale.value = data.transform.SCALE_X
      }
    })
  }

  return Object.assign(viewer, {
    initLogicFlow,
    exportGraphRawData, exportGraphData, exportPng,
    showMiniMap, toggleMiniMap,
    scale, zoomOut, zoomIn, resetZoom, fitView
  })
}

/**
 * 使用建模工具
 * 注意：对该函数返回值中的 lf 属性，请不要解构后使用
 */
export function useModeler(model: ModelType, propertiesPanelConfig: PropertiesPanelConfig)
  : ModelerContext {
  const modeler = useViewer(model)

  const _ctx = shallowReactive<PropertiesPanelContext>({})
  provide('properties_panel_context', _ctx) // 提供属性面板上下文

  // propertiesPanel
  const propertiesPanel = shallowReactive<PropertiesPanelView>({
    collapsed: !propertiesPanelConfig,
    disabled: !propertiesPanelConfig,
    toggleCollapsed: () => {
      propertiesPanel.collapsed = !propertiesPanel.collapsed
    }
  })

  // modified
  const modified = ref(false)
  const setModified = (val: boolean) => {
    modified.value = val
  }
  // undo, redo
  const undoDisable = ref(true)
  const redoDisable = ref(true)
  const setUndoState = ({ undoAble, redoAble }: { undoAble: boolean, redoAble: boolean }) => {
    undoDisable.value = !undoAble
    redoDisable.value = !redoAble
  }
  const undo = () => {
    modeler.lf?.undo()
  }
  const redo = () => {
    modeler.lf?.redo()
  }


  const _initModeler = () => {
    _ctx.lf = modeler.lf

    modeler.lf?.on('history:change', ({ data }: any) => {
      setUndoState(data)
      setModified(true)
    })
    if (propertiesPanelConfig) {
      modeler.lf?.on('node:click,edge:click,blank:click',
        async ({ data }: any) => {
          // console.log('click', data)
          if (data) {
            if (_ctx.selectedModel?.id == data.id) return
            propertiesPanel.component = propertiesPanelConfig[data.type] || propertiesPanelConfig.default
            await nextTick()  // 为了确保先激活 Panel 再改变数据，此处 nextTick() 的位置不要随便调整
            _ctx.selectedModel = modeler.lf?.getModelById(data.id)
          } else {
            propertiesPanel.component = propertiesPanelConfig.top || propertiesPanelConfig.default
            await nextTick()  // 为了确保先激活 Panel 再改变数据，此处 nextTick() 的位置不要随便调整
            _ctx.selectedModel = undefined
          }
        })
      propertiesPanel.component = propertiesPanelConfig.top || propertiesPanelConfig.default
    }
  }

  const _oldInit = modeler.initLogicFlow
  modeler.initLogicFlow = (logicflowOptions: any) => {
    _oldInit(logicflowOptions)
    _initModeler()
  }

  return Object.assign(modeler, {
    modified, undoDisable, redoDisable, undo, redo, propertiesPanel
  })
}

/**
 * 使用属性面板要操作的数据对象，用于扩展实现属性面板组件
 * 注意：该函数返回响应式对象，请不要解构后使用
 */
export function usePropertiesPanelData(): PropertiesPanelData {
  const ctx = inject<PropertiesPanelContext>('properties_panel_context') // 注入属性面板上下文
  const activated = ref(false)
  const element = reactive<PropertiesPanelData>({
    id: '',
    type: '',
    text: '',
    properties: {},
  })
  const changedId = () => {
    // TODO 引入校验规则，检查 id 是否合法，并且便于 Form 表单中使用
    const oldId = ctx?.selectedModel?.id
    let newId = element.id
    if (!oldId) return
    if (ctx?.selectedModel?.BaseType == 'node') newId = ctx?.lf?.changeNodeId<string>(oldId, newId) || ''
    else if (ctx?.selectedModel?.BaseType == 'edge') newId = ctx?.lf?.changeEdgeId(oldId, newId) || ''
    // else 'graph'
    if (!newId || newId == '') {
      // 修改失败，重新加载数据
      loadData()
    }
  }

  const _stopHandles: any[] = []
  let _subscribedTextEvent = false
  const _textUpdateCallback = (data: { id: string; }) => {
    if (!activated.value) return
    if (data?.id == element.id) {
      console.log('update text', data, ctx?.selectedModel?.text?.value)
      element.text = ctx?.selectedModel?.text?.value || ''
    }
  }
  const loadData = () => {
    if (_subscribedTextEvent) ctx?.lf?.off('text:update', _textUpdateCallback)

    _stopHandles.forEach(h => h())
    _stopHandles.length = 0

    if (ctx?.selectedModel) {
      element.id = ctx.selectedModel.id
      element.type = ctx.selectedModel.type
      element.text = ctx.selectedModel.text?.value
      element.properties = ctx.selectedModel.properties
      ctx?.lf?.on('text:update', _textUpdateCallback), _subscribedTextEvent = true
    } else {
      element.id = ''
      element.type = ''
      element.text = ''
      element.properties = {}
    }
    _stopHandles.push(
      // Vue3 当前版本 watch 方法 oldVal 传值不正确
      watch(
        () => element.id,
        (newVal, oldVal) => {
          // console.log('id changed:', oldVal, '->', newVal)
          changedId()
        }),
      watch(
        () => element.text,
        (newVal, oldVal) => {
          // console.log('text changed:', oldVal, '->', newVal)
          ctx?.selectedModel?.updateText(newVal);
        })
    )
  }

  watch(() => ctx?.selectedModel, (newVal, oldVal) => {
    if (!activated.value) return
    console.log('selectedModel:', oldVal?.id, '->', newVal?.id)
    loadData()
  })

  onActivated(() => {
    activated.value = true
  })

  onDeactivated(() => {
    activated.value = false
  })

  return element
}

export * from './types';
