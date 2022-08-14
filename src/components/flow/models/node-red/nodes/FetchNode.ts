import { h } from '@logicflow/core';
import { fetchIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class FetchNode extends BaseNode.view {
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

class FetchNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(231, 231, 174)';
    return style
  }
}

export default {
  type: 'fetch-node',
  text: 'fecth',
  icon: Icon,
  model: FetchNodeModel,
  view: FetchNode
}
