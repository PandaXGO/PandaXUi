<template>
  <div>
    <el-button-group>
      <el-button :disabled="!modified" type="primary">
        <SvgIcon name="elementMessageBox"/>保存
      </el-button>
    </el-button-group>
    <el-button-group class="ml-4">
      <el-dropdown split-button>
          导入
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>模型文件（*.json）</el-dropdown-item>
            </el-dropdown-menu>
          </template>
      </el-dropdown>
      <el-dropdown split-button>
          导出
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item id="exportRaw" @click="exportGraphRawData(modelType + '.json')">模型文件（*.json）</el-dropdown-item>
              <el-dropdown-item id="exportPng" key="png" @click="exportPng(modelType)">PNG 文件</el-dropdown-item>
            </el-dropdown-menu>
          </template>
      </el-dropdown>
    </el-button-group>
    <el-button-group class="ml-4" >
      <el-button :disabled="undoDisable" @click="undo">
        <SvgIcon name="elementCaretLeft"/>
      </el-button>
      <el-button :disabled="redoDisable" @click="redo">
        <SvgIcon name="elementCaretRight"/>
      </el-button>
    </el-button-group>
    <el-button-group class="ml-4">
      <el-button  @click="zoomOut">
        <SvgIcon name="elementZoomOut"/>
      </el-button>
      <el-tooltip
              class="box-item"
              effect="dark"
              content="点击此处，恢复原始大小和位置"
              placement="bottom-start"
      >
        <el-button style="padding: 4px" @click="resetZoom">{{ scale.percentage }}</el-button>
      </el-tooltip>
      <el-button  @click="zoomIn">
        <SvgIcon name="elementZoomIn"/>
      </el-button>
      <el-tooltip
              class="box-item"
              effect="dark"
              content="自适应大小"
              placement="bottom-start"
      >
        <el-button  id="fitView" @click="fitView(100)">
          <SvgIcon name="elementAim"/>
        </el-button>
      </el-tooltip>
    </el-button-group>
    <el-button-group class="ml-4">
      <el-tooltip
              class="box-item"
              effect="dark"
              content="显示/隐藏 缩略图导航"
      >
        <el-button @click="toggleMiniMap()" :type="showMiniMap ? 'primary' : 'default'">
          <SvgIcon name="elementCamera"/>
        </el-button>
      </el-tooltip>
      <el-tooltip
              class="box-item"
              effect="dark"
              content="显示/隐藏 属性面板"
      >
        <el-button :disabled="propertiesPanel.disabled" @click="propertiesPanel.toggleCollapsed" :type="propertiesPanel.collapsed ? 'primary' : 'default'">
          <SvgIcon name="elementCopyDocument"/>
        </el-button>
      </el-tooltip>
      <el-button disabled >
        <SvgIcon name="elementSetting"/>
      </el-button>
      <el-tooltip
              class="box-item"
              effect="dark"
              content="查看代码"
              placement="bottom-start"
      >
        <el-button :type="codeDrawerVisible ? 'primary' : 'default'" @click="codeDrawerVisible = true">
          <SvgIcon name="elementMonitor"/>
        </el-button>
      </el-tooltip>
    </el-button-group>
  </div>
</template>

<script setup lang="ts">
import { ModelerContext } from '../useapi';
import { inject } from 'vue';

const modelerContext: ModelerContext = inject<any>('modeler_context')
const {
  exportPng, exportGraphRawData, // exportGraphData,
  showMiniMap, toggleMiniMap, scale, zoomOut, zoomIn, resetZoom, fitView,
  modified, undoDisable, redoDisable, undo, redo, propertiesPanel,
  modelType, codeDrawerVisible
} = modelerContext
</script>
