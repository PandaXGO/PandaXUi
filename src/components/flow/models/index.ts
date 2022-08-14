import { ModelType } from '../useapi';
import bpmnModel from './bpmn/model';
import nodeRedModel from './node-red/model';

export default <ModelType[]>[
  bpmnModel,
  nodeRedModel
]
