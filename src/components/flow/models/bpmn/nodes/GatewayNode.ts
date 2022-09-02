import { h } from '@logicflow/core';
import { gatewayIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class GatewayNode extends BaseNode.view {
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

class GatewayNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(32, 174, 137)';
    return style
  }
}

export default {
  type: 'gateway-node',
  text: '网关',
  icon: Icon,
  model: GatewayNodeModel,
  view: GatewayNode
}
