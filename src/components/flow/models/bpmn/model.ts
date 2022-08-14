import StartEvent from '@logicflow/extension/es/bpmn/events/StartEvent';
import SequenceFlow from '@logicflow/extension/es/bpmn/flow/SequenceFlow';
import Gateway from '@logicflow/extension/es/bpmn/gateways/ExclusiveGateway';
import { ModelType } from '../../useapi';
import { endIcon, gatewayIcon, serviceTaskIcon, startIcon, userTaskIcon } from './icons';
import EndEvent from './nodes/EndEvent';
import ServiceTask from './nodes/ServiceTask';
import UserTask from './nodes/UserTask';
import { theme } from './theme';
import "./style.css"

export default <ModelType>{
  name: 'bpmn',
  label: 'BPMN 模型',
  defaultEdgeType: SequenceFlow.type,
  theme,
  nodeTypes: [
    {
      ...StartEvent,
      label: '开始',
      icon: startIcon
    },
    {
      ...EndEvent,
      label: '结束',
      icon: endIcon
    },
    {
      ...UserTask,
      label: '用户任务',
      icon: userTaskIcon
    },
    {
      ...ServiceTask,
      label: '系统任务',
      icon: serviceTaskIcon
    },
    {
      ...Gateway,
      label: '路由',
      icon: gatewayIcon
    }
  ],
  edgeTypes: [
    SequenceFlow
  ],
  newData: {}
}
