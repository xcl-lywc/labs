(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dc68"],{"200a":function(t,e,a){},"3a19":function(t,e,a){"use strict";var s=a("200a"),i=a.n(s);i.a},aa2b:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"content-wrap-box"},[a("el-card",{staticClass:"title-card"},[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/eptmanage/exercisescore"}}},[t._v("习题评分")]),a("el-breadcrumb-item",[t._v("习题详情")])],1)],1),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoad,expression:"isLoad"}],staticClass:"router-view-wrap transparent-bg"},[a("div",{staticClass:"router-view-content task-detail"},[a("el-card",[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",{staticClass:"card-title"},[t._v("课程信息")])]),t.courseDetail?a("el-row",[a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            课程名称："+t._s(t.courseDetail.name)+" \n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            课程代码： "+t._s(t.courseDetail.c_code)+"\n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            课程教师： "+t._s(t.courseDetail.c_teacher)+"\n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            课程性质： "+t._s(t.courseDetail.c_nature)+"\n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            简介："+t._s(t.courseDetail.description)+" \n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            课程组长："),t._l(t.courseDetail.courseLeader,function(e,s){return a("span",{key:s},[t._v(t._s(e.user_name)+"，")])})],2),a("el-col",{staticClass:"marb5",attrs:{span:12}},[t._v("\n            创建时间："+t._s(t.common._convertDate(t.courseDetail.create_time,"yyyy年MM月dd日"))+"  \n          ")])],1):t._e()],1),a("el-card",{staticClass:"mart20"},[a("div",{attrs:{slot:"header"},slot:"header"},[a("span",{staticClass:"card-title"},[t._v("实验信息")])]),t.experimentDetail?a("el-row",[a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            实验名称："+t._s(t.experimentDetail.name)+"  \n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            简介："+t._s(t.experimentDetail.description)+" \n          ")]),a("el-col",{staticClass:"marb5",attrs:{span:24}},[t._v("\n            任课教师："),t._l(t.experimentDetail.teacher,function(e,s){return a("span",{key:s},[t._v(t._s(e.user_name)+"，")])})],2),a("el-col",{staticClass:"marb5",attrs:{span:12}},[t._v("\n            创建时间："+t._s(t.common._convertDate(t.experimentDetail.create_time,"yyyy年MM月dd日"))+"  \n          ")])],1):t._e()],1),a("exercise-taskdetailcom",{staticClass:"mart20"})],1)])],1)},i=[],r=a("20c2"),n={data:function(){return{paperDialog:!1,delayDialog:!1,isPaperDialogShowClose:!0,taskDetail:null,courseDetail:null,experimentDetail:null,isLoad:!0,delayForm:{end_time:null},questionActiveName:"1",answerMemberListData:[],experimentReportList:[],loginUserId:sessionStorage.getItem("access_key"),paperDetail:null}},computed:{reportStatus:function(){if(this.taskDetail)switch(this.taskDetail.cur_status){case 1:return"未发布";case 2:return"进行中";case 3:return"已截止";case 4:return"已结束"}}},components:{"exercise-taskdetailcom":r["a"]},mounted:function(){this.getQueryTaskDetail(),this.getQueryCourseDetail(),this.getQueryExperimentDetail()},methods:{getQueryCourseDetail:function(){var t=this;this.axios.get("".concat(this.common.basePath,"/course/detail/").concat(this.$route.params.task_id),"").then(function(e){t.courseDetail=e.data.data,t.isLoad=!1}).catch(function(e){t.$message.error(e),t.isLoad=!1})},getQueryTaskDetail:function(){var t=this;this.axios.get("".concat(this.common.basePath,"/task/").concat(this.$route.params.task_id),"").then(function(e){t.taskDetail=e.data.data,t.getQueryPaperDetail(e.data.data.associated_object),t.isLoad=!1}).catch(function(e){t.$message.error(e),t.isLoad=!1})},getQueryPaperDetail:function(t){var e=this;this.axios.get("".concat(this.common.basePath,"/paper/simple/").concat(t),"").then(function(t){e.paperDetail=t.data.data}).catch(function(t){e.$message.error(t)})},getQueryExperimentDetail:function(){var t=this;this.axios.get("".concat(this.common.basePath,"/experiment/").concat(this.$route.params.experiment_id),"").then(function(e){t.experimentDetail=e.data.data,t.isLoad=!1}).catch(function(e){t.$message.error(e),t.isLoad=!1})},goToQuestionPage:function(){this.$router.push({name:"ExerciseTestPaper",params:{report_id:this.taskDetail.id,experiment_id:this.taskDetail.experiment_id,associated_object:this.taskDetail.associated_object}})},closePaperDialogFun:function(){this.paperDialog=!1},isPaperDialogShowCloseFun:function(t){this.isPaperDialogShowClose=t},submitDelayTask:function(t){var e=this;this.$refs[t].validate(function(t){if(!t)return!1;e.axios.patch("".concat(e.common.basePath,"/task/").concat(e.$route.params.id),e.delayForm).then(function(t){e.getQueryTaskDetail(),e.delayDialog=!1}).catch(function(t){e.delayDialog=!1,e.$message.error(t)})})},releaseTask:function(){var t=this;this.axios.get("".concat(this.common.basePath,"/task/release/").concat(this.$route.params.id),"").then(function(e){t.$message.success(e.data.meta.message),t.getQueryTaskDetail()}).catch(function(e){t.$message.error(e)})}}},o=n,c=(a("3a19"),a("2877")),l=Object(c["a"])(o,s,i,!1,null,null,null);l.options.__file="ExerciseScoreDetail.vue";e["default"]=l.exports}}]);
//# sourceMappingURL=chunk-dc68.51b341a1.js.map