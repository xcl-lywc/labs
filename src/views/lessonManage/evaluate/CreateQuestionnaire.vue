/********* 创建问卷 *********/
<template> 
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>添加评价要求</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <div class="router-view-content"> 
        <el-form ref="taskForm" :model="taskForm" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item 
                label="任务名称："  
                prop="name"
                :rules="[
                  { required: true, message: '请输入任务名称', trigger: 'blur' },
                  { validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]
                ">
                <el-input v-model="taskForm.name"></el-input>
              </el-form-item> 
            </el-col> 
            <el-col :span="24"> 
              <el-form-item label="问卷内容："> 
                <el-card>
                  <questionnaire-paper :questionnaire="taskForm.questionnaire" isEdit="true"></questionnaire-paper>
                </el-card>
              </el-form-item> 
            </el-col>
            <el-col :span="24">
              <el-form-item label="" >  
                <el-button 
                  :disabled="!common.checkAuthority('CreateQuestionnaire_Save', true)"
                  type="primary" @click="submitSave('taskForm')">
                  {{common.checkAuthority('CreateQuestionnaire_Save') ? common.checkAuthority('CreateQuestionnaire_Save').name : ''}}
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
        taskForm: {
          experiment_id: this.$route.params.id,
          name:          null,
          questionnaire: {
            name:         null,
            type:         1, //问卷类型：1评价教学2互评3自评
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
            this.axios.post(`${this.common.basePath}/task/save/questionnaire`,this.taskForm).then((response) => {
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