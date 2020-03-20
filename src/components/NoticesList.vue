 <!--
    相关通知列表
  -->
<template>
  <div class="notices">
    <h2 class="page-title mart60 padt10">相关通知</h2>
    <el-button type="primary" icon="el-icon-back" size="middle" class="back-button"  @click="back">返回</el-button>
    <div class="block-wrap">
      <h4 class="block-title">相关通知列表</h4>
      <div class="block-body">
        <!-- <div class="body-operation">
          <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="" icon="el-icon-plus" size="mini" @click="addDiolog">添加</el-button>
            </el-col>
            <el-col :span="12" :offset="0">
              
            </el-col>
          </el-row>
        </div> -->
        <div class="body-content">
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData.rows" stripe style="width: 100%">
                <!-- <el-table-column type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" fixed class-name="border-index"></el-table-column>
                <el-table-column prop="sending_time" label="发件时间" width="180">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.sending_time | formatDate}}
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="sender" label="项目名称" width="180"></el-table-column> -->
                <el-table-column prop="title" label="消息">
                  <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="infromation" label="信息"></el-table-column> -->
                <el-table-column label="操作" width="120" header-align="center" align="center">
                  <template slot-scope="scope">
                      <el-button type="success" icon="" size="small" @click="openDetails(scope.row)"><i class="fa fa-eye"></i> 查看</el-button>
                      <!-- <el-button type="danger" icon="el-icon-delete" size="small" @click="del(scope.row)">删除</el-button> -->
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-bottom">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          background
          small
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </div>
    </div>
    <!-- 
      相关通知详情弹框
    -->
    <el-dialog
      :title="detailNotice.title"
      :visible.sync="detailDialogVisible"
      width="50%"
      :show-close="true">
      <ul class="notice-content">
        <li>{{detailNotice.infromation}}<el-button @click="checkNotice(detailNotice)" class="fr" type="text" size="small">》点击查看《</el-button></li>
        <!-- params: {id: detailNotice.from_id} -->
        <li></li>
      </ul>
      <template slot="footer">
        <span>{{detailNotice.sending_time | formatDate}}</span>
      </template>
    </el-dialog>
    <!-- 
      添加弹框
    -->
    <el-dialog
      title="添加消息"
      :visible.sync="addDialogVisible"
      width="50%"
      :show-close="true">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="发送人" prop="sender">
          <el-input v-model="ruleForm.sender"></el-input>
        </el-form-item>
        <el-form-item label="信息" prop="infromation">
          <el-input v-model="ruleForm.infromation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click=" addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="config('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div> 
</template>

