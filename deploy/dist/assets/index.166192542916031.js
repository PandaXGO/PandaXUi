var U=Object.defineProperty;var q=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var M=(o,l,i)=>l in o?U(o,l,{enumerable:!0,configurable:!0,writable:!0,value:i}):o[l]=i,N=(o,l)=>{for(var i in l||(l={}))L.call(l,i)&&M(o,i,l[i]);if(q)for(var i of q(l))Q.call(l,i)&&M(o,i,l[i]);return o};import{_ as K,H as I,D as H,k as W,m as X,P as Y,p as Z,a as k,h as u,w as n,g as $,N as S,M as V,r,aC as G,o as c,aD as ee,F as T,e as O,f as _,b as f,y as g,i as h,t as z,z as te}from"./index.1661925429160.js";import{E as ue,l as oe,d as ae,c as ne,r as le,a as re}from"./editModule.166192542916011.js";const se={name:"Job",components:{EditModule:ue},setup(){const{proxy:o}=$(),l=I(),i=I(null);H();const t=W({loading:!0,ids:[],single:!0,multiple:!0,title:"",tableData:[],total:0,open:!1,modelForm:{},jobGroupOptions:[],statusOptions:[],queryParams:{pageNum:1,pageSize:10,jobName:void 0,jobGroup:void 0,status:void 0}}),p=()=>{t.loading=!0,oe(t.queryParams).then(e=>{t.tableData=e.data.data,t.total=e.data.total,t.loading=!1})},P=()=>{t.queryParams.jobName=void 0,t.queryParams.jobGroup=void 0,t.queryParams.status=void 0,p()},A=(e,s)=>o.selectDictLabel(t.statusOptions,e.status),y=(e,s)=>o.selectDictLabel(t.jobGroupOptions,e.jobGroup),F=e=>{e=[],t.title="\u6DFB\u52A0\u5B9A\u65F6\u4EFB\u52A1",l.value.openDialog(e)},E=e=>{t.title="\u4FEE\u6539\u5B9A\u65F6\u4EFB\u52A1",l.value.openDialog(e)},m=e=>{const s=e.jobId||t.ids;S({message:'\u662F\u5426\u786E\u8BA4\u5220\u9664\u5B9A\u65F6\u4EFB\u52A1\u7F16\u53F7\u4E3A"'+s+'"\u7684\u6570\u636E\u9879?',title:"\u8B66\u544A",showCancelButton:!0,confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(function(){return ae(s).then(()=>{p(),V.success("\u5220\u9664\u6210\u529F")})})},b=e=>{t.ids=e.map(s=>s.jobId),t.single=e.length!=1,t.multiple=!e.length},j=e=>{t.queryParams.pageSize=e,p()},v=e=>{t.queryParams.pageNum=e,p()},d=e=>{let s=e.status==="0"?"\u542F\u7528":"\u505C\u7528";S({message:'\u786E\u8BA4\u8981"'+s+'""'+e.jobName+'"\u4EFB\u52A1\u5417?',title:"\u8B66\u544A",showCancelButton:!0,confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(function(){return ne({jobId:e.jobId,status:e.status})}).then(()=>{V({message:s+"\u6210\u529F",type:"success"})}).catch(function(){e.status=e.status==="0"?"1":"0"})},D=e=>{let s=e.entryId>0?"\u505C\u6B62":"\u542F\u52A8";S({message:"\u786E\u8BA4\u8981\u7ACB\u5373"+s+'"'+e.jobName+'"\u4EFB\u52A1\u5417?',title:"\u8B66\u544A",showCancelButton:!0,confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(function(){if(e.entryId>0)le(e.jobId).then(w=>{p()});else return re(e.jobId).then(w=>{p()})}).then(()=>{V({message:s+"\u6267\u884C\u6210\u529F",type:"success"})})};return X(()=>{p(),o.getDicts("sys_normal_disable").then(e=>{t.statusOptions=e.data}),o.getDicts("sys_job_group").then(e=>{t.jobGroupOptions=e.data}),o.mittBus.on("onEditJobModule",e=>{p()})}),Y(()=>{o.mittBus.off("onEditJobModule")}),N({editModuleRef:l,ruleFormRef:i,handleSelectionChange:b,handleSizeChange:j,handleCurrentChange:v,handleQuery:p,resetQuery:P,onOpenAddModule:F,onOpenEditModule:E,statusFormat:A,jobGroupFormat:y,onTabelRowDel:m,handleRun:D,handleStatusChange:d},Z(t))}},ie={class:"app-container"},de=h(" \u641C\u7D22"),ce=h(" \u91CD\u7F6E "),pe={class:"card-header"},me=f("span",{class:"card-header-text"},"\u5B9A\u65F6\u4EFB\u52A1\u5217\u8868",-1),be=h("\u65B0\u589E"),_e=h("\u5220\u9664"),he=h("\u7F16\u8F91"),ge=h("\u5220\u9664");function fe(o,l,i,t,p,P){const A=r("el-input"),y=r("el-form-item"),F=r("el-option"),E=r("el-select"),m=r("SvgIcon"),b=r("el-button"),j=r("el-form"),v=r("el-card"),d=r("el-table-column"),D=r("el-switch"),e=r("el-popover"),s=r("el-table"),w=r("el-divider"),R=r("el-pagination"),x=r("EditModule"),B=G("auth"),J=G("loading");return c(),k("div",ie,[u(v,{shadow:"always"},{default:n(()=>[u(j,{model:o.queryParams,ref:"queryForm",inline:!0,"label-width":"68px"},{default:n(()=>[u(y,{label:"\u4EFB\u52A1\u540D\u79F0",prop:"jobName"},{default:n(()=>[u(A,{placeholder:"\u8BF7\u8F93\u5165\u4EFB\u52A1\u540D\u79F0\u6A21\u7CCA\u67E5\u8BE2",clearable:"",onKeyup:ee(t.handleQuery,["enter"]),style:{width:"240px"},modelValue:o.queryParams.jobName,"onUpdate:modelValue":l[0]||(l[0]=a=>o.queryParams.jobName=a)},null,8,["onKeyup","modelValue"])]),_:1}),u(y,{label:"\u4EFB\u52A1\u7EC4\u540D",prop:"jobGroup"},{default:n(()=>[u(E,{modelValue:o.queryParams.jobGroup,"onUpdate:modelValue":l[1]||(l[1]=a=>o.queryParams.jobGroup=a),placeholder:"\u8BF7\u9009\u62E9\u4EFB\u52A1\u7EC4\u540D",clearable:"",style:{width:"240px"}},{default:n(()=>[(c(!0),k(T,null,O(o.jobGroupOptions,a=>(c(),_(F,{key:a.dictValue,label:a.dictLabel,value:a.dictValue},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),u(y,{label:"\u4EFB\u52A1\u72B6\u6001",prop:"status"},{default:n(()=>[u(E,{modelValue:o.queryParams.status,"onUpdate:modelValue":l[2]||(l[2]=a=>o.queryParams.status=a),placeholder:"\u8BF7\u9009\u62E9\u4EFB\u52A1\u72B6\u6001",clearable:"",style:{width:"240px"}},{default:n(()=>[(c(!0),k(T,null,O(o.statusOptions,a=>(c(),_(F,{key:a.dictValue,label:a.dictLabel,value:a.dictValue},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),u(y,null,{default:n(()=>[u(b,{type:"primary",plain:"",onClick:t.handleQuery},{default:n(()=>[u(m,{name:"elementSearch"}),de]),_:1},8,["onClick"]),u(b,{onClick:t.resetQuery},{default:n(()=>[u(m,{name:"elementRefresh"}),ce]),_:1},8,["onClick"])]),_:1})]),_:1},8,["model"])]),_:1}),u(v,{class:"box-card"},{header:n(()=>[f("div",pe,[me,f("div",null,[g((c(),_(b,{type:"primary",plain:"",onClick:t.onOpenAddModule},{default:n(()=>[u(m,{name:"elementPlus"}),be]),_:1},8,["onClick"])),[[B,"tool:job:add"]]),g((c(),_(b,{type:"danger",plain:"",disabled:o.multiple,onClick:t.onTabelRowDel},{default:n(()=>[u(m,{name:"elementDelete"}),_e]),_:1},8,["disabled","onClick"])),[[B,"tool:job:delete"]])])])]),default:n(()=>[g((c(),_(s,{data:o.tableData,onSelectionChange:t.handleSelectionChange},{default:n(()=>[u(d,{type:"selection",width:"55",align:"center"}),u(d,{label:"\u4EFB\u52A1\u7F16\u53F7",align:"center",prop:"jobId"}),u(d,{label:"\u4EFB\u52A1\u540D\u79F0",align:"center",prop:"jobName","show-overflow-tooltip":!0}),u(d,{label:"\u4EFB\u52A1\u7EC4\u540D",align:"center",prop:"jobGroup",formatter:t.jobGroupFormat},null,8,["formatter"]),u(d,{label:"\u4EFB\u52A1\u7C7B\u578B",align:"center",prop:"jobType"},{default:n(a=>[h(z(a.row.jobType==1?"\u63A5\u53E3":"\u51FD\u6570"),1)]),_:1}),u(d,{label:"\u8C03\u7528\u76EE\u6807",align:"center",prop:"invokeTarget","show-overflow-tooltip":!0}),u(d,{label:"cron\u6267\u884C\u8868\u8FBE\u5F0F",align:"center",prop:"cronExpression","show-overflow-tooltip":!0}),u(d,{label:"\u72B6\u6001",align:"center"},{default:n(a=>[u(D,{modelValue:a.row.status,"onUpdate:modelValue":C=>a.row.status=C,"active-value":"0","inactive-value":"1",onClick:C=>t.handleStatusChange(a.row)},null,8,["modelValue","onUpdate:modelValue","onClick"])]),_:1}),u(d,{label:"\u64CD\u4F5C",align:"center",width:"300"},{default:n(a=>[u(e,{placement:"left"},{reference:n(()=>[u(b,{type:"primary",circle:""},{default:n(()=>[u(m,{name:"elementStar"})]),_:1})]),default:n(()=>[f("div",null,[g((c(),_(b,{text:"",type:"primary",onClick:C=>t.handleRun(a.row)},{default:n(()=>[u(m,{name:"elementSwitchButton"}),h(z(a.row.entryId>0?"\u505C\u6B62":"\u542F\u52A8"),1)]),_:2},1032,["onClick"])),[[B,"tool:job:run"]])]),f("div",null,[g((c(),_(b,{text:"",type:"primary",onClick:C=>t.onOpenEditModule(a.row)},{default:n(()=>[u(m,{name:"elementEdit"}),he]),_:2},1032,["onClick"])),[[B,"tool:job:edit"]])]),f("div",null,[g((c(),_(b,{text:"",type:"primary",onClick:C=>t.onTabelRowDel(a.row)},{default:n(()=>[u(m,{name:"elementDelete"}),ge]),_:2},1032,["onClick"])),[[B,"tool:job:delete"]])])]),_:2},1024)]),_:1})]),_:1},8,["data","onSelectionChange"])),[[J,o.loading]]),g(f("div",null,[u(w),u(R,{background:"",total:o.total,"current-page":o.queryParams.pageNum,"page-size":o.queryParams.pageSize,layout:"total, sizes, prev, pager, next, jumper",onSizeChange:t.handleSizeChange,onCurrentChange:t.handleCurrentChange},null,8,["total","current-page","page-size","onSizeChange","onCurrentChange"])],512),[[te,o.total>0]])]),_:1}),u(x,{ref:"editModuleRef",title:o.title},null,8,["title"])])}var Fe=K(se,[["render",fe]]);export{Fe as default};
