(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-65e2"],{"03cf":function(t,e,a){},"69f3":function(t,e,a){"use strict";var s=a("03cf"),r=a.n(s);r.a},f756:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{ref:"contentWrap",staticClass:"content-wrap-box"},[a("el-card",{staticClass:"title-card"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",[t._v("待提交报告列表")])],1)],1),a("div",{ref:"contentWrap",staticClass:"router-view-wrap"},[a("div",{staticClass:"router-view-content"},[a("el-form",{ref:"searchForm",attrs:{model:t.searchForm,inline:!0,"label-width":"120px"}},[a("el-form-item",{attrs:{label:"实验课程：",prop:"course_id"}},[a("el-select",{on:{change:t.courseChange},model:{value:t.searchForm.course_id,callback:function(e){t.$set(t.searchForm,"course_id",e)},expression:"searchForm.course_id"}},t._l(t.courseListData.rows,function(t,e){return a("el-option",{key:e,attrs:{value:t.id,label:t.name}})}))],1),a("el-form-item",{attrs:{label:"实验名称：",prop:"experiment_id"}},[a("el-select",{model:{value:t.searchForm.experiment_id,callback:function(e){t.$set(t.searchForm,"experiment_id",e)},expression:"searchForm.experiment_id"}},t._l(t.experimentListData.rows,function(t,e){return a("el-option",{key:e,attrs:{value:t.id,label:t.name}})}))],1),a("el-form-item",{staticStyle:{display:"none"},attrs:{label:"状态：",prop:"reportStatus"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:t.searchForm.reportStatus,callback:function(e){t.$set(t.searchForm,"reportStatus",e)},expression:"searchForm.reportStatus"}},t._l(t.statusOptions,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}))],1),a("el-form-item",[a("el-button",{attrs:{disabled:!t.common.checkAuthority("ReportTaskList_QueryList",!0),type:"primary"},on:{click:function(e){t.getQueryList(!0)}}},[t._v("\n            "+t._s(t.common.checkAuthority("ReportTaskList_QueryList")?t.common.checkAuthority("ReportTaskList_QueryList").name:"")+"\n          ")]),a("el-button",{attrs:{type:"primary"},on:{click:t.resetSearchForm}},[t._v("置空")])],1)],1),a("el-row",{staticClass:"padding-row"},[t._l(t.listData.rows,function(e,s){return t.listData.rows.length?a("el-col",{key:s,attrs:{span:8}},[a("el-card",{staticClass:"card-wrap",staticStyle:{height:"327px"}},[a("div",{staticClass:"card-content cursor-pointer",on:{click:function(a){t.goToDetail(e)}}},[a("p",{staticClass:"card-"},[t._v("报告任务 "+t._s(t.reportStatus(e.cur_status))+" 得分占比："+t._s(e.value)+"%")]),a("p",{staticClass:"card-"},[t._v("名字："+t._s(e.name))]),a("p",{staticClass:"card-"},[t._v("报告类型："+t._s(2==e.genre?"个人报告":"小组报告"))]),a("p",{staticClass:"card-"},[t._v("报告模板："+t._s(e.task_files?JSON.parse(e.task_files).name:"无"))]),a("p",{staticClass:"card-"},[t._v("要求："+t._s(e.description))])]),a("div",{staticClass:"card-bottom cursor-pointer",on:{click:function(a){t.goToDetail(e)}}},[a("p",{staticClass:"card- text-right"},[t._v(t._s(t.common._convertDate(e.end_time,"yyyy年MM月dd日"))+" \n              ")])])])],1):t._e()}),t.listData.rows.length?t._e():a("el-col",{staticClass:"padding-row text-center text-info",attrs:{span:24}},[t._v("暂无数据")])],2)],1)])],1)},r=[],o={data:function(){return{scrollLoadSw:!0,searchForm:{course_id:null,experiment_id:null,reportStatus:1,pageNum:this.common.elementPagination.pageNumDefault,pageSize:this.common.elementPagination.pageSizeDefault,student_id:sessionStorage.getItem("Access-Key")},statusOptions:[{label:"未做",value:1},{label:"已答题/未打分",value:2},{label:"已打分",value:3}],listData:{total:0,rows:[]},courseListData:{total:0,rows:[]},experimentListData:{total:0,rows:[]},activeCourseId:null}},watch:{},mounted:function(){var t=this,e=this.$refs.contentWrap;e.addEventListener("scroll",function(){e.clientHeight+50>=e.scrollHeight-e.scrollTop&&t.scrollLoadSw&&(t.scrollLoadSw=!1,t.searchForm.pageNum<t.listData.total/t.searchForm.pageSize&&t.getQueryList(!1))},!1),this.getQueryList(!0),this.getQueryCourseList()},methods:{reportStatus:function(t){if(t)switch(t){case 1:return"未做";case 2:return"已答题/未打分";case 3:return"已打分"}},getQueryList:function(t){var e=this;this.axios.get("".concat(this.common.basePath,"/task/student/report"),{params:this._queryParams(t)}).then(function(a){t?e.listData=a.data.data:(e.listData.rows=e.listData.rows.concat(a.data.data.rows),e.listData.total=a.data.data.total),e.scrollLoadSw=!0}).catch(function(t){e.$message.error(t),e.scrollLoadSw=!0})},_queryParams:function(t){return t?this.searchForm.pageNum=1:this.searchForm.pageNum++,this.searchForm},getQueryCourseList:function(){var t=this;this.axios.get("".concat(this.common.basePath,"/course"),"").then(function(e){t.courseListData=e.data.data}).catch(function(e){t.$message.error(e)})},goToDetail:function(t){this.$router.push({name:"ReportTaskDetail",params:{id:t.id,experiment_id:t.experiment_id}})},resetSearchForm:function(){this.$refs.searchForm&&this.$refs.searchForm.resetFields()},getQueryExperimentList:function(t){var e=this;this.axios.get("".concat(this.common.basePath,"/experiment"),{params:{course_id:t}}).then(function(t){e.experimentListData=t.data.data}).catch(function(t){e.$message.error(t)})},courseChange:function(t){this.searchForm.experiment_id=null,this.getQueryExperimentList(t)}}},i=o,n=(a("69f3"),a("2877")),c=Object(n["a"])(i,s,r,!1,null,null,null);c.options.__file="ReportTaskList.vue";e["default"]=c.exports}}]);
//# sourceMappingURL=chunk-65e2.d0c65ec8.js.map