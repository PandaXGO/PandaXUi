import { h } from '@logicflow/core';
import { userTaskIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";

class UserNode extends BaseNode.view {
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

class UserNodeModel extends BaseNode.model {
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(253, 208, 162)';
    return style
  }
}

export default {
  type: 'user-node',
  text: '用户任务',
  icon: Icon,
  model: UserNodeModel,
  view: UserNode
}
