/*********** 考勤表 ************/
<template>
  <div class="content-wrap-box">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/lesson/testlist' }">实验列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TestDetail', params: {id: $route.params.experiment_id} }">实验详情</el-breadcrumb-item>
        <el-breadcrumb-item>考勤表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content"> 
        <div style=" overflow-x: auto; ">
          <div class="text-center" v-if="!attendanceSheetData.length">
            暂无考勤
          </div> 
          <table v-if="attendanceSheetData.length" class="hand-table" style=" width: max-content; ">
            <thead border="1">
              <tr>
                <td><el-checkbox v-model="isAllChecked"></el-checkbox></td>
                <td>学 号</td>
                <td>姓 名</td> 
                <td  
                  v-for="(item, index) in attendanceSheetData[0].info">
                  {{item.taskName}}   
                </td>
                <td>得分</td>
              </tr>
            </thead>
            <tbody> 
              <tr v-for="(itemTit, indexTit) in attendanceSheetData" :key="indexTit">
                <td class="tab-index-class"> 
                  <el-checkbox v-model="itemTit.checked"></el-checkbox>
                </td>
                <td class="tab-index-class">{{itemTit.account}}</td>
                <td class="tab-index-class">{{itemTit.name}}</td>
                <td class="tab-content-class" v-for="(itemVal, indexVal) in itemTit.info" :key="indexVal">{{itemVal.score}}</td>
                <td class="tab-index-class">{{itemTit.scores}}</td>
              </tr> 
            </tbody>
          </table>   
        </div>
        <!-- 页面底部 -->
        <div class="router-view-bottom mart20">
          <div>
            <!-- 编辑 -->
            <el-button 
              :disabled="!common.checkAuthority('AttendanceSheet_Edit', true)"
              type="primary" @click=" showEditSheetDialog ">
                {{common.checkAuthority('AttendanceSheet_Edit') ? common.checkAuthority('AttendanceSheet_Edit').name : ''}}
            </el-button>
            <!-- 下载模板 -->
            <el-button 
              :disabled="!common.checkAuthority('AttendanceSheet_DownloadSheetModule', true)"
              type="primary" @click=" downloadSheetModule ">
              {{common.checkAuthority('AttendanceSheet_DownloadSheetModule') ? common.checkAuthority('AttendanceSheet_DownloadSheetModule').name : ''}}
            </el-button> 
            <!-- 导入 --> 
            <upload 
              size="middle"
              class="fl marl10"
              :url="`/work/import`"
              :isDisabled="!common.checkAuthority('AttendanceSheet_Import', true)"
              :fileTypes="['xls','xlsx']"
              :buttonText="common.checkAuthority('AttendanceSheet_Import') ? common.checkAuthority('AttendanceSheet_Import').name : ''" 
              @uploadSuccess="importSheet"></upload> 
          </div> 
        </div>
      </div> 
    </div>
    <!-- 编辑考勤 -->
    <el-dialog 
      v-if="attendanceSheetData.length"
      width="550px"
      title="编辑考勤" 
      :visible.sync="editSheetDialog">
        <el-form ref="editSheetForm" :model="editSheetForm" label-width="110px" >
          <el-form-item 
            label="任务：" 
            prop="taskId"
            :rules="[{ required: true, message: '请选择任务', trigger: 'blur' },]">
            <el-select v-model="editSheetForm.taskId">
              <el-option 
                v-for="(item, index) in attendanceSheetData[0].info"
                :key="index"
                :label="item.taskName"
                :value="item.taskId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            label="类型：" 
            prop="type"
            :rules="[{ required: true, message: '请选择类型', trigger: 'blur' },]">
            <el-radio-group v-model="editSheetForm.type">
              <el-radio :label="1">补卡</el-radio>
              <el-radio :label="2">清空打卡</el-radio> 
            </el-radio-group>
          </el-form-item>
          <el-form-item 
            label="补卡时间：" 
            prop="time"
            :rules="[{ required: true, message: '请选择补卡时间', trigger: 'blur' },]">
            <el-date-picker
              v-model="editSheetForm.time"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> 
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editSheetDialog = false">取 消</el-button> 
          <el-button @click="editSheet('editSheetForm')" type="primary">保 存</el-button> 
        </div>
      </el-dialog>
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  export default {
    components:{   
      'upload':                upload,
    },
    data() {
      return { 
        editSheetDialog:     false,
        isAllChecked:        false, //true为全选
        attendanceSheetData: [], 
        editSheetForm:       {
          accounts:     [],   //用户学号、工号集合
          taskId:       null, //任务Id
          type:         null, //补卡1，清空2
          time:         null, //
        }
      }
    },
    mounted(){
      this.getQueryList(); 
    },
    watch:{
      isAllChecked(val){ 
        this.attendanceSheetData.forEach((item) => {
          item.checked = !item.checked;
        });
      }
    },
    methods: {  
      /*
       * 查询课程列表， 
       */
      getQueryList(){  
        this.axios.get(`${this.common.basePath}/work/check/experimentId`,{params: {id: this.$route.params.experiment_id}}).then((response) => {
          this.attendanceSheetData = this._listAddCheckedKey(response.data.data);
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       * 在列表中添加checked键
       */
      _listAddCheckedKey(data){
        if(data){
          data.forEach((item) => {
            item.checked = false;
          });
        }
        return data;
      },
      checkboxChange(ev, item){
        debugger
        ev ? this.editSheetForm.accounts.push(item.account) : this.deleteAccount(item.account);
      },
      deleteAccount(account){
        for(var i = 0;i<this.editSheetForm.accounts.length;i++){this.editSheetForm.accounts[i]===account ? this.editSheetForm.accounts.splice(i,1) : this.editSheetForm.accounts;};
      },
      showEditSheetDialog(){
        // ---------- 获取被选中人员的账号 --------
        this.editSheetForm.accounts = [];
        this.attendanceSheetData.forEach((item) => {
          if(item.checked){
            this.editSheetForm.accounts.push(item.account);
          }
        });
        // ---------- 验证是否被选中的学生 --------
        if(!this.editSheetForm.accounts.length) {
          this.$message.warning('请选择学生');
          return false;
        }
        this.$refs.editSheetForm ? this.$refs.editSheetForm.resetFields() : '';
        this.editSheetDialog = true;
      },
      editSheet(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editSheetForm.time = this.editSheetForm.time.getTime();
            this.axios.post(`${this.common.basePath}/work/edit`,this.editSheetForm).then((response) => {
              this.$message.success(response.data.meta.message); 
              this.getQueryList();
              this.editSheetDialog = false;
              this.isAllChecked = false;
            }).catch((error) => {
              this.$message.error(error); 
              this.editSheetDialog = false; 
            });
          } else { 
            return false;
          }
        });
      },
      /*
       * 导入表格成功
       */ 
      importSheet(){
        this.getQueryList();
      },
      /*
       * 下载表格模板
       */
      downloadSheetModule(){
        this.axios.get(`${this.common.basePath}/work/export`,
          {params: {experiment_id: this.$route.params.experiment_id},responseType: "blob"}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('下载成功'); 
        }).catch((error) => {
          this.$message.error(error);  
        });
      }
    }
  }
</script>
<style lang="less">
  
</style>