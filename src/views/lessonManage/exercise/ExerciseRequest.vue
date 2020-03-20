<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>添加习题要求</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap"> 
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <el-form ref="taskForm" :model="taskForm" label-width="120px">
          <el-row>
            <el-col :span="12">
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
            <el-col :span="12"> 
              <el-form-item 
                label="得分占比：" 
                prop="value"
                :rules="[
                  { required: true, message: '请输入得分占比', trigger: 'blur' },]
                ">
                <el-input type="number" v-model="taskForm.value">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item> 
            </el-col>
            <el-col :span="12"> 
              <el-form-item 
                label="截止时间：" 
                prop="end_time"
                :rules="[
                  { required: true, message: '请选择截止时间', trigger: 'blur' },]
                ">
                <el-date-picker
                  :picker-options="pickerOptions0"
                  v-model="taskForm.end_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="12:00:00">
                </el-date-picker>
              </el-form-item> 
            </el-col>
            <el-col :span="12">
              <el-form-item 
                label="通过分数："
                prop="adopt_score"
                :rules="[
                  { required: true, message: '请输入通过分数', trigger: 'blur' },]
                "> 
                <el-input type="number" v-model="taskForm.adopt_score"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12"> 
              <el-form-item label="需要阻塞："> 
                <el-radio-group v-model="taskForm.is_block">
                  <el-radio :label="1">阻塞</el-radio>
                  <el-radio :label="2">不阻塞</el-radio> 
                </el-radio-group>
              </el-form-item> 
            </el-col> -->
            <el-col :span="24"> 
              <el-form-item label="试题内容：">  
                <el-card>
                  <test-parper :paperItem="taskForm.paperItem" :isEdit="true"></test-parper>
                </el-card>
              </el-form-item> 
            </el-col>
            <el-col :span="24">
              <el-form-item label="" >   
                <el-button 
                  :disabled="!common.checkAuthority('ExerciseRequest_Save', true)"
                  type="primary" @click="submitSave('taskForm')">
                  {{common.checkAuthority('ExerciseRequest_Save') ? common.checkAuthority('ExerciseRequest_Save').name : ''}}
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
  import testPaper from '../../../components/TestPaperC.vue'
  export default {
    data () {
      return { 
        pickerOptions0: { 
          disabledDate(time) {
            return time.getTime() < Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
          }
        },
        taskForm: {
          "experiment_id": this.$route.params.id,
          "name":          null,
          "end_time":      null,
          "value":         null,
          "adopt_score":         null,
          "is_block":      1, //1阻塞 2不阻塞
          "paperItem": {
            name:      null,
            exam_time: null,
            questions: [],
          },
        },
      }
    },
    components:{
      'test-parper': testPaper,
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
            this.axios.post(`${this.common.basePath}/task/save`,this.taskForm).then((response) => {
              this.$message('保存成功'); 
              this.$router.push({ name: 'TestDetail', params: {id: this.$route.params.id} });
            }).catch((error) => {
              this.$message.error(error); 
            }); 
          } else { 
            return false;
          }
        });
        
      }, 
      submitEdit(){

      },
    }
  }
</script>
<style lang="less">
  
</style>