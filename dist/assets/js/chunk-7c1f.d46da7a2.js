(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7c1f"],{"28a5":function(e,t,s){s("214f")("split",2,function(e,t,a){"use strict";var n=s("aae3"),r=a,i=[].push,o="split",c="length",u="lastIndex";if("c"=="abbc"[o](/(b)*/)[1]||4!="test"[o](/(?:)/,-1)[c]||2!="ab"[o](/(?:ab)*/)[c]||4!="."[o](/(.?)(.?)/)[c]||"."[o](/()()/)[c]>1||""[o](/.?/)[c]){var l=void 0===/()??/.exec("")[1];a=function(e,t){var s=String(this);if(void 0===e&&0===t)return[];if(!n(e))return r.call(s,e,t);var a,o,d,p,f,v=[],m=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(e.sticky?"y":""),_=0,h=void 0===t?4294967295:t>>>0,w=new RegExp(e.source,m+"g");l||(a=new RegExp("^"+w.source+"$(?!\\s)",m));while(o=w.exec(s)){if(d=o.index+o[0][c],d>_&&(v.push(s.slice(_,o.index)),!l&&o[c]>1&&o[0].replace(a,function(){for(f=1;f<arguments[c]-2;f++)void 0===arguments[f]&&(o[f]=void 0)}),o[c]>1&&o.index<s[c]&&i.apply(v,o.slice(1)),p=o[0][c],_=d,v[c]>=h))break;w[u]===o.index&&w[u]++}return _===s[c]?!p&&w.test("")||v.push(""):v.push(s.slice(_)),v[c]>h?v.slice(0,h):v}}else"0"[o](void 0,0)[c]&&(a=function(e,t){return void 0===e&&0===t?[]:r.call(this,e,t)});return[function(s,n){var r=e(this),i=void 0==s?void 0:s[t];return void 0!==i?i.call(s,r,n):a.call(String(r),s,n)},a]})},"5c2d":function(e,t,s){},aa77:function(e,t,s){var a=s("5ca1"),n=s("be13"),r=s("79e5"),i=s("fdef"),o="["+i+"]",c="​",u=RegExp("^"+o+o+"*"),l=RegExp(o+o+"*$"),d=function(e,t,s){var n={},o=r(function(){return!!i[e]()||c[e]()!=c}),u=n[e]=o?t(p):i[e];s&&(n[s]=u),a(a.P+a.F*o,"String",n)},p=d.trim=function(e,t){return e=String(n(e)),1&t&&(e=e.replace(u,"")),2&t&&(e=e.replace(l,"")),e};e.exports=d},c5f6:function(e,t,s){"use strict";var a=s("7726"),n=s("69a8"),r=s("2d95"),i=s("5dbc"),o=s("6a99"),c=s("79e5"),u=s("9093").f,l=s("11e9").f,d=s("86cc").f,p=s("aa77").trim,f="Number",v=a[f],m=v,_=v.prototype,h=r(s("2aeb")(_))==f,w="trim"in String.prototype,b=function(e){var t=o(e,!1);if("string"==typeof t&&t.length>2){t=w?t.trim():p(t,3);var s,a,n,r=t.charCodeAt(0);if(43===r||45===r){if(s=t.charCodeAt(2),88===s||120===s)return NaN}else if(48===r){switch(t.charCodeAt(1)){case 66:case 98:a=2,n=49;break;case 79:case 111:a=8,n=55;break;default:return+t}for(var i,c=t.slice(2),u=0,l=c.length;u<l;u++)if(i=c.charCodeAt(u),i<48||i>n)return NaN;return parseInt(c,a)}}return+t};if(!v(" 0o1")||!v("0b1")||v("+0x1")){v=function(e){var t=arguments.length<1?0:e,s=this;return s instanceof v&&(h?c(function(){_.valueOf.call(s)}):r(s)!=f)?i(new m(b(t)),s,v):b(t)};for(var x,I=s("9e1e")?u(m):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),g=0;I.length>g;g++)n(m,x=I[g])&&!n(v,x)&&d(v,x,l(m,x));v.prototype=_,_.constructor=v,s("2aba")(a,f,v)}},e002:function(e,t,s){"use strict";var a=s("5c2d"),n=s.n(a);n.a},e612:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content-wrap-box"},[s("el-card",{staticClass:"title-card"},[s("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[s("el-breadcrumb-item",{attrs:{to:{path:"/lesson/list"}}},[e._v("课程列表")]),s("el-breadcrumb-item",{attrs:{to:{name:"LessonListDetail",params:{id:e.courseId}}}},[e._v("课程详情")]),s("el-breadcrumb-item",{attrs:{to:{name:"LessonQuestionnaireDetail",params:{course_id:e.courseId,cquestionnaire_id:e.cQuestionnaireId,questionnaire_id:e.questionnaireId}}}},[e._v("问卷任务详情")]),s("el-breadcrumb-item",[e._v("问卷")])],1)],1),s("div",{staticClass:"router-view-wrap"},[s("div",{staticClass:"router-view-content"},[s("div",[s("el-card",{attrs:{shadow:"never"}},e._l(e.qItems,function(t,a){return s("div",{key:a,staticClass:"questions-box mart5"},[s("div",[e._v(e._s(a+1)+"、")]),s("el-card",{staticClass:"questions-content",attrs:{shadow:"never"}},[s("el-row",{staticClass:"mard10"},[s("el-col",{staticClass:"div-flex",attrs:{span:17}},[s("div",{staticClass:"label-2 label marr5"},[e._v("题干: ")]),s("div",[1==t.type?s("span",[e._v(e._s(t.question))]):e._e(),2==t.type?s("span",[e._v(e._s(t.question)+" （最多能选择"+e._s(t.max_option)+"项）")]):e._e(),4==t.type?s("span",[e._v(e._s(t.question)+"（最大分数："+e._s(t.score)+"分）")]):e._e()])]),s("el-col",{staticClass:"text-right question-type",attrs:{offset:1,span:5}},[e._v("\n                  "+e._s(e.numMatchingText(t.type))+"\n                ")])],1),s("el-row",{staticClass:"mard10"},[s("el-col",{attrs:{span:22}},[s("div",{staticStyle:{"margin-left":"60px"}},[1==t.type?s("el-radio-group",{model:{value:t.answer,callback:function(s){e.$set(t,"answer",s)},expression:"item.answer"}},e._l(t.options,function(t,a){return s("div",{key:a,staticClass:"div-flex mart10 flex-align-items"},[s("el-radio",{staticClass:"marl5",attrs:{disabled:"",label:t.id}},[e._v("\n                          选项"+e._s(a+1)+"：（"+e._s(t.score)+"分）"+e._s(t.answer)+"\n                        ")])],1)})):e._e(),2==t.type?s("el-checkbox-group",{attrs:{max:t.max_option},model:{value:t.answer,callback:function(s){e.$set(t,"answer",s)},expression:"item.answer"}},e._l(t.options,function(t,a){return s("div",{key:a,staticClass:"div-flex mart10 flex-align-items"},[s("el-checkbox",{staticClass:"marl5",attrs:{disabled:"",label:t.id}},[e._v(" \n                          选项"+e._s(a+1)+"：（"+e._s(t.score)+"分）"+e._s(t.answer)+"\n                        ")])],1)})):e._e(),4==t.type?s("div",[s("el-input",{attrs:{disabled:"",type:"textarea",rows:"5"},model:{value:t.answer,callback:function(s){e.$set(t,"answer",s)},expression:"item.answer"}}),s("div",{staticClass:"div-flex mart10"},[e._v("\n                        *得分："),s("el-input-number",{attrs:{disabled:"",max:t.score},model:{value:t.scoreA,callback:function(s){e.$set(t,"scoreA",s)},expression:"item.scoreA"}}),e._v(" 分\n                      ")],1)],1):e._e()],1)])],1)],1)],1)}))],1)])])],1)},n=[],r=(s("c5f6"),s("28a5"),s("ac6a"),{data:function(){return{courseId:this.$route.params.course_id,cQuestionnaireId:this.$route.params.cquestionnaire_id,questionnaireId:this.$route.params.questionnaire_id,qItems:[],answerMemberListData:[],participantId:"default",answerSituation:null}},watch:{},mounted:function(){this.getQueryQuestionnaireList()},methods:{numMatchingText:function(e){switch(e){case 1:return this.questionTypeText="单选题";case 2:return this.questionTypeText="多选题";case 3:return this.questionTypeText="判断题";case 4:return this.questionTypeText="评语"}},getQueryQuestionnaireList:function(){var e=this;this.axios.get("".concat(this.common.basePath,"/course-answer/question/list"),{params:{userId:JSON.parse(sessionStorage.getItem("Access-Key")),cQuestionnaireId:this.cQuestionnaireId}}).then(function(t){e.qItems=e._convertQItems(t.data.data)}).catch(function(t){e.$message.error(t)})},_convertQItems:function(e){return!!e&&(e.forEach(function(e){1==e.type?e.answer=e.answer?parseInt(e.answer.answer):null:2==e.type?e.answer=e.answer?e.answer.answer.split(",").map(Number):[]:4==e.type&&(e.scoreA=e.answer?e.answer.score:null,e.answer=e.answer?e.answer.answer:null)}),e)}}}),i=r,o=(s("e002"),s("2877")),c=Object(o["a"])(i,a,n,!1,null,null,null);c.options.__file="QuestionnaireCheck.vue";t["default"]=c.exports},fdef:function(e,t){e.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"}}]);
//# sourceMappingURL=chunk-7c1f.d46da7a2.js.map