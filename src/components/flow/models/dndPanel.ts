import NodeRedExtension from "./node-red/dndPanel/index";
import BpmnExtension from "./bpmn/dndPanel";

export default <Record<string, any>>{
    "nodeRed": NodeRedExtension,
    "bpmn": BpmnExtension,
}
