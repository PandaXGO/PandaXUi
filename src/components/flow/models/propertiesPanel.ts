import { PropertiesPanelConfig } from '../useapi'
import bpmn from './bpmn/propertiesPanel'
import nodeRed from './node-red/propertiesPanel'

export default <Record<string, PropertiesPanelConfig>>{
  'bpmn': bpmn,
  'nodeRed': nodeRed
}
