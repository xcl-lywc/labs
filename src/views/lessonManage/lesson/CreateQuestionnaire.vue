/********* 创建课程问卷 *********/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/list' }">课程</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'LessonListDetail', params: {id: $route.params.course_id} }">课程详情</el-breadcrumb-item>
        <el-breadcrumb-item>添加课程问卷</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <div class="router-view-content"> 
        <el-form ref="courseForm" :model="courseForm" label-width="120px">
          <el-row> 
            <el-col :span="24" class="marb20"> 
              <questionnaire-paper type="1" :questionnaire="courseForm.questionnaire" isEdit="true"></questionnaire-paper>
            </el-col>
            <el-col :span="24">
              <el-form-item label="" >  
                <el-button 
                  :disabled="!common.checkAuthority('LessonCreateQuestionnaire_Save', true)"
                  type="primary" @click="submitSave('courseForm')">
                  {{common.checkAuthority('LessonCreateQuestionnaire_Save') ? common.checkAuthority('LessonCreateQuestionnaire_Save').name : ''}}
                </el-button> 
              </el-form-item> 
            </el-col>
          </el-row>  
        </el-form> 
      </div>
    </div>
  </div> 
</template>
<script> 
  import questionnaire from '../../../components/Questionnaire.vue'
  export default { 
    data () {
      return {
        courseForm: { 
          questionnaire: {
            courseId: this.$route.params.course_id,
            name:         null,   
            description:  null,
            qItems:       [],
          },
        },
        paperCreatorAccount: null,
      }
    },
    components:{ 
      'questionnaire-paper': questionnaire,
    },
    computed:{ 
    },
    mounted(){   
    },
    methods: { 
      /*
       * 保存数据
       */
      submitSave(formName){  
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/course-questionnaire`,this.courseForm.questionnaire).then((response) => {
              this.$message('保存成功');
              this.$router.go(-1);
            }).catch((error) => {
              this.$message.error(error); 
            });
          } else { 
            return false;
          }
        }); 
      },
    }
  }
</script>
<style lang="less">
  
</style>