import { BaseEdgeModel, BaseNodeModel, Definition, LogicFlow } from '@logicflow/core';
import { DefineComponent, Ref, ShallowReactive } from 'vue';

export type NodeType = {
  type: string
  view: any
  model: any
  text?: string
  icon?: string
  label?: string
  className?: string
  properties?: Record<string, any>
  callback?: (lf: LogicFlow, container: HTMLElement) => void
}

export type EdgeType = {
  type: string
  view: any
  model: any
}

export type ModelType = {
  name: string
  label: string
  defaultEdgeType: string
  nodeTypes: NodeType[]
  edgeTypes?: EdgeType[]
  theme?: any
  newData?: {}
  plugins?: any[]
  init?: (lf: LogicFlow) => void  // 初始化
}

export type PropertiesPanelConfig = {
  /**
   * 顶层元素属性面板
   */
  top?: DefineComponent<{}, {}, any>
  /**
   * 默认元素属性面板：没有对应元素类型的面板时，使用该面板
   */
  default?: DefineComponent<{}, {}, any>
  /**
   * 属性面板：key为元素类型，value为元素属性面板组件
   */
  [key: string]: DefineComponent<{}, {}, any> | null | undefined
}

export type PropertiesPanelView = {
  component?: DefineComponent<{}, {}, any>,
  collapsed: boolean,
  disabled: boolean,
  toggleCollapsed(): void
}

export type PropertiesPanelContext = {
  lf?: LogicFlow
  selectedModel?: BaseNodeModel | BaseEdgeModel
}

export type PropertiesPanelData = {
  id: string,
  type: string,
  text: string,
  properties: Record<string, any>,
}

export type ViewerContext = {
  lf?: LogicFlow
  initLogicFlow(logicflowOptions: Definition): void

  exportGraphRawData(filename: string): void
  exportGraphData(filename: string): void
  exportPng(filename: string, backgroundColor?: string): void

  showMiniMap: Ref<boolean>
  toggleMiniMap(): void

  scale: {
    value: number;
    percentage: string;
  }
  zoomOut(): void
  zoomIn(): void
  resetZoom(): void
  fitView(offset: number): void

  [key: string]: any
}

export type ModelerContext = ViewerContext & {
  propertiesPanel: ShallowReactive<PropertiesPanelView>
  modified: Ref<boolean>
  undoDisable: Ref<boolean>
  redoDisable: Ref<boolean>
  undo(): void
  redo(): void
}
