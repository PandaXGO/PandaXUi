import { h } from '@logicflow/core';
import { swapIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class SwapNode extends BaseNode.view {
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

class SwapNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(226, 217, 110)';
    return style
  }
}

export default {
  type: 'swap-node',
  text: 'swap',
  icon: Icon,
  model: SwapNodeModel,
  view: SwapNode
}
