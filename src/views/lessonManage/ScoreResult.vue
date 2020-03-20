/*********** 学生成绩单 ************/
<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonListDetail', params: {id: $route.params.course_id} }">课程详情</el-breadcrumb-item> 
        <el-breadcrumb-item :to="{ name: 'StudentRegister', params: {id: $route.params.course_id} }" >学生花名册</el-breadcrumb-item>
        <el-breadcrumb-item >学生成绩单</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap transparent-bg">
      <!-- 页面主要内容 -->
      <div class="router-view-content" v-if="scoreDetail"> 
        <el-card>
          <el-row>
            <el-col :span="20" class="text-center">
              <span>课程：{{scoreDetail.courseName}}</span>
            </el-col>
            <el-col :span="4" class="text-right">
              <span>总成绩：{{scoreDetail.score}}</span>
            </el-col>
          </el-row> 
        </el-card>
        <!-- 学生信息 -->
        <el-card class="mart20"> 
          <div slot="header">
            <span class="card-title">学生信息</span>
          </div>
          <el-row>
            <el-col :span="5">
              <div class="img-photo-fix wh100">
                <img :src="scoreDetail.head_img ? scoreDetail.head_img : '默认图' " :onerror="defaultImg(scoreDetail.sex)" width="100px" height="100px" />
              </div>
            </el-col>
            <el-col :span="9">
              <p>姓名：{{scoreDetail.user_name ? scoreDetail.user_name : '无'}}</p>
              <p>工/学号：{{scoreDetail.faculty ? scoreDetail.account : '无'}}</p>
              <p>入学时间：{{common._convertDate(scoreDetail.admission_time, 'yyyy年MM月dd日')}}</p>
              <p>手机：{{scoreDetail.phone_num ? scoreDetail.phone_num : '无'}}</p>
            </el-col>
            <el-col :span="10">
              <p>院系：{{scoreDetail.facultyName ? scoreDetail.facultyName : '无'}}</p>
              <p>邮箱：{{scoreDetail.mail ? scoreDetail.mail : '无'}}</p>
            </el-col>
          </el-row>
        </el-card>
        <!-- 得分明细 -->
        <el-card class="mart20"> 
          <div slot="header">
            <span class="card-title">得分明细</span>
          </div>
          <el-row v-if="scoreDetail.exprimentScoreList ? scoreDetail.exprimentScoreList.length != 0 : false">
            <el-col 
              v-for="(item, index) in scoreDetail.exprimentScoreList" 
              :key="index" :span="11" >
              <el-card>
                <h4>{{item.experimentName}}&nbsp;&nbsp;&nbsp;总分占比：{{item.totalValue}}%&nbsp;&nbsp;&nbsp;总成绩： {{item.score}}</h4>
                <p class="marl10" v-for="(itemO, indexO) in item.scoreList" :key="indexO">
                  {{indexO +1}} 、{{itemO.taskName}}&nbsp;&nbsp;&nbsp;得分：{{itemO.score}}/{{itemO.maxScore}}&nbsp;&nbsp;&nbsp;成绩占比： {{itemO.value}}%</p>
              </el-card>
            </el-col> 
          </el-row>
          <el-row v-else class="text-center" >暂无数据</el-row>
        </el-card>
      </div> 
    </div> 
  </div>
</template>
<script>
  export default {
    data () {
      return { 
        scoreDetail: null, 
      }
    },
    mounted(){ 
      this.getScoreDetail();
    },
    methods: {  
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
       * 查询成绩详情 
       */
      getScoreDetail(){  
        this.axios.get(`${this.common.basePath}/member/score/${this.$route.params.member_id}`, '').then((response) => {
          this.scoreDetail = response.data.data;
        }).catch((error) => {
          this.$message.error(error);  
        });
      }, 
    }
  }
</script>
<style lang="less">
  
</style>