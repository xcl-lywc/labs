<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item>实验详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <!-- 简介 -->
        <el-card v-if="common.checkAuthority('TestDetail_QueryBasicsDetailMoudle', true) && detailData " class="basics_desc">
          <div slot="header">
            <span class="card-title">简介</span>
          </div>
          <el-row>
            <el-col :span="12" class="marb10"><span>所属课程： </span>{{detailData.courseName}}</el-col>
            <el-col :span="12" class="marb10"><span>实验类型： </span>{{detailData.etype == 1 ? '个人实验' : '小组实验'}}</el-col>
            <el-col :span="12" class="marb10"><span>实验： </span>{{detailData.name}}</el-col>
            <el-col :span="12" class="marb10"><span>得分占比： </span>{{detailData.value ? `${detailData.value}%` : '无'}}</el-col>
            <el-col :span="12" class="marb10"><span>满分： </span>{{detailData.score ? detailData.score : '100'}}分</el-col>
            <el-col :span="24" class="marb10 inline-flex"><span>简介：</span><span class="cursor-pointer_T ">{{detailData.description}}</span></el-col>
          </el-row> 
          <p class="text-right">
            <el-button 
              :disabled="!common.checkAuthority('TestDetail_EditBasicsDetail', true)"
              type="primary" @click="editTestDialog = true; ">
              {{common.checkAuthority('TestDetail_EditBasicsDetail') ? common.checkAuthority('TestDetail_EditBasicsDetail').name : ''}}
            </el-button>
            <!-- 将实验设置为模板， 必须之前不是模板实验才能修改， 并且课程模板不为null，也就是当前实验属于的课程必须是模板创建的 -->
            <el-button 
              v-if="!detailData.template && detailData.courseTemplate"
              :disabled="!common.checkAuthority('TestDetail_Base', true)"
              type="primary" @click=" upGradeBase ">
              {{common.checkAuthority('TestDetail_Base') ? common.checkAuthority('TestDetail_Base').name : ''}}
            </el-button>
          </p> 
          <p>实验资料：</p>
          <p> 
            <el-tag
              class="marr10 mart10"
              v-for="(item, index) in detailData.experimentsData"
              :key="index"
              :closable="common.checkAuthority('TestDetail_DeleteFile', true)"
              @close="handleTagClose(item)"
              :type="item.type">
                <a v-if="common.checkAuthority('TestDetail_AddTestData', true)" 
                   :href="`${common.publicBasePath}${item.path}`" target="_blank">{{item.name}}</a> 
                <span v-else>{{item.name}}</span> 
            </el-tag>
          </p>
          <p> 
            <upload 
              :isDisabled="!common.checkAuthority('TestDetail_AddTestData', true)"
              :buttonText="common.checkAuthority('TestDetail_AddTestData') ? common.checkAuthority('TestDetail_AddTestData').name : ''" 
              @uploadSuccess="(response) => {uploadSuccess('experimentsData', response)}"></upload>
          </p>
        </el-card> 
        <!-- 实验安排 -->
        <el-card v-if="common.checkAuthority('TestDetail_QueryExperimentalArrangementMoudle', true)" class="mart20">
          <div slot="header">
            <span class="card-title">实验安排<span style="font-size: 12px;">（注意：实验室全天共可排14个课时）</span></span>
          </div>
          <el-card v-for="(item,index) in lBespeakRecordListData" :key="index" class="mart5">
            <span>开始节次：{{common._convertDate(item.begin_time, 'yyyy年MM月dd日')}}：</span>
            <span>{{item.begin_index}} ~ </span>
            <span>结束节次：{{common._convertDate(item.begin_time, 'yyyy年MM月dd日')}}：</span>
            <span>{{item.end_index}}</span>
            教室：<span v-for="(itemC, indexC) in item.classRooms" :key="indexC">{{itemC.name}}{{indexC < item.classRooms.length -1 ? '、' : ''}}</span>
            <el-button
              class="marl10" 
              :disabled="!common.checkAuthority('TestDetail_DeleteTestArrage', true)"
              type="danger" size="small" @click="deleteLBespeakRecord(item.l_bespeak_id)">
              {{common.checkAuthority('TestDetail_DeleteTestArrage') ? common.checkAuthority('TestDetail_DeleteTestArrage').name : ''}}
            </el-button>  
          </el-card>
          <p class="text-right">
            <el-button
              class="marl10" 
              :disabled="!common.checkAuthority('TestDetail_DeleteTestArrage', true)"
              type="primary" size="small" @click="supplementClassShow">
               补录课时
            </el-button> 
            <el-button 
              :disabled="!common.checkAuthority('TestDetail_BookingClassroom', true)"
              @click="$router.push({name: 'BookingClassroom', params: {experiment_id: $route.params.id}})" type="primary" size="small">
                {{common.checkAuthority('TestDetail_BookingClassroom') ? common.checkAuthority('TestDetail_BookingClassroom').name : ''}}
              </el-button>
          </p>
        </el-card> 
        <!-- 实验任务 -->
        <el-card v-if="common.checkAuthority('TestDetail_QueryExperimentalTaskMoudle', true)" class="mart20">
          <div slot="header">
            <span class="card-title">实验任务</span>
          </div>
          <el-card style="position: relative;" v-for="(item,index) in taskListData.rows" :key="index" class="mart5 cursor-pointer">
           <p @click=" goToTaskPape(item) " >
            <span v-if="item.type != 4">
              {{item.name}}，满分： {{item.score}}，总成绩占比：{{item.value}}% 。
            </span>
            <span v-else>
              {{item.name}} 。
            </span>
            <span>状态：<span :style="{color: reportStatus(item.cur_status).color}">{{reportStatus(item.cur_status).name}}</span></span>
            </p>  
            <el-button 
              :disabled="!common.checkAuthority('TestDetail_DelelteTask', true)"
              @click="deleteTask(item)" class="del-circle-btn" type="danger" >
                删除
              </el-button>
          </el-card>
          <p class="text-right">
            <el-button  
              :disabled="!common.checkAuthority('TestDetail_AttendanceTask', true) || !isExistTeacher"
              type="primary" size="small" 
              @click=" attendanceTaskDialog = true; $refs.attendanceTaskForm ? $refs.attendanceTaskForm.resetFields() : ''; ">
              {{common.checkAuthority('TestDetail_AttendanceTask') ? common.checkAuthority('TestDetail_AttendanceTask').name : ''}}
            </el-button>
            <el-button  
              :disabled="!common.checkAuthority('TestDetail_ReportTask', true) || !isExistTeacher"
              type="primary" size="small" 
              @click=" reportTaskDialog = true; $refs.reportTaskForm ? $refs.reportTaskForm.resetFields() : ''; $refs.baseTaskForm ? $refs.baseTaskForm.resetFields() : ''">
              {{common.checkAuthority('TestDetail_ReportTask') ? common.checkAuthority('TestDetail_ReportTask').name : ''}}    
            </el-button> 
            <el-button  
              :disabled="!common.checkAuthority('TestDetail_ExerciseRequest', true) || !isExistTeacher"
              type="primary" size="small" @click=" taskShow(1)">
              {{common.checkAuthority('TestDetail_ExerciseRequest') ? common.checkAuthority('TestDetail_ExerciseRequest').name : ''}}    
            </el-button>
            <el-button  
              :disabled="!common.checkAuthority('TestDetail_CreateQuestionnaire', true) || !isExistTeacher"
              type="primary" size="small" @click=" taskShow(4) ">
              {{common.checkAuthority('TestDetail_CreateQuestionnaire') ? common.checkAuthority('TestDetail_CreateQuestionnaire').name : ''}}    
            </el-button> 
          </p>
        </el-card>
        <!-- 实验成员 -->
        <el-card v-if="common.checkAuthority('TestDetail_QueryExperimentalMembersMoudle', true)" class="mart20">
          <div slot="header">
            <span class="card-title">实验成员</span>
          </div>
          <el-card shadow="never">
            <div slot="header" class="clearfix">
              <span><strong>教师</strong></span> 
              <!-- 课程下面有老师才有添加按钮 -->
              <el-button 
                :disabled="!common.checkAuthority('TestDetail_AddTeacher', true)"
                v-if="memeberCourseTeaherListData.rows.length" class="fr"@click="addTeacherMember(2)" type="primary" size="mini">
                  {{common.checkAuthority('TestDetail_AddTeacher') ? common.checkAuthority('TestDetail_AddTeacher').name : ''}}
                </el-button>
              <div v-else class="fr coloCCC">
                系统中没有可选课程教师角色的用户，请联系课程组长添加相应用户到课程！
              </div>
            </div>
            <div>
              <el-row class="padding-row">
                <el-col v-for="(item,index) in memeberTypeListData.teachers" :key="index" :span="6">
                  <el-card class="person-card-wrap-card">
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
                      :disabled="!common.checkAuthority('TestDetail_DelelteMember', true)"
                      @click="deleteMember(item, 2)" class="del-circle-btn" type="danger">
                        删除
                      </el-button>
                  </el-card>
                </el-col>
              </el-row> 
            </div>
          </el-card>
          <el-card shadow="never" class="mart10">
            <div slot="header" class="clearfix">
              <span><strong>助教</strong></span> 
              <!-- 课程下面有老师才有添加按钮 -->
              <el-button 
                :disabled="!common.checkAuthority('TestDetail_AddTutor', true)"
                v-if="memeberCourseTutorsListData.rows.length" class="fr" @click="addTeacherMember(4)" type="primary" size="mini">
                  {{common.checkAuthority('TestDetail_AddTutor') ? common.checkAuthority('TestDetail_AddTutor').name : ''}}
                </el-button>
              <div v-else class="fr coloCCC">
                系统中没有可选课程助教角色的用户，请联系课程组长添加相应用户到课程！
              </div>
            </div>
            <div>
              <el-row class="padding-row">
                <el-col v-for="(item,index) in memeberTypeListData.tutors" :key="index" :span="6">
                  <el-card class="person-card-wrap-card">
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
                      :disabled="!common.checkAuthority('TestDetail_DelelteMember', true)"
                      @click="deleteMember(item, 4)" class="del-circle-btn" type="danger">
                        删除
                      </el-button>
                  </el-card>
                </el-col>
              </el-row> 
            </div>
          </el-card>
          <el-card shadow="never" class="mart10">
            <div slot="header" class="clearfix">
              <span><strong>学员</strong></span> 
              <el-button class="fr" type="primary" size="mini" 
                @click="goToStudentResister">管理实验的学生名册</el-button>
            </div>
            <div> 
              <div class="person-group-wrap marb10" v-for="(item,index) in memeberTypeListData.students" :key="index">
                <div class="person-group-item_t">{{item.teamName}}：</div>
                <div class="person-group-item_w mart10" 
                  style="width: 60px!important;"
                  v-for="(itemMembers,indexMembers) in item.cMembers"
                  v-if="indexMembers <= 4 || (indexMembers > 4 && item.isShowMore)">
                  <el-dropdown :hide-on-click="false" placement="bottom-start">
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
                </div> 
                <el-button v-if="item.cMembers ? item.cMembers.length > 5 : false" @click=" showMoreMember(item) " size="small">{{!item.isShowMore ? '显示更多' : '仅展示5条'}}</el-button>
                <!-- 添加按钮 -->
                <!-- <div  
                  v-if="item.length && memeberCourseStudentListData.rows.length && common.checkAuthority('TestDetail_AddStudent', true)" 
                  @click="addStudentMember(item[0].group_num)" 
                  class=" person-group-student-add marl10 cursor-pointer" >
                  <i class="el-icon-plus"></i>
                </div> -->
              </div>  
            </div>
          </el-card>
          <p class="text-right">
            <!-- 考勤表 -->
            <el-button 
              :disabled="!common.checkAuthority('TestDetail_AttendanceSheet', true)"
              type="primary" size="small" 
              @click="$router.push({name: 'AttendanceSheet', params: {experiment_id: $route.params.id}})">
              {{common.checkAuthority('TestDetail_AttendanceSheet') ? common.checkAuthority('TestDetail_AttendanceSheet').name : ''}}    
            </el-button>
            <!-- 成绩明细表 -->
            <el-button 
              :disabled="!common.checkAuthority('TestDetail_ScheduleOfAchievements', true)"
              type="primary" size="small" 
              @click="$router.push({name: 'ScheduleOfAchievements', params: {experiment_id: $route.params.id}})">
              {{common.checkAuthority('TestDetail_ScheduleOfAchievements') ? common.checkAuthority('TestDetail_ScheduleOfAchievements').name : ''}} 
            </el-button> 
          </p>
        </el-card>
        <!-- 留言栏 -->
        <el-card v-if="common.checkAuthority('TestDetail_QueryMessageMoudle', true)" class="mart20">
          <div slot="header">
            <span class="card-title">留言栏</span>
          </div>
          <div class="message-box">
            <el-card class="marb5"  v-if="messageListData.total>0">
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
            <el-card v-if="userDetail && common.checkAuthority('TestDetail_ReleaseMessage', true)" class="marb5">
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
                      :rules="[
                        { required: true, message: '留言不能为空', trigger: '' },
                        { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
                        ">
                      <el-input placeholder="请填写留言信息" type="textarea" v-model="messageForm.info"></el-input>
                    </el-form-item> 
                  </el-form>
                </div>
                <div class="text-right">
                  <el-button type="primary" size="small" @click="submitMessage('messageForm')">
                    {{common.checkAuthority('TestDetail_ReleaseMessage') ? common.checkAuthority('TestDetail_ReleaseMessage').name : ''}}
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </el-card> 
      </div>
    </div>
    <!-- 编辑实验基本信息 -->
    <el-dialog 
      width="550px"
      title="编辑实验基本信息" 
      :visible.sync="editTestDialog">
        <el-form ref="submitForm" :model="submitForm" label-width="100px" > 
          <el-form-item 
            label="实验名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入实验名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="submitForm.name"></el-input>
          </el-form-item> 
          <!-- <el-form-item 
            label="实验类型：" 
            prop="etype"
            :rules="[{ required: true, message: '请选择实验类型', trigger: 'blur' },]">
            <el-radio-group v-model="submitForm.etype">
              <el-radio :label="1">个人实验</el-radio>
              <el-radio :label="2">小组实验</el-radio> 
            </el-radio-group>
          </el-form-item>  -->
          <el-form-item 
            label="实验简介：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入实验简介', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
              ">
            <el-input type="textarea" :rows="6" v-model="submitForm.description"></el-input>
          </el-form-item> 
          <el-form-item 
              label="得分占比：" 
              prop="value"
              :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
              <el-input-number type="number" :min="1" :max="100" v-model="submitForm.value"></el-input-number> %
            </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editTestDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitTest('submitForm')">保存</el-button>
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
            <el-input v-model="memberSearchForm.user_name"></el-input>
          </el-form-item>  
          <el-form-item 
            label="工号：" 
            prop="account" >
            <el-input v-model="memberSearchForm.account"></el-input>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="getQueryMemberListByCourseId(memberBatchForm.type)">搜索</el-button>
            <el-button type="primary" @click="$refs.memberSearchForm ? $refs.memberSearchForm.resetFields() : '' ">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border 
          :row-key="getTableRowKeys"
          ref="memberTable"
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
    <!-- 添加报告要求 -->
    <el-dialog 
      width="550px"
      title="创建报告要求" 
      :visible.sync="reportTaskDialog" v-if="detailData">
        <!-- 不为null 表示课程是模板添加的就有以下功能 并且有模板的情况下才能添加 --> 
        <el-tabs v-model="activeBaseName" v-if="detailData.template && baseReportTaskList.rows.length">
          <!-- 自定义表单 -->
          <el-tab-pane label="自定义" name="1">
            <el-form ref="reportTaskForm" :model="reportTaskForm" label-width="100px" > 
              <el-form-item 
                label="任务名称：" 
                prop="name"
                :rules="[
                  { required: true, message: '请输入任务名称', trigger: 'blur' },
                  { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
                  ">
                <el-input v-model="reportTaskForm.name"></el-input>
              </el-form-item> 
              <el-form-item 
                label="截止日期：" 
                prop="end_time"
                :rules="[{ required: true, message: '请选择截止日期', trigger: 'blur' },]">
                <el-date-picker
                  v-model="reportTaskForm.end_time"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item> 
              <el-form-item 
                label="得分占比：" 
                prop="value"
                :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
                <el-input-number type="number" :min="1" :max="100" v-model="reportTaskForm.value"></el-input-number> %
              </el-form-item> 
              <el-form-item 
                label="总分：" 
                prop="score"
                :rules="[{ required: true, message: '请输入总分', trigger: 'blur' },]"> 
                <el-input-number type="number" :min="1" v-model="reportTaskForm.score"></el-input-number>
              </el-form-item> 
              <el-form-item 
                label="报告类型：" 
                prop="genre"
                :rules="[{ required: true, message: '请选择报告类型', trigger: 'blur' },]">
                <el-radio-group v-model="reportTaskForm.genre">
                  <el-radio :label="1">小组报告</el-radio> 
                  <el-radio :label="2">个人报告</el-radio>
                </el-radio-group>
              </el-form-item> 
              <el-form-item 
                label="报告模板：" 
                prop="task_files"
                :rules="[{ required: false, message: '请选择报告模板', trigger: 'blur' },]">
                <upload 
                  buttonText="上传"
                  @uploadSuccess=" uploadReportSuccess "></upload>
                <span>{{reportTaskForm.task_files ? JSON.parse(reportTaskForm.task_files).name : ''}}</span>
              </el-form-item> 
              <el-form-item 
                label="报告要求：" 
                prop="description"
                :rules="[
                  { required: true, message: '请输入报告要求', trigger: 'blur' },
                  { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
                  ">
                <el-input type="textarea" :rows="6" v-model="reportTaskForm.description"></el-input>
              </el-form-item> 
            </el-form>
          </el-tab-pane>
          <!-- 模板表单 -->
          <el-tab-pane label="模板" name="2">
            <el-form ref="baseTaskForm" :model="baseTaskForm" label-width="100px" >
              <el-form-item 
                label="模板：" 
                prop="tasks"
                :rules="[
                  { required: true, message: '请选择模板', trigger: 'blur' }]">
                <el-select v-model="baseTaskForm.tasks" filterable placeholder="请选择" >
                  <el-option v-for="(item, index) in baseReportTaskList.rows" :value="item.id" :label="item.name"></el-option> 
                </el-select>
              </el-form-item>   
              <!-- <el-form-item 
                label="得分占比：" 
                prop="defaultValue"
                :rules="[
                  { required: true, message: '请输入得分占比', trigger: 'blur' }]
                  ">
                <el-input type="number" :min="1" :max="100"  v-model="baseTaskForm.defaultValue"></el-input>
              </el-form-item> -->       
            </el-form> 
          </el-tab-pane>
        </el-tabs>
        <!-- 自定义表单 -->
        <el-form v-else ref="reportTaskForm" :model="reportTaskForm" label-width="100px" > 
          <el-form-item 
            label="任务名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入任务名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="reportTaskForm.name"></el-input>
          </el-form-item> 
          <el-form-item 
            label="截止日期：" 
            prop="end_time"
            :rules="[{ required: true, message: '请选择截止日期', trigger: 'blur' },]">
            <el-date-picker
              v-model="reportTaskForm.end_time"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> 
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-input-number type="number" :min="1" :max="100" v-model="reportTaskForm.value"></el-input-number> %
          </el-form-item> 
          <el-form-item 
            label="总分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入总分', trigger: 'blur' },]"> 
            <el-input-number type="number" :min="1" v-model="reportTaskForm.score"></el-input-number>
          </el-form-item> 
          <el-form-item 
            label="报告类型：" 
            prop="genre"
            :rules="[{ required: true, message: '请选择报告类型', trigger: 'blur' },]">
            <el-radio-group v-model="reportTaskForm.genre">
              <el-radio :label="1">小组报告</el-radio> 
              <el-radio :label="2">个人报告</el-radio>
            </el-radio-group>
          </el-form-item> 
          <el-form-item 
            label="报告模板：" 
            prop="task_files"
            :rules="[{ required: false, message: '请选择报告模板', trigger: 'blur' },]">
            <upload 
              buttonText="上传"
              @uploadSuccess=" uploadReportSuccess "></upload>
            <span>{{reportTaskForm.task_files ? JSON.parse(reportTaskForm.task_files).name : ''}}</span>
          </el-form-item> 
          <el-form-item 
            label="报告要求：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入报告要求', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
              ">
            <el-input type="textarea" :rows="6" v-model="reportTaskForm.description"></el-input>
          </el-form-item> 
        </el-form>
        
        <div slot="footer" class="dialog-footer">
          <el-button @click="reportTaskDialog = false">取 消</el-button>
          <!-- 自定义 -->
          <el-button v-if="activeBaseName == 1" type="primary" @click="submitReport('reportTaskForm')">保存</el-button>
          <!-- 模板 -->
          <el-button v-if="activeBaseName == 2" type="primary" @click="submitBase('baseTaskForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 添加考情任务 -->
    <el-dialog 
      width="550px"
      title="创建考勤任务" 
      :visible.sync="attendanceTaskDialog">
        <el-form ref="attendanceTaskForm" :model="attendanceTaskForm" label-width="100px" > 
          <el-form-item 
            label="任务名称：" 
            prop="name"
            :rules="[
              { required: true, message: '请输入任务名称', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
              ">
            <el-input v-model="attendanceTaskForm.name"></el-input>
          </el-form-item>  
          <el-form-item 
            label="总分：" 
            prop="score"
            :rules="[{ required: true, message: '请输入总分', trigger: 'blur' },]">
            <el-input-number :min="1" type="number" v-model="attendanceTaskForm.score"></el-input-number>
          </el-form-item>  
          <el-form-item 
            label="得分占比：" 
            prop="value"
            :rules="[{ required: true, message: '请输入得分占比', trigger: 'blur' },]">
            <el-input-number type="number" :min="1" :max="100" v-model="attendanceTaskForm.value"></el-input-number> %
          </el-form-item>  
          <!-- <el-form-item 
            label="是否阻塞：" 
            prop="is_block"
            :rules="[{ required: true, message: '请选择是否阻塞', trigger: 'blur' },]">
            <el-radio-group v-model="attendanceTaskForm.is_block">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="2">否</el-radio> 
            </el-radio-group>
          </el-form-item> -->
          <el-form-item 
            label="任务描述：" 
            prop="description"
            :rules="[
              { required: true, message: '请输入任务描述', trigger: 'blur' },
              { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]
              ">
            <el-input type="textarea" :rows="6" v-model="attendanceTaskForm.description"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attendanceTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitAttendance('attendanceTaskForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 补录课时 -->
    <el-dialog 
      width="80vw"
      title="补录课时" 
      :visible.sync="supplementClassDialog">
        <div class="router-view-content">  
        <!-- 预约教室 -->
        <el-card class="box-card mart20">
          <div slot="header" class="clearfix"> 
            <span class="card-title">预约教室</span> 
          </div>
          <!-- 搜索表单 -->
          <el-form ref="supplementClassForm" :model="supplementClassForm" :inline="true" label-width="130px"> 
            <el-form-item label="实验室：" prop="id">
              <el-select v-model="supplementClassForm.id">
                <el-option v-for="(item, index) in labList.rows" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item> 
            <el-form-item 
              label="预约节次：" 
              prop="sTime"
              :rules="[{ required: true, message: '请选择第一个时间', trigger: 'blur' },
                {validator: (rule, value, callback) => { dateValid(rule, value, callback, 'sTime') } ,trigger:'blur'},
              ]">
              <el-date-picker
                v-model="supplementClassForm.sTime"
                type="date" >
              </el-date-picker> 
            </el-form-item> 
            <el-form-item
              prop="b_index"
              :rules="[{ required: true, message: '请选择第一个时间的节次', trigger: 'blur' },
                {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'b_index') } ,trigger:'blur'},
              ]">
              <el-input-number type="number" :min="1" v-model="supplementClassForm.b_index"> </el-input-number>
            </el-form-item>
            <el-form-item>
              ~
            </el-form-item> 
            <el-form-item  
              prop="eTime"
              :rules="[{ required: true, message: '请选择第二个时间', trigger: 'blur' }, 
              ]">
              <el-date-picker
                v-model="supplementClassForm.eTime"
                type="date" >
              </el-date-picker> 
            </el-form-item>
            <el-form-item
              prop="e_index"
              :rules="[{ required: true, message: '请选择第二个时间的节次', trigger: 'blur' },
                {validator: (rule, value, callback) => { indexValid(rule, value, callback, 'e_index') } ,trigger:'blur'},
              ]">
              <el-input-number type="number" :min="1" v-model="supplementClassForm.e_index"> </el-input-number>
            </el-form-item>
            
            <el-form-item>
              <el-button  
                type="primary" @click="getQuerySelectClass('supplementClassForm')">
                查询
              </el-button>
            </el-form-item>
          </el-form> 
          <!-- 卡片 -->
          <el-row class="padding-row">
            <el-col :span="8" v-for="(item, index) in selectClassData" :key="index">
              <el-card class="card-class marl10"> 
                <p>
                  <el-checkbox 
                    :disabled="item.timeTableRecord ? !item.timeTableRecord.l_bespeak_id : false" 
                    class="fl marr10"  v-model="item.isChecked"> 
                  </el-checkbox>
                  <span class="fl">容量：{{item.size}} </span>   
                </p>
                <br/>
                <p>教室地址：{{item.address}}</p> 

                <div style="color: #c7a53d" v-if="item.timeTableRecord ? !item.timeTableRecord.l_bespeak_id : false"> 
                  已被实验室占用，不能再强行预约
                </div>
                <div v-if="item.timeTableRecord ? item.timeTableRecord.l_bespeak_id : false">
                  <p>{{item.timeTableRecord.faculty_name}} 的 {{item.timeTableRecord.user_name}} 在 {{item.timeTableRecord.experiment_name}} 下占用了该教室</p>
                  <p>占用人联系电话：{{item.timeTableRecord.phone_num}}</p>
                </div> 

              </el-card>
            </el-col>
          </el-row>
          <div class="text-right mart10"> 
            <el-button  
              type="primary" @click=" reserveClass ">
              补录
            </el-button>
          </div>
        </el-card>
      </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attendanceTaskDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitAttendance('attendanceTaskForm')">保存</el-button>
        </div>
    </el-dialog>
    <!-- 添加习题要求/评价要求 --> 
    <el-dialog 
      width="550px"
      :title="baseTaskType == 1 ? '添加习题要求' : '添加评价要求'" 
      :visible.sync="baseTaskDialog" v-if="detailData">
        <!-- 不为null 表示课程是模板添加的就有以下功能 并且有模板的情况下才能添加 -->
        <el-tabs v-model="activeEBaseName" v-if="detailData.template && baseReportTaskList.rows.length">
          <el-tab-pane label="自定义" name="1">
            <!-- 自定义表单 -->
            <!-- 习题 -->
            <el-button v-if=" baseTaskType == 1 " type="primary" @click=" $router.push({name: 'ExerciseRequest', params: {id: $route.params.id}}) ">跳到自定义</el-button>
            <!-- 评价 -->
            <el-button v-if=" baseTaskType == 4 " type="primary" @click=" $router.push({name: 'CreateQuestionnaire', params: {id: $route.params.id}}) ">跳到自定义</el-button>
            
          </el-tab-pane>
          <el-tab-pane label="模板" name="2">
            <!-- 模板表单 -->
            <el-form ref="baseTaskForm" :model="baseTaskForm" label-width="100px" >
              <el-form-item 
                label="模板：" 
                prop="tasks"
                :rules="[
                  { required: true, message: '请选择模板', trigger: 'blur' }]">
                <!-- 习题 -->
                <el-select v-if="baseTaskType == 1" v-model="baseTaskForm.tasks" filterable placeholder="请选择" >
                  <el-option v-for="(item, index) in baseExercisesTaskList.rows" :value="item.id" :label="item.name"></el-option> 
                </el-select>
                <!-- 评价 -->
                <el-select v-if="baseTaskType == 4" v-model="baseTaskForm.tasks" filterable placeholder="请选择" >
                  <el-option v-for="(item, index) in baseEvaluateTaskList.rows" :value="item.id" :label="item.name"></el-option> 
                </el-select>
              </el-form-item>  
              <!-- <el-form-item 
                label="得分占比：" 
                prop="defaultValue"
                :rules="[
                  { required: true, message: '请输入得分占比', trigger: 'blur' }]
                  ">
                <el-input type="number" :min="1" :max="100"  v-model="baseTaskForm.defaultValue"></el-input>
              </el-form-item> -->       
            </el-form> 
          </el-tab-pane>
        </el-tabs>  
        <div slot="footer" class="dialog-footer">
          <el-button @click="baseTaskDialog = false">取 消</el-button> 
          <!-- 模板 --> 
          <el-button v-if="activeEBaseName == 2 " type="primary" @click="submitBase('baseTaskForm')">保存</el-button> 
        </div>
    </el-dialog>
  </div>
