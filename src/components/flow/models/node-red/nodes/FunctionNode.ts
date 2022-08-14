import { h } from '@logicflow/core';
import { functionIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class FunctionNode extends BaseNode.view {
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

class FunctionNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(253, 208, 162)';
    return style
  }
}

export default {
  type: 'function-node',
  text: 'function',
  icon: Icon,
  model: FunctionNodeModel,
  view: FunctionNode
}
