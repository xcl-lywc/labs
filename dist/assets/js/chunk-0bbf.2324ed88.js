(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0bbf"],{"0b39":function(t,a,e){},"235f":function(t,a,e){"use strict";var n=e("0b39"),i=e.n(n);i.a},b5e4:function(t,a,e){"use strict";e.r(a);var n=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticClass:"instructions content-wrap-box"},[e("el-card",{staticClass:"title-card"},[e("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[e("el-breadcrumb-item",[t._v("产品说明书")])],1),e("el-button",{staticClass:"instructions-back",attrs:{type:"primary",icon:"el-icon-back",size:"mini",round:""},on:{click:function(a){t.$router.go(-1)}}},[t._v("返回")])],1),e("div",{staticClass:"router-view-wrap",attrs:{id:"editormd2"}},[e("mavon-editor",{ref:"md",staticClass:"mavon-height",attrs:{toolbarsFlag:!1,subfield:!1,defaultOpen:"preview",navigation:!0},model:{value:t.value,callback:function(a){t.value=a},expression:"value"}})],1)],1)},i=[],s={data:function(){return{value:"# 一级标题",loading:!1}},methods:{getInstructions:function(){var t=this;this.loading=!0,this.axios.get("".concat(this.common.msBasePath,"/other/instructions"),{params:{project_id:22}}).then(function(a){0===a.data.meta.code?t.value=a.data.data?a.data.data:"":t.$message.error(a.data.meta.message,20),t.loading=!1}).catch(function(a){t.$message.error(a),t.loading=!1})}},mounted:function(){this.getInstructions()}},o=s,r=(e("235f"),e("2877")),c=Object(r["a"])(o,n,i,!1,null,null,null);c.options.__file="Instructions.vue";a["default"]=c.exports}}]);
//# sourceMappingURL=chunk-0bbf.2324ed88.js.map