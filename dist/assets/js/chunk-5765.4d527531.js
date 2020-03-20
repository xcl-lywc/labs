(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5765"],{"17aa":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"content-wrap-box"},[a("el-card",{staticClass:"title-card"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("div",{staticClass:"breadcrumb-div",staticStyle:{width:"calc(100% - 281px)"}},[a("el-breadcrumb-item",{staticClass:"mart10",attrs:{to:{path:"/lesson/testlist"}}},[e._v("实验列表")]),a("el-breadcrumb-item",{staticClass:"mart10",attrs:{to:{name:"TestDetail",params:{id:e.$route.params.id}}}},[e._v("实验详情")]),a("el-breadcrumb-item",{staticStyle:{width:"calc(100% - 164px)"}},[a("div",{staticClass:"fl text-left-div mart10"},[e._v("管理实验的学生名册")]),a("div",{staticClass:"text-right fr"},[a("el-button",{attrs:{type:"primary",disabled:!e.common.checkAuthority("TestPersonalStudentResister_AddStudent",!0)},on:{click:e.showMemberDialog}},[e._v("\n              "+e._s(e.common.checkAuthority("TestPersonalStudentResister_AddStudent")?e.common.checkAuthority("TestPersonalStudentResister_AddStudent").name:"")+"\n            ")]),a("upload",{staticClass:"marl10",staticStyle:{display:"inline-block"},attrs:{url:"/participant/import/"+e.$route.params.id,isDisabled:!e.common.checkAuthority("TestPersonalStudentResister_Import",!0),fileTypes:["xls","xlsx"],size:"middle",buttonText:e.common.checkAuthority("TestPersonalStudentResister_Import")?e.common.checkAuthority("TestPersonalStudentResister_Import").name:""},on:{uploadSuccess:e.importSheet}})],1)])],1)])],1),a("el-card",{staticClass:"operation-router-view-wrap mar15",attrs:{"body-style":{"padding-bottom":"0px"}}},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:e.searchForm,"label-width":"100px"}},[a("el-form-item",{attrs:{label:"学号：",prop:"account"}},[a("el-input",{model:{value:e.searchForm.account,callback:function(t){e.$set(e.searchForm,"account",t)},expression:"searchForm.account"}})],1),a("el-form-item",{attrs:{label:"院系：",prop:"faculty"}},[a("el-cascader",{attrs:{filterable:"",options:e.facultyOptions,props:e.facultyProps,"change-on-select":!0,"show-all-levels":!1},model:{value:e.searchForm.faculty,callback:function(t){e.$set(e.searchForm,"faculty",t)},expression:"searchForm.faculty"}})],1),a("el-form-item",{attrs:{label:"姓名：",prop:"user_name"}},[a("el-input",{model:{value:e.searchForm.user_name,callback:function(t){e.$set(e.searchForm,"user_name",t)},expression:"searchForm.user_name"}})],1),a("el-form-item",[a("el-button",{attrs:{disabled:!e.common.checkAuthority("TestPersonalStudentResister_Search",!0),type:"primary"},on:{click:e.getQueryStudent}},[e._v("\n          "+e._s(e.common.checkAuthority("TestPersonalStudentResister_Search")?e.common.checkAuthority("TestPersonalStudentResister_Search").name:"")+"\n        ")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.$refs.searchForm&&e.$refs.searchForm.resetFields()}}},[e._v("置空")])],1)],1)],1),a("div",{staticClass:"router-view-wrap mart0"},[a("div",{staticClass:"router-view-content"},[a("el-table",{ref:"multipleTable",staticStyle:{width:"100%"},attrs:{data:e.studentList.rows,"tooltip-effect":"dark"}},[a("el-table-column",{attrs:{type:"index",align:"center",label:"序号",prop:"faculty"}}),a("el-table-column",{attrs:{align:"center",label:"工/学号",prop:"account"}}),a("el-table-column",{attrs:{align:"center",prop:"user_name",label:"姓名"}}),a("el-table-column",{attrs:{width:"100",align:"center",prop:"group_type",label:"是否组长","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s(1==t.row.group_type?"是":"否")+"\n          ")]}}])}),a("el-table-column",{attrs:{width:"50",align:"center",prop:"sex_str",label:"性别","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n            "+e._s(1==t.row.sex?"男":"女")+"\n          ")]}}])}),a("el-table-column",{attrs:{width:"200px",align:"center",prop:"facultyName",label:"院系","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{width:"120",align:"center",prop:"phone_num",label:"手机","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{align:"center",prop:"mail",label:"邮箱","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{align:"center",label:"操作",width:"200px","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{disabled:!e.common.checkAuthority("TestPersonalStudentResister_Delete",!0),type:"danger",size:"mini"},on:{click:function(a){e.deleteMember(t.row.id)}}},[e._v("\n                "+e._s(e.common.checkAuthority("TestPersonalStudentResister_Delete")?e.common.checkAuthority("TestPersonalStudentResister_Delete").name:"")+"\n              ")])]}}])})],1),a("div",{staticClass:"router-view-bottom mart10"},[a("div"),a("el-pagination",{staticClass:"fr ",attrs:{background:"","current-page":e.common.elementPagination.pageNum,"page-sizes":e.common.elementPagination.pageSizes,"page-size":e.common.elementPagination.pageSizeDefault,layout:"total, sizes, prev, pager, next",total:e.studentList.total},on:{"size-change":function(t){e.handleSizeChange(t,"studentList")},"current-change":function(t){e.handleCurrentChange(t,"studentList")}}})],1)],1)]),a("el-dialog",{attrs:{width:"70vw",title:"添加成员",visible:e.addMemberDialog},on:{"update:visible":function(t){e.addMemberDialog=t}}},[a("el-form",{ref:"memberSearchForm",attrs:{inline:!0,model:e.memberSearchForm,"label-width":"60px"}},[a("el-form-item",{attrs:{label:"姓名：",prop:"name"}},[a("el-input",{model:{value:e.memberSearchForm.user_name,callback:function(t){e.$set(e.memberSearchForm,"user_name",t)},expression:"memberSearchForm.user_name"}})],1),a("el-form-item",{attrs:{label:"工号：",prop:"account"}},[a("el-input",{model:{value:e.memberSearchForm.account,callback:function(t){e.$set(e.memberSearchForm,"account",t)},expression:"memberSearchForm.account"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.getQueryMemberListByCourseId()}}},[e._v("搜索")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.$refs.memberSearchForm&&e.$refs.memberSearchForm.resetFields()}}},[e._v("置空")])],1)],1),a("el-table",{ref:"memberTable",staticStyle:{width:"100%"},attrs:{border:"","row-key":e.getTableRowKeys,data:e.memberListData.rows,"tooltip-effect":"dark"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{"reserve-selection":!0,align:"center",type:"selection",width:"55"}}),a("el-table-column",{attrs:{align:"center",label:"工号",prop:"account"}}),a("el-table-column",{attrs:{align:"center",prop:"user_name",label:"姓名"}}),a("el-table-column",{attrs:{align:"center",prop:"facultyName",label:"系别","show-overflow-tooltip":""}}),a("el-table-column",{attrs:{align:"center",prop:"phone_num",label:"手机","show-overflow-tooltip":""}})],1),a("div",{staticClass:"pad10"},[a("el-pagination",{staticClass:"fr ",attrs:{background:"","current-page":e.common.elementPagination.pageNum,"page-sizes":e.common.elementPagination.pageSizes,"page-size":e.common.elementPagination.pageSizeDefault,layout:"total, sizes, prev, pager, next",total:e.memberListData.total},on:{"size-change":function(t){e.handleSizeChange(t,"membersList")},"current-change":function(t){e.handleCurrentChange(t,"membersList")}}})],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.addMemberDialog=!1}}},[e._v("取 消")]),a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.submitBatch("memberBatchForm")}}},[e._v("保存")])],1)],1)],1)},o=[],s=(a("ac6a"),a("d443")),n={components:{upload:s["a"]},data:function(){return{experimentId:this.$route.params.id,courseId:this.$route.params.courseId,addMemberDialog:!1,studentList:{total:0,rows:[]},facultyOptions:[],searchForm:{experiment_id:this.$route.params.id,account:null,type:3,faculty:null,user_name:null,pageNum:this.common.elementPagination.pageNumDefault,pageSize:this.common.elementPagination.pageSizeDefault},facultyProps:{value:"id",label:"faculty",children:"childrens"},memberSearchForm:{experiment_id:this.$route.params.id,user_name:null,account:null,pageNum:this.common.elementPagination.pageNumDefault,pageSize:this.common.elementPagination.pageSizeDefault},memberListData:{total:0,rows:[]},memberBatchForm:{experiment_id:this.$route.params.id,type:3,member_id:[]}}},mounted:function(){this.getQueryStudent(),this.getQueryMemberListByCourseId(),this.getQueryFacultyTree()},methods:{getQueryStudent:function(){var e=this,t=this.searchForm.faculty?this.searchForm.faculty[this.searchForm.faculty.length-1]:null,a="experiment_id=".concat(this.searchForm.experiment_id,"&account=").concat(this.searchForm.account,"&type=3&faculty=").concat(t,"&user_name=").concat(this.searchForm.user_name,"&pageNum=").concat(this.searchForm.pageNum,"&pageSize=").concat(this.searchForm.pageSize);this.axios.get("".concat(this.common.basePath,"/participant?").concat(a),{}).then(function(t){e.studentList=t.data.data}).catch(function(t){e.$message.error(t)})},deleteMember:function(e){var t=this;this.axios.patch("".concat(this.common.basePath,"/participant/delete/").concat(e),"").then(function(e){t.getQueryStudent()}).catch(function(e){t.$message.error(e)})},getQueryMemberListByCourseId:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/member"),this._memberListByCourseIdParams(3)).then(function(t){e.memberListData=e.memeberCourseStudentListData=t.data.data}).catch(function(t){e.$message.error(t)})},_memberListByCourseIdParams:function(e){var t=JSON.parse(JSON.stringify(this.memberSearchForm));return t.type=e,t.course_id=this.courseId,{params:t}},getTableRowKeys:function(e){return e.id},handleSelectionChange:function(e){var t=this;this.memberBatchForm.member_id=[],e.forEach(function(e){t.memberBatchForm.member_id.push(e.id)})},showMemberDialog:function(){this.memberListData=this.memeberCourseStudentListData,this.addMemberDialog=!0,this.memberBatchForm.type=3,this.$refs.memberSearchForm&&this.$refs.memberSearchForm.resetFields(),this.getQueryMemberListByCourseId(),this.$refs.memberTable&&this.$refs.memberTable.clearSelection()},submitBatch:function(){var e=this;if(!this.memberBatchForm.member_id.length)return this.$message.error("请选择成员"),!1;this.axios.post("".concat(this.common.basePath,"/participant/add/batch"),this.memberBatchForm).then(function(t){e.getQueryStudent(),e.getQueryMemberListByCourseId(),e.addMemberDialog=!1,e.$message.success(t.data.meta.message)}).catch(function(t){e.$message.error(t),e.addMemberDialog=!1})},getQueryFacultyTree:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/faculty/tree"),"").then(function(t){e._recombineFacultyTree(t.data.data),e.facultyOptions=t.data.data}).catch(function(t){e.$message.error(t)})},_recombineFacultyTree:function(e){var t=this;e.forEach(function(e){e.childrens?t._recombineFacultyTree(e.childrens):delete e.childrens})},handleCurrentChange:function(e,t){"studentList"==t?(this.searchForm.pageNum=e,this.getQueryStudent()):(this.memberSearchForm.pageNum=e,this.getQueryMemberListByCourseId())},handleSizeChange:function(e,t){"studentList"==t?(this.searchForm.pageSize=e,this.getQueryStudent()):(this.memberSearchForm.pageSize=e,this.getQueryMemberListByCourseId())},importSheet:function(e){this.$message.success("上传成功"),this.getQueryStudent()}}},i=n,c=(a("5efa"),a("2877")),l=Object(c["a"])(i,r,o,!1,null,null,null);l.options.__file="TestPersonalStudentResister.vue";t["default"]=l.exports},"49d2":function(e,t,a){},"5efa":function(e,t,a){"use strict";var r=a("49d2"),o=a.n(r);o.a}}]);
//# sourceMappingURL=chunk-5765.4d527531.js.map