var U=Object.defineProperty;var D=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var h=(l,o,e)=>o in l?U(l,o,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[o]=e,y=(l,o)=>{for(var e in o||(o={}))O.call(o,e)&&h(l,e,o[e]);if(D)for(var e of D(o))q.call(o,e)&&h(l,e,o[e]);return l};import{$ as d,_ as L,H as N,k as z,p as T,a as _,h as r,w as t,a2 as $,M as A,r as n,aC as j,o as i,y as H,i as F,t as E,b as W,F as B,e as k,f as S,g as w}from"./index.1661925429160.js";function ue(l){return d({url:"/resource/email/list",method:"get",params:l})}function G(l){return d({url:"/resource/email",method:"post",data:l})}function J(l){return d({url:"/resource/email",method:"put",data:l})}function re(l){return d({url:"/resource/email/"+l,method:"delete"})}function te(l){return d({url:"/resource/email/changeStatus",method:"put",data:l})}function ae(l){return d({url:"/resource/email/debugMail",method:"post",data:l})}const K={name:"editMenu",props:{title:{type:String,default:()=>""}},setup(){const{proxy:l}=w(),o=N(null),e=z({isShowDialog:!1,loading:!1,ruleForm:{mailId:0,category:"",host:"",port:0,from:"",nickname:"",secret:"",isSsl:!1,status:"0"},statusOptions:[],mailOptions:[],ruleRules:{host:[{required:!0,message:"\u90AE\u4EF6\u670D\u52A1\u5668\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],port:[{required:!0,message:"\u7AEF\u53E3\u53F7\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],from:[{required:!0,message:"\u8D26\u53F7\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}],secret:[{required:!0,message:"\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A",trigger:"blur"}]}}),c=u=>{u.mailId&&u.mailId!=null&&u.mailId!=0?(e.ruleForm=u,e.ruleForm.mailId=u.mailId,e.ruleForm.category=u.category,e.ruleForm.host=u.host,e.ruleForm.port=u.port,e.ruleForm.from=u.from,e.ruleForm.nickname=u.nickname,e.ruleForm.secret=u.secret,e.ruleForm.isSsl=u.isSsl,e.ruleForm.status=u.status):f(),e.isShowDialog=!0,e.loading=!1,l.getDicts("sys_normal_disable").then(s=>{e.statusOptions=s.data}),l.getDicts("res_mail_category").then(s=>{e.mailOptions=s.data})},p=u=>{l.mittBus.emit("onEditResEmailsModule",u),e.isShowDialog=!1},V=()=>{p()},g=()=>{const u=$(o);!u||u.validate(s=>{s&&(e.loading=!0,e.ruleForm.mailId!=null&&e.ruleForm.mailId!=0?J(e.ruleForm).then(m=>{A.success("\u4FEE\u6539\u6210\u529F"),e.loading=!1,p(e.ruleForm)}):G(e.ruleForm).then(m=>{A.success("\u65B0\u589E\u6210\u529F"),e.loading=!1,p(e.ruleForm)}))})},f=()=>{e.ruleForm.mailId=0,e.ruleForm.category="",e.ruleForm.host="",e.ruleForm.port=0,e.ruleForm.from="",e.ruleForm.nickname="",e.ruleForm.secret="",e.ruleForm.isSsl=!1,e.ruleForm.status="0"};return y({ruleFormRef:o,openDialog:c,closeDialog:p,onCancel:V,initForm:f,onSubmit:g},T(e))}},P={class:"system-menu-container"},Q={style:{"font-size":"large"}},X={class:"dialog-footer"},Y=F("\u53D6 \u6D88"),Z=F("\u7F16 \u8F91");function x(l,o,e,c,p,V){const g=n("el-radio"),f=n("el-radio-group"),u=n("el-form-item"),s=n("el-col"),m=n("el-input"),v=n("el-input-number"),C=n("el-row"),M=n("el-form"),b=n("el-button"),I=n("el-dialog"),R=j("drag");return i(),_("div",P,[r(I,{modelValue:l.isShowDialog,"onUpdate:modelValue":o[7]||(o[7]=a=>l.isShowDialog=a),width:"769px",center:""},{header:t(()=>[H((i(),_("div",Q,[F(E(e.title),1)])),[[R,[".system-menu-container .el-dialog",".system-menu-container .el-dialog__header"]]])]),footer:t(()=>[W("span",X,[r(b,{onClick:c.onCancel},{default:t(()=>[Y]),_:1},8,["onClick"]),r(b,{type:"primary",onClick:c.onSubmit,loading:l.loading},{default:t(()=>[Z]),_:1},8,["onClick","loading"])])]),default:t(()=>[r(M,{model:l.ruleForm,rules:l.ruleRules,ref:"ruleFormRef","label-width":"80px"},{default:t(()=>[r(C,{gutter:35},{default:t(()=>[r(s,{span:24},{default:t(()=>[r(u,{label:"Mail\u5206\u7C7B",prop:"category"},{default:t(()=>[r(f,{modelValue:l.ruleForm.category,"onUpdate:modelValue":o[0]||(o[0]=a=>l.ruleForm.category=a)},{default:t(()=>[(i(!0),_(B,null,k(l.mailOptions,a=>(i(),S(g,{key:a.dictValue,label:a.dictValue},{default:t(()=>[F(E(a.dictLabel),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u7528\u6237\u540D\u79F0",prop:"from"},{default:t(()=>[r(m,{modelValue:l.ruleForm.from,"onUpdate:modelValue":o[1]||(o[1]=a=>l.ruleForm.from=a),placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u540D"},null,8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u5BC6\u7801",prop:"secret"},{default:t(()=>[r(m,{modelValue:l.ruleForm.secret,"onUpdate:modelValue":o[2]||(o[2]=a=>l.ruleForm.secret=a),placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801"},null,8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u4E3B\u673A\u5730\u5740",prop:"host"},{default:t(()=>[r(m,{modelValue:l.ruleForm.host,"onUpdate:modelValue":o[3]||(o[3]=a=>l.ruleForm.host=a),placeholder:"\u8BF7\u8F93\u5165\u4E3B\u673A\u5730\u5740"},null,8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u7AEF\u53E3",prop:"port"},{default:t(()=>[r(v,{modelValue:l.ruleForm.port,"onUpdate:modelValue":o[4]||(o[4]=a=>l.ruleForm.port=a),min:10},null,8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u53D1\u4EF6\u4EBA",prop:"nickname"},{default:t(()=>[r(m,{modelValue:l.ruleForm.nickname,"onUpdate:modelValue":o[5]||(o[5]=a=>l.ruleForm.nickname=a),placeholder:"\u8BF7\u8F93\u5165\u53D1\u4EF6\u4EBA"},null,8,["modelValue"])]),_:1})]),_:1}),r(s,{span:24},{default:t(()=>[r(u,{label:"\u72B6\u6001",prop:"status"},{default:t(()=>[r(f,{modelValue:l.ruleForm.status,"onUpdate:modelValue":o[6]||(o[6]=a=>l.ruleForm.status=a)},{default:t(()=>[(i(!0),_(B,null,k(l.statusOptions,a=>(i(),S(g,{key:a.dictValue,label:a.dictValue},{default:t(()=>[F(E(a.dictLabel),1)]),_:2},1032,["label"]))),128))]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}var ee=L(K,[["render",x]]),se=Object.freeze({__proto__:null,[Symbol.toStringTag]:"Module",default:ee});export{ee as E,re as a,te as c,ae as d,se as e,ue as l};