</template>
<script> 
  import upload from "../../components/Upload.vue"
  export default {
    data () {
      return { 
        paramId:         this.$route.params.id,
        detailData:      null,
        activeBaseName:  '1', //1为自定义表单，2为模板表单
        activeEBaseName: '1', //1为自定义表单，2为模板表单
        showModel:       "main", // 由于包含子组件时, 用于控制页面展示的区域
        userDetail:      null,
        baseTaskType:    1, //  1 习题 2报告,3考勤,4评价
        isExistTeacher:  false, // ture表示有老师角色，false则没有
        memeberTypeListData: {  //分类人员数据
          groupLeaders: [],   
          students:     [],
          teachers:     [],
          tutors:       [],
        },
        surplusTotalScore:  0, //剩余占比数
        lBespeakRecordListData:       {total: 0, rows: []}, //实验安排列表
        memeberCourseStudentListData: {total: 0, rows: []}, //课程下面的学生成员列表
        memeberCourseTeaherListData:  {total: 0, rows: []}, //课程下面的老师成员列表
        memeberCourseTutorsListData:  {total: 0, rows: []}, //课程下面的助教成员列表
        labList:                      {rows: [], total: 0}, //实验室列表
        supplementClassDialog:false,
        memberDialog:         false,
        editTestDialog:       false,
        reportTaskDialog:     false,
        baseTaskDialog:       false,
        attendanceTaskDialog: false,
        memberSearchForm: { 
          experiment_id:  this.$route.params.id,
          user_name:      null,
          account:        null,
          pageNum:        this.common.elementPagination.pageNumDefault,
          pageSize:       this.common.elementPagination.pageSizeDefault,
        },
        memberListData:  {total: 0, rows: []}, //所有成员数据
        messageListData: {total: 0, rows: []}, //留言板数据
        selectClassData: [],
        memberBatchForm: {  //新增成员表单
          "experiment_id": this.$route.params.id,
          "type":          2, //1、课程组长；2、任课教师；3、学生；4、助教
          "member_id":     [],
        }, 
        submitForm:{
          "name":           null,
          "description":    null, 
          "etype":          null,
          "course_id":      null,
          "value":          null,
        },
        taskListData:       {total: 0, rows: []}, //任务列表
        baseReportTaskList: {total: 0, rows: []}, //报告任务模板列表
        baseExercisesTaskList: {total: 0, rows: []}, //习题任务模板列表
        baseEvaluateTaskList: {total: 0, rows: []}, //评价任务模板列表
        reportTaskForm:   { //报告任务表单
          experiment_id:  this.$route.params.id,
          name:           null,
          value:          null, //占比
          score:          null, //
          end_time:       null,
          description:    null,
          genre:          null, //报告类型
          task_files:     null,
        },  
        baseTaskForm: {
          experimentID: this.$route.params.id,
          tasks:        null,
          defaultValue: null,
        },
        attendanceTaskForm:   { //考情任务表单
          experiment_id:  this.$route.params.id,
          name:           null, //名字
          value:          null, //占比
          score:          null, //总分
          type:           3, //
          is_block:       null, 
          description:    null,
        },  
        messageForm: {
          info:              null,
          associated_object: this.$route.params.id,
          type:              2,
        },
        supplementClassForm: { //预约教室的查询条件
          sTime:    new Date(),
          eTime:    new Date(),
          b_index:  1,
          e_index:  2,
          id:       null,
        }, 
        // 留言板分页
        pageNum: 1,
        pageSize: 5,
      }
    },
    components: { 
      upload,
    },
    computed:{
      reportStatus(){  
        // 使用闭包才在计算属性中传参
        return function(status_num){ 
          switch(status_num){
            case 1: 
              return {name: '未发布', color: '#f5b800'};
              break;
            case 2: 
              return {name: '进行中', color: '#d298fd'};
              break;
            case 3: 
              return {name: '已截止', color: 'red'};
              break;
            case 4: 
              return {name: '已结束', color: '#3aff6e'};
              break;
          }
        }
      } 
    },
    mounted(){  
      this.getQueryDetail();  
      this.getQueryMemberListType();
      this.getQueryFaculty();
      this.getQueryTaskList();
      this.getMessageList();
      this.getUserDetail();
      this.getLBespeakRecordList();
      this.getQuerylabList();
      this.loginAccountIsRole(); 
     },
    methods: {
      /**
       * 将当前实验升级为模板,必须课程也是创建的模板，才能升级实验
       * @return {[type]} [description]
       */
      upGradeBase(){
        this.axios.get(`${this.common.basePath}/baseExperiment/upgrade`, {params: { experimentID: this.paramId} }).then((response) => {
          this.$message.success(response.data.meta.message);
          this.getQueryDetail();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },  
      /**
       * 模板列表数据
       * @return {[type]} [description]
       */
      getQueryBaseList(type){ 
        this.axios.get(`${this.common.basePath}/baseTask`, {params: { experiment_id: this.detailData.template, type: type, cur_status: 1} }).then((response) => {
          if(type == 1){ //习题任务列表
            this.baseExercisesTaskList = response.data.data;
          }else if(type == 2){ //报告任务列表
            this.baseReportTaskList = response.data.data;
          }else if(type == 4){ //评价任务列表
            this.baseEvaluateTaskList = response.data.data;
          }
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
       * 时间验证
       */
      dateValid(rule, value, callback, keyName){ 
        if(this.common._convertDate(this.supplementClassForm.sTime, 'yyyyMMdd') > this.common._convertDate(this.supplementClassForm.eTime, 'yyyyMMdd')){
          callback(new Error('第一个时间不能大于第二个时间'));
        }else{
          callback();
        }
      },
      /*
       * 节次验证
       */
      indexValid(rule, value, callback, keyName){  
        if(value > 14) callback(new Error(`最大节不能大于14`));
        if(this.supplementClassForm.b_index > this.supplementClassForm.e_index){
          callback(new Error('第一个节次不能大于第二个节次'));
        }else{
          callback();
        }
      },
      /*
       * 查询课程列表，
       */
      getQueryDetail(){  
        this.axios.get(`${this.common.basePath}/experiment/${this.paramId}`, '').then((response) => {
          this.detailData = response.data.data;
          this.submitForm.name = response.data.data.name;
          this.submitForm.description = response.data.data.description;
          this.submitForm.etype = response.data.data.etype;  
          this.submitForm.course_id = response.data.data.course_id;
          this.submitForm.value = response.data.data.value;
          this.getQueryMemberListByCourseId(2);
          this.getQueryMemberListByCourseId(3);
          this.getQueryMemberListByCourseId(4);
          // -------------- 该实验是模板添加的，才查询任务模板列表 -----------
          if(this.detailData.template){
            this.getQueryBaseList(1); //报告
            this.getQueryBaseList(2); //习题
            this.getQueryBaseList(4); //评价
          }
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
       * 查询实验安排
       */
      getLBespeakRecordList(){
        this.axios.get(`${this.common.basePath}/l_bespeak_record/list/${this.$route.params.id}`,'').then((response) => {
          this.lBespeakRecordListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      /*
       * 根据课程Id查询人员列表
       * @params {string/number} type 1、课程组长；2、任课教师；3、学生；4、助教
       */
      getQueryMemberListByCourseId(type){  
        this.axios.get(`${this.common.basePath}/member`,this._memberListByCourseIdParams(type)).then((response) => {
          if(type == 2){
            this.memberListData = this.memeberCourseTeaherListData = response.data.data;
          }else if(type == 3){
            this.memberListData = this.memeberCourseStudentListData = response.data.data;
          }else if(type == 4){
            this.memberListData = this.memeberCourseTutorsListData = response.data.data;
          }
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _memberListByCourseIdParams(type){
        let params = JSON.parse(JSON.stringify(this.memberSearchForm));
        params.type = type;
        params.course_id = this.detailData.course_id;
        return {
          params: params
        }
      },
      /*
       * 查询教师数据
       */
      getQueryMemberListType(){ 
        this.axios.post(`${this.common.basePath}/participant/members/type`,{types: [2,4], experiment_id: this.$route.params.id}).then((response) => {
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
        this.axios.post(`${this.common.basePath}/participant/members/group`,{types: [3], experiment_id: this.$route.params.id}).then((response) => {  
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
        if(!data) return []; 
        let convertData = [];
        for(let i in data){ 
          convertData.push({
            teamName:   i,
            cMembers:   data[i],
            isShowMore: false,
          });  
        } 
        return convertData;
      },
      /*
       * 查询实验室列表
       */
      getQuerylabList(){ 
        this.axios.get(`${this.common.basePath}/lab/list`,'').then((response) => {
          this.labList = response.data.data; 
          this.supplementClassForm.id = this.labList.rows ? this.labList.rows.length ? this.labList.rows[0].id : null : null;
          // this.getQuerySelectClass();
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /*
       * 查询预约教室
       */
      getQuerySelectClass(formName){  
        if(!formName){
          this._selectClassAxios();
        }else{
          this.$refs[formName].validate((valid) => {
            if (valid) { 
              this._selectClassAxios();
            } else { 
              return false;
            }
          }); 
        } 
      }, 
      _selectClassParams(){  
        return { //预约教室的查询条件 
          sTime:    this.supplementClassForm.sTime ? this.supplementClassForm.sTime.getTime() : null,
          eTime:    this.supplementClassForm.eTime ? this.supplementClassForm.eTime.getTime() : null,
          b_index:  this.supplementClassForm.b_index,
          e_index:  this.supplementClassForm.e_index,
          id:       this.supplementClassForm.id,
          size:     this.supplementClassForm.size,  
        }
      },
      _selectClassAxios(){   
        this.axios.post(`${this.common.basePath}/lab/select/class`, this._selectClassParams()).then((response) => {
          this.selectClassData = this._selectClassDataAddKey(response.data.data); 
        }).catch((error) => {
          this.$message.error(error); 
        });   
      },
      /*
       * 给课程添加一个key
       */
      _selectClassDataAddKey(data){
        data.forEach((item) => {
          item.isChecked = false;
        });
        return data;
      },
      /*
       * 添加教师
       */
      addTeacherMember(type){  
        this.memberListData = type == 2 ? this.memeberCourseTeaherListData : this.memeberCourseTutorsListData; 
        this.memberDialog = true;
        this.memberBatchForm.type = type;
        this.$refs.memberSearchForm ? this.$refs.memberSearchForm.resetFields() : '';
        this.getQueryMemberListByCourseId(type);
        this.$refs.memberTable ? this.$refs.memberTable.clearSelection() : '';
        
      },
      /*
       * 根据分组添加学生
       * @params {string} groupNum 分组识别
       */
      addStudentMember(groupNum){
        this.memberListData = this.memeberCourseStudentListData;
        this.memberDialog = true;
        this.memberBatchForm.group_num = groupNum;
        this.memberBatchForm.type = 3;
        this.$refs.memberSearchForm ? this.$refs.memberSearchForm.resetFields() : '';
        this.getQueryMemberListByCourseId(3);
        this.$refs.memberTable ? this.$refs.memberTable.clearSelection() : '';
      },
      handleSelectionChange(val){
        this.memberBatchForm.member_id = [];
        val.forEach((item) => {
          this.memberBatchForm.member_id.push(item.id)
        })
      },
      /**
       * 指定表单选中的值为id
       * @return {[type]} [description]
       */
      getTableRowKeys(item){
        return  item.id;
      },
      /*
       * 保存新增成员
       */
      submitBatch(){
        if(!this.memberBatchForm.member_id.length) {this.$message.error('请选择成员'); return false;}
        this.axios.post(`${this.common.basePath}/participant/add/batch`,this.memberBatchForm).then((response) => {
          // ---------- 不是学生 ----------
          if(this.memberBatchForm.type != 3) 
            this.getQueryMemberListType();
          else 
            this.getQueryFaculty(); 

          this.getQueryMemberListByCourseId(this.memberBatchForm.type);
          this.memberDialog = false;
          this.$message.success(response.data.meta.message);
          this.loginAccountIsRole();
        }).catch((error) => {
          this.$message.error(error);  
          this.memberDialog = false;
          this.loginAccountIsRole();
        });
      },
      /*
       * 编辑实验
       */
      submitTest(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/experiment/${this.paramId}`,this.submitForm).then((response) => {
              this.getQueryDetail(true);
              this.editTestDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.editTestDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 提交报告
       */
      submitReport(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/task/save/report`,this.reportTaskForm).then((response) => {
              this.getQueryTaskList();
              this.reportTaskDialog = false; 
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.reportTaskDialog = false; 
            }); 
          } else { 
            return false;
          }
        });
      },
      /**
       * 模板添加任务
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitBase(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/baseTask/build`,this.baseTaskForm).then((response) => {
              this.getQueryTaskList();
              this.reportTaskDialog = false;
              this.baseTaskDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.reportTaskDialog = false;
              this.baseTaskDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 查询实验任务列表
       */
      getQueryTaskList(){
        this.axios.get(`${this.common.basePath}/task`,{params: {experiment_id: this.$route.params.id}}).then((response) => { 
          this.taskListData = response.data.data;
          this._totalScore(response.data.data)
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 统计得分占比已经占过的总数,计算出剩余能占比的数
       * @return {[type]} [description]
       */
      _totalScore(data){ 
        if(data){
          let score = 0;
          if(data.rows){
            data.rows.forEach( (item) => {
              this.totalScore += parseInt(item.score); 
            })
            this.surplusTotalScore = 100 - score;
          }
        }
      },
      /*
       * 跳转任务详情页 
       */
      goToTaskPape(itemTask){ 
        switch(itemTask.type){
          case 1: //实验任务详情
            this.$router.push({name: 'ExercisesTaskDetail', params: {experiment_id: this.$route.params.id, task_id: itemTask.id}});
            break;
          case 2: // 报告详情
            this.$router.push({name: 'ReportDetail', params: {id: itemTask.id}});
            break;
          case 3: // 考情任务详情
            this.$router.push({name: 'AttendanceTaskDetail', params: {task_id: itemTask.id, experiment_id: this.$route.params.id}});
            break;
          case 4: //问卷任务详情
            this.$router.push({name: 'QuestionnaireTaskDetail', params: {id: itemTask.id}});
            break;
            
        }
      },
      submitAttendance(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/task`,this.attendanceTaskForm).then((response) => {
              this.getQueryTaskList();
              this.attendanceTaskDialog = false;
              this.$message.success(response.data.meta.message);
            }).catch((error) => {
              this.$message.error(error);
              this.attendanceTaskDialog = false;
            }); 
          } else { 
            return false;
          }
        });
      },
      /*
       * 查询留言板
       * type为1表示课程，2表示实验
       */
      getMessageList(){ 
        this.axios.get(`${this.common.basePath}/m_massage`, {params: {associated_object: this.$route.params.id, type: 2,pageSize:this.pageSize,pageNum:this.pageNum}}).then((response) => {
           this.messageListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      submitMessage(formName){ 
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/m_massage`,this.messageForm).then((response) => {
              this.getMessageList();  
              this.$refs[formName].resetFields();
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
            this.$message.success(response.data.meta.message);
            this.getQueryDetail()
          }).catch((error) => {
            this.$message.error(error);  
          }); 
        }).catch(() => {
                   
        }); 
      },
      /*
       * 上传附件的回调
       */
      uploadSuccess(keyName, response){ 
        let ao_type = 3; 
        let params = {
          name:               response.name,
          path:               response.path,
          associated_object:  this.$route.params.id,
          ao_type:            ao_type,
        }
        this.axios.post(`${this.common.basePath}/c_literature`,params).then((response) => {
          this.getQueryDetail(); 
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      }, 
      /*
       * 删除指定Id实验安排
       */
      deleteLBespeakRecord(id){  
        this.axios.delete(`${this.common.basePath}/l_bespeak_record/reject/${id}`, '').then((response) => {
          this.$message.success(response.data.meta.message);
          this.getLBespeakRecordList()
        }).catch((error) => {
          this.$message.error(error);  
        });  
      }, 
      /*
       * 根据指定Id删除成员
       */
      deleteMember(item, type){
        this.axios.patch(`${this.common.basePath}/participant/delete/${item.id}`, '').then((response) => {
          type == 3 ? this.getQueryFaculty() : this.getQueryMemberListType(); 
          this.getQueryMemberListByCourseId(type);
          this.$message.success(response.data.meta.message);
          this.loginAccountIsRole();
        }).catch((error) => {
          this.$message.error(error);  
        }); 
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){
        this.memberSearchForm.pageNum = val;
        this.getQueryMemberListByCourseId(this.memberBatchForm.type)
        
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        this.memberSearchForm.pageSize = val;
        this.getQueryMemberListByCourseId(this.memberBatchForm.type);
      },
      uploadReportSuccess(response){
        this.reportTaskForm.task_files = JSON.stringify(response);
      },
      deleteTask(item){
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.patch(`${this.common.basePath}/task/delete/${item.id}`, '').then((response) => {
            this.$message.success(response.data.meta.message);
            this.getQueryTaskList();
          }).catch((error) => {
            this.$message.error(error);  
          }); 
        }).catch(() => {
                   
        }); 
      },
      supplementClassShow(){
        this.supplementClassDialog = true;
        this.getQuerySelectClass();
      },
      /*
       * 预约教室 
       */
      reserveClass(){ 
        // -------------- 组装Id ----------------
        this.ids = []; 
        this.selectClassData.forEach((item) => {
          if(item.isChecked) this.ids.push(item.id);
        });
 
        if(!this.ids.length) { this.$message.warning('请选择要预约的教室'); return false;}
        let reserveForm = {
          ids:      this.ids,
          sTime:    this.supplementClassForm.sTime,
          eTime:    this.supplementClassForm.eTime,
          b_index:  this.supplementClassForm.b_index,
          e_index:  this.supplementClassForm.e_index, 
          reason:   '无',
          experiment_id: this.$route.params.id,
          owner_id:      sessionStorage.getItem('Access-Key'),
        }
        this.axios.post(`${this.common.basePath}//lab/reserve/repair`, reserveForm).then((response) => {
          this.$message.success(response.data.meta.message);  
          this.getLBespeakRecordList();
          this.supplementClassDialog = false;
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      showMoreMember(item){ 
        item.isShowMore = !item.isShowMore;
      },
      /**
       * [goToStudentResister description]
       * @return {[type]} [description]
       */
      goToStudentResister(){
        if(this.detailData.etype == 1){ //个人实验
          this.$router.push({name: 'TestPersonalStudentResister', params: {id: this.paramId, courseId: this.detailData.course_id}})
        }else{ //小组实验
          this.$router.push({name: 'TestGroupStudentResister', params: {id: this.paramId, courseId: this.detailData.course_id}})
        } 
      },
      /*
       * 获取当前账号有没有自己想要的角色Id
       * @params {string} roleId 角色Id
       */
      loginAccountIsRole(){
        this.isExistTeacher = false;
        this.axios.get(`${this.common.basePath}/participant/type`,{params: {experiment_id: this.paramId}}).then((response) => { 
          if(response.data.data){ 
            response.data.data.forEach((item) => {
              // 1, "课程组长"  2, "任课教师" 3, "学生", 4, "助教"
              if(item == '2' || item == '4'){ 
                this.isExistTeacher = true;
              } 
            });
          }
        }).catch((error) => {
          this.$message.error(error); 
        }); 
      },
      /**
       * 显示任务
       * @param  {[type]} type  1 习题 2报告,3考勤,4评价
       * @return {[type]}      [description]
       */
      taskShow(type){ 
        this.$refs.baseTaskForm ? this.$refs.baseTaskForm.resetFields() : '';
        let template = this.detailData.template;
        this.baseTaskType = type; 
        if(template){ //有模板时显示弹框

          // --------- 没有任务模板时，直接跳转到自定义表单 -----------
          if(!this.baseExercisesTaskList.rows.length && type == 1)
            return this.$router.push({name: 'ExerciseRequest', params: {id: this.$route.params.id}})
          if(!this.baseEvaluateTaskList.rows.length && type == 4)
            return this.$router.push({name: 'CreateQuestionnaire', params: {id: this.$route.params.id}})

          this.baseTaskDialog = true; 
        }else{
          if(type == 1) {
            this.$router.push({name: 'ExerciseRequest', params: {id: this.$route.params.id}})
          }else if(type == 4){
            this.$router.push({name: 'CreateQuestionnaire', params: {id: this.$route.params.id}})
          }
        }  
      }
    }
  }
</script>
<style lang="less">
  .person-group-student-add{
    border: 1px solid #ccc;
    height: 40px;
    width: 40px;
    text-align: center;
    line-height: 47px;
    i{
      font-size: 26px;
      color: #6e6d6d;
    }
  }
</style>