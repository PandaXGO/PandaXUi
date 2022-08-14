import { h } from '@logicflow/core';
import { switchIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class SwitchNode extends BaseNode.view {
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

class SwitchNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(226, 217, 110)';
    return style
  }
}

export default {
  type: 'switch-node',
  text: 'switch',
  icon: Icon,
  model: SwitchNodeModel,
  view: SwitchNode
}
