<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程列表</el-breadcrumb-item>
        <el-breadcrumb-item>课程详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 课程简介 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryCourseDetailModule', true) && courseDetailData">
          <div slot="header"><span class="card-title">课程简介</span></div>
          <el-row>
            <el-col class="marb10" :span="12"><span>课程名称： {{courseDetailData.name}}</span></el-col>
            <el-col class="marb10" :span="12"><span>创建时间： {{common._convertDate(courseDetailData.create_time, 'yyyy年MM月dd日')}}</span></el-col>
            <el-col class="marb10" :span="12"><span>课程代码： {{courseDetailData.c_code}}</span></el-col>
            <el-col class="marb10" :span="12"><span>课程教师： {{courseDetailData.c_teacher}}</span></el-col>
            <el-col class="marb10" :span="12"><span>学年学期：{{courseDetailData.c_year ? `${courseDetailData.c_year}学年${courseDetailData.cStageName}` : '无'}}</span></el-col>
            <el-col class="marb10" :span="12"><span>课程性质： {{courseDetailData.c_nature}}</span></el-col>
            <el-col class="marb10 inline-flex" :span="24"><span>课程简介：</span><span class="cursor-pointer_T ">{{courseDetailData.description}}</span></el-col>
          </el-row> ```
          <p class="text-right">
            <el-button 
              :disabled="!common.checkAuthority('LessonListDetail_EditDesc', true)"
              type="primary" @click="editCourseDialog = true">
                {{common.checkAuthority('LessonListDetail_EditDesc') ? common.checkAuthority('LessonListDetail_EditDesc').name : ''}}
            </el-button>
            <!-- 查看成绩单 -->
            <el-button 
              v-if="currentUserStudentPartakeInfo"
              :disabled="!common.checkAuthority('LessonListDetail_CheckScore', true)"
              type="primary" @click="checkScore">
                {{common.checkAuthority('LessonListDetail_CheckScore') ? common.checkAuthority('LessonListDetail_CheckScore').name : ''}}
            </el-button>
            <!-- 升级为模板课程， 必须要当前课程之前不是模板创建的 -->
            <el-button 
              v-if="!courseDetailData.template"
              :disabled="!common.checkAuthority('LessonListDetail_Base', true)"
              type="primary" @click=" upGradeBase ">
              {{common.checkAuthority('LessonListDetail_Base') ? common.checkAuthority('LessonListDetail_Base').name : ''}}
            </el-button>
          </p>
          <p>课程大纲：</p>
          <p>  
            <el-tag
              class="marr10 mart10"
              v-for="(item, index) in courseDetailData.syllabus"
              :key="index"
              :closable="common.checkAuthority('LessonListDetail_DeleteFile', true)"
              @close="handleTagClose(item)"
              :type="item.type">
                <a v-if="common.checkAuthority('LessonListDetail_UploadSyllabus', true)" 
                   :href="`${common.publicBasePath}${item.path}`" target="_blank">{{item.name}}</a> 
                <span v-else>{{item.name}}</span> 
            </el-tag>
          </p>
          <p> 
            <upload 
              :isDisabled="!common.checkAuthority('LessonListDetail_UploadSyllabus', true)"
              :buttonText="common.checkAuthority('LessonListDetail_UploadSyllabus') ? common.checkAuthority('LessonListDetail_UploadSyllabus').name : ''" 
              @uploadSuccess="(response) => {uploadSuccess('syllabus', response)}"></upload>
          </p>

          <p>课程资料：</p> 
          <p> 
            <el-tag
              class="marr10 mart10"
              v-for="(item, index) in courseDetailData.courseData"
              :key="index"
              :closable="common.checkAuthority('LessonListDetail_DeleteFile', true)"
              @close="handleTagClose(item)"
              :type="item.type">
                <a v-if="common.checkAuthority('LessonListDetail_UploadCourseData', true)" :href="`${common.publicBasePath}${item.path}`" target="_blank">{{item.name}}</a> 
                <span v-else>{{item.name}}</span>
            </el-tag>
          </p>
          <p> 
            <upload 
              :isDisabled="!common.checkAuthority('LessonListDetail_UploadCourseData', true)"
              :buttonText="common.checkAuthority('LessonListDetail_UploadCourseData') ? common.checkAuthority('LessonListDetail_UploadCourseData').name : ''" 
              @uploadSuccess="(response) => {uploadSuccess('courseData', response)}"></upload>
          </p>
        </el-card> 
        <!-- 师资组成 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryCompositionOfTeachersModule', true)" class="mart20">
          <div slot="header"><span class="card-title">师资组成</span></div>
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span><strong>课程组长</strong></span> 
              <el-button 
                v-if="memberGroupLeadersListData.rows.length"
                :disabled="!common.checkAuthority('LessonListDetail_AddGroupLeaders', true)"
                class="fr" size="mini" type="primary" @click="addMember(1)">
                {{common.checkAuthority('LessonListDetail_AddGroupLeaders') ? common.checkAuthority('LessonListDetail_AddGroupLeaders').name : ''}}    
              </el-button> 
              <div v-else class="fr coloCCC">
                系统中没有可选课程组长角色的用户，请联系管理员给要添加的用户授权！
              </div>
            </div>
            <div>
              <el-row class="padding-row">
                <el-col v-for="(item,index) in memeberTypeListData.groupLeaders" :key="index" :span="8">
                  <el-card class="person-card-wrap-card marb10">
                    <div class="person-card-wrap pad5" > 
                      <el-dropdown class="person-card-wrap pad5">
                        <div class="img-photo-fix wh100">
                          <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" />
                        </div> 
                        <el-dropdown-menu slot="dropdown" > 
                          <el-row class="mar5 member-info-fix">
                            <el-col :span="9">
                              <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                            </el-col>
                            <el-col :span="15"> 
                              <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                              <p>工/学号：{{item.account ? item.account : '无'}}</p>
                              <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                              <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                              <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                            </el-col>
                          </el-row>
                        </el-dropdown-menu>
                      </el-dropdown>  
                      <div class="content">
                        <p class="marb5 mart0">{{item.user_name}}  </p>
                        <p class="a-line-ellipsis mart0 marb5">{{item.facultyName}} </p>
                        <p class="mart0 marb5 more-line-ellipsis">{{item.sim_desc}}</p>
                      </div>
                    </div>
                    <el-button 
                      :disabled="!common.checkAuthority('LessonListDetail_DeleteMember', true)"
                      @click="deleteMember(item, 1)" class="del-circle-btn" type="danger">删除</el-button>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card shadow="never" class="mart10">
            <div slot="header" class="clearfix">
              <span><strong>任课教师</strong></span>
              <el-button 
                v-if="memberTeachersListData.rows.length"
                :disabled="!common.checkAuthority('LessonListDetail_AddTeachers', true)"
                class="fr" size="mini" type="primary" @click="addMember(2)">
                  {{common.checkAuthority('LessonListDetail_AddTeachers') ? common.checkAuthority('LessonListDetail_AddTeachers').name : ''}}
              </el-button>
              <div v-else class="fr coloCCC">
                系统中没有可选课程教师角色的用户，请联系管理员给要添加的用户授权！
              </div>
            </div>
            <div>
              <el-row class="padding-row">
                <el-col v-for="(item,index) in memeberTypeListData.teachers" :key="index" :span="8">
                  <el-card class="person-card-wrap-card" style="height: 200px;">
                    <div class="person-card-wrap"> 
                      <el-dropdown class="person-card-wrap pad5">
                        <div class="img-photo-fix wh100">
                          <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" />
                        </div> 
                        <el-dropdown-menu slot="dropdown" > 
                          <el-row class="mar5 member-info-fix">
                            <el-col :span="9">
                              <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                            </el-col>
                            <el-col :span="15"> 
                              <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                              <p>工/学号：{{item.account ? item.account : '无'}}</p>
                              <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                              <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                              <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                            </el-col>
                          </el-row>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <div class="content">
                        <p class="marb5 mart0">{{item.user_name}}  </p>
                        <p class="a-line-ellipsis mart0 marb5">{{item.facultyName}} </p>
                        <p class="mart0 marb5 more-line-ellipsis">{{item.sim_desc}}</p>
                      </div>
                    </div>
                    <el-button 
                      :disabled="!common.checkAuthority('LessonListDetail_DeleteMember', true)"
                      @click="deleteMember(item, 2)" class="del-circle-btn" type="danger">删除</el-button>
                  </el-card>
                </el-col>
              </el-row> 
            </div>
          </el-card>
          <el-card shadow="never" class="mart10">
            <div slot="header" class="clearfix">
              <span><strong>任课助教</strong></span>
              <el-button 
                v-if="memberTutorsListData.rows.length"
                :disabled="!common.checkAuthority('LessonListDetail_AddTutors', true)"
                class="fr" size="mini" type="primary" @click="addMember(4)">
                  {{common.checkAuthority('LessonListDetail_AddTutors') ? common.checkAuthority('LessonListDetail_AddTutors').name : ''}}
                </el-button>
              <div v-else class="fr coloCCC">
                系统中没有可选课程助教角色的用户，请联系管理员给要添加的用户授权！
              </div>
            </div>
            <div> 
              <el-row class="padding-row">
                <el-col v-for="(item,index) in memeberTypeListData.tutors" :key="index" :span="8">
                  <el-card class="person-card-wrap-card" style="height: 200px;">
                    <div class="person-card-wrap"> 
                      <el-dropdown class="person-card-wrap pad5">
                        <div class="img-photo-fix wh100">
                          <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" />
                        </div> 
                        <el-dropdown-menu slot="dropdown" > 
                          <el-row class="mar5 member-info-fix">
                            <el-col :span="9">
                              <p><img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="100px" height="100px" /></p>
                            </el-col>
                            <el-col :span="15"> 
                              <p>姓名：{{item.user_name ? item.user_name : '无'}}</p>
                              <p>工/学号：{{item.account ? item.account : '无'}}</p>
                              <p>手机：{{item.phone_num ? item.phone_num : '无'}}</p>
                              <p>院系：{{item.facultyName ? item.facultyName : '无'}}</p>
                              <p>邮箱：{{item.mail ? item.mail : '无'}}</p>
                            </el-col>
                          </el-row>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <div class="content">
                        <p class="marb5 mart0">{{item.user_name}}  </p>
                        <p class="a-line-ellipsis mart0 marb5">{{item.facultyName}} </p>
                        <p class="mart0 marb5 more-line-ellipsis">{{item.sim_desc}}</p>
                      </div>
                    </div>
                    <el-button 
                      :disabled="!common.checkAuthority('LessonListDetail_DeleteMember', true)"
                      @click="deleteMember(item, 4)" class="del-circle-btn" type="danger">删除</el-button>
                  </el-card>
                </el-col>
              </el-row> 
            </div>
          </el-card>
        </el-card>
        <!-- 实验安排 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryExperimentalArrangementModule', true)" class="mart20">
          <div slot="header">
            <span class="card-title">实验安排</span>
            <el-button 
              :disabled="!common.checkAuthority('LessonListDetail_AddExperiment', true)"
              @click=" courseOperaDialog = true; " class="fr" size="mini" type="primary">
              {{common.checkAuthority('LessonListDetail_AddExperiment') ? common.checkAuthority('LessonListDetail_AddExperiment').name : ''}}    
            </el-button>
          </div> 
          <el-card v-for="(item,index) in courseList.rows" :key="index" class="mart5">
            <span class="cursor-pointer" @click="$router.push({name: 'TestDetail', params: {id: item.id} })">{{item.name}}</span>
          </el-card> 
        </el-card>
        <!-- 课程问卷 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryExperimentalArrangementModule', true)" class="mart20">
          <div slot="header">
            <span class="card-title">课程问卷</span>
            <el-button 
              :disabled="!common.checkAuthority('LessonListDetail_AddQuestionnaire', true)"
              @click=" courseQuestionnaireDialog = true; " class="fr" size="mini" type="primary">
              {{common.checkAuthority('LessonListDetail_AddQuestionnaire') ? common.checkAuthority('LessonListDetail_AddQuestionnaire').name : ''}}    
            </el-button>
          </div> 
          <!-- 跳转课程问卷详情 -->
          <el-card v-for="(item,index) in courseQuestionnaireList.rows" :key="index" class="mart5">
            <span class="cursor-pointer" 
              @click="$router.push({name: 'LessonQuestionnaireDetail', 
                  params: {'course_id': item.courseId, 'cquestionnaire_id': item.cQuestionnaireId, 'questionnaire_id': item.id} })">{{item.name}}</span>
            <!-- 显示是否能答题 -->
            <!-- <el-button 
              v-show="item.isAnswer"
              :disabled="!common.checkAuthority('LessonListDetail_Answer', true)"
              @click=" $router.push({name: 'LessonQuestionnaireScore', 
                  params: {'course_id': item.courseId, 'cquestionnaire_id': item.cQuestionnaireId, 'questionnaire_id': item.id} })" class="fr" size="mini" type="primary">
              {{common.checkAuthority('LessonListDetail_Answer') ? common.checkAuthority('LessonListDetail_Answer').name : ''}}    
            </el-button>  -->
            <span v-if="item.isAnswer" class="fr" style="color: red;">未答</span> 
          </el-card> 
        </el-card>
        <!-- 学生名单 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryStudentModule', true)" class="mart20"> 
          <div slot="header">
            <span class="card-title">学生名单</span>
            <el-button 
              :disabled="!common.checkAuthority('LessonListDetail_MangeStudentRegister', true)"
              class="fr marl20" type="default" size="mini"
              @click="$router.push({name: 'StudentRegister', params: {id: $route.params.id}})">
                {{common.checkAuthority('LessonListDetail_MangeStudentRegister') ? common.checkAuthority('LessonListDetail_MangeStudentRegister').name : ''}}
            </el-button>

            <el-button 
              v-if="memberStudentsListData.rows.length"
              :disabled="!common.checkAuthority('LessonListDetail_AddStudent', true)"
              class="fr" size="mini" type="primary" @click="addMember(3)">
              {{common.checkAuthority('LessonListDetail_AddStudent') ? common.checkAuthority('LessonListDetail_AddStudent').name : ''}}    
            </el-button>
            <div v-else class="fr coloCCC">
              系统中没有可选课程学生角色的用户，请联系管理员给要添加的用户授权！
            </div> 
          </div>
          <div class="person-group-wrap person-group-wrap_W marb10" v-for="(item,index) in memeberTypeListData.students" :key="index">
            <div class="person-group-item_t">{{item.facultyName}}：</div>
            <!-- 人员详情 -->
            <div>
              <div class="person-group-item_w mart10" 
                v-for="(itemMembers,indexMembers) in item.cMembers" 
                v-if="indexMembers <= 4 || (indexMembers > 4 && item.isShowMore)">
                <el-dropdown>
                  <div class="img-photo-fix wh50">
                    <img :src="itemMembers.head_img ? itemMembers.head_img : '默认图' " :onerror="defaultImg(itemMembers.sex)" width="40px" height="40px" />
                  </div> 
                  <el-dropdown-menu slot="dropdown" > 
                    <el-row class="mar5 member-info-fix">
                      <el-col :span="9">
                        <p><img :src="itemMembers.head_img ? itemMembers.head_img : '默认图' " :onerror="defaultImg(itemMembers.sex)" width="100px" height="100px" /></p>
                      </el-col>
                      <el-col :span="15"> 
                        <p>姓名：{{itemMembers.user_name ? itemMembers.user_name : '无'}}</p>
                        <p>工/学号：{{itemMembers.account ? itemMembers.account : '无'}}</p>
                        <p>手机：{{itemMembers.phone_num ? itemMembers.phone_num : '无'}}</p>
                        <p>院系：{{itemMembers.facultyName ? itemMembers.facultyName : '无'}}</p>
                        <p>邮箱：{{itemMembers.mail ? itemMembers.mail : '无'}}</p>
                      </el-col>
                    </el-row>
                  </el-dropdown-menu>
                </el-dropdown>

                <!-- <p class="person-name">{{itemMembers.user_name}}</p> -->
                <!-- <el-button 
                  :disabled="!common.checkAuthority('LessonListDetail_DeleteMember', true)"
                  @click="deleteMember(itemMembers, 3)" class="del-circle-btn" type="danger" icon="el-icon-close" circle></el-button> -->
              </div>  
              <el-button v-if="item.cMembers ? item.cMembers.length > 5 : false" @click=" showMoreMember(item) " size="small">{{!item.isShowMore ? '显示更多' : '仅展示5条'}}</el-button>
            </div>
            <div class="person-group-add">{{ item.cMembers.length }} 人</div>
          </div>
        </el-card>
        
        <!-- 留言栏 -->
        <el-card v-if="common.checkAuthority('LessonListDetail_QueryMessageModule', true)" class="mart20">
          <div slot="header">
            <span class="card-title">留言栏</span>
          </div>  
          <div class="message-box">
            <el-card class="mart5" v-if="messageListData.total>0">
              <div class="pad5" v-for="(item,index) in messageListData.rows" :key="index">
                <div class="overflow-hidden">
                  <div class="img-photo-fix wh20 inline-block">
                    <img :src="item.head_img ? item.head_img : '默认图' " :onerror="defaultImg(item.sex)" width="20px" height="20px" />
                  </div>
                  &nbsp;
                  <span class="inline-block">{{item.creatorName}}</span>
                  <div class="inline-block marl10">
                    发表于{{common._convertDate(item.create_time, 'yyyy年MM月dd日')}}
                  </div>
                </div>
                <div class="content mar10 leave-msg-box"> 
                  <p>{{item.info}}</p>
                </div>
              </div>
              <div class="pad5 padt10 text-right">
                <!-- 分页 -->
                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next"
                  :current-page="pageNum"
                  :page-size="pageSize"
                  :page-sizes="[5, 10, 15]"
                  :total="messageListData.total"
                  @size-change="pageSizeChange"
                  @current-change="pageCurrentChange">
                </el-pagination>
              </div>
            </el-card>
            <el-card v-if="userDetail && common.checkAuthority('LessonListDetail_ReleaseMessage', true)" class="mart5">
              <div class="pad5" >
                <div>
                  <div class="img-photo-fix wh20 inline-block">
                    <img :src="userDetail.head_img ? userDetail.head_img : '默认图' " :onerror="defaultImg(userDetail.sex)" width="20px" height="20px" />
                  </div>
                  &nbsp;{{userDetail.user_name}}
                </div>
                <div class="content mar10">  
                  <el-form ref="messageForm" :model="messageForm"> 
                    <el-form-item  
                      prop="info"
                      :rules="[{ required: true, message: '留言不能为空', trigger: '' },]">
                      <el-input placeholder="请填写留言信息" type="textarea" v-model="messageForm.info"></el-input>
                    </el-form-item> 
                  </el-form>
                </div>
                <div class="text-right">
                  <el-button type="primary" size="small" @click="submitMessage('messageForm')">
                    {{common.checkAuthority('LessonListDetail_ReleaseMessage') ? common.checkAuthority('LessonListDetail_ReleaseMessage').name : ''}}
                  </el-button>
                </div>
              </div>
            </el-card>
          </div> 
        </el-card>
      </div>
    </div>
    <!-- 编辑简介 --> 
    <el-dialog 
      width="550px"
      title="编辑简介" 
      :visible.sync="editCourseDialog">
        <el-form ref="courseForm" :model="courseForm" label-width="100px" >
          <el-form-item 
            label="课程名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入课程名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.name"></el-input>
          </el-form-item> 
          <el-form-item 
            label="课程代码：" 
            prop="c_code"
            :rules="[
              { required: true, message: '请输入课程代码', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_code"></el-input>
          </el-form-item> 
          <el-form-item 
            label="课程教师：" 
            prop="c_teacher"
            :rules="[
              { required: true, message: '请输入课程教师', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_teacher"></el-input>
          </el-form-item> 
          <el-form-item 
              label="学年：" 
              prop="c_year"
              :rules="[
                { required: true, message: '请输入学年', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input type="number" v-model="courseForm.c_year"></el-input>
            </el-form-item>
            <el-form-item 
              label="学期：" 
              prop="c_stage"
              :rules="[
                { required: true, message: '请选择学期', trigger: 'blur' },
                { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-select v-model="courseForm.c_stage">
                <el-option value="1" label="春季"></el-option>
                <el-option value="2" label="秋季"></el-option>
                <el-option value="3" label="夏季"></el-option>
                <el-option value="4" label="冬季"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item 
            label="课程性质：" 
            prop="c_nature"
            :rules="[
              { required: true, message: '请输入课程性质', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
            <el-input v-model="courseForm.c_nature"></el-input>
          </el-form-item> 
          <el-form-item 
            label="课程简介：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入课程简介', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
            <el-input type="textarea" :rows="6" v-model="courseForm.description"></el-input>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editCourseDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitCourse('courseForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 添加成员 -->
    <el-dialog 
      width="70vw"
      title="添加成员" 
      :visible.sync="memberDialog">
        <el-form ref="memberSearchForm" :inline="true" :model="memberSearchForm" label-width="60px" >
          <el-form-item 
            label="姓名：" 
            prop="name" >
            <el-input v-model="memberSearchForm.name"></el-input>
          </el-form-item>  
          <el-form-item 
            label="工号：" 
            prop="account" >
            <el-input v-model="memberSearchForm.account"></el-input>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="getQueryMemberList(memberBatchForm.type)">搜索</el-button>
            <el-button type="primary" @click="$refs.memberSearchForm ? $refs.memberSearchForm.resetFields() : '' ">置空</el-button>
          </el-form-item>
        </el-form> 
        <el-table
          border 
          ref="memberTable"
          :row-key="getTableRowKeys"
          :data="memberListData.rows"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            :reserve-selection="true"
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="工号" 
            prop="account"> 
          </el-table-column>
          <el-table-column
            align="center"
            prop="user_name"
            label="姓名" >
          </el-table-column>
          <el-table-column
            align="center"
            prop="facultyName"
            label="系别"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="phone_num"
            label="手机"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="pad10">
          <!-- 分页 --> 
          <el-pagination  
             class="fr "
             background
             @size-change="handleSizeChange($event)"
             @current-change="handleCurrentChange($event)"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="memberListData.total">
          </el-pagination> 
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="memberDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBatch('memberBatchForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 创建实验 -->
    <el-dialog 
      width="550px"
      title="创建实验" 
      :visible.sync="courseOperaDialog" v-if="courseDetailData">
        <!-- 不为null 表示课程是模板添加的就有以下功能 并且有模板的情况下才能添加 -->
        <el-tabs v-model="activeBaseName" v-if="courseDetailData.template && baseExperimentList.rows.length">
          <!-- 自定义表单 -->
          <el-tab-pane label="自定义" name="1">
            <el-form ref="submitTestForm" :model="submitTestForm" label-width="100px" > 
              <el-form-item 
                label="实验名称：" 
                prop="name"
                :rules="[{ required: true, message: '请输入课程名称', trigger: 'blur' },]">
                <el-input v-model="submitTestForm.name"></el-input>
              </el-form-item> 
              <el-form-item 
                label="实验类型：" 
                prop="etype"
                :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
                <el-radio-group v-model="submitTestForm.etype">
                  <el-radio :label="1">个人实验</el-radio>
                  <el-radio :label="2">小组实验</el-radio> 
                </el-radio-group>
              </el-form-item> 
              <el-form-item 
                label="实验简介：" 
                prop="description"
                :rules="[{ required: true, message: '请输入实验简介', trigger: 'blur' },]">
                <el-input type="textarea" v-model="submitTestForm.description"></el-input>
              </el-form-item>
              <el-form-item 
                label="得分占比：" 
                prop="value"
                :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
                <el-input-number type="number" :min="1" :max="100" v-model="submitTestForm.value"></el-input-number> %
              </el-form-item> 
            </el-form>
          </el-tab-pane>
          <!-- 模板表单 -->
          <el-tab-pane label="模板" name="2">
            <el-form ref="submitBaseTestForm" :model="submitBaseTestForm" label-width="100px" >
              <el-form-item 
                label="模板：" 
                prop="baseExperimentID"
                :rules="[
                  { required: true, message: '请选择模板', trigger: 'blur' }]">
                <el-select v-model="submitBaseTestForm.baseExperimentID" filterable placeholder="请选择" >
                  <el-option v-for="(item, index) in baseExperimentList.rows" :value="item.id" :label="item.name"></el-option> 
                </el-select>
              </el-form-item> 
              <!-- <el-form-item 
                label="得分占比：" 
                prop="defaultValue"
                :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
                <el-input-number type="number" :min="1" :max="100" v-model="submitBaseTestForm.defaultValue"></el-input-number> %
              </el-form-item>  -->        
            </el-form> 
          </el-tab-pane> 
        </el-tabs> 
        <el-form v-else ref="submitTestForm" :model="submitTestForm" label-width="100px" > 
          <el-form-item 
            label="实验名称：" 
            prop="name"
            :rules="[{ required: true, message: '请输入课程名称', trigger: 'blur' },]">
            <el-input v-model="submitTestForm.name"></el-input>
          </el-form-item> 
          <el-form-item 
            label="实验类型：" 
            prop="etype"
            :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
            <el-radio-group v-model="submitTestForm.etype">
              <el-radio :label="1">个人实验</el-radio>
              <el-radio :label="2">小组实验</el-radio> 
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="实验简介：" 
            prop="description"
            :rules="[{ required: true, message: '请输入实验简介', trigger: 'blur' },]">
            <el-input type="textarea" v-model="submitTestForm.description"></el-input>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-input-number type="number" :min="1" :max="100" v-model="submitTestForm.value"></el-input-number> %
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="courseOperaDialog = false">取 消</el-button>
          <el-button v-if="activeBaseName == 1" type="primary" @click="submitTest('submitTestForm')">保存</el-button>
          <el-button v-if="activeBaseName == 2" type="primary" @click="submitBaseTest('submitBaseTestForm')">保存</el-button>
        </div>
    </el-dialog>  
    <!-- 添加课程问卷 --> 
    <el-dialog 
      width="550px"
      title="添加课程问卷" 
      :visible.sync="courseQuestionnaireDialog">
        <!-- 不为null 表示课程是模板添加的就有以下功能 并且有模板的情况下才能添加 -->
        <el-tabs v-model="activeQBaseName" v-if="baseQuestionnaireList.rows.length">
          <!-- 自定义表单 -->
          <el-tab-pane label="自定义" name="1">
            <el-button type="primary" @click=" $router.push({name: 'LessonCreateQuestionnaire', params: {course_id: $route.params.id}}) ">跳到自定义</el-button> 
          </el-tab-pane>
          <!-- 模板表单 -->
          <el-tab-pane label="模板" name="2">
            <el-form ref="baseQuestionnaireForm" :model="baseQuestionnaireForm" label-width="100px" >
              <el-form-item 
                label="模板：" 
                prop="template"
                :rules="[
                  { required: true, message: '请选择模板', trigger: 'blur' }]">
                <!-- 习题 -->
                <el-select v-model="baseQuestionnaireForm.template" filterable placeholder="请选择" >
                  <el-option v-for="(item, index) in baseQuestionnaireList.rows" :value="item.baseCQuestionnaireId" :label="item.name"></el-option> 
                </el-select> 
              </el-form-item>         
            </el-form> 
          </el-tab-pane>
        </el-tabs>  
        <div slot="footer" class="dialog-footer">
          <el-button @click="courseQuestionnaireDialog = false">取 消</el-button> 
          <!-- 模板 --> 
          <el-button v-if="activeQBaseName == 2 " type="primary" @click="submitQuestionnaireBase('baseQuestionnaireForm')">保存</el-button> 
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  export default {
    data () {
      return { 
        paramsId:          this.$route.params.id,
        courseDetailData:  null,
        memberDialog:      false,
        courseOperaDialog: false,
        editCourseDialog:  false,
        courseQuestionnaireDialog: false, //添加课程问卷
        userDetail:        false,
        activeBaseName:    '1', //1为自定义表单，2为模板表单
        activeQBaseName:   '1', //1为自定义表单，2为模板表单   
        currentUserStudentPartakeInfo: null, //获取当前用户的学生参与信息
        noAnswerQuestionnaireList:  [], //未答问卷列表
        memberSearchForm: {
          type:       null,
          course_id:  this.$route.params.id,
          role_id:    null,
          name:       null,
          account:    null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        }, 
        memberListData:             {total: 0, rows: []}, //统一
        memberGroupLeadersListData: {total: 0, rows: []}, //能添加课程组长成员数据
        memberStudentsListData:     {total: 0, rows: []}, //能添加学生成员数据
        memberTeachersListData:     {total: 0, rows: []}, //能添加老师成员数据
        memberTutorsListData:       {total: 0, rows: []}, //能添加助教成员数据
        messageListData: {total: 0, rows: []}, //留言板数据
        baseExperimentList:         {total: 0, rows: []},
        courseQuestionnaireList:    {total: 0, rows: []}, //课程问卷列表
        baseQuestionnaireList:      {total: 0, rows: []}, //课程问卷模板列表
        memeberTypeListData: {  //分类人员数据
          groupLeaders: [],   
          students:     [],
          teachers:     [],
          tutors:       [],
        },
        memberBatchForm:  {  //新增成员表单
          "course_id": this.$route.params.id,
          "type":      2, //1、课程组长；2、任课教师；3、学生；4、助教
          "user_id":   [],
        },   
        submitTestForm: {
          "name":           null,
          "description":    null, 
          "etype":          null,
          "course_id":      this.$route.params.id,
          "value":          null,
        },
        submitBaseTestForm: { //实验模板表单
          "courseID":         this.$route.params.id,
          "baseExperimentID": null,
          "defaultValue":     null,
        },
        baseQuestionnaireForm:{ //通过模板创建课程Id
          courseId:          this.$route.params.id,
          template:          null,
        },
        courseList:      {total: 0, rows: []}, //实验列表
        courseForm:{
          "name":           null,
          "description":    null, 
          "c_code":         null,
          "c_teacher":      null,
          "c_nature":       null,
          "c_year":         null,
          "c_stage":        null,
        },
        messageForm: {
          info:              null,
          associated_object: this.$route.params.id,
          type:              1,
        },
        // 留言板分页
        pageNum: 1,
        pageSize: 5,
      }
    },
    components: {
      upload
    },
    watch: {
      memberDialog(newVal, oldVal){
        if(!newVal){
          this.$refs.memberSearchForm ? this.$refs.memberSearchForm.resetFields() : '';
          this.getQueryMemberList(1);
          this.getQueryMemberList(2);
          this.getQueryMemberList(3);
          this.getQueryMemberList(4);
        }
      } 
    },
    mounted(){
      this.getQueryCourseDetail();
      this.getQueryMemberListType();
      this.getQueryMemberList(1);
      this.getQueryMemberList(2);
      this.getQueryMemberList(3);
      this.getQueryMemberList(4);
      this.getQueryFaculty();
      this.getQueryCourseList();
      this.getMessageList();
      this.getUserDetail();  
      this.getCurrentInfo();
    },
    methods: { 
      /**
       * 获取当前用户的学生参与信息
       * @return {[type]} [description]
       */
      getCurrentInfo(){
        this.axios.get(`${this.common.basePath}/member/current/info`, {params: { courseId: this.paramsId} }).then((response) => {
           this.currentUserStudentPartakeInfo = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /**
       * 将当前课程升级为模板,必须要课程不是模板创建的才能升级
       * @return {[type]} [description]
       */
      upGradeBase(){
        this.axios.get(`${this.common.basePath}/baseCourse/upgrade`, {params: { courseID: this.paramsId} }).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryCourseDetail();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /**
       * 模板列表数据
       * @return {[type]} [description]
       */
      getQueryBaseExperiment(){ 
        this.axios.get(`${this.common.basePath}/baseExperiment`, {params: { course_id: this.courseDetailData.template, cur_status: 1} }).then((response) => {
          this.baseExperimentList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        }); 
       },
      /**
       * 查询课程问卷列表
       * @return {[type]} [description]
       */
      queryCourseQuestionnaireList(){
        this.axios.post(`${this.common.basePath}/course-questionnaire/list`, { courseId: this.paramsId } ).then((response) => {
          this.courseQuestionnaireList = this._queryCourseQuestionnaireList(response.data.data);
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      _queryCourseQuestionnaireList(res){
        if( !res )  return false;
        res.rows.forEach( (item) => {
          item.isAnswer = false;
        })
        return res;
      },
      /**
       * 查询课程问卷模板列表
       * @return {[type]} [description]
       */
      queryCourseQuestionnaireBaseList(){
        this.axios.post(`${this.common.basePath}/base-questionnaire/list`, { courseId: this.courseDetailData.template, curStatus: 1} ).then((response) => {
          this.baseQuestionnaireList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      
      /**
       * 留言板分页
       * @author chuanlin.Xiao
       * @date   2019-11-12T14:17:22+0800
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val) {
        this.pageSize = val
        this.getMessageList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getMessageList()
      },
      /**
       * 根据性别使用不同的头像
       * @param  {[type]} sex [description]
       * @return {[type]}     [description]
       */
      defaultImg(sex){ 
        return sex == 1 ? 
                'this.src="' + require('../../assets/img/male.png') + '"' : 
                'this.src="' + require('../../assets/img/female.png') + '"';
      },
      /*
       * 查询课程详情
       */
      getQueryCourseDetail(){
        this.axios.get(`${this.common.basePath}/course/${this.paramsId}`,'').then((response) => {
          this.courseDetailData = response.data.data;
          this.courseForm= response.data.data; 
          this.courseForm.c_stage = this.courseForm.c_stage.toString();
          this.getQueryBaseExperiment();
          this.queryCourseQuestionnaireList();
          this.queryCourseQuestionnaireBaseList();
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 根据登录账号Id查询用户个人信息
       */
      getUserDetail(){
        this.axios.get(`${this.common.basePath}/user/one/user`,{params: {id: sessionStorage.getItem('Access-Key')}}).then((response) => {
           this.userDetail = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询留言板
       * type为1表示课程，2表示实验
       */
      getMessageList(){ 
        this.axios.get(`${this.common.basePath}/m_massage`,{params: {associated_object: this.$route.params.id, type: 1,pageNum:this.pageNum,pageSize:this.pageSize}}).then((response) => {
           this.messageListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 添加成员
       */
      addMember(type){   
        this.memberBatchForm.type = type;
        this.memberSearchForm.pageNum = this.common.elementPagination.pageNumDefault;
        this.memberSearchForm.pageSize = this.common.elementPagination.pageSizeDefault; 
        this.memberDialog = true;
        this.$refs.memberTable ? this.$refs.memberTable.clearSelection() : '';

        this.getQueryMemberList(type);
      },
      _rodeId(type){
        switch(type){  //1、课程组长；2、任课教师；3、学生；4、助教
          case 1: 
            // role_id 2课程组长   3教师     4助教      5学生
            this.memberSearchForm.role_id = 2;
            break;
          case 2:  
            this.memberSearchForm.role_id = 3;
            break;
          case 3:  
            this.memberSearchForm.role_id = 5;
            break;
          case 4:  
            this.memberSearchForm.role_id = 4;
            break;
        }
      },
      handleSelectionChange(val){  
        this.memberBatchForm.user_id = [];
        val.forEach((item) => {
          this.memberBatchForm.user_id.push(item.id)
        })
      },
      /**
       * 指定表单选中的值为id
       * @return {[type]} [description]
       */
      getTableRowKeys(item){ 
        return item.id;
      },
      /*
       * 查询人员列表
       */
      getQueryMemberList(type){  
        this.axios.post(`${this.common.basePath}/member/not/list`,this._memberListParams(type)).then((response) => {
          //1、课程组长；2、任课教师；3、学生；4、助教
          switch(type){
            case 1:
              this.memberListData = this.memberGroupLeadersListData = response.data.data;
              break;
            case 2:
              this.memberListData = this.memberTeachersListData = response.data.data;
              break;
            case 3:
              this.memberListData = this.memberStudentsListData = response.data.data;
              break;
            case 4:
              this.memberListData = this.memberTutorsListData = response.data.data;
              break;
          }
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _memberListParams(type){
        this._rodeId(type);
        this.memberSearchForm.type = type;
        return JSON.parse(JSON.stringify(this.memberSearchForm));
      },
      /*
       * 保存新增成员
       */
      submitBatch(){
        if(!this.memberBatchForm.user_id.length) {this.$message.error('请选择成员'); return false;}
        this.axios.post(`${this.common.basePath}/member/add/batch`,this.memberBatchForm).then((response) => {
          this.getQueryMemberList(this.memberBatchForm.type);

          
          if(this.memberBatchForm.type == 3){ //学生
            this.getQueryFaculty();
            this.getCurrentInfo();
          }else{
            this.getQueryMemberListType();
          }

          this.memberDialog = false;
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.$message.error(error);  
          this.memberDialog = false;
        });
      },
      /*
       * 查询课程组长跟教师,助教数据
       */
      getQueryMemberListType(){ 
        this.axios.post(`${this.common.basePath}/member/members/type`,{types: [1,2,4], course_id: this.$route.params.id}).then((response) => { 
          this.memeberTypeListData.groupLeaders = response.data.data.groupLeaders; 
          this.memeberTypeListData.teachers = response.data.data.teachers; 
          this.memeberTypeListData.tutors = response.data.data.tutors; 
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询学生数据
       */
      getQueryFaculty(){ 
        this.axios.post(`${this.common.basePath}/member/members/faculty`,{types: [3], course_id: this.$route.params.id}).then((response) => { 
          this.memeberTypeListData.students = this._studensData(response.data.data);
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 学生数据，在每个系别中添加是否折叠的属性
       * @param  {Boolean} isShowMore true为展示全部，false为仅展示前五条
       * @return {[type]}      [description]
       */
      _studensData(data){
        data.forEach( (item) => {
          item.isShowMore = false;
        })
        return data;
      },
      /*
       * 新建实验
       */
      submitTest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/experiment`,this.submitTestForm).then((response) => {
              this.getQueryCourseList(true);
              this.courseOperaDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.courseOperaDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /**
       * 添加模板实验
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitBaseTest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseExperiment/build`, this.submitBaseTestForm).then((response) => {
              this.getQueryCourseList(true);
              this.courseOperaDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.courseOperaDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 查询课程列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryCourseList(){  
        this.axios.get(`${this.common.basePath}/experiment`,{params: {course_id: this.$route.params.id}}).then((response) => {
          this.courseList = response.data.data;
        }).catch((error) => {
          this.$message.error(error); 
        });
      },
      /*
       * 编辑课程
       */
      submitCourse(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/course/${this.paramsId}`,this.courseForm).then((response) => {
              this.getQueryCourseDetail();
              this.editCourseDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              // this.editCourseDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 上传附件的回调
       */
      uploadSuccess(keyName, response){ 
        // 1为课程资料(courseData); 2 为课程大纲(syllabus)，
        let ao_type = keyName == 'courseData' ? 1 : 2; 
        let params = {
          name:               response.name,
          path:               response.path,
          associated_object:  this.$route.params.id,
          ao_type:            ao_type,
        }
        this.axios.post(`${this.common.basePath}/c_literature`,params).then((response) => {
          this.getQueryCourseDetail(); 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      submitMessage(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/m_massage`,this.messageForm).then((response) => {
              this.getMessageList(); 
              this.messageForm.info = null;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error); 
              this.messageForm.info = null;
            }); 
          } else { 
            return false;
          }
        }); 
      },
      /*
       * 删除指定Id的资料文件
       */
      handleTagClose(item){ 
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete(`${this.common.basePath}/c_literature/${item.id}`, '').then((response) => {
            this.getQueryCourseDetail();
            this.$message.success(response.data.meta.message);
          }).catch((error) => {
            this.$message.error(error);  
          }); 
        }).catch(() => {
                   
        }); 
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){
        this.memberSearchForm.pageNum = val;
        this.getQueryMemberList(this.memberBatchForm.type);
        
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){ 
        this.memberSearchForm.pageSize = val;
        this.getQueryMemberList(this.memberBatchForm.type);
      },
      /*
       * 根据指定Id删除成员
       */
      deleteMember(item, type){
        this.axios.patch(`${this.common.basePath}/member/delete/batch`, {ids: [item.id]}).then((response) => {
          this.$message.success(response.data.meta.message);
          type == 3 ? this.getQueryFaculty() : this.getQueryMemberListType(); 
          this.getQueryMemberList(this.memberBatchForm.type);
        }).catch((error) => {
          this.$message.error(error);  
        }); 
      },
      showMoreMember(item){ 
        item.isShowMore = !item.isShowMore;
      },
      /**
       * 保存问卷模板
       * @return {[type]} [description]
       */
      submitQuestionnaireBase(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/course-questionnaire/template`, this.baseQuestionnaireForm).then((response) => {
              this.$message.success(response.data.meta.message);
              this.queryCourseQuestionnaireList(); 
              this.courseQuestionnaireDialog = false;
            }).catch((error) => {
              this.$message.error(error);
              this.courseQuestionnaireDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /**
       * 查看成绩单
       * @return {[type]} [description]
       */
      checkScore(){
        this.axios.get(`${this.common.basePath}/course-answer/no-answer/questionnaire`, {params: {userId: this.currentUserStudentPartakeInfo.user_id,courseId: this.currentUserStudentPartakeInfo.course_id}}).then((response) => {
          this.noAnswerQuestionnaireList = response.data.data;
          // ----------- 已经答完所有卷子 
          if(!response.data.data.length){
            this.$router.push({name: 'ScoreResult', params: {member_id: this.currentUserStudentPartakeInfo.id, course_id: this.currentUserStudentPartakeInfo.course_id}});
          }else{
            this.$message.warning('请将课程问卷下面的卷子都答完后，才能查看成绩单。')
          }
          this.judgeTempQ();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /**
       * 判断当前卷子Id在问答卷子列表中是否存在，存在就显示答卷按钮
       * @param  {[type]} questionnaireId [description]
       * @return {[type]}                 [description]
       */
      judgeTempQ(){
        if(!this.noAnswerQuestionnaireList) return false;
        this.courseQuestionnaireList.rows.forEach( (itemQu) => {
          itemQu.isAnswer = false;
          this.noAnswerQuestionnaireList.forEach( (item) => {
            if(itemQu.id == item.id){
              itemQu.isAnswer = true;
            }
          }) 
        })  
      }
    },
  }
</script>
<style lang="less">
  .person-group-item_w{ 
    text-align: center;
    margin-right: 5px;
    img{
      width: 50px;
      height: 50px;
    }
    .person-name{
      /*text-align: center;*/
      margin: 0;
      padding-left: 18px; 
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .person-group-item_t{
    line-height: 50px; 
  }
  .message-box img{
    display: inline-block; 
  }
</style>