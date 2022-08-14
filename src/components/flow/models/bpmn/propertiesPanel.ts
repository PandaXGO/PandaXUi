import { PropertiesPanelConfig } from '../../useapi'
import defaultPanel from './panel/default.vue'
import topPanel from './panel/top.vue'
import userTaskPanel from './panel/userTask.vue'

export default <PropertiesPanelConfig>{
  default: defaultPanel,
  top: topPanel,
  'bpmn:userTask': userTaskPanel
}
