import { PropertiesPanelConfig } from '../../useapi'
import defaultPanel from './panel/default.vue'
import topPanel from './panel/top.vue'
import userTaskPanel from './panel/userTask.vue'
import serviceTaskPanel from './panel/serviceTask.vue'
import gatewayTaskPanel from './panel/gatewayTask.vue'

export default <PropertiesPanelConfig>{
  default: defaultPanel,
  top: topPanel,
  'user-node': userTaskPanel,
  'service-node': serviceTaskPanel,
  'gateway-node': gatewayTaskPanel,
}
