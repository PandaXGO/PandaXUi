import { ModelType } from '../../useapi';
import FlowLink from "./edges/FlowLink";
import StartNode from "./nodes/StartNode";
import StopNode from "./nodes/StopNode";
import UserNode from "./nodes/UserNode";
import ServiceNode from "./nodes/ServiceNode";
import GatewayNode from "./nodes/GatewayNode";

import "./style.css"

export default <ModelType>{
  name: 'bpmn',
  label: 'BPMN 模型',
  defaultEdgeType: FlowLink.type,
  nodeTypes: [
    StartNode,
    StopNode,
    UserNode,
    ServiceNode,
    GatewayNode
  ],
  edgeTypes: [
    FlowLink
  ],
  newData: {},
  init(lf) {}
}
