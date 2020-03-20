/*********** 课程安排 ************/
<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程安排</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <!-- 搜索表单 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="dateTE"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="所属课程：" prop="course_id">
            <el-select v-model="searchForm.course_id" @change="courseChange">
              <el-option v-for="(item, index) in courseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属实验：" prop="name">
            <el-select v-model="searchForm.experiment_id">
              <el-option v-for="(item, index) in exerciseListData.rows" :key="index" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item> 
          <el-form-item label="课程指导老师：" prop="c_teacher">
            <el-input v-model="searchForm.c_teacher"></el-input>
          </el-form-item> 
          
          <el-form-item>
            <el-button 
              :disabled="!common.checkAuthority('CourseCountQuery', true)"
              type="primary" @click="getQueryList(true)">
                {{common.checkAuthority('CourseCountQuery') ? common.checkAuthority('CourseCountQuery').name : ''}}
              </el-button>
            <el-button type="primary" @click="resetSearchForm">置空</el-button>
          </el-form-item>
        </el-form>
        <el-table 
          ref="multipleTable"
          :data="courseCountList" 
          style="width: 100%"> 
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column 
            label="课程名称" 
            width="150"
            prop="name"> 
          </el-table-column>
          <el-table-column  
            prop="c_code"
            width="120"
            label="课程代码" >
          </el-table-column>
          <el-table-column 
            width="80"
            prop="c_teacher"
            label="课程教师" >
          </el-table-column>
          <el-table-column
            width="80"
            prop="tutor_name"
            label="实验老师" >
          </el-table-column>
          <el-table-column
            width="80"
            prop="tutor_titles"
            label="职称">
          </el-table-column>
          <el-table-column
            width="200"
            prop="tutor_faculty"
            label="所属学院">
          </el-table-column>
          <el-table-column  
            width="250"
            prop="experiment_name"
            label="实验名称">
          </el-table-column>
          <el-table-column 
            width="80"
            prop="period"
            label="实验学时">
          </el-table-column>
          <el-table-column
            width="200"
            prop="c_nature"
            label="课程性质">
          </el-table-column>  
          <el-table-column 
            width="200"
            prop="schooltime"
            label="上课时间" > 
          </el-table-column>
          <el-table-column  
            width="200"
            prop="class_room"
            label="上课地点"
            show-overflow-tooltip>
          </el-table-column>  
          <el-table-column
            width="120"  
            prop="attendance"
            label="上课学生人数"
            show-overflow-tooltip>
          </el-table-column>  
        </el-table>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart10"> 
          <div> 
            <!-- 下载课程安排表格 -->
            <el-button 
              :disabled="!common.checkAuthority('CourseCount_DownloadSheet', true)"
              type="primary" @click=" downloadSheet ">
              {{common.checkAuthority('CourseCount_DownloadSheet') ? common.checkAuthority('CourseCount_DownloadSheet').name : ''}}
            </el-button> 
          </div> 
        </div>
      </div> 
    </div> 
  </div>
</template>
<script> 
  export default { 
    data () {
      return {
        searchForm:{
          begin_time:    null,
          end_time:      null,
          course_id:     null,
          experiment_id: null,
          c_teacher:     null,
        },
        dateTE:          null,
        courseListData:   {total: 0, rows: []},
        exerciseListData: {total: 0, rows: []},
        courseCountList: [], 
      }
    },
    mounted(){
      this.getQueryList(); 
      this.getQueryCourseList();
    },
    methods: {  
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
      /*
       * 根据课程Id查询实验列表
       */
      getQueryExerciseList(){ 
         this.axios.get(`${this.common.basePath}/experiment`,{params: {course_id: this.searchForm.course_id }}).then((response) => {
          this.exerciseListData = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 查询学生列表， 
       */
      getQueryList(){    
        this.axios.post(`${this.common.basePath}/course/count`,this._queryParams()).then((response) => {
          this.courseCountList = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
      _queryParams(){ 
        this.searchForm.begin_time = this.dateTE ? this.dateTE[0].getTime() : null;
        this.searchForm.end_time = this.dateTE ? this.dateTE[1].getTime() : null;
        return this.searchForm;
      },
      /*
       * 下载表格
       */
      downloadSheet(){
        this.axios.post(`${this.common.basePath}/course/count/download`,this._queryParams(),{responseType: "blob"}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('下载成功'); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : '';
        this.dateTE = null;
      },
      /*
       * 课程改变重查实验数据
       */
      courseChange(ev){
        this.getQueryExerciseList(); 
        this.searchForm.experiment_id = null;
      }
    }
  }
</script>
<style lang="less">
  
</style>