var u=Object.defineProperty;var n=Object.getOwnPropertySymbols;var g=Object.prototype.hasOwnProperty,p=Object.prototype.propertyIsEnumerable;var c=(s,e,t)=>e in s?u(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t,l=(s,e)=>{for(var t in e||(e={}))g.call(e,t)&&c(s,t,e[t]);if(n)for(var t of n(e))p.call(e,t)&&c(s,t,e[t]);return s};import{_ as h,u as d,v as f,k as _,c as m,p as v,a as w,G as x,o as V,b as i}from"./index.1661925429160.js";const T={name:"pagesFilteringDetails1",setup(){const s=d(),e=f(),t=_({tagViewHeight:""}),a=m(()=>{let{isTagsview:o}=s.themeConfig,{isTagsViewCurrenFull:r}=e;return r?"30px":o?"114px":"80px"});return l({initTagViewHeight:a},v(t))}},B=i("div",{class:"layout-view-bg-white"},[i("div",{class:"w100 h100 flex"},[i("div",{class:"flex-margin color-primary"},"\u6D4B\u8BD5\u754C\u9762")])],-1),y=[B];function C(s,e,t,a,o,r){return V(),w("div",{style:x({height:`calc(100vh - ${a.initTagViewHeight}`})},y,4)}var k=h(T,[["render",C]]);export{k as default};
