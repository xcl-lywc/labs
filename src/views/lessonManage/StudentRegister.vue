/*********** 学生花名册 ************/
<template>
  <div class="content-wrap-box">  
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonListDetail', params: {id: $route.params.id} }">课程详情</el-breadcrumb-item> 
        <el-breadcrumb-item>学生花名册</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-form ref="searchForm" :inline="true" :model="searchForm" label-width="100px" > 
          <el-form-item 
            label="学号：" 
            prop="account" >
            <el-input v-model="searchForm.account"></el-input>
          </el-form-item>  
          <el-form-item 
            label="系别：" 
            prop="faculty" > 
            <el-cascader
              v-model="searchForm.faculty"
              filterable
              :options="facultyOptions"
              :props="facultyProps" 
              :change-on-select="true" 
              :show-all-levels="false"
             >
             <!--  @change="facultyvalChange" -->
            </el-cascader> 
          </el-form-item> 
          <el-form-item label="入校时间：">
            <el-date-picker
              v-model="searchForm_dateTE"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>  
          <br/>
          <el-form-item 
            label="姓名：" 
            prop="user_name" >
            <el-input v-model="searchForm.user_name"></el-input>
          </el-form-item>  
          <el-form-item> 
            <el-button 
              :disabled="!common.checkAuthority('StudentRegister_QueryList', true)"
              type="primary" @click="getQueryList">
              {{common.checkAuthority('StudentRegister_QueryList') ? common.checkAuthority('StudentRegister_QueryList').name : ''}}
            </el-button>
            <el-button type="primary" @click="clearSearchForm">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table 
          ref="multipleTable"
          :data="studentListData.rows"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleStudentMemberSelectionChange">
          <el-table-column 
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            align="center"
            label="工/学号" 
            prop="account"> 
          </el-table-column>
          <el-table-column 
            align="center"
            prop="user_name"
            label="姓名" >
          </el-table-column>
          <el-table-column
            width="50"
            align="center"
            prop="sex_str"
            label="性别"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="130"
            align="center"
            prop="create_time"
            label="入校时间"
            show-overflow-tooltip>
            <template slot-scope="scope"> 
              {{common._convertDate(scope.row.admission_time, 'yyyy年MM月dd日')}}
            </template>
          </el-table-column>
          <el-table-column
            width="200px"
            align="center"
            prop="facultyName"
            label="院系"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            prop="phone_num"
            label="手机"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            align="center"
            prop="mail"
            label="邮箱"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            width="60"
            align="center"
            prop="code"
            label="成绩"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column 
            align="center" 
            label="操作"
            width="200px"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button 
                :disabled="!common.checkAuthority('StudentRegister_QueryScoreSingle', true)"
                type="primary" size="mini" 
                @click=" $router.push({name: 'ScoreResult', params: {member_id: scope.row.id, course_id: $route.params.id}}) ">
                  {{common.checkAuthority('StudentRegister_QueryScoreSingle') ? common.checkAuthority('StudentRegister_QueryScoreSingle').name : ''}}
                </el-button>
              <el-button style="display: none;" type="primary" size="mini" @click="editMember(scope.row)">编辑</el-button>
              <el-button 
                :disabled="!common.checkAuthority('StudentRegister_Delete', true)"
                type="danger" size="mini" @click=" delMember([scope.row.id])">
                  {{common.checkAuthority('StudentRegister_Delete') ? common.checkAuthority('StudentRegister_Delete').name : ''}}
                </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart10"> 
          <div>
            <!-- 导入学生花名册 -->
            <el-button 
              class="fl marr10"
              :disabled="!common.checkAuthority('StudentRegister_ImportStudentRegister', true)"
              type="primary" @click=" pageNum=1;importType('judge') ">
                {{common.checkAuthority('StudentRegister_ImportStudentRegister') ? common.checkAuthority('StudentRegister_ImportStudentRegister').name : ''}}
            </el-button>
            <!-- 添加学员 -->
            <el-button 
              :disabled="!common.checkAuthority('StudentRegister_Add', true)"
              type="primary" @click=" studentDialog = true; $refs.memberStudentTable ? $refs.memberStudentTable.clearSelection() : '' ">
              {{common.checkAuthority('StudentRegister_Add') ? common.checkAuthority('StudentRegister_Add').name : ''}}
            </el-button>
            <!-- 删除学员 -->
            <el-button 
              :disabled="!common.checkAuthority('StudentRegister_Delete', true)"
              type="danger" @click= " statisticsDeleteMemeber(); delMember(studentSelectAllIds) ">
              {{common.checkAuthority('StudentRegister_Delete') ? common.checkAuthority('StudentRegister_Delete').name : ''}}
            </el-button>
          </div>
          <!-- 分页 -->
          <el-pagination   
             class="fr "
             background
             @size-change="handleSizeChange($event, 'studentList')"
             @current-change="handleCurrentChange($event, 'studentList')"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="studentListData.total">
          </el-pagination> 
        </div>
      </div> 
    </div>
    <!-- 添加成员 -->
    <el-dialog 
      width="70vw"
      title="添加学生" 
      :visible.sync="studentDialog">
        <el-form ref="allMemberForm" :inline="true" :model="allMemberForm" label-width="60px" >
          <el-form-item 
            label="姓名：" 
            prop="name" >
            <el-input v-model="allMemberForm.name"></el-input>
          </el-form-item>  
          <el-form-item 
            label="工号：" 
            prop="account" >
            <el-input v-model="allMemberForm.account"></el-input>
          </el-form-item>  
          <el-form-item>
            <el-button type="primary" @click="getQueryAllMemberList">搜索</el-button>
            <el-button type="primary" @click="$refs.allMemberForm ? $refs.allMemberForm.resetFields() : '' ">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border 
          ref="memberStudentTable"
          :data="memberListData.rows"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleAllMemberSelectionChange">
          <el-table-column
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
          <el-pagination  
             class="fr "
             background
             @size-change="handleSizeChange($event, 'memberList')"
             @current-change="handleCurrentChange($event, 'memberList')"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="memberListData.total">
          </el-pagination> 
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="studentDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitBatch('studentBatchForm')">保存</el-button>
        </div>
    </el-dialog>

    <!-- 导入学生花名册dialog -->
    <el-dialog :visible.sync="dialogImportVisible" title="导入学生花名册">
      <el-form>
        <el-form-item label="上传表格文件：">
          <!-- 导入学生花名册 -->
          <upload 
            :url="`/member/import/${$route.params.id}`"
            :isDisabled="!common.checkAuthority('StudentRegister_ImportStudentRegister', true)"
            :fileTypes="['xls','xlsx']"
            size="middle"
            :buttonText="common.checkAuthority('StudentRegister_ImportStudentRegister') ? common.checkAuthority('StudentRegister_ImportStudentRegister').name : ''" 
            @uploadSuccess="importSheet">
          </upload>
        </el-form-item>
        <el-form-item label="" label-width="110px">
          <el-button type="text" @click="downloadTemplate" icon="el-icon-download">下载模版</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 处理数据dialog（处理用户的校正、冲突以及查看错误用户信息） -->
    <el-dialog :visible.sync="dialogTabVisible" title="处理学生数据" width="1250px" @close="delcache"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane label="错误导入" name="3">
          <span>系统获取表格信息检测到数据缺失、数据格式错误或者无法处理的异常，请查证下面的信息，补全修改后保存。</span>
          <el-table
            :data="importTableData.rows"
            stripe
            min-height='500'
            style="width: 100%">
            <el-table-column align="center" width="200" label="工/学号" prop="account"></el-table-column>
            <el-table-column align="center" prop="user_name" width="120" label="姓名"></el-table-column>
            <el-table-column width="60" align="center" prop="sex_str" label="性别"show-overflow-tooltip></el-table-column>
            <el-table-column width="150" align="center" prop="create_time" label="入校时间" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{common._convertDate(scope.row.admission_time, 'yyyy年MM月dd日')}}
              </template>
            </el-table-column>
            <el-table-column width="200" align="center" prop="facultyName" label="院系" show-overflow-tooltip></el-table-column>
            <el-table-column width="120" align="center" prop="phone_num" label="手机" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="100" prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
            <el-table-column width="60" align="center" prop="code" label="成绩" show-overflow-tooltip></el-table-column>
            <el-table-column width="200" align="center" prop="message" label="信息" show-overflow-tooltip></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="重复导入" name="2">
          <span>当前课程已有以下学生；请检查用户信息是否发生变化，如果变化，请替换；如果未发生变化，请保留；如果不确定，可以不处理，待与学生核对信息后，根据实际情况处理。</span>
          <el-table
            :data="importTableData.rows"
            stripe
            tooltip-effect="dark"
            style="width: 100%">
            <el-table-column type="expand" label="#" align="center">
              <template slot-scope="props">
                <p class="conflicting-title">{{props.row.user_name}}<span>的冲突数据列表：</span></p>
                <el-table
                  :data="props.row.conflictingUsers"
                  border
                  tooltip-effect="dark"
                  row-class-name="warning-row"
                  style="width: 100%">
                  <el-table-column label="序号" type="index" width="55" fixed></el-table-column>
                  <el-table-column align="center" width="200" label="工/学号" prop="account"></el-table-column>
                  <el-table-column align="center" prop="user_name" width="120" label="姓名"></el-table-column>
                  <el-table-column width="60" align="center" prop="sex_str" label="性别"show-overflow-tooltip></el-table-column>
                  <el-table-column width="150" align="center" prop="create_time" label="入校时间" show-overflow-tooltip>
                    <template slot-scope="scope"> 
                      {{common._convertDate(scope.row.admission_time, 'yyyy年MM月dd日')}}
                    </template>
                  </el-table-column>
                  <el-table-column width="200" align="center" prop="facultyName" label="院系" show-overflow-tooltip></el-table-column>
                  <el-table-column width="120" align="center" prop="phone_num" label="手机" show-overflow-tooltip></el-table-column>
                  <el-table-column align="center" width="100" prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
                  <el-table-column width="60" align="center" prop="code" label="成绩" show-overflow-tooltip></el-table-column>
                  <el-table-column width="200" align="center" prop="message" label="信息" show-overflow-tooltip></el-table-column>
                  <el-table-column label="操作" width="80" fixed="right">
                    <template slot-scope="scope">
                      <!-- <el-button type="default" size="mini" :disabled="!common.checkAuthority('UserList-detail', true)" @click="showUserDetail(scope.row)">查看</el-button> -->
                      <el-button type="success" size="mini" @click="resolved(scope.row,props.row.id)">替 换</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column align="center" width="200" label="工/学号" prop="account"></el-table-column>
            <el-table-column align="center" prop="user_name" width="100" label="姓名"></el-table-column>
            <el-table-column width="50" align="center" prop="sex_str" label="性别"show-overflow-tooltip></el-table-column>
            <el-table-column width="100" align="center" prop="create_time" label="入校时间" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{common._convertDate(scope.row.admission_time, 'yyyy年MM月dd日')}}
              </template>
            </el-table-column>
            <el-table-column width="180" align="center" prop="facultyName" label="院系" show-overflow-tooltip></el-table-column>
            <el-table-column width="100" align="center" prop="phone_num" label="手机" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="100" prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
            <el-table-column width="50" align="center" prop="code" label="成绩" show-overflow-tooltip></el-table-column>
            <el-table-column width="200" align="center" prop="message" label="信息" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="resolved(scope.row,scope.row.id)">保 留</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="待导入" name="1">
          <span>请注意检查学号、邮件等信息格式是否错误。</span>
          <el-table
            :data="importTableData.rows"
            stripe
            style="width: 100%"
            ref="personImportMultipleTable"
            :row-key="getRowImportKeys"
            tooltip-effect="dark"
            @selection-change="handleSelectionImportChange">
            <el-table-column type="selection" width="50" fixed :reserve-selection="true" align="center"></el-table-column>
            <el-table-column align="center" width="200" label="工/学号" prop="account"></el-table-column>
            <el-table-column align="center" prop="user_name" width="120" label="姓名"></el-table-column>
            <el-table-column width="60" align="center" prop="sex_str" label="性别"show-overflow-tooltip></el-table-column>
            <el-table-column width="150" align="center" prop="create_time" label="入校时间" show-overflow-tooltip>
              <template slot-scope="scope"> 
                {{common._convertDate(scope.row.admission_time, 'yyyy年MM月dd日')}}
              </template>
            </el-table-column>
            <el-table-column width="150" align="center" prop="facultyName" label="院系" show-overflow-tooltip></el-table-column>
            <el-table-column width="120" align="center" prop="phone_num" label="手机" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" width="100" prop="mail" label="邮箱" show-overflow-tooltip></el-table-column>
            <el-table-column width="60" align="center" prop="code" label="成绩" show-overflow-tooltip></el-table-column>
            <el-table-column width="200" align="center" prop="message" label="信息" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showPersonDialog(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="primary" size="mini" @click="keep" class="mart10" :disabled="this.adjustData.length===0?true:false">批量保存</el-button>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">  
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="importTableData.total"
          @size-change="pageSizeImportChange"
          @current-change="pageCurrentImportChange">
        </el-pagination>
      </span>
    </el-dialog>

    <!-- 需校正学生的编辑dialog -->
    <el-dialog :visible.sync="dialogPersonVisible" title="学生"  width="800px">
      <el-form ref="personForm" :model="personForm" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="user_name"><el-input v-model="personForm.user_name"></el-input></el-form-item>
            <el-form-item label="工号/学号：" prop="account"><el-input v-model="personForm.account" disabled></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像：" prop="head_img">
              <!-- <upload-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :avatar="personForm.head_img" :size="'mini'"></upload-avatar> -->
              <crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="personForm.head_img"></crop-avatar>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级：" prop="grade_num">
              <el-input v-model="personForm.grade_num" :type="typeof(personForm.grade_num)==='number'?'number':''"><template slot="append">届</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级：" prop="class_num">
              <el-input v-model="personForm.class_num" :type="typeof(personForm.class_num)==='number'?'number':''"><template slot="append">班</template></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <el-select v-model="personForm.sex" class="fill-width">
                <el-option :value="1" label="男"></el-option>
                <el-option :value="2" label="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入校时间：" prop="admission_time">
              <el-date-picker v-model="personForm.admission_time" class="fill-width" value-format="timestamp" placeholder="请选择入学时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="院系：" prop="faculties_ids">
              <el-cascader :options="facultyOptions" :props="facultyProps" v-model="personForm.faculties_ids" change-on-select class="fill-width"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机：" prop="phone_num"><el-input-number v-model="personForm.phone_num" class="fill-width text-left-penetrate" :min="0" :controls="false"></el-input-number></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="mail"><el-input type="email" v-model="personForm.mail"></el-input></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介：" prop="sim_desc"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="personForm.sim_desc"></el-input></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogPersonVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPersonForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  import UploadAvatar from "../../components/UploadAvatar.vue"
  import CropAvatar from "../../components/CropAvatar.vue"
  export default {
    components:{   
      'upload':                upload,
      'upload-avatar':         UploadAvatar,
      'crop-avatar':           CropAvatar
    },
    data () {
      // 验证手机号码
      let checkPhoneNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码'));
        } else {
          if(/^1[34578]\d{9}$/.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的手机号码'));
          }
        }
      };
      return {
        courseId:this.$route.params.id,
        //处理信息dialog的外层校正表格 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
        getRowImportKeys(row) {
          return row.num;
        },

        dialogImportVisible:false,
        dialogTabVisible:false,
        activeTabName:'3',
        importUserType:3,
        importTableData: {
          rows: [],
          total: 0
        },
        adjustData:[],//需校正的数据
        pageNum:1,
        pageSize:10,

        studentIds:             [], //本页被选中学生Id数组  
        studentSelectAllIds:    [], //所有被选中的学生Id数组  
        studentDialog:      null,
        searchForm_dateTE:  null,
        searchForm: { 
          course_id: this.$route.params.id,
          account:   null,
          type:      3,
          faculty:   null,
          begin_time:null,
          end_time:  null,
          user_name: null, 
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        },  
        facultyOptions: [], //院系树
        facultyProps: {
          value:    'id',
          label:    'faculty', 
          children: 'childrens',
        },
        studentListData:     {total: 0, rows: []}, 
        memberDetail:        null,
        memberListData:      {total: 0, rows: []},
        allMemberForm:   {  
          type:       3,
          course_id:  this.$route.params.id,
          role_id:    5,
          name:       null,
          account:    null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        },
        studentBatchForm:{  //新增学生成员表单
          "course_id": this.$route.params.id,
          "type":      3,   //1、课程组长；2、任课教师；3、学生；4、助教
          "user_id":   [], 
        },  
        studentAddIds:    [], //新增所有被选中的学生Id数组  

        // 编辑需校正学生的信息弹框
        dialogPersonVisible: false,
        personForm: { 
          head_img:       null,
          user_name:      null,
          account:        null,
          sex:            null,
          admission_time: null,
          faculties_ids:  [],
          phone_num:      undefined,
          mail:           null,
          grade_num:      null,
          class_num:      null,
          sim_desc:       null,
        },
        rules: {
          user_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          account: [
            { required: true, message: '请输入工号/学号', trigger: 'blur' },
          ],
          faculties_ids: [
            { required: true, message: '请选择院系', trigger: 'change' },
          ],
          phone_num: [
            { required: true, validator: checkPhoneNum, trigger: 'blur' },
          ],
          mail: [
            { type: "email", message: '请输入正确的邮箱地址', trigger: 'blur' },
          ],
        },
      }
    },
    mounted(){
      this.getQueryList();
      this.getQueryFacultyTree();
      this.getQueryAllMemberList();
    },
    methods: {  
      /*
       * 查询学生列表， 
       */
      getQueryList(){    
        this.axios.get(`${this.common.basePath}/member`,{params: this._queryParams()}).then((response) => {
          this.studentListData = response.data.data;
          
          // ---------- 设置默认选中的数据 ---------
          this.$refs.multipleTable.clearSelection();
          this.$nextTick( () => { 
            this.studentSelectAllIds.forEach((itemId) => { 
              this.studentListData.rows.forEach( (item) =>{
                if(itemId == item.id){
                  this.$refs.multipleTable.toggleRowSelection(item,true);
                }
              });
              
            });
          })
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      _queryParams(){ 
        this.searchForm.begin_time = this.searchForm_dateTE ? this.searchForm_dateTE[0].getTime() : null;
        this.searchForm.end_time = this.searchForm_dateTE ? this.searchForm_dateTE[1].getTime() : null;
        let params = JSON.parse(JSON.stringify(this.searchForm));
        params.faculty = this.searchForm.faculty ? this.searchForm.faculty[this.searchForm.faculty.length -1] : null;
        return params;
      },
      /*
       * 查询人员列表
       */
      getQueryAllMemberList(){
        this.axios.post(`${this.common.basePath}/member/not/list`,this.allMemberForm).then((response) => {
          this.memberListData = response.data.data;
          if(!this.studentDialog) return false; 
          // ---------- 设置默认选中的数据 ---------
          this.$refs.memberStudentTable.clearSelection();
          this.$nextTick( () => {  
            this.studentBatchForm.user_id.forEach((itemId) => { 
              this.memberListData.rows.forEach( (item) =>{
                if(itemId == item.id){
                  this.$refs.memberStudentTable.toggleRowSelection(item,true);
                }
              });
              
            });
          })

        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询系别树
       */
      getQueryFacultyTree(){  
        this.axios.get(`${this.common.basePath}/faculty/tree`,'').then((response) => {
          // ------ 重组系别树，将最后一层没有数据的children去掉, 然后再给变量赋值 ----- 
          this._recombineFacultyTree(response.data.data); 

          this.facultyOptions = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      _recombineFacultyTree(facultyData){
        facultyData.forEach((item) => {
          if(!item.childrens){
           delete item.childrens;
          }else{
            this._recombineFacultyTree(item.childrens);
          }
        })  
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       * @param {string} type studentList为学生列表类型，memberList为所有成员列表 
       */
      handleCurrentChange(val, type){  
        if(type == 'studentList'){
          this.statisticsDeleteMemeber();
          this.searchForm.pageNum = val;
          this.getQueryList();
        }else{
          this.statisticsAddMemeber();
          this.allMemberForm.pageNum = val;
          this.getQueryAllMemberList();
        } 
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val, type){ 
        if(type == 'studentList'){
          this.statisticsDeleteMemeber();
          this.searchForm.pageSize = val;
          this.getQueryList();
        }else{
          this.statisticsAddMemeber();
          this.allMemberForm.pageSize = val;
          this.getQueryAllMemberList();
        } 
       },
      /*
       * 选中学生成员表格，获取选中的值
       */
      handleStudentMemberSelectionChange(val){  
        this.studentIds = [];    
        val.forEach((item) => { 
          this.studentIds.push(item.id);
        }); 
        // this.statisticsDeleteMemeber();
      },  
      /*
       * 选中所有成员表格获取选中值
       */
      handleAllMemberSelectionChange(val){
        this.studentAddIds = [];
        val.forEach((item) => {
          this.studentAddIds.push(item.id)
        })
       },
      /*
       * 获取级联选中值数组中的最后一个
       */
      facultyvalChange(val){ 
        this.searchForm.faculty = val[val.length-1];
       },
      /*
       * 编辑成员信息
       */
      editMember(row){
        this._getQueryMemberById(row);
       },
      _getQueryMemberById(row){
        this.axios.get(`${this.common.basePath}/member/${row.id}`,'').then((response) => {
          this.memberDetail = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 根据指定Id删除成员
       */
      delMember(ids){  

        this.axios.patch(`${this.common.basePath}/member/delete/batch`,{ids: ids}).then((response) => {
          // ------------ 总条数减去被删除的数据在除以每页条数，得到最后的页码如果小于当前页面,就查询被删除后数据的最大一页
          let pageNumA = (this.studentListData.total - this.studentSelectAllIds.length) / this.searchForm.pageSize
          if(pageNumA < this.searchForm.pageNum){
            if(pageNumA > parseInt(pageNumA)){
              this.searchForm.pageNum = parseInt(pageNumA) + 1;
            }else{
              this.searchForm.pageNum = parseInt(pageNumA)
            }
          }  
          this.studentSelectAllIds = [];
          this.getQueryList();
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      /*
       * 保存新增成员
       */
      submitBatch(){
        this.statisticsAddMemeber();
        if(!this.studentBatchForm.user_id.length) {this.$message.error('请选择成员'); return false;}
        this.axios.post(`${this.common.basePath}/member/add/batch`,this.studentBatchForm).then((response) => {
          this.getQueryList();
          this.studentDialog = false;
          this.$message.success(response.data.meta.message);
        }).catch((error) => {
          this.$message.error(error);  
          this.studentDialog = false;
        });
      },
      /*
       * 导入学生花名册（上传附件的回调）
       */
      importSheet(response){
        this.$message.success('上传成功');
        this.getQueryList();
        this.dialogImportVisible = false
        this.importType("judge");
      },
      clearSearchForm(){
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : '';
        this.searchForm_dateTE = null;
      },
      // 统计删除人员的Id数组
      statisticsDeleteMemeber () { 
        if(this.studentSelectAllIds.length <= 0){
          this.studentSelectAllIds = this.studentIds;
        }else {
          // 本页被选中的Id，在所有被选中的数据中没有的话，就添加
          this.studentIds.forEach( (idA) =>{
            let isExit = false;
            this.studentSelectAllIds.forEach( (idB) => {
              if(idA == idB)
                isExit = true;
            })
            if(!isExit){
              this.studentSelectAllIds.push(idA);
            }
          });

          // ------ 本页数据，在所有被选中的数组中有数据 ----
          this.studentListData.rows.forEach((item) => {
            this.studentSelectAllIds.forEach( (idA, index) => { 
              if(item.id == idA){ 
                // -------- 所有被选中的数据，存在本页数据，
                // --------但是在本页选中的数据中不存在，那么就删除此Id
                let isExit = false;
                this.studentIds.forEach((idB) => {
                  if(idA == idB){ 
                    isExit = true;
                  }
                });
                if(!isExit){ 
                  this.studentSelectAllIds.splice(index, 1)
                }
              }
            });
          });
        }
      },
      // 统计新增人员的Id数组
      statisticsAddMemeber () { 
        if(this.studentBatchForm.user_id.length <= 0){
          this.studentBatchForm.user_id = this.studentAddIds;
        }else {
          // 本页被选中的Id，在所有被选中的数据中没有的话，就添加
          this.studentAddIds.forEach( (idA) =>{
            let isExit = false;
            this.studentBatchForm.user_id.forEach( (idB) => {
              if(idA == idB)
                isExit = true;
            })
            if(!isExit){
              this.studentBatchForm.user_id.push(idA);
            }
          });

          // ------ 本页数据，在所有被选中的数组中有数据 ----
          this.memberListData.rows.forEach((item) => {
            this.studentBatchForm.user_id.forEach( (idA, index) => { 
              if(item.id == idA){ 
                // -------- 所有被选中的数据，存在本页数据，
                // --------但是在本页选中的数据中不存在，那么就删除此Id
                let isExit = false;
                this.studentAddIds.forEach((idB) => {
                  if(idA == idB){ 
                    isExit = true;
                  }
                });
                if(!isExit){ 
                  this.studentBatchForm.user_id.splice(index, 1)
                }
              }
            });
          });
        }
      },

      /**
       *学生花名册导入之前判断是否有异常学生数据
       *role_id为null，展示导入学生花名册dialog；不为null时，展示处理数据dialog
       *judge 判断；refresh 刷新、请求
       */
      importType(type){
        if(type=='judge'){
          this.axios.get(`${this.common.basePath}/member/import/cache`,{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType,courseId:this.courseId}}).then((response) => {
            if(response.data.data.role_id){
              this.dialogTabVisible=true;
              this.$refs.personImportMultipleTable ? this.$refs.personImportMultipleTable.clearSelection():'';
              this.importTableData.rows = response.data.data.rows;
              this.importTableData.total = response.data.data.total;             
            }else{
              this.showImport();
            }
          }).catch((error) => {
            this.$message.error(error);  
          });
        }else if(type=='refresh'){
          this.axios.get(`${this.common.basePath}/member/import/cache`,{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType,courseId:this.courseId}}).then((response) => {
            this.importTableData.rows = response.data.data.rows;
            this.importTableData.total = response.data.data.total;
          }).catch((error) => {
            this.$message.error(error);  
          });
        }
        
      },
      /*
       *打开处理数据dialog
       */
      openDataDialog(){
        
      },
      /**
       * 展示导入功能dialog
       * @return {[type]} [description]
       */
      showImport() {
        this.dialogImportVisible = true
      },
      /**
       * 处理数据dialog的tab切换
       */
      handleTabClick(tab){
        console.log(tab.name)
        if(tab.name==='1'){
          this.$refs.personImportMultipleTable.clearSelection();
          this.pageNum=1;
          this.importUserType = 1;
          this.importType("refresh");
        }else if(tab.name==='2'){
          this.pageNum=1;
          this.importUserType = 2;
          this.importType("refresh");
        }else if(tab.name==='3'){
          this.pageNum=1;
          this.importUserType = 3;
          this.importType("refresh");
        }
      },
      /**
       * 处理数据dialog的外层表格分页功能
       */
      pageSizeImportChange(val) {
        this.pageSize = val
        this.importType("refresh")
      },
      pageCurrentImportChange(val) {
        this.pageNum = val
        this.importType("refresh")
      },
      /**
       *解决冲突数据
       */
      resolved(val,id){ 
        let arr  = [];
        let form = val;
        form.conflictingUsers = null;
        form.id = id;
        arr.push(form)
        this.axios.post(`${this.common.basePath}/member/import/add/${this.courseId}`,arr).then((response) => {
          this.$message.success('成功解决！');  
          this.importType("refresh");
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       *校正学生花名册多选功能
       */
      handleSelectionImportChange(val) {
        this.adjustData = val;
      },
      /*
       *批量保存 校正学生花名册
       */
      keep(){
        this.axios.post(`${this.common.basePath}/member/import/add/${this.courseId}`,this.adjustData).then((response) => {
          this.$message.success('校正成功！');  
          this.importType("refresh");
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       *清除学生花名册信息的高速缓存
       */
      delcache(){ 
        this.$confirm('是否清除学生花名册信息的高速缓存？', '提示', {
          confirmButtonText: '清除',
          cancelButtonText: '暂不清除',
          type: 'warning'
        }).then(() => {
          
          this.axios.get(`${this.common.basePath}/member/import/delcache/${this.courseId}`,{params:{}}).then((response) => {
            this.getQueryList();
            this.$message({
              type: 'success',
              message: '清除缓存成功!'
            });
          }).catch((error) => {
            this.$message.error(error);  
          });
        }).catch(() => {this.getQueryList();});
        
      },
      /**
       * 点击编辑需要校正的学生
       * @param  {[type]} row  [description]
       * @return {[type]}      [description]
       */
      showPersonDialog(row) {

        this.dialogPersonVisible = true
        // this.personForm.head_img = row.head_img

        row.faculties_ids?'':row.faculties_ids = [];
        this.personForm = JSON.parse(JSON.stringify(row))
        console.log(this.personForm.head_img)
      },
      uploadAvatarSuccess(val) {
        this.personForm.head_img = val.path
      },
      /**
       * 点击提交需校正学生的编辑信息
       * @return {[type]} [description]
       */
      submitPersonForm() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/member/cache/update/${this.courseId}`,
          data: this.personForm,
        }
        this.$refs.personForm.validate((valid) => {
          if(valid) {
            config.data.faculty = this.personForm.faculties_ids[this.personForm.faculties_ids.length - 1]
            delete config.data.faculties_ids
            this.axios(config).then((response) => {
              this.dialogPersonVisible = false
              this.$message.success(response.data.meta.message)
              this.importType("refresh");
            }).catch((errorMsg) => {
              this.dialogPersonVisible = false
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
      /**
       * 下载学生信息导入模版
       * @author chuanlin.Xiao
       * @date   2019-11-08T15:37:26+0800
       * @return {[type]}                      [description]
       */
      downloadTemplate(){

        this.axios.get(`${this.common.basePath}/home/import/template`,{responseType: "blob",params:{}}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('下载成功')
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
    }
  }
</script>
<style lang="less">
  
</style>