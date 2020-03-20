<!-- 实验管理-实验习题 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>实验习题</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" ref="contentWrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
          <el-form-item label="实验课程：" prop="course_id">
            <el-select v-model="searchForm.course_id" @change="courseChange">
              <el-option v-for="(item, index) in courseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验名称：" prop="experiment_id">
            <el-select v-model="searchForm.experiment_id">
              <el-option v-for="(item, index) in experimentListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="状态：" prop="reportStatus" style="display: none;">
            <el-select v-model="searchForm.reportStatus" placeholder="请选择">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> 
          <el-form-item>
            <el-button 
              :disabled="!common.checkAuthority('ExperimentalExercises_QueryList', true)"
              type="primary" @click="getQueryList()">
              {{common.checkAuthority('ExperimentalExercises_QueryList') ? common.checkAuthority('ExperimentalExercises_QueryList').name : ''}}
            </el-button>
            <el-button type="primary" @click="resetSearchForm">置空</el-button>
          </el-form-item>
        </el-form> 
        <!-- 内容 -->
        <el-table  
          :data="listData.rows"
          tooltip-effect="dark" > 
          <el-table-column 
            label="习题名称" 
            prop="name"> 
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="150px" 
            prop="user_name"
            label="截止时间" >
            <template slot-scope="scope">
              {{common._convertDate(scope.row.end_time, 'yyyy年MM月dd日')}}
            </template>
          </el-table-column>
          <el-table-column
            width="150px" 
            prop="sex"
            label="状态"
            show-overflow-tooltip>
            <template slot-scope="scope">
              {{reportStatus(scope.row.solution_status)}}
            </template>
          </el-table-column>
          <el-table-column
            width="150px" 
            prop="solution_score"
            label="得分"
            show-overflow-tooltip> 
          </el-table-column> 
          <el-table-column   
            label="操作"
            width="80px"
            show-overflow-tooltip>
            <template slot-scope="scope"> 
              <div> 
                <el-button 
                  :disabled="!common.checkAuthority('ExperimentalExercises_Answer', true)"
                  type="primary" size="mini" 
                  v-if="scope.row.solution_status == 1" 
                  @click="showPaper(scope.row)">
                  {{common.checkAuthority('ExperimentalExercises_Answer') ? common.checkAuthority('ExperimentalExercises_Answer').name : ''}}
                </el-button> 
                 
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart10"> 
          <div></div>
          <!-- 分页 -->
          <el-pagination  
             :disabled="!common.checkAuthority('ExerciseScore_QueryList', true)"
             class="fr "
             background
             @size-change="handleSizeChange($event)"
             @current-change="handleCurrentChange($event)"
             :current-page="common.elementPagination.pageNum"
             :page-sizes="common.elementPagination.pageSizes"
             :page-size="common.elementPagination.pageSizeDefault"
             layout="total, sizes, prev, pager, next"
             :total="listData.total">
          </el-pagination> 
        </div>
      </div> 
    </div>

    <!-- 答题 -->
    <el-dialog 
      width="70vw"
      title="开始答题" 
      :closeOnClickModal="false"
      :showClose="isPaperDialogShowClose"
      :visible.sync="paperDialog" >
        <exercises-respondence 
          @isPaperDialogShowClose="isPaperDialogShowCloseFun" 
          @closePaperDialog="closePaperDialogFun" 
          v-if="activeAnswerItem" 
          :paperId="activeAnswerItem.associated_object" 
          :taskId="activeAnswerItem.id"></exercises-respondence>
        <div slot="footer" class="dialog-footer">
          <el-button @click="paperDialog = false">取 消</el-button> 
        </div>
    </el-dialog>
  </div>
</template>
<script>
  // 答题
  import exercisesRespondence from '../lessonManage/exercise/ExercisesRespondence.vue';
  export default { 
    data () {
      return {
        scrollLoadSw: true, //滚动加载开关
        paperDialog:  false, //试卷弹框
        isPaperDialogShowClose: true, //控制试卷弹框的关闭按钮
        dateTE:       null,
        searchForm:  { 
          course_id:     null, 
          experiment_id: null,
          reportStatus:  1,
          pageNum:       this.common.elementPagination.pageNumDefault,
          pageSize:      this.common.elementPagination.pageSizeDefault,
          student_id:    sessionStorage.getItem('Access-Key'),
        }, 
        statusOptions: [
          {label: '未完成', value: 1},
          {label: '已完成', value: 2},
          {label: '未打分', value: 3}, 
        ],
        listData:         {total: 0, rows: []},
        courseListData:   {total: 0, rows: []},
        experimentListData: {total: 0, rows: []}, 
        activeCourseId:   null,
        activeAnswerItem: null, //选中答题的数据
        
      }
    },
    watch:{   
    },
    created() { 
    },
    components:{  
      'exercises-respondence': exercisesRespondence,
    },
    mounted(){    

      //----- 初始化 ------- 
      this.getQueryList();
      this.getQueryCourseList(); 
    },
    methods: {
      reportStatus(cur_status){  
        if(cur_status){
          switch(cur_status){
            case 1: 
              return '未完成';
              break;
            case 2: 
              return '已完成';
              break;
            case 3: 
              return '未打分';
              break; 
          }
        }
       
      }, 
      /*
       * 查询课程列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(){  
        this.axios.get(`${this.common.basePath}/task/student/test`,{params: this.searchForm}).then((response) => {
          this.listData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询课程列表，
       */
      getQueryCourseList(){  
        this.axios.get(`${this.common.basePath}/course`,'').then((response) => {
           this.courseListData = response.data.data;  
        }).catch((error) => {
          this.$message.error(error);  
        });
      },   
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : ''; 
      },
      /*
       *  实验数据
       */
      getQueryExperimentList(courseId){  
        this.axios.get(`${this.common.basePath}/experiment`,{params: {course_id: courseId}}).then((response) => {
          this.experimentListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 课程改变实验跟着改变
       */
      courseChange(val){  
        // ------ 清空之前被选中的实验Id ----- 
        this.searchForm.experiment_id = null;

        this.getQueryExperimentList(val);
      },
      /*
       * 改变当前页码触发此事件
       * @param {number} val 当前页码
       */
      handleCurrentChange(val){ 
        this.searchForm.pageNum = val;
        this.getQueryList();
       },
      /*
       * 改变每页条数触发此事件
       * @param {number} val 当前数据
       */
      handleSizeChange(val){  
        this.searchForm.pageSize = val;
        this.getQueryList();
       },
      /*
       * 关闭考卷弹框
       */
      closePaperDialogFun(){
        this.paperDialog = false;
        this.getQueryList();
       },
      isPaperDialogShowCloseFun(val){ 
        this.isPaperDialogShowClose = val;
        this.getQueryList();
       }, 
      /*
       * 显示试卷
       */
      showPaper(item){
        this.paperDialog = true;
        this.activeAnswerItem = item; 
      },
      goToDetail(item) {
        this.$message('查看详情，待开发')
      },
    }
  }
</script>
<style lang="less">
  
</style>