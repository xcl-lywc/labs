<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>学年学期</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="isLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="common.checkAuthority('SchoolYear-tree', true)">
          <el-col :span="24">
            <!-- <el-input placeholder="输入关键字进行过滤" v-model="filterText" clearable></el-input> -->
          </el-col>
          <el-col :span="24">
            <div><el-button type="primary" size="mini" @click="showDialog(null, 'addYear')" :disabled="!!filterText || !common.checkAuthority('SchoolYeardd_AddYear', true)">添加学年</el-button></div>
            <el-tree :data="treeData" :props="defaultProps">
              <span class="fill-width" slot-scope="{ node, data }">
                <div @mouseenter=" mouseenter(data) " @mouseleave="tempId = null">
                  <span>
                    <i class="fa fa-desktop text-primary" v-if="data.type_id == 1"></i>
                    <i class="fa fa-mouse-pointer text-info" v-if="data.type_id == 2"></i>
                    {{ node.label }} 
                    <span class="marl10" style="color: #ccc; font-size: 14px; ">{{ data.type_id == 2 ? `（时段：${common._convertDate(data.start_time, 'yyyy-MM-dd')} ~ ${common._convertDate(data.end_time, 'yyyy-MM-dd')}）` : '' }}</span>&nbsp;&nbsp;  
                    <span v-if="tempId == data.id"> 
                      <el-button @click.stop="showDialog(data, 'addSchool')" v-if="data.type_id == 1 && common.checkAuthority('SchoolYear_AddSchool', true)" type="text"  :disabled="!common.checkAuthority('SchoolYear_AddSchool', true)">添加学期</el-button>
                      <el-button type="text" @click.stop="showDialog(data, 'edit')" v-if="common.checkAuthority('SchoolYear_Edit', true)">编辑</el-button>
                      <el-button type="text" v-if="common.checkAuthority('SchoolYear_delete', true)" class="text-danger"  @click.stop="deleteTree(data)">删除</el-button>
                    </span>
                  </span>
                </div>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </div> 
    </div>   
    <el-dialog 
      :title="`${editOrAdd == 'edit' ? '编辑' : '添加'}${editOrAdd == 'addYear' ? '学年' : '学期' }`" 
      :visible.sync="dialogVisible" width="50vw">
      <el-form ref="schoolYearForm"  :model="schoolYearForm" label-width="100px">
        <el-form-item 
          v-if="editOrAdd == 'addYear' || (editOrAdd == 'edit' && typeId == 1)"
          label="学年" 
          prop="name"
          :rules="[
            { required: true, message: '请输入学年', trigger: 'blur' }, 
          ]">
          <el-date-picker
            v-model="schoolYearForm.name"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="editOrAdd == 'addSchool' || (editOrAdd == 'edit' && typeId == 2)" label="学期名称" prop="name"><el-input v-model="schoolYearForm.name"></el-input></el-form-item>
        <el-form-item v-if="editOrAdd == 'addSchool' || (editOrAdd == 'edit' && typeId == 2)" label="开始结束时间" prop="dateTime">
          <el-date-picker
            :picker-options="startDatePicker"
            v-model="schoolYearForm.dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期" >
          </el-date-picker>
        </el-form-item> 
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('schoolYearForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        startDatePicker: {
          disabledDate: (time) => { 
            if(this.tempYearName){
              // var date = new Date(this.tempYearName);
              // var year = date.getFullYear();
              // var month = date.getMonth() + 1;
              // if (month >= 1 && month <= 9) {
              //     month = "0" + month;
              // }
              // var mindate = year.toString()  + month.toString();

              // var timeyear = time.getFullYear();
              // var timemonth = time.getMonth() + 1;
              // if (timemonth >= 1 && timemonth <= 9) {
              //     timemonth = "0" + timemonth;
              // }
              // var timedate = timeyear.toString() + timemonth.toString();
              // return mindate > timedate;
              return time.getTime() < new Date(`${this.tempYearName}-01-01`).getTime();
            }else{
              return true;
            } 
          }
        },
        isLoading:      false,
        dialogVisible:  false,
        treeData:       null,
        defaultProps: {
          children: 'childrens',
          label:    'name'
        },
        tempData:    null,// 当前浮动到那个元素上面
        tempId:      null, //当前浮动到那个元素上面
        typeId:      1, //1为学年，2为学期
        editOrAdd: 'add', //add为添加，edit为编辑
        tempYearName: null, //最后一次被选中的学年
        filterText: null, //关键词检索
        schoolYearForm: {
          name:         null, 
          parent_id:    null,
          start_time:   null,
          end_time:     null, 
          type_id:      this.typeId,
          dateTime:     [], //辅助用一下
        }, 
      };
    },
    watch: { 
    },
    mounted () {
      this.initTree()
    },
    methods: { 
      /**
       * 鼠标浮动获取当前树中的某一个对象
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      mouseenter(data){
        this.tempId = data.id; 
        data.type_id == 1 ? this.tempYearName = data.name : ''
      },
      /**
       * 获取学年学期树
       * @return {[type]} [description]
       */
      initTree() {
        this.isLoading = true
        let config = {
          method: "post",
          url: `${this.common.basePath}/configSemester/tree`,
          data: {}
        }
        this.axios(config).then((response) => {
          this.treeData   = response.data.data 
          this.isLoading = false;
        }).catch((errorMsg) => {
          this.isLoading = false
          this.$message.error(errorMsg)
        })
      }, 
      showDialog(data, operationType){
        this.tempData = data;
        this.editOrAdd = operationType;
        this.typeId = data ? data.type_id : this.typeId = 1; 
        this.schoolYearForm.parent_id = data ? data.parent_id : null;
        this.schoolYearForm.name = data ? data.name : null;
        //--------------- 编辑学期时 ------------
        if(operationType == 'edit' && this.typeId == 2){
          this.schoolYearForm.dateTime = [new Date(data.start_time), new Date(data.end_time)]; 
        }
        // ------ 起到一个定位的作用 --------
        if(operationType == 'addSchool'){
          this.schoolYearForm.name = null;
          this.schoolYearForm.dateTime = [new Date(`${this.tempYearName}-01-01`), new Date(`${this.tempYearName}-01-02`)] 
        }

        if(operationType == 'addYear') {
          this.schoolYearForm.name = null;
        }
        this.dialogVisible = true;
      },
      /**
       * 提交表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */      
      submitForm(formName){
        this.$refs[formName].validate(valid => {
          if(valid) {   
            if(this.editOrAdd == 'edit'){
              this._updateSubmit();
            }else{
              this._addSubmit();
            }
          } else {
            this.$message.error("请输入必填项")
          }
        })
      },
      _addSubmit(){
        this.axios.post(`${this.common.basePath}/configSemester`, this.submitParams()).then((response) => {
            this.initTree();
            this.$message.success(response.data.meta.message);
            this.dialogVisible = false;
        }).catch((error) => {
          this.dialogVisible = false;
          this.$message.error(error); 
        }); 
      },
      _updateSubmit(){
        this.axios.patch(`${this.common.basePath}/configSemester/${this.tempData.id}`, this.submitParams()).then((response) => {
            this.initTree();
            this.$message.success(response.data.meta.message);
            this.dialogVisible = false;
        }).catch((error) => {
          this.dialogVisible = false;
          this.$message.error(error); 
        }); 
      },
      submitParams(){
        if(this.editOrAdd == 'addYear' || (this.editOrAdd == 'edit' && this.typeId == 1)){ 
          return {
            name:         this.common._convertDate(this.schoolYearForm.name, 'yyyy'), 
            type_id:      1, 
          }
        }else if(this.editOrAdd == 'addSchool' || (this.editOrAdd == 'edit' && this.typeId == 2)){ 
          let parentId = this.editOrAdd == 'addSchool' ?  this.tempData.id : this.tempData.parent_id;
          return {
            name:         this.schoolYearForm.name, 
            parent_id:    parentId,
            start_time:   this.schoolYearForm.dateTime[0].getTime(),
            end_time:     this.schoolYearForm.dateTime[1].getTime(),
            type_id:      2, 
          } 
        }  
      },
      /**
       * 删除
       * @param {[type]} parentId [description]
       */
      deleteTree(data) {
        this.authorityForm = JSON.parse(JSON.stringify(data))

        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButt才去onText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => { 
          let config = {
            method: "patch",
            url: `${this.common.basePath}/configSemester/delete/${data.id}`,
          }
          this.axios(config).then((response) => { 
            this.$message.success(response.data.meta.message) 
            this.initTree()
          }).catch((errorMsg) => { 
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
    }
  };
</script>