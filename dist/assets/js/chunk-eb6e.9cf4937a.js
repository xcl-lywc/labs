(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-eb6e"],{1781:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrap-box"},[s("el-card",{staticClass:"title-card"},[s("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[s("el-breadcrumb-item",{attrs:{to:{path:"/lesson/testlist"}}},[e._v("实验列表")]),s("el-breadcrumb-item",{attrs:{to:{name:"TestDetail",params:{id:e.$route.params.experiment_id}}}},[e._v("实验详情")]),s("el-breadcrumb-item",{attrs:{to:{name:"ExercisesTaskDetail",params:{experiment_id:e.$route.params.experiment_id,task_id:e.$route.params.task_id}}}},[e._v("习题任务详情")]),s("el-breadcrumb-item",[e._v("评分")])],1)],1),s("div",{staticClass:"router-view-wrap"},[s("div",{staticClass:"router-view-content"},[s("marking-score-com")],1)])],1)},n=[],o=s("dbcf"),a={components:{"marking-score-com":o["a"]},data:function(){return{}},mounted:function(){},methods:{}},r=a,c=(s("a295"),s("2877")),u=Object(c["a"])(r,i,n,!1,null,null,null);u.options.__file="MarkingScore.vue";t["default"]=u.exports},"28a5":function(e,t,s){s("214f")("split",2,function(e,t,i){"use strict";var n=s("aae3"),o=i,a=[].push,r="split",c="length",u="lastIndex";if("c"=="abbc"[r](/(b)*/)[1]||4!="test"[r](/(?:)/,-1)[c]||2!="ab"[r](/(?:ab)*/)[c]||4!="."[r](/(.?)(.?)/)[c]||"."[r](/()()/)[c]>1||""[r](/.?/)[c]){var l=void 0===/()??/.exec("")[1];i=function(e,t){var s=String(this);if(void 0===e&&0===t)return[];if(!n(e))return o.call(s,e,t);var i,r,m,d,p,h=[],f=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),v=0,x=void 0===t?4294967295:t>>>0,_=new RegExp(e.source,f+"g");l||(i=new RegExp("^"+_.source+"$(?!\\s)",f));while(r=_.exec(s)){if(m=r.index+r[0][c],m>v&&(h.push(s.slice(v,r.index)),!l&&r[c]>1&&r[0].replace(i,function(){for(p=1;p<arguments[c]-2;p++)void 0===arguments[p]&&(r[p]=void 0)}),r[c]>1&&r.index<s[c]&&a.apply(h,r.slice(1)),d=r[0][c],v=m,h[c]>=x))break;_[u]===r.index&&_[u]++}return v===s[c]?!d&&_.test("")||h.push(""):h.push(s.slice(v)),h[c]>x?h.slice(0,x):h}}else"0"[r](void 0,0)[c]&&(i=function(e,t){return void 0===e&&0===t?[]:o.call(this,e,t)});return[function(s,n){var o=e(this),a=void 0==s?void 0:s[t];return void 0!==a?a.call(s,o,n):i.call(String(o),s,n)},i]})},"67a2":function(e,t,s){},9319:function(e,t,s){"use strict";var i=s("9453"),n=s.n(i);n.a},9453:function(e,t,s){},a295:function(e,t,s){"use strict";var i=s("67a2"),n=s.n(i);n.a},dbcf:function(e,t,s){"use strict";var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.questionItem?s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:18}},[s("div",[e._v(e._s(e.questionIndex+1)+"、"+e._s(e.questionItem.question)+"\n          （"+e._s(null!=e.questionItem.answer.score?"得分："+e.questionItem.answer.score+"分，":"")+"\n          总分"+e._s(e.questionItem.score)+"分）\n        ")])]),s("el-col",{staticClass:"text-right question-type",attrs:{span:4}},[e._v("\n        "+e._s(e.numMatchingText(e.questionItem.type))+"\n      ")]),s("el-col",{attrs:{span:24}},[e._l(e.questionItem.options,function(t,i){return 1==e.questionItem.type||2==e.questionItem.type||3==e.questionItem.type?s("div",{directives:[{name:"show",rawName:"v-show",value:!t.isDelete,expression:"!itemOption.isDelete"}],key:i,staticClass:"div-flex mart10 flex-align-items",staticStyle:{"margin-left":"10px"}},[s("el-radio",{directives:[{name:"show",rawName:"v-show",value:1==e.questionItem.type||3==e.questionItem.type,expression:"questionItem.type == 1 || questionItem.type == 3"}],staticClass:"marl5",attrs:{disabled:"",label:"true"},on:{change:function(t){e.changeRadioRightKey(e.questionItem,i)}},model:{value:t.answer,callback:function(s){e.$set(t,"answer",s)},expression:"itemOption.answer"}},[e._v("选项"+e._s(i+1)+"："+e._s(t.name))]),s("el-checkbox",{directives:[{name:"show",rawName:"v-show",value:2==e.questionItem.type,expression:"questionItem.type == 2"}],staticClass:"marl5",attrs:{disabled:"","true-label":"true","false-label":"false"},model:{value:t.answer,callback:function(s){e.$set(t,"answer",s)},expression:"itemOption.answer"}},[e._v("选项"+e._s(i+1)+"："+e._s(t.name))])],1):e._e()}),4==e.questionItem.type?s("div",{staticClass:"mart10 marb10",staticStyle:{"margin-left":"10px"}},[e._v("\n          "+e._s(e.questionItem.textAnswer)+"\n        ")]):e._e()],2)],1),s("div",{staticClass:"text-right mart10"},[s("el-button",{directives:[{name:"show",rawName:"v-show",value:e.questionIndex>0,expression:"questionIndex > 0"}],attrs:{type:"primary"},on:{click:function(t){e.questionIndex--,e.getQueryQuestionDetail(e.questionIndex)}}},[e._v("上一题")]),4==e.questionItem.type?s("el-button",{attrs:{type:"primary"},on:{click:e.scoreQuestion}},[e._v("评分")]):e._e(),s("el-button",{directives:[{name:"show",rawName:"v-show",value:e.questionIndex+1<e.questionIdList.length,expression:" (questionIndex + 1) < questionIdList.length "}],attrs:{type:"primary"},on:{click:function(t){e.questionIndex++,e.getQueryQuestionDetail(e.questionIndex)}}},[e._v("下一题")])],1)],1):e._e(),s("el-card",[s("p",{staticClass:"mar10"},[s("i",{staticClass:"color-box green"}),e._v("为已打分题，\n      "),s("i",{staticClass:"color-box orange"}),e._v("为未打分题，\n      "),s("i",{staticClass:"color-box gray"}),e._v("为学生没有做答的题\n    ")]),e._l(e.questionIdList,function(t,i){return s("p",{key:i,staticClass:"marr10",staticStyle:{display:"inline-block"}},[s("el-button",{staticClass:"question-btn",attrs:{type:t.answer_id?null!=t.score?"success":"warning":"info",disabled:e.questionIdList[e.questionIndex].question_id==t.question_id},on:{click:function(t){e.questionIndex=i,e.getQueryQuestionDetail(e.questionIndex)}}},[e._v("第"+e._s(i+1)+"题")])],1)})],2),s("p",{staticClass:"text-right"},[s("el-button",{attrs:{type:"primary"},on:{click:e.endScore}},[e._v("结束评分")])],1),s("el-dialog",{attrs:{width:"500px",title:"评分",closeOnClickModal:!1,visible:e.scoreDialog},on:{"update:visible":function(t){e.scoreDialog=t}}},[e.questionItem?s("div",{},[s("el-form",{ref:"scoreForm",attrs:{model:e.scoreForm,"label-width":"80px"}},[s("el-form-item",{attrs:{prop:"score",label:"得分",rules:[{required:!0,message:"请打分",trigger:"blur"}]}},[s("el-input-number",{attrs:{min:0,max:e.questionItem.score},model:{value:e.scoreForm.score,callback:function(t){e.$set(e.scoreForm,"score",t)},expression:"scoreForm.score"}})],1)],1)],1):e._e(),s("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:function(t){e.submitScore("scoreForm")}}},[e._v("打 分")]),s("el-button",{on:{click:function(t){e.scoreDialog=!1}}},[e._v("取 消")])],1)])],1)},n=[],o=(s("7f7f"),s("ac6a"),s("28a5"),{data:function(){return{questionItem:null,paramsSolutionId:this.$route.params.solution_id,questionIdList:[],questionIndex:0,scoreDialog:!1,scoreForm:{score:null,question_id:null,solution_id:this.$route.params.solution_id}}},mounted:function(){this.getQueryQuestionIdListData()},methods:{getQueryQuestionDetail:function(e){var t=this;this.axios.get("".concat(this.common.basePath,"/question/detail/teacher/").concat(this.paramsSolutionId),{params:{questionId:this.questionIdList[e].question_id}}).then(function(e){t._convertAnswer(e.data.data)}).catch(function(e){t.$message.error(e)})},_convertAnswer:function(e){if(4==e.type)e.answer?e.textAnswer=e.answer.answer:e.textAnswer="";else{var t=e.answer.answer?e.answer.answer.split(","):[];e.options.forEach(function(e){t.forEach(function(t){e.id==t&&(e.answer="true")})})}this.questionItem=e},numMatchingText:function(e){switch(e){case 1:return this.questionTypeText="单选题";case 2:return this.questionTypeText="多选题";case 3:return this.questionTypeText="判断题";case 4:return this.questionTypeText="简答题"}},scoreQuestion:function(e){this.scoreDialog=!0,this.scoreForm.question_id=this.questionItem.id},submitScore:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return!1;t._submitScore()})},_submitScore:function(){var e=this;this.axios.patch("".concat(this.common.basePath,"/answer/score"),this.scoreForm).then(function(t){e.getQueryQuestionIdListData(),e.scoreDialog=!1}).catch(function(t){e.scoreDialog=!1,e.$message.error(t)})},getQueryQuestionIdListData:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/question/score/").concat(this.paramsSolutionId),"").then(function(t){e.questionIdList=t.data.data,e.getQueryQuestionDetail(e.questionIndex)}).catch(function(t){e.$message.error(t)})},endScore:function(){var e=this;window.xyy=this.$router,this.axios.get("".concat(this.common.basePath,"//answer/score/end/").concat(this.paramsSolutionId),"").then(function(t){e.$message({type:"success",showClose:!0,message:"评分结束，将跳转到上一个页面",duration:1e3}),setTimeout(function(){"EPTMarkingScore"==e.$router.history.current.name?e.$router.push({path:"/eptmanage/exercisescore"}):"MarkingScore"==e.$router.history.current.name&&e.$router.push({name:"ExercisesTaskDetail",params:{experiment_id:e.$route.params.experiment_id,task_id:e.$route.params.task_id}})},1210)}).catch(function(t){e.$message.error(t)})},changeRadioRightKey:function(e,t){e.options.forEach(function(e,s){e.answer=s!=t?"false":"true"})}}}),a=o,r=(s("9319"),s("2877")),c=Object(r["a"])(a,i,n,!1,null,null,null);c.options.__file="MarkingScoreCom.vue";t["a"]=c.exports}}]);
//# sourceMappingURL=chunk-eb6e.9cf4937a.js.map