import { h, NodeConfig, RectNode, RectNodeModel } from "@logicflow/core";
import { getBytesLength } from '../../util';


class RedNodeModel extends RectNodeModel {
  /**
   * 初始化
   */
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 100;
    this.height = 30;
    this.radius = 5;
    this.text.editable = false;
    this.text.x = this.x + 10;
    this.iconPosition = ''; // icon位置，left表示左边，'right'表示右边
  }
  /**
   * 动态设置初始化数据
   */
  setAttributes() {
    if (this.text.value) {
      let width = 30 + getBytesLength(this.text.value) * 9;
      width = Math.ceil(width / 20) * 20;
      if (width < 100) {
        width = 100;
      }
      this.width = width;
    }
  }
  /**
   * 重写节点样式
   */
  getNodeStyle() {
    const style = super.getNodeStyle();
    style.fill = '#a6bbcf';
    if (this.isSelected) {
      style.strokeWidth = 2;
      style.stroke = '#ff7f0e';
    } else {
      style.strokeWidth = 1;
      style.stroke = '#999';
    }
    return style;
  }
  /**
   * 重写定义锚点
   */
  getDefaultAnchor() {
    const { x, y, id, width, height } = this;
    const anchors = [
      {
        x: x + width / 2,
        y: y,
        id: `${id}_right`,
        type: "right"
      },
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: "left"
      }
    ];
    return anchors;
  }
  /**
   *
   */
  getOutlineStyle() {
    const style: any = super.getOutlineStyle();
    style.stroke = 'transparent';
    style.hover.stroke = 'transparent';
    return style;
  }
}
class RedNode extends RectNode {
  /**
   * 1.1.7版本后支持在view中重写锚点形状。
   * 重写锚点新增
   */
  getAnchorShape(anchorData:any) {
    const { x, y, type } = anchorData;
    return h("rect", {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: 'custom-anchor'
    });
  }
  getIcon () {

  }
  getShape() {
    const {
      text,
      x,
      y,
      width,
      height,
      radius
    } = this.props.model;
    const style = this.props.model.getNodeStyle()
    return h(
      'g',
      {
        className: 'lf-red-node'
      },
      [
        h('rect', {
          ...style,
          x: x - width / 2,
          y: y - height / 2,
          width,
          height,
          rx: radius,
          ry: radius
        }),
        h('g', {
          style: 'pointer-events: none;',
          transform: `translate(${x}, ${y})`
        }, [
          h('rect', {
            x: - width / 2,
            y: - height / 2,
            width: 30,
            height: 30,
            fill: '#000',
            fillOpacity: 0.05,
            stroke: 'none',
          }),
          this.getIcon(),
          h('path', {
            d: `M ${30 - width / 2} ${1 -height / 2 } l 0 28`,
            stroke: '#000',
            strokeOpacity: 0.1,
            strokeWidth: 1
          })
        ])
      ]
    )
  }
}


export default {
  type: 'red-node',
  model: RedNodeModel,
  view: RedNode
}