<script>
  import {formatDate} from '../plugins/data.js';
  export default {
    name: 'notices',
    data() {
      return {
        detailDialogVisible:false,
        addDialogVisible:false,
        elementPageData: {               
          //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        tableData: {rows: [], total: 0},
        currentPage: 1,
        detailNotice:{},
        nId:null,
        dId:null,
        ruleForm: {
          title: '',
          sender: '',
          infromation: '',
        },
        rules: {
          title: [
            { required: true, message: '请填写标题', trigger: 'blur' },
          ],
          sender: [
            { required: true, message: '请填写发送人', trigger: 'blur' },
          ],
          infromation: [
            { required: true, message: '请填写信息', trigger: 'blur' },
          ],
        },
      }
    },
    /* 
      转化时间戳
    */
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
    computed: {
      getNoticeNum() {
        return this.$store.state.noticeNum;
      }
    },
    watch: {
      getNoticeNum: {
        handler(newV, oldV) {
          this.getNoticesList()
        }
        
      }
    },
    mounted () {
      /* 
       列表展示
       */
      this.getNoticesList();
      
    },
    methods: {
      
      /* 
       返回上一级
       */
      back(){
        sessionStorage.setItem("noticeIds","1");
        this.$router.back(-1);
      },
      
      /* 
        查看详情 row, event, column
      */
      openDetails(row) {
        this.nId = row.id;
        this.detailDialogVisible = true;
        this.getNoticesDetail();
      },
      
      /* 
      添加弹框 
       */
      addDiolog(){
        this.addDialogVisible = true;
      },

      /* 
        项目序号
       */
      indexMethod(index) {
        return (index+1) * 1;
      },
      
      /*
      * 改变当前页码触发此事件
      * @param {number} val 当前页码
      */
      handleCurrentChange(val){
        this.elementPageData.pageNum = val;
        this.getNoticesList();
      },
      
      /*
      * 改变每页条数触发此事件
      * @param {number} val 当前数据
      */
      handleSizeChange(val){
        this.elementPageData.pageSize = val;
        this.getNoticesList();
      },
      
      /* 
        获取相关通知列表
      */
      getNoticesList(){
        this.axios.get(`${this.common.basePath}/notices`,this._noticesParams()).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.tableData = response.data.data;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _noticesParams(){
        return {
          params: {
            cur_status:1,
            recipients:sessionStorage.getItem("assignee").toString(),
            // id:sessionStorage.getItem("assignee").toString()
            pageSize: this.elementPageData.pageSize,
            pageNum:  this.elementPageData.pageNum,
          }
        }
      },
      
      /* 
        获取相关通知详请
      */
      getNoticesDetail(){
        this.axios.get(`${this.common.basePath}/notices/${this.nId}`,this._noticeDetailParams()).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.detailNotice = response.data.data;
            this.getNoticesList();
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _noticeDetailParams(){
        return {
          params: {
            id:this.nId,
          }
        }
      },
      
      /* 
        删除消息
       */
      del(row){
        this.dId = row.id;
        this.$confirm('确认要删除该消息吗？', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.axios.patch(`${this.common.basePath}/notices/delete/${this.dId}`, { params: {id:this.dId} }).then( (response) => {
            this.getNoticesList();
          }).catch( (error) => {
            this.$message.error(error);
          });
        })
        .catch(action => {
          
        });
      },
      
      /* 
       添加消息
       */
      add(){
        var formData = {
          "cur_status": 1,
          "infromation": this.ruleForm.infromation,
          recipients:sessionStorage.getItem("assignee").toString(),
          "sender": this.ruleForm.sender,
          "title": this.ruleForm.title,
        }
        this.axios.post(`${this.common.basePath}/notices`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.addDialogVisible = false;
            this.getNoticesList();//刷新列表
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      
      /* 
        确认添加消息
       */
      config(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.add();
          } else {
            this.$message.warning("未填写完整！！！",60);     
            return false;
          }
        });
      },
      
      /* 
       重置添加消息
       */
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      /*
        根据不同的类型跳转至不同的页面
       */
      checkNotice (data) {
        let pathString
        switch(data.project_stage) {
					case null:
						pathString = "/project_set_up/reporting"
						break;
          case 1:
            pathString = "/project_set_up/declare"
            break;
          case 2:
            pathString = "/project_set_up/acceptance"
            break;
          case 3:
            pathString = "/project_set_up/pretrial"
            break;
          case 4:
            pathString = "/project_set_up/review"
            break;
          case 5:
            pathString = "/project_set_up/leader"
            break;
          case 6:
            pathString = "/project_set_up/financial"
            break;
          case 7:
            pathString = "/project_set_up/file"
            break;
          case 8:
            pathString = "/project_set_up/track"
            break;
          default:
            pathString = ""
            break;
        }
        this.$router.push({path: pathString})
      }
    },
    
    
  }
</script>

<style lang="less">
  /* 
  相关通知 
  */
  .notices{
    /* 
      通知详情
    */
    .notice-content{
      width: 100%;
    }
    .notice-content li{
      line-height: 30px;
    }
    /* 
    头部
    */
    .header-wrap{
      z-index: 99;
      position: fixed;
      top: 0;
      height: 60px;
      width: 100%;
      background: #fff;
      box-shadow: 0 -2px 10px rgb(84, 92, 100, 0.5);
      .header-img, .header-title{
        display: inline-block;
        margin: 0;
        height: 60px;
        vertical-align: middle;
        line-height: 60px;
        font-size: 20px;
      }
      .header-img {
        height: 40px;
        margin: 10px 0 10px 15px
      }
      .header-img:hover {
        cursor: pointer;
      }
      .main-title{
        color: #333333;
        font-size: 24px;
        font-weight: 900;
      }
      .sub-title{
        margin-left: 8px;
        color: #808080;
        font-size: 16px;
        line-height: 68px;
      }
    }
  }
</style>