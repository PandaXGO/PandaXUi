<template>
  <div>
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
              placement="bottom-start"
      >
        <el-button :type="showMiniMap ? 'primary' : 'default'" @click="toggleMiniMap()">
          <SvgIcon name="elementCamera"/>
        </el-button>
      </el-tooltip>
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
import { ViewerContext } from '../useapi';
import { inject } from 'vue';

const viewContext: ViewerContext = inject<any>('viewer_context')
const {
  showMiniMap, toggleMiniMap, scale, zoomOut, zoomIn, resetZoom, fitView, codeDrawerVisible
} = viewContext
</script>
