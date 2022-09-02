import { h } from '@logicflow/core';
import { startIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class StopNode extends BaseNode.view {
  getIcon() {
    const {
      width,
      height,
    } = this.props.model;
    return h('image', {
      width: 30,
      height: 30,
      x: - width / 2,
      y: - height / 2,
      href: Icon
    })
  }
}

class StopNodeModel extends BaseNode.model {
  /**
   * 重写定义锚点
   */
  getDefaultAnchor() {
    const { x, y, id, width } = this;
    const anchors = [
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: "left"
      }
    ];
    return anchors;
  }
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(193, 75, 51)';
    return style
  }
}

export default {
  type: 'stop-node',
  text: '结束',
  icon: Icon,
  model: StopNodeModel,
  view: StopNode
}
