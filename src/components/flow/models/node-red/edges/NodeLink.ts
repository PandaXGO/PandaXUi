import { BezierEdge, BezierEdgeModel } from "@logicflow/core";

class NodeLinkModel extends BezierEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.strokeWidth = 3;
    style.stroke = this.isSelected ? '#ff7f0e' : '#999';
    return style;
  }
}
class NodeLink extends BezierEdge {}

export default {
  type: 'node-link',
  view: NodeLink,
  model: NodeLinkModel
}
