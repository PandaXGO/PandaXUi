import { ModelType } from '../../useapi';
import FlowLink from "./edges/FlowLink";
import DelayNode from "./nodes/DelayNode";
import FetchNode from "./nodes/FetchNode";
import FunctionNode from "./nodes/FunctionNode";
import StartNode from "./nodes/StartNode";
import SwapNode from "./nodes/SwapNode";
import SwitchNode from "./nodes/SwitchNode";

import "./style.css";

export default <ModelType>{
  name: 'nodeRed',
  label: 'NodeRed 模型',
  defaultEdgeType: FlowLink.type,
  nodeTypes: [
    StartNode,
    FunctionNode,
    SwitchNode,
    SwapNode,
    FetchNode,
    DelayNode,
  ],
  edgeTypes: [
    FlowLink
  ],
  newData: {},
  init(lf) {
    lf.on('node-red:start', () => {
      // todo: 让流程跑起来
      console.log('我要开始执行流程了')
    })
  }
}
