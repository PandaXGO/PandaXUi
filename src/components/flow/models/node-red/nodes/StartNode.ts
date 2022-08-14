import { h } from '@logicflow/core';
import { startIcon as Icon } from "../icons";
import BaseNode from "./BaseNode";
import GraphModel from "@logicflow/core/types/model/GraphModel";

class StartNode extends BaseNode.view {
  getIcon() {
    const { model, graphModel } = this.props;
    const {
      width,
      height,
    } = model;
    return h('image', {
      width: 30,
      height: 30,
      x: - width / 2,
      y: - height / 2,
      className: 'node-red-start',
      href: Icon,
      onClick: () => {
        graphModel.eventCenter.emit('node-red:start',{})
      }
    })
  }
}

class StartNodeModel extends BaseNode.model {
  /**
   * 重写定义锚点
   */
  getDefaultAnchor() {
    const { x, y, id, width } = this;
    const anchors = [
      {
        x: x + width / 2,
        y: y,
        id: `${id}_right`,
        type: "right"
      }
    ];
    return anchors;
  }
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = 'rgb(166, 187, 207)';
    return style
  }
}

export default {
  type: 'start-node',
  text: 'start',
  icon: Icon,
  model: StartNodeModel,
  view: StartNode
}
