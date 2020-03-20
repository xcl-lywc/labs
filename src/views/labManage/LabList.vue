<!-- 实验室列表 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item>实验室列表</el-breadcrumb-item>  -->
        <el-breadcrumb-item class="text-bold">
          <div class="breadcrumb-div">
            <div class="fl text-left-div">实验室列表</div>
            <div class="text-right fr">
              <el-button type="primary" 
              @click="dialogType = 1 ; dialogTitle = '创建实验室' ; roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' " :disabled="!common.checkAuthority('LabList_Add',true)">新增</el-button>
              <el-button type="danger" @click="deleteRoom" :disabled="isDisabaledDelBtn()">删除</el-button>
            </div>
          </div>
        </el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap operation-router-view-wrap" ref="contentWrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
          <el-form-item label="实验室名称：">
            <el-input v-model="searchForm.keys"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getQueryList(true)" :disabled="!common.checkAuthority('LabList_Search',true)">搜索</el-button>
            <el-button type="default" @click="clearForm">置空</el-button>
          </el-form-item>
        </el-form>
        <!-- 新增/删除 -->
        <div class="text-right overflow-hidden">
          <span class="mart10 marl20 text-left fl">{{'共计'+cardsData.total+'个实验室'}}</span>
            <!-- <el-button type="primary" 
            @click="dialogType = 1 ; dialogTitle = '创建实验室' ; getClassList(); roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' ">新增</el-button> -->
           <!-- <el-button type="primary" 
           @click="dialogType = 1 ; dialogTitle = '创建实验室' ; roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' " :disabled="!common.checkAuthority('LabList_Add',true)">新增</el-button> -->
          <!-- <el-button type="danger" @click="deleteRoom" :disabled="isDisabaledDelBtn()">删除</el-button> -->
        </div>
        <!-- 卡片 -->
        <div class="padding-row" v-if="common.checkAuthority('LabList_Search', true)">
          
          <el-row class="padding-row" v-if="cardsData.rows.length > 0">
            <el-checkbox-group v-model="ids" size="small">
            <el-col :span="8" v-for="(item, index) in cardsData.rows" :key="index">
              <el-card class="card-wrap card-wrap_m">
                <el-tag class="width-percentage" type="success">
                <h3 class="card-title marb0">
                  <el-checkbox :label="item.id" :disabled="!common.checkAuthority('LabList_Delete',true)">&nbsp;</el-checkbox>
                  <span class="card-title">{{item.name}}</span>
                </h3>
                </el-tag>
                <p class="card-content_ card-content cursor-pointer_T">简介：{{ item.instructions }}</p>
                <div class="card-bottom_">
                  <div class="room">
                    <span class="fl">教室: &nbsp;</span>
                    <el-tooltip effect="dark" placement="top" v-if="item.childrenVos.length!=0" >
                      <div slot="content">
                        <span v-for="childItem in item.childrenVos" >
                          {{childItem.code+' ( '+childItem.capacity+'人 ) '}}&nbsp;
                        </span>
                      </div>
                      <div class="room-list fl cursor-pointer">
                        <span v-for="childItem in item.childrenVos" >
                          {{childItem.code+' ( '+childItem.capacity+'人 ) '}}&nbsp;
                        </span>
                      </div>
                    </el-tooltip>
                    <span v-if="item.childrenVos.length==0" class="fl room-list">暂无</span>
                  </div>
                  <div class="remarks">
                    <el-tooltip effect="dark" :content="item.remarks" placement="top" v-if="item.remarks">
                      <span class="remarks-info fl cursor-pointer">备注: {{item.remarks}}</span>
                    </el-tooltip>
                    <span class="remarks-info fl"  v-else>备注: 暂无</span>
                    <!-- <span v-if="item.remarks" class="remarks-info fl">{{'备注: '+item.remarks}}</span> -->
                    <!-- <span v-else class="remarks-info fl">{{'备注: '+'暂无'}}</span> -->
                    <el-button type="primary" size="mini" @click="dialogType = 2 ; dialogTitle = '编辑实验室' ; getClassList(); roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' ; editId = item.id; echoLabInfo(item.id);" class="fr" :disabled="!common.checkAuthority('LabList_Edit',true)">编辑</el-button>
                  </div>
                  
                </div>
              </el-card>
            </el-col>
            </el-checkbox-group>
          </el-row>
          
          <el-row class="padding-row text-center text-info" v-else>
            暂无数据
          </el-row>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部-分页 -->
      <!-- <div class="router-view-bottom">
        <div></div>
        <el-pagination
          class="fill-width"
          background
          layout="total, sizes, prev, pager, next"
          :total="cardsData.total">
        </el-pagination>
      </div> -->
      <!-- 创建实验室 -->
      <el-dialog 
        width="550px"
        :title="dialogTitle" 
        :visible.sync="roomOperaDialog">
          <el-form ref="submitForm" :model="submitForm" label-width="110px" >
            <el-form-item 
              label="实验室名称：" 
              prop="l_name"
              :rules="[{ required: true, message: '请输入实验室名称', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="submitForm.l_name"></el-input>
            </el-form-item>
            <el-form-item 
              label="使用描述：" 
              prop="instructions"
              :rules="[{ required: true, message: '请输入使用描述', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
              <el-input type='textarea' v-model="submitForm.instructions" rows="5"></el-input>
            </el-form-item> 
            <!-- <el-form-item 
              label="实验教室：" 
              prop="code"
              v-if="dialogType === 1"
              :rules="[{ required: true, message: '请选择实验教室', trigger: 'blur' },]">
              <el-select v-model="submitForm.code">
                <el-option v-for="(item, index) in classListData" :key="item.id" :value="item.identifier" :label="item.identifier">
                  <div @click="class_id = item.id">{{item.identifier}}</div>
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item 
              label="实验教室：" 
              prop="code"
              v-if="dialogType === 2"
              :rules="[{ required: true, message: '请选择实验教室', trigger: 'blur' },]">
              <el-select v-model="submitForm.code">
                <el-option v-for="(item, index) in classListData" :key="item.id" :value="item.id" :label="item.identifier">
                  <div @click="class_id = item.id">{{item.identifier}}</div>
                </el-option>
              </el-select>
            </el-form-item> -->
            <!-- <el-form-item 
              label="教室人数：" 
              prop="capacity"
              v-if="dialogType === 1"
              :rules="[{ required: true, message: '请输入教室人数', trigger: 'blur' },{ type: 'number', message: '教室人数必须为数字值'},]">
              <el-input v-model.number="submitForm.capacity"></el-input>
            </el-form-item> -->
            <el-form-item 
              label="备注：" 
              :rules="[{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]"
              prop="remarks">
              <el-input type='textarea' v-model="submitForm.remarks" rows="3"></el-input>
            </el-form-item> 
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="roomOperaDialog = false">取 消</el-button>
            <el-button v-if="dialogType === 1" type="primary" @click="submit('submitForm')">保 存</el-button>
            <el-button v-if="dialogType === 2" type="primary" @click="submit_('submitForm')">保 存</el-button>
          </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        searchForm:  {
          keys:          null,
          pageNum:       this.common.elementPagination.pageNumDefault,
          pageSize:      this.common.elementPagination.pageSizeDefault,
        }, 
        scrollLoadSw: true, //滚动加载开关
        cardsData:       { rows:[],total:0 },//实验室列表
        classListData:   null,//教室列表
        dialogType:         null,//弹框类型；1为创建弹框，2为编辑弹框。
        dialogTitle:        null,//弹框标题
        roomOperaDialog:    false,//弹框
        submitForm:{
          "l_name":        null,
          "instructions":null, 
          // "code":        null,
          // "capacity":    null,
          "remarks":     null,
        },
        class_id:        null,//添加实验室的教室id
        ids:             [],//删除实验室的id数组
        editId:          null,//编辑实验室的id
      }
    },
    created() {
      console.log(this.$store.state.authority);
    },
    mounted() {
      // ------ 滚动加载更多 -------
      // 通过$refs获取dom元素
      let box = this.$refs.contentWrap;
      // 监听这个dom的scroll事件
      box.addEventListener('scroll', () => {
      // 滑动到底部50的时候操作数据
      if(box.clientHeight + 50 >= box.scrollHeight - box.scrollTop ) {
        // ------ 值为true表示可以再次请求
        if(this.scrollLoadSw){
          this.scrollLoadSw = false;
          if(this.searchForm.pageNum < this.cardsData.total / this.searchForm.pageSize){
            this.getQueryList(false);
          } 
        }
         
        }  
      }, false)   

      //----- 初始化 ------- 
      this.getQueryList(true);
    },
    methods: {
      /*
       * 查询实验室列表，请求成功，或者失败，都将滚动状态isLoadMore设置为true
       * @params {bool} isRefresh true为重置数据 false累加数据
       */
      getQueryList(isRefresh){  
        this.axios.get(`${this.common.basePath}/lab/list`,{params: this._queryParams(isRefresh)}).then((response) => {
          // ---------- 当时加载更多是，就需要累加，否则直接覆盖
          if(!isRefresh) { 
            // ----------- 合并两个数组 ------------
            this.cardsData.rows = this.cardsData.rows.concat(response.data.data.rows);

            this.cardsData.total = response.data.data.total;
          }else{
            // ---------- 查询第一页数据 ---------  
            this.cardsData = response.data.data;
          }
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
        }).catch((error) => {
          this.$message.error(error); 
          // ------- 请求完毕，将滚动开关设置为true
          this.scrollLoadSw = true;
        });
      },
      _queryParams(isRefresh){
        isRefresh ? this.searchForm.pageNum = 1 : this.searchForm.pageNum ++;
        return this.searchForm;
      },
      /**
       * 清空 还原搜索表单
       */
      clearForm() {
        this.searchForm.keys = null
      },

      /**
       * 查询教室列表
       */
      getClassList(){  
        this.axios.get(`${this.common.basePath}/class/list`,{params:{pageNum:1,pageSize:10,}}).then((response) => {
          this.axios.get(`${this.common.basePath}/class/list`,{params:{pageNum:1,pageSize:response.data.data.total,}}).then((response) => {
             this.classListData = response.data.data.rows;
          }).catch((error) => {
            this.$message.error(error);  
          });
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 新建实验室
       */
      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/lab`,this.submitForm).then((response) => {
              this.getQueryList(true);
              this.$message.success('成功!'); 
              this.roomOperaDialog = false;
            }).catch((error) => {
              this.$message.error(error);
              this.roomOperaDialog = false;
            }); 
          } else { 
            return false;
          }
        });
        
      },

      /**
       * 重置弹框表单
       */
      resetSearchForm(){ 
        this.$refs.searchForm ? this.$refs.searchForm.resetFields() : '';
      },

      /**
       * 删除实验室
       */
      deleteRoom(){
        this.$confirm('将是否删除所选实验室?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var formData = new FormData();
          formData.append("ids",this.ids);
          this.axios.patch(`${this.common.basePath}/lab/delete`,formData).then((response) => {
            this.$message.success('成功!'); 
            this.getQueryList(true);
            this.ids = [];
          }).catch((error) => {
            this.$message.error(error);
            this.ids = [];
          }); 
        }).catch(() => {});
      },
      /*
        是否禁用删除按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('LabList_Delete',true) === false){//有权限
          if(this.ids.length!=0){//选中需要删除的实验室
            return false;
          }else{//未选中需要删除的实验室
            return true;
          }
        }else{//无权限
          return true;
        }
      },
      
      /**
       * 转详情
       */
      goToDetail (idA) {
        this.$router.push({name: "TestDetail", params: {id: idA}})
      },

      /**
       * 回显某实验室信息
       */
      echoLabInfo(id){
        this.axios.get(`${this.common.basePath}/lab/${id}`,{params:{}}).then((response) => {
          this.submitForm.instructions = response.data.data.instructions;
          this.submitForm.remarks = response.data.data.remarks;
          this.submitForm.l_name = response.data.data.l_name;
          this.submitForm.capacity = response.data.data.size;
          this.$set(this.submitForm,"code", response.data.data.address);
        }).catch((error) => {
          this.$message.error(error);
        }); 
      },
      /**
       * 编辑实验室
       */
      submit_(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let form = {
              instructions:this.submitForm.instructions,
              remarks:this.submitForm.remarks,
              l_name:this.submitForm.l_name,
              size:this.submitForm.capacity,
              address:this.submitForm.code,
            }
            this.axios.patch(`${this.common.basePath}/lab/${this.editId}`,form).then((response) => {
              this.getQueryList(true);
              this.$message.success('成功!'); 
              this.roomOperaDialog = false;
            }).catch((error) => {
              this.$message.error(error);
              this.roomOperaDialog = false;
            }); 
          } else { 
            return false;
          }
        });
        
      },
      
    }
  }
</script>
<style lang="less" scoped>
  .card-content_{
    min-height: 210px !important;
  }
  .card-bottom_{
    overflow:hidden;
    line-height:30px;
    .room{
      overflow: hidden;
      .room-list{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: calc(100% - 40px);
      }
    }
    .remarks{
      width:100%;
      overflow:hidden;
      .remarks-info{
        display: inline-block;
        white-space: nowrap;
        width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>