import { h } from '@logicflow/core';
import { delayIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class DelayNode extends BaseNode.view {
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

class DelayNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(230, 224, 248)';
    return style
  }
}

export default {
  type: 'delay-node',
  text: 'delay',
  icon: Icon,
  model: DelayNodeModel,
  view: DelayNode
}
