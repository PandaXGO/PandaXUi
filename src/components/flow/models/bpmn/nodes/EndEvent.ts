import { CircleNode } from '@logicflow/core';
import { EndEventModel as OldModel } from '@logicflow/extension/es/bpmn/events/EndEvent';

// 解决 logic-flow 提供的图形符号不符合 BPMN 规范的问题
class EndEventModel extends OldModel {
  // static extendKey = 'EndEventModel';
  getNodeStyle() {
    const style = super.getNodeStyle()
    style.strokeWidth = 4
    return style
  }
  setAttributes(): void {
    this.r = 17;
  }
}

class EndEventView extends CircleNode {
  static extendKey = 'EndEventView';
}

const EndEvent = {
  type: 'bpmn:endEvent',
  view: EndEventView,
  model: EndEventModel,
};

export { EndEventView, EndEventModel };
export default EndEvent;
