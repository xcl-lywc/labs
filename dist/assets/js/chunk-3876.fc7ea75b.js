(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3876"],{"2e8b":function(t,e,a){},a1d4:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrap-box"},[a("el-card",{staticClass:"title-card"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/consumables/record"}}},[t._v("入库")]),a("el-breadcrumb-item",[t._v("入库详情")])],1)],1),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.pageLoading,expression:"pageLoading"}],staticClass:"router-view-wrap transparent-bg"},[a("div",{staticClass:"router-view-content"},[t.common.checkAuthority("InstockDetail-info",!0)?a("el-row",[a("el-card",{attrs:{shadow:""}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("基本信息")]),t.detailData?a("div",{staticClass:"fr"},[t.common.checkAuthority("Record-detail-put",!0)?a("el-button",{attrs:{type:"success",size:"mini",disabled:2===t.detailData.curStatus},on:{click:function(e){e.stopPropagation(),t.confirmInstockApply(t.detailData)}}},[t._v("入库")]):t._e(),t.common.checkAuthority("Record-detail-edit",!0)?a("el-button",{attrs:{type:"primary",size:"mini",disabled:2===t.detailData.curStatus},on:{click:function(e){e.stopPropagation(),t.$router.push({name:"InstockDetailedForm",params:{type:2,id:t.detailData.id}})}}},[t._v("编辑")]):t._e(),t.common.checkAuthority("Record-detail-delete",!0)?a("el-button",{attrs:{type:"danger",size:"mini",disabled:2===t.detailData.curStatus},on:{click:function(e){e.stopPropagation(),t.deleteInstockApply(t.detailData)}}},[t._v("删除")]):t._e()],1):t._e()]),t.detailData?a("el-form",{attrs:{model:t.detailData,"label-width":"120px","label-position":"left"}},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"入库人："}},[a("el-card",{attrs:{shadow:"never"}},[t.consumerBaseInfo?a("el-form",{staticClass:"show-detail-form",attrs:{"label-width":"100px"}},[a("el-row",{attrs:{gutter:5}},[a("el-col",{attrs:{span:24}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"工号/学号：",prop:"account"}},[a("span",[t._v(t._s(t.consumerBaseInfo.account))])]),a("el-form-item",{attrs:{label:"姓名：",prop:"user_name"}},[a("span",[t._v(t._s(t.consumerBaseInfo.user_name))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"头像：",prop:"head_img"}},[t.consumerBaseInfo.head_img||""===t.consumerBaseInfo.head_img?a("el-avatar",{attrs:{shape:"square",size:50,src:t.common.filePath+t.consumerBaseInfo.head_img}},[a("img",{attrs:{src:"https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"}})]):a("span",[t._v("未上传头像")])],1)],1)],1),a("el-col",{attrs:{span:24}},[t.facultyTreeData?a("el-form-item",{attrs:{label:"院系：",prop:"faculties_ids"}},[a("el-cascader",{staticClass:"fill-width text-info",attrs:{disabled:"",options:t.facultyTreeData,props:t.facultyProps,"change-on-select":""},model:{value:t.consumerBaseInfo.faculties_ids,callback:function(e){t.$set(t.consumerBaseInfo,"faculties_ids",e)},expression:"consumerBaseInfo.faculties_ids"}})],1):t._e()],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"手机：",prop:"phone_num"}},[a("span",[t._v(t._s(t.consumerBaseInfo.phone_num))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"邮箱：",prop:"mail"}},[a("span",[t._v(t._s(t.consumerBaseInfo.mail))])])],1)],1)],1):t._e()],1)],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"操作人："}},[a("el-card",{attrs:{shadow:"never"}},[t.creatorBaseInfo?a("el-form",{staticClass:"show-detail-form",attrs:{"label-width":"100px"}},[a("el-row",{attrs:{gutter:5}},[a("el-col",{attrs:{span:24}},[a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"工号/学号：",prop:"account"}},[a("span",[t._v(t._s(t.creatorBaseInfo.account))])]),a("el-form-item",{attrs:{label:"姓名：",prop:"user_name"}},[a("span",[t._v(t._s(t.creatorBaseInfo.user_name))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"头像：",prop:"head_img"}},[t.creatorBaseInfo.head_img||""===t.creatorBaseInfo.head_img?a("el-avatar",{attrs:{shape:"square",size:50,src:t.common.filePath+t.creatorBaseInfo.head_img}},[a("img",{attrs:{src:"https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"}})]):a("span",[t._v("未上传头像")])],1)],1)],1),a("el-col",{attrs:{span:24}},[t.facultyTreeData?a("el-form-item",{attrs:{label:"院系：",prop:"faculties_ids"}},[a("el-cascader",{staticClass:"fill-width text-info",attrs:{disabled:"",options:t.facultyTreeData,props:t.facultyProps,"change-on-select":""},model:{value:t.creatorBaseInfo.faculties_ids,callback:function(e){t.$set(t.creatorBaseInfo,"faculties_ids",e)},expression:"creatorBaseInfo.faculties_ids"}})],1):t._e()],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"手机：",prop:"phone_num"}},[a("span",[t._v(t._s(t.creatorBaseInfo.phone_num))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"邮箱：",prop:"mail"}},[a("span",[t._v(t._s(t.creatorBaseInfo.mail))])])],1)],1)],1):t._e()],1)],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"操作时间："}},[a("span",[t._v(t._s(t.common._convertDate(t.detailData.createTime,"yyyy/MM/dd")))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"入库类型："}},[1===t.detailData.inStockType?a("el-tag",{attrs:{type:"success"}},[t._v("入库")]):t._e(),2===t.detailData.inStockType?a("el-tag",{attrs:{type:"danger"}},[t._v("借出归还")]):t._e(),3===t.detailData.inStockType?a("el-tag",{attrs:{type:"warning"}},[t._v("维修入库")]):t._e()],1)],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"状态："}},[2===t.detailData.curStatus?a("el-tag",{attrs:{type:"success"}},[t._v("已入库")]):t._e(),1===t.detailData.curStatus?a("el-tag",{attrs:{type:"warning"}},[t._v("未入库")]):t._e()],1)],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"原因："}},[a("div",{staticClass:"desc_info_box"},[t._v("\n                    "+t._s(t.detailData.reason)+"\n                  ")])])],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{label:"入库清单："}},[a("el-card",{attrs:{shadow:""}},[a("el-table",{attrs:{stripe:"",data:t.detailData.materialInStockInfos,"show-header":!0}},[a("el-table-column",{attrs:{type:"expand",label:"仓库"},scopedSlots:t._u([{key:"default",fn:function(t){return[a("el-table",{attrs:{data:t.row.materialInStockInfoHasStorehouses,border:"","show-header":!0}},[a("el-table-column",{attrs:{prop:"address",align:"center",label:"教室",width:""}}),a("el-table-column",{attrs:{prop:"amount",align:"center",label:"数量",width:""}})],1)]}}])}),a("el-table-column",{attrs:{prop:"materialTypeName",label:"耗材类型","show-overflow-tooltip":"",width:""}}),a("el-table-column",{attrs:{prop:"materialModelName",label:"耗材型号","show-overflow-tooltip":"",width:""}}),a("el-table-column",{attrs:{prop:"modelType",label:"型号类型",width:""},scopedSlots:t._u([{key:"default",fn:function(e){return[1===e.row.modelType?a("el-tag",[t._v("耗材")]):t._e(),2===e.row.modelType?a("el-tag",{attrs:{type:"success"}},[t._v("设备")]):t._e()]}}])}),a("el-table-column",{attrs:{prop:"identifier",label:"设备编号","show-overflow-tooltip":"",width:""},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.identifier?a("span",[t._v(t._s(e.row.identifier))]):a("i",{staticClass:"el-icon-close",staticStyle:{"font-size":"16px"}})]}}])}),a("el-table-column",{attrs:{prop:"serialNum",label:"设备序列号","show-overflow-tooltip":"",width:""},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.serialNum?a("span",[t._v(t._s(e.row.serialNum))]):a("i",{staticClass:"el-icon-close",staticStyle:{"font-size":"16px"}})]}}])}),a("el-table-column",{attrs:{prop:"amount",label:"数量",width:""}})],1)],1)],1)],1)],1)],1):a("div",{staticClass:"text-center text-info"},[t._v(" 暂无数据 ")])],1)],1):a("div",{staticClass:"text-center text-info"},[t._v(" 你无权查看此内容 ")])],1)])],1)},o=[],r=(a("cadf"),a("551c"),a("097d"),{data:function(){return{paramsId:this.$route.params.id,pageLoading:!1,detailData:null,consumerBaseInfo:null,creatorBaseInfo:null,facultyTreeData:null,facultyProps:{children:"childrens",label:"faculty",value:"id"}}},created:function(){this.initFacultyTree()},mounted:function(){this.common.checkAuthority("InstockDetail-info",!0)&&this.getInstockDetailedInfo()},methods:{getUserBaseInfo01:function(t){var e=this,a={method:"get",url:"".concat(this.common.basePath,"/user/one/user"),params:{id:t}};this.axios(a).then(function(t){e.consumerBaseInfo=t.data.data}).catch(function(t){e.$message.error(t)})},getUserBaseInfo02:function(t){var e=this,a={method:"get",url:"".concat(this.common.basePath,"/user/one/user"),params:{id:t}};this.axios(a).then(function(t){e.creatorBaseInfo=t.data.data}).catch(function(t){e.$message.error(t)})},initFacultyTree:function(){var t=this;this.pageLoading=!0;var e={method:"get",url:"".concat(this.common.basePath,"/faculty/tree/public")};this.axios(e).then(function(e){t.facultyTreeData=e.data.data||[]}).catch(function(e){t.$message.error(e)})},getInstockDetailedInfo:function(){var t=this;this.pageLoading=!0;var e={method:"get",url:"".concat(this.common.basePath,"/material_instock/select_detail"),params:{id:this.paramsId}};this.axios(e).then(function(e){t.detailData=e.data.data,e.data.data.consumer&&t.getUserBaseInfo01(e.data.data.consumer),e.data.data.creator&&t.getUserBaseInfo02(e.data.data.creator),t.pageLoading=!1}).catch(function(e){t.pageLoading=!1,t.$message.error(e)})},deleteInstockApply:function(t){var e=this;this.$confirm("当前删除的内容将无法找回","确认删除?",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(a){var s={method:"get",url:"".concat(e.common.basePath,"/material_instock/delete"),params:{id:t.id}};e.axios(s).then(function(a){e.$message.success(a.data.meta.message),e.activeId==t.id&&(e.activeId=null),e.$router.push({name:"Record"})}).catch(function(t){e.$message.error(t)})}).catch(function(t){})},confirmInstockApply:function(t){var e=this;this.$confirm("确认入库？","入库",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(a){var s={method:"post",url:"".concat(e.common.basePath,"/storehouse/in-stock/confirm"),params:{id:t.id}};e.axios(s).then(function(t){e.$message.success(t.data.meta.message),e.getInstockDetailedInfo()}).catch(function(t){e.$message.error(t)})}).catch(function(t){})}}}),l=r,n=(a("a5ed"),a("2877")),i=Object(n["a"])(l,s,o,!1,null,null,null);i.options.__file="InstockDetail.vue";e["default"]=i.exports},a5ed:function(t,e,a){"use strict";var s=a("2e8b"),o=a.n(s);o.a}}]);
//# sourceMappingURL=chunk-3876.fc7ea75b.js.map