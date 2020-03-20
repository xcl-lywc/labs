<!-- 教室列表 -->
<template>
  <div class="content-wrap-box" ref="contentWrap">
    <!-- 头部导航栏 -->
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item>教室列表</el-breadcrumb-item>  -->

        <el-breadcrumb-item class="text-bold">
          <div class="breadcrumb-div">
            <div class="fl text-left-div">教室列表</div>
            <div class="text-right fr">
              <el-button type="primary" 
              @click="dialogType = 1 ; dialogTitle = '创建教室' ; roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' " :disabled="!common.checkAuthority('ClassroomList_Add',true)">新增</el-button>
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
        <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="60px">
          <el-form-item label="编码：">
            <el-input v-model="searchForm.keys"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getQueryList(true)" :disabled="!common.checkAuthority('ClassroomList_Search',true)">搜索</el-button>
            <el-button type="default" @click="clearForm">置空</el-button>
          </el-form-item>
        </el-form>
        <!-- 新增/删除 -->
        <div class="text-right overflow-hidden">
          <span class="fl mart10 marl20">{{'共计'+cardsData.total+'个教室'}}</span>
          <!-- <el-button type="primary" 
            @click="dialogType = 1 ; dialogTitle = '创建教室' ; roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' " :disabled="!common.checkAuthority('ClassroomList_Add',true)">新增</el-button>
          <el-button type="danger" @click="deleteRoom" :disabled="isDisabaledDelBtn()">删除</el-button>  -->
        </div>
        <!-- 卡片 -->
        <div class="padding-row" v-if="common.checkAuthority('ClassroomList_Search', true)">
          <el-row class="padding-row" v-if="cardsData.rows.length > 0">
            <el-checkbox-group v-model="ids" size="small">
            <el-col :span="8" v-for="(item, index) in cardsData.rows" :key="index">
              <el-card class="card-wrap card-wrap_s">
                <el-tag class="width-percentage" type="success">
                <h3 class="card-title marb0">
                  <el-checkbox :label="item.id" :disabled="!common.checkAuthority('ClassroomList_Delete',true)">&nbsp;</el-checkbox>
                  <span class="card-title">{{'编码：'+item.identifier}}</span>
                </h3>
                </el-tag>
                <p class="card-content cursor-pointer_T">简介：{{ item.instructions }}</p>
                <div class="card-bottom_">
                  <div class="remarks">
                    <el-tooltip effect="dark" :content="item.address" placement="top" v-if="item.address">
                      <span class="address fl">{{'地址: '+item.address}}</span>
                    </el-tooltip>
                    <span class="address fl"  v-else>地址: 暂无</span>
                    <el-button type="" size="mini" @click="goToDetail(item.id)" class="fr" :disabled="!common.checkAuthority('ClassroomList_QueryDetail',true)">查看</el-button>
                    <el-button type="primary" size="mini" @click="dialogType = 2 ; dialogTitle = '编辑教室' ; roomOperaDialog = true ; $refs.submitForm ? $refs.submitForm.resetFields() : '' ; editId = item.id; echoClassInfo(item.id);" class="fr marr10" :disabled="!common.checkAuthority('ClassroomList_Edit',true)">编辑</el-button>
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
      <!-- 创建教室 -->
      <el-dialog 
        width="550px"
        :title="dialogTitle" 
        :visible.sync="roomOperaDialog">
          <el-form ref="submitForm" :model="submitForm" label-width="110px" >
            <el-form-item 
              label="编码：" 
              prop="identifier"
              :rules="[{ required: true, message: '请输入教室编码', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]">
              <el-input v-model="submitForm.identifier"></el-input>
            </el-form-item>
            <el-form-item 
              label="使用描述：" 
              prop="instructions"
              :rules="[{ required: true, message: '请输入使用描述', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
              <el-input type='textarea' v-model="submitForm.instructions" rows="5"></el-input>
            </el-form-item>
            <el-form-item 
              label="教室地址：" 
              prop="address"
              :rules="[{ required: true, message: '请输入教室地址', trigger: 'blur' },{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },]">
              <el-input type='textarea' v-model="submitForm.address" rows="3"></el-input>
            </el-form-item>
            <el-form-item 
              label="教室坐标：" 
              :rules="[{ validator: (rule, value, callback) => {common.wordNumberValid(rule, value, callback, 'single')}, trigger: 'blur' },]"
              prop="coordinates">
              <el-input v-model="submitForm.coordinates" placeholder="（选填）"></el-input>
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
          keys:       null,
          pageNum:    this.common.elementPagination.pageNumDefault,
          pageSize:   this.common.elementPagination.pageSizeDefault,
        }, 
        scrollLoadSw: true, //滚动加载开关
        cardsData:  {
          rows:  [],
          total: 0
        },
        dialogType:         null,//弹框类型；1为创建弹框，2为编辑弹框。
        dialogTitle:        null,//弹框标题
        roomOperaDialog:    false,//弹框
        submitForm:{
          "identifier":     null,
          "instructions":   null, 
          "address":        null,
          "coordinates":      null,
        },
        ids:     [],//删除教室的id数组
        editId:null,//编辑教室的id
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
        this.axios.get(`${this.common.basePath}/class/list`,{params: this._queryParams(isRefresh)}).then((response) => {
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
       * 新建教室
       */
      submit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/class`,this.submitForm).then((response) => {
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
       * 删除教室
       */
      deleteRoom(){
        // this.$message('该功能暂未开放');
        // return;
        this.$confirm('是否删除所选教室?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var formData = new FormData();
          formData.append("ids",this.ids);
          this.axios.patch(`${this.common.basePath}/class/delete`,formData).then((response) => {
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
        if(!this.common.checkAuthority('ClassroomList_Delete',true) === false){//有权限
          if(this.ids.length!=0){//选中需要删除的教室
            return false;
          }else{//未选中需要删除的教室
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
        this.$router.push({name: "ClassroomDetail", params: {id: idA}})
      },

      /**
       * 回显某教室信息
       */
      echoClassInfo(id){
        this.axios.get(`${this.common.basePath}/class/${id}`,{params:{}}).then((response) => {
          this.submitForm = response.data.data;
        }).catch((error) => {
          this.$message.error(error);
        }); 
      },
      /**
       * 编辑教室
       */
      submit_(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.patch(`${this.common.basePath}/class/${this.editId}`,this.submitForm).then((response) => {
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
  .router-view-content{
    min-height:calc(100vh - 121px);
  }
  .card-bottom_{
    height: 30px;
    line-height:30px;
    .remarks{
      .address{
        display: inline-block;
        white-space: nowrap;
        width: 40%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
</style>