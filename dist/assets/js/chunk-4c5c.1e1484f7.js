(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4c5c"],{"0b7d":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrap-box"},[s("el-card",{staticClass:"title-card"},[s("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[s("el-breadcrumb-item",{attrs:{to:{path:"/lesson/testlist"}}},[e._v("实验列表")]),s("el-breadcrumb-item",{attrs:{to:{name:"TestDetail",params:{id:e.$route.params.experiment_id}}}},[e._v("实验详情")]),s("el-breadcrumb-item",{attrs:{to:{name:"ExercisesTaskDetail",params:{experiment_id:e.$route.params.experiment_id,task_id:e.$route.params.task_id}}}},[e._v("习题任务详情")]),s("el-breadcrumb-item",[e._v("习题详情")])],1)],1),s("div",{staticClass:"router-view-wrap"},[s("div",{staticClass:"router-view-content"},[s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},e._l(e.questionListData,function(t,a){return s("div",{key:a,staticClass:"questions-box mart5"},[s("div",[e._v(e._s(a+1)+"、")]),s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:18}},[e._v("\n                得分:"+e._s(t.answer.score?t.answer.score:0)+"分（总分:"+e._s(t.score?t.score:0)+"分）\n              ")]),s("el-col",{staticClass:"text-right question-type",attrs:{offset:2,span:4}},[e._v("\n                "+e._s(e.numMatchingText(t.type))+"\n              ")])],1),s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:18}},[s("div",[e._v(e._s(t.question))])]),s("el-col",{attrs:{span:22}},[e._l(t.options,function(a,i){return 1==t.type||2==t.type||3==t.type?s("div",{directives:[{name:"show",rawName:"v-show",value:!a.isDelete,expression:"!itemOption.isDelete"}],key:i,staticClass:"div-flex mart10 flex-align-items",staticStyle:{"margin-left":"10px"}},[s("el-radio",{directives:[{name:"show",rawName:"v-show",value:1==t.type||3==t.type,expression:"item.type == 1 || item.type == 3"}],staticClass:"marl5",attrs:{disabled:"",label:"true"},model:{value:a.answer,callback:function(t){e.$set(a,"answer",t)},expression:"itemOption.answer"}},[e._v("选项"+e._s(i+1)+"： ")]),s("el-checkbox",{directives:[{name:"show",rawName:"v-show",value:2==t.type,expression:"item.type == 2"}],staticClass:"marl5",attrs:{disabled:"","true-label":"true","false-label":"false"},model:{value:a.answer,callback:function(t){e.$set(a,"answer",t)},expression:"itemOption.answer"}},[e._v("选项"+e._s(i+1)+"：")]),e._v("  \n                    "+e._s(a.name)+" \n                ")],1):e._e()}),4==t.type?s("div",{staticClass:"mart10"},[s("el-card",{attrs:{shadow:"never"}},[e._v("\n                    "+e._s(t.textAnswer)+"\n                  ")])],1):e._e()],2)],1)],1)],1)}))],1)])],1)},i=[],n=(s("28a5"),s("ac6a"),{data:function(){return{paramsSolutionId:this.$route.params.solution_id,paramsIsScore:this.$route.params.isscore,questionListData:[]}},mounted:function(){this.getQueryQuestionList()},methods:{getQueryQuestionList:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/question/list/teacher/").concat(this.paramsSolutionId),"").then(function(t){e._convertAnswer(t.data.data)}).catch(function(t){e.$message.error(t)})},_convertAnswer:function(e){var t=this;e.forEach(function(e){if(4==e.type)e.answer&&(e.textAnswer=e.answer.answer);else if("student"==t.$route.params.type){var s=[];e.answer&&(s=e.answer.answer?e.answer.answer.split(","):[]),e.options.forEach(function(e){if(!s.length)return e.answer="false",!1;s.forEach(function(t){e.id==t?e.answer="true":e.answer="false"})})}}),this.questionListData=e},numMatchingText:function(e){switch(e){case 1:return this.questionTypeText="单选题";case 2:return this.questionTypeText="多选题";case 3:return this.questionTypeText="判断题";case 4:return this.questionTypeText="简答题"}}}}),r=n,o=(s("849b9"),s("2877")),c=Object(o["a"])(r,a,i,!1,null,null,null);c.options.__file="ExerciseQuestionDetail.vue";t["default"]=c.exports},"28a5":function(e,t,s){s("214f")("split",2,function(e,t,a){"use strict";var i=s("aae3"),n=a,r=[].push,o="split",c="length",l="lastIndex";if("c"=="abbc"[o](/(b)*/)[1]||4!="test"[o](/(?:)/,-1)[c]||2!="ab"[o](/(?:ab)*/)[c]||4!="."[o](/(.?)(.?)/)[c]||"."[o](/()()/)[c]>1||""[o](/.?/)[c]){var u=void 0===/()??/.exec("")[1];a=function(e,t){var s=String(this);if(void 0===e&&0===t)return[];if(!i(e))return n.call(s,e,t);var a,o,d,p,v,m=[],w=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),f=0,h=void 0===t?4294967295:t>>>0,x=new RegExp(e.source,w+"g");u||(a=new RegExp("^"+x.source+"$(?!\\s)",w));while(o=x.exec(s)){if(d=o.index+o[0][c],d>f&&(m.push(s.slice(f,o.index)),!u&&o[c]>1&&o[0].replace(a,function(){for(v=1;v<arguments[c]-2;v++)void 0===arguments[v]&&(o[v]=void 0)}),o[c]>1&&o.index<s[c]&&r.apply(m,o.slice(1)),p=o[0][c],f=d,m[c]>=h))break;x[l]===o.index&&x[l]++}return f===s[c]?!p&&x.test("")||m.push(""):m.push(s.slice(f)),m[c]>h?m.slice(0,h):m}}else"0"[o](void 0,0)[c]&&(a=function(e,t){return void 0===e&&0===t?[]:n.call(this,e,t)});return[function(s,i){var n=e(this),r=void 0==s?void 0:s[t];return void 0!==r?r.call(s,n,i):a.call(String(n),s,i)},a]})},6245:function(e,t,s){},"849b9":function(e,t,s){"use strict";var a=s("6245"),i=s.n(a);i.a}}]);
//# sourceMappingURL=chunk-4c5c.1e1484f7.js.map