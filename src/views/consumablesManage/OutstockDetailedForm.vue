<!-- 出库单 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-if="paramsPage=='1'" :to="{ path: '/consumables/out' }">出库</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsPage=='2'" :to="{ path: '/consumables/myout' }">我的申请</el-breadcrumb-item>
        <el-breadcrumb-item v-if="paramsPage=='1'">出库单</el-breadcrumb-item> 
        <el-breadcrumb-item v-if="paramsPage=='2'">我的申请单</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="true">
          <el-col v-if="true" :span="24"> 
            <el-form :model="instockDetailedForm" ref="instockDetailedForm" label-width="120px" :rules="instockDetailedRules" class="instockDetailedForm">
              <!-- <el-form-item label="出库人：" prop="approver">
                <el-select v-model="instockDetailedForm.approver" class="fill-width" placeholder="请选择">
                  <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}-出库人`"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="出库类型：" prop="applyType">
                <el-select v-model="instockDetailedForm.applyType" class="fill-width" placeholder="请选择" @change="onChange" :disabled="paramsType=='2'||paramsType=='3'">
                  <el-option v-for="(item, index) in applyTypeList" :value="item.id" :label="item.name" :key="`${index}-出库类型`"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系电话：" prop="applyPhone"><el-input v-model="instockDetailedForm.applyPhone" :disabled="paramsType=='3'"></el-input></el-form-item>
              <el-form-item label="出库备注：" prop="description"><el-input type="textarea" v-model="instockDetailedForm.description" :disabled="paramsType=='3'"></el-input></el-form-item>
              <el-form-item label="出库清单：" prop="articles" class="is-required">
                <el-row :gutter="20">
                  <div v-for="(item,index) in instockDetailedForm.articles" :key="`${index}-出库清单`">
                    <el-col :span="24">
                      <el-card shadow="" class="marb10" style="position:relative">
                        <i type="danger" v-if="paramsType=='1'||paramsType=='2'" @click="delete_articles(index)" class="el-icon-delete text-danger cursor-pointer" style="position:absolute;right:10px;top:10px;font-size:20px"></i>
                        <el-tabs v-model="item.activeName" @tab-click="handleClick($event,item,index)" v-if="instockDetailedForm.applyType==1">
                          <el-tab-pane label="耗材" name="first"  :disabled="paramsType=='2'||paramsType=='3'">
                            <el-form-item label="耗材类型：" prop="materialType" class='marb10'>
                              <el-cascader :options="typeTree" :props="typeTreeProps" v-model="item.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'modelForm01',index)}" :disabled="paramsType=='3'" filterable></el-cascader>
                            </el-form-item>
                            <el-form-item label="耗材型号：" prop="modelID" :rules="[{ required: false, message: '请选择', trigger: 'blur' },]" class="is-required">
                              <el-select v-model="item.modelID" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="item.materialType.length <= 0 || paramsType=='3'" @change="modelChange($event,index)" filterable>
                                <el-option v-for="(item_, index_) in dialogModelList01" :value="item_.id" :label="item_.materialModel+'（可用库存：'+(item_.inStockAmount?item_.inStockAmount:0)+'）'" :key="`${index_}-型号`"></el-option>
                              </el-select>
                              <span class="text-info" v-if="paramsType=='1'||paramsType=='2'">（若需改变；先选择设备耗材类型，再选择耗材型号）</span>
                            </el-form-item>
                          </el-tab-pane>
                          <el-tab-pane label="设备" name="second" :disabled="paramsType=='2'||paramsType=='3'">
                            <el-form-item label="耗材类型：" prop="materialType" class='marb10'>
                              <el-cascader :options="typeTree" :props="typeTreeProps" v-model="item.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'modelForm02',index)}" :disabled="paramsType=='3'" filterable></el-cascader>
                            </el-form-item>
                            <el-form-item label="耗材型号：" prop="modelID" :rules="[{ required: false, message: '请选择', trigger: 'change' },]" class="is-required">
                              <el-select v-model="item.modelID" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="item.materialType.length <= 0 || paramsType=='3'" @change="modelChange($event,index)" filterable>
                                <el-option v-for="(item_, index_) in dialogModelList02" :value="item_.id" :label="item_.materialModel+'（可用库存：'+(item_.inStockAmount?item_.inStockAmount:0)+'）'" :key="`${index_}-型号`"></el-option>
                              </el-select>
                              <span class="text-info" v-if="paramsType=='1'||paramsType=='2'">（若需改变；先选择设备耗材类型，再选择耗材型号）</span>
                            </el-form-item>
                          </el-tab-pane>
                        </el-tabs>
                        <br  v-if="instockDetailedForm.applyType!=1"/>
                        <!-- @change="getStoreList(index,$event);" -->
                        <el-form-item label="设备编号：" prop="identifier" class="is-required" v-if="instockDetailedForm.applyType!=1"><el-input v-model="item.identifier" placeholder='请输入序列号/编号，查询需加入出库清单的设备' :disabled="paramsType=='3'" @blur="blur($event,index)"></el-input></el-form-item>
                        <el-form-item label="设备：" prop="" v-if="instockDetailedForm.applyType!=1">
                          <!-- 表格数据 -->
                          <el-table :data="item.modelList">
                            <el-table-column label="耗材类型" prop="materialTypeName" show-overflow-tooltip width=""></el-table-column>
                            <el-table-column label="耗材型号" prop="materialModelName" width="" show-overflow-tooltip></el-table-column>
                            <el-table-column label="型号类型" prop="modelType" width="100">
                              <template slot-scope="scope">
                                <el-tag v-if='scope.row.modelType===1'>耗材</el-tag>
                                <el-tag  v-if='scope.row.modelType===2' type="success">设备</el-tag>
                              </template>
                            </el-table-column>
                            <el-table-column label="教室" prop="address" width="100" show-overflow-tooltip></el-table-column>
                            <el-table-column label="设备序列号" prop="serialNum" width="" show-overflow-tooltip></el-table-column>
                            <el-table-column label="数量" prop="amount" width="100"></el-table-column>
                            <el-table-column label="状态" show-overflow-tooltip>
                              <template slot-scope="scope">
                                <el-tag v-if='scope.row.curStatus===1' type="success">在库</el-tag>
                                <el-tag  v-if='scope.row.curStatus===2' type="warning">出库</el-tag>
                              </template>
                            </el-table-column>
                          </el-table>
                        </el-form-item>
                        <el-form-item label="数量：" prop="amount" :rules="[{ required: false, message: '请输入', trigger: 'blur' },]" class="is-required" v-if="instockDetailedForm.applyType==1">
                          <el-input-number v-model="item.amount" :min="0" :max="item.inStockAmount" class="fill-width" :disabled="paramsType=='3'"></el-input-number>
                        </el-form-item>
                        <el-form-item label="出库位置：" prop="outStockInfoHasStorehouseList" v-if="instockDetailedForm.applyType==1&&paramsType=='3'" class="is-required">
                          <el-row :gutter="20">                          
                            <div v-for="(itemChild,indexChild) in item.outStockInfoHasStorehouseList">
                              <el-col :span='10'>
                                <el-card shadow="" class="marb5" style='position:relative'>
                                  <i  v-if="paramsType=='3'" class="el-icon-delete text-danger cursor-pointer" style="position:absolute;top:5px;right:5px" @click="delete_outStockInfoHasStorehouseList(index,indexChild)"></i>
                                  <el-form-item label="教室：" prop="materialId" label-width="70px" :rules="[{ required: false, message: '请选择', trigger: 'blur' },]" class="is-required">
                                    <el-select v-model="itemChild.materialId" class="fill-width" placeholder="请选择" filterable>
                                      <el-option v-for="(itemChild_, itemIndex_) in item.materialStorehouseList" :value="itemChild_.id" :label="itemChild_.address" :key="`${itemIndex_}-子教室`"></el-option>
                                    </el-select>
                                  </el-form-item>
                                  <el-form-item label="数量：" prop="amount" label-width="70px" :rules="[{ required: false, message: '请输入', trigger: 'blur' },]" class="is-required">
                                    <el-input-number v-model="itemChild.amount" :min="0" :max="item.amount - sum(index,indexChild)" class="fill-width"></el-input-number>
                                  </el-form-item>
                                </el-card>
                              </el-col>
                            </div> 
                            <el-col :span='10'>
                              <el-button type="warning" size="mini" icon="el-icon-plus" class="mart10" @click="add_outStockInfoHasStorehouseList(index)"  v-if="paramsType=='3'">添 加</el-button>
                              <span class="text-info">（出库的数量之和需等于总数量）</span>
                            </el-col> 
                          </el-row>
                        </el-form-item>
                      </el-card>
                    </el-col>
                  </div>
                  <el-col :span='24'>
                    <el-button type="warning" icon="el-icon-plus" class="mart10" @click="add_articles()"  size="mini" v-if="paramsType=='1'||paramsType=='2'">添加清单</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col v-else :span="24" class="text-center text-info"> 你无权查看此内容 </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom_ overflow-hidden" v-if="true">
        <el-button v-if='paramsType=="1"' type="primary" size="" class="fr" @click='createInstockDetailedForm();' icon="el-icon-document-checked">保 存</el-button>
        <el-button v-if='paramsType=="2"' type="primary" size="" class="fr" @click='editInstockDetailedForm();' icon="el-icon-document-checked">确认修改</el-button>
        <el-button v-if='paramsType=="3"' type="primary" size="" class="fr" @click='dialog(1);' icon="el-icon-document-checked">同意出库</el-button>
        <el-button v-if='paramsType=="3"' type="danger" size="" class="fr marr10" @click='dialog(2);' icon="el-icon-document-checked">拒 绝</el-button>
        <el-button type="" v-if='paramsType=="2"||paramsType=="1"' size="" class="fr marr10" @click='reset(1);'>重 置</el-button>
        <el-button type="warning" size="" class="fr marr10" @click="$router.go(-1);">返 回</el-button>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>
    </div>

    <!-- 通过或者拒绝时 --> 
    <el-dialog :title="dialogType===1?'同意':'拒绝'" :visible.sync="dialogVisible" width="30vw">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="图片：" prop="approverFiles" v-if="dialogType===1">
          <upload buttonText="点击上传" :fileTypes="['png', 'jpg']" @uploadSuccess="(response) => {uploadFileSuccess(response)}"/>
          <file-show :fileList="form.approverFiles?[JSON.parse(form.approverFiles)]:[]" :closable="true" @handleClose="handleClose"></file-show>
        </el-form-item>
        <el-form-item label="备注：" prop="reason">
          <el-input v-model="form.reason" class="fill-width" placeholder="请输入" type="textarea"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  import FileShow from "../../components/FileShow.vue"
  export default {
    components: {
      upload,
      FileShow
    },
    data() {
      return {
        paramsPage:          this.$route.params.page,// page为1时出库单，为2时我的出库单
        paramsType:          this.$route.params.type,//  type为1时创建出库单，为2时编辑出库单，为3时出库操作
        paramsId:          this.$route.params.id,
        pageLoading:false,
        userList:[],
        typeTree: [],// 耗材类型树
        typeTreeProps: {// 耗材类型树配置
          label: 'materialType',
          value: 'id',
          children: 'childrens'
        },
        dialogModelList01: null, // 出库清单对话框中的耗材型号列表(耗材)
        dialogModelList02: null, // 出库清单对话框中的耗材型号列表(设备)
        housesList:[],
        modelForm:{},

        // 出库单弹框
        dialogInstockDetailedVisible:false,
        applyTypeList:[{id:1,name:'借出申请'},{id:2,name:'维修申请'},{id:3,name:'报废'}],
        instockDetailedForm: {
          // approver: Number(sessionStorage.getItem('Access-Key')),// 出库人
          applyType: 1,//出库类型
          description:null,// 出库备注
          applyPhone:null,
          articles: [ // 出库清单
            {
              amount:1,// 出库数量 
              inStockAmount:0,//可用库存
              materialType:[],// 耗材类型数组
              modelID:null,// 设备耗材型号id
              identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
              activeName:'first',// 耗材与设备的tab切换
              modelList:[],//通过序列号搜索得到的设备列表
            },
          ]
        },
        instockDetailedRules: {
          // approver: [{
          //   required: true, message: "请选择", trigger: "change"
          // }],
          applyType: [{
            required: true, message: "请选择", trigger: "change"
          }],
          applyPhone: [{
            required: true, message: "请输入", trigger: "blur"
          }],
          description: [
            { required: false, message: '请输入要求', trigger: 'blur' },
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' }
          ],
        },

        // 同意出库、拒绝的弹框
        dialogVisible: false,
        dialogType:1,//1是同意，2是拒绝
        form: {
          reason: null,
          approverFiles:   null,
        },
        rules: {
          reason: [
            { required: true, message: "请输入", trigger: "blur" },
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' }
          ],
          approverFiles: [
            { required: true, message: "请上传图片", trigger: "blur" }
          ],
        },
        
      };
    },
    computed: {
      
    },
    created () {
      this.getUserList();
      this.getTypeTree();
      // this.getHouseList();
    },
    mounted () {
      this.paramsType=='2'||this.paramsType=='3' ? this.getInstockDetailedInfo():'';
      this.paramsType=='1'?this.getModelAllList(1,false):'';
      this.paramsType=='1'?this.getUserBaseInfo():'';
    },
    methods: {

      /**
       * 创建时，给联系电话赋值
       * @author chuanlin.Xiao
       * @date   2019-12-11T11:04:07+0800
       * @return {[type]}                 [description]
       */
      getUserBaseInfo(){
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: sessionStorage.getItem("Access-Key")
          },
        }
        this.axios(config).then((response) => {
          this.instockDetailedForm.applyPhone = response.data.data.phone_num; 
          
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

      },

      /**
       * 图片上传成功
       * @return {[type]}          [description]
       */
      uploadFileSuccess(response) {
        this.form.approverFiles=JSON.stringify(response);
      },
      /**
       * 若需重传或者删除照图片片时，点击删除照片
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      handleClose(tag) {
        this.$confirm("是否删除该照片？", "提示", {
          comfirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.form.approverFiles=null;
        }).catch(err => {})  
      },

      blur(val,index){
        console.log(val.target.value)
        if(val.target.value == null||val.target.value==''){
          return;
        } else{
          let config = {method: "post",url: `${this.common.basePath}/storehouse/detail?serialNum=${val.target.value}`,data: {serialNum:val.target.value}}
          this.axios(config).then((response) => {

            if(response.data.data&&response.data.data.curStatus==1){
              this.instockDetailedForm.articles[index].modelList = [response.data.data]
            }else{
              this.$message.error('未查询到设备或者该设备不可用！！')
              this.instockDetailedForm.articles[index].identifier = null;
              this.instockDetailedForm.articles[index].modelList = []
            }
            
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }
          
      },
      /**
       * 查询当前可用库存
       * @author chuanlin.Xiao
       * @date   2019-12-06T15:25:54+0800
       * @return {[type]}                 [description]
       */
      modelChange(val,index){
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/detail?id=${val}`,
          data: {}
        }
        this.axios(config).then((response) => {
          this.instockDetailedForm.articles[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 累加求和
       */
      sum(index,indexChild){
        let array = this.instockDetailedForm.articles[index].outStockInfoHasStorehouseList;
        // reduce 语法实现数组的累加求和
        // total    必需。初始值, 或者计算结束后的返回值。
        // currentValue    必需。当前元素
        // currentIndex    可选。当前元素的索引
        // arr    可选。当前元素所属的数组对象。
        let sumVal = array.slice(0, indexChild).reduce(function (total, currentValue, currentIndex, arr) {
            return total + currentValue.amount;
        }, 0);
        return sumVal;
      },
      /**
       * 编辑时，获取入库信息
       */
      getInstockDetailedInfo() {
        let config = {
          method: "get",
          url: `${this.common.basePath}/materialApply/info`,
          params: {
            applyID:this.paramsId
          }
        }
        let that = this;
        that.getModelAllList(1,true)
        that.getModelAllList(2,true)
        this.axios(config).then((response) => {
          let formdata = response.data.data

          if(formdata.applyType==1){ //
            formdata.articles.forEach( function(element, index) {

              element.activeName = element.modelType==1?'first':'second'
              // element.materialType = [element.materialType]
              element.materialType = element.materialTypeCode.split('-').map(Number)
              that.modelChange(element.modelID,index)
              
            });
          }else{// 维修申请和报废 回显清单中的设备列表
            formdata.articles.forEach( function(element, index) {

              
              if(element.outStockInfoHasStorehouseList&&element.outStockInfoHasStorehouseList.length>0){
                
                element.modelList = element.outStockInfoHasStorehouseList
                element.modelList[0].materialTypeName = element.materialTypeName
                element.modelList[0].materialModelName = element.materialModelName
                element.modelList[0].modelType = element.modelType

                element.identifier = element.outStockInfoHasStorehouseList[0].identifier
              }

              element.activeName = element.modelType==1?'first':'second'
              // element.materialType = [element.materialType]
              element.materialType = element.materialTypeCode.split('-').map(Number)
              
            });
          }

          console.log('编辑回显信息：',formdata)
          this.instockDetailedForm = formdata
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 出库类型下拉项的onchange事件
       */
      onChange(val){
        this.reset(val)
        if(val==1){

        }else{

        }
      },
      /**
       * 切换耗材与设备，重置清单，重置耗材类型与型号下拉菜单
       */
      handleClick(tab,item,index){
        console.log('tab切换：',tab.name,item,index)
        if(this.paramsType=='2'||this.paramsType=='3'){
          // this.$confirm('切换类型将丢失原信息, 是否继续?', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'warning'
          // }).then(() => { 
          //   this._handleClick(tab,item,index)
          // }).catch(() => { this.instockDetailedForm.materialInStockInfos[index].activeName = tab.name=='first'?'second':'first' });

          this._handleClick(tab,item,index)
        }else{
          this._handleClick(tab,item,index)
        }
      },
      _handleClick(tab,item,index){

        if(tab.name=='second'){
          this.getModelAllList(2,true);// 获取dialogModelList02
        }else{
          this.getModelAllList(1,true);// 获取dialogModelList02
        }

        
        this.instockDetailedForm.articles[index].materialType = []
        if(tab.name=='first'){
          this.instockDetailedForm.articles[index].modelID = this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null

          //切换出库清单项，设置出库清单-耗材-耗材数量的最大值
          let config = {
            method: "post",
            url: `${this.common.basePath}/material_model/detail?id=${this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null}`,
            data: {}
          }
          this.axios(config).then((response) => {
            this.instockDetailedForm.articles[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })

        }else{
          if(!this.dialogModelList02){
            let config = {method: "post",url: `${this.common.basePath}/material_model/list`,data: {modelType:2}}
            this.axios(config).then((response) => {
              this.instockDetailedForm.articles[index].modelID = response.data.data.rows[0].id

              //切换出库清单项，设置出库清单-耗材-耗材数量的最大值
              let config = {
                method: "post",
                url: `${this.common.basePath}/material_model/detail?id=${response.data.data.rows[0].id}`,
                data: {}
              }
              this.axios(config).then((response) => {
                this.instockDetailedForm.articles[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
              }).catch((errorMsg) => {
                this.$message.error(errorMsg)
              })

            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          }else{
            this.instockDetailedForm.articles[index].modelID = this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:null

            //切换出库清单项，设置出库清单-耗材-耗材数量的最大值
            let config = {
              method: "post",
              url: `${this.common.basePath}/material_model/detail?id=${this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:null}`,
              data: {}
            }
            this.axios(config).then((response) => {
              this.instockDetailedForm.articles[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })

          }
        }
        this.instockDetailedForm.articles[index].identifier = null
        this.instockDetailedForm.articles[index].amount = 1
        this.instockDetailedForm.articles[index].activeName = tab.name
        this.instockDetailedForm.articles[index].modelList = []
      },
      /**
       * 添加出库清单项
       */
      add_articles(){
        
        let obj = {
          amount:1,// 出库数量 
          inStockAmount:0,//可用库存
          materialType:[],// 耗材类型数组
          modelID:this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:'',// 设备耗材型号id
          identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
          activeName:'first',// 耗材与设备的tab切换
          modelList:[],//通过序列号搜索得到的设备列表
        };

        //添加出库清单项，设置出库清单-耗材-耗材数量的最大值
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/detail?id=${obj.modelID}`,
          data: {}
        }
        this.axios(config).then((response) => {
          obj.inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

        this.instockDetailedForm.articles.push(obj);
      },
      /**
       * 删除出库清单项
       */
      delete_articles(index){
        this.instockDetailedForm.articles.splice(index,1);
      },
      /**
       * 添加出库位置（子教室）
       */
      add_outStockInfoHasStorehouseList(index){
        let obj = {
          materialId:this.instockDetailedForm.articles[index].materialStorehouseList&&this.instockDetailedForm.articles[index].materialStorehouseList.length>0?this.instockDetailedForm.articles[index].materialStorehouseList[0].id:null,// 子仓库id
          amount:1// 数量
        }
        this.instockDetailedForm.articles[index].outStockInfoHasStorehouseList.push(obj);
      },
      /**
       * 删除出库位置（子教室）
       */
      delete_outStockInfoHasStorehouseList(index,indexChild){
        this.instockDetailedForm.articles[index].outStockInfoHasStorehouseList.splice(indexChild,1);
      },
       /**
       * 查询耗材类型树
       * @return {[type]} [description]
       */
      getTypeTree() {
        let config = {method: "post",url: `${this.common.basePath}/material_type/tree`,data: {}};
        let self = this;
        this.axios(config).then((response) => {this.typeTree = response.data.data}).catch((errorMsg) => {this.$message.error(errorMsg)});
      },
      /**
       * 点击耗材类型树 将最终选择的类型进行耗材型号查询
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      cascaderChanged(val, formName,index) {
        let target = null
        if (formName == "modelForm01") {
          target = "dialogModelList01"
        }else if(formName == "modelForm02"){
          target = "dialogModelList02"
        }
        this.getModelList(val[val.length - 1], target,index)
      },
      /**
       * 根据类型Id与modelType获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id, target,index) {
        this.instockDetailedForm.articles[index].modelID = null;//先设置该型号id为null，防止dialogModelList01/dialogModelList02为null时，耗材型号label显示为id的情况
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            materialType: id,
            modelType:target=='dialogModelList01'?1:2
          }
        }
        this.axios(config).then((response) => {
          this[target] = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据modelType获取型号列表
       * @return {[type]} [description]
       */
      getModelAllList(modelType,tab) {
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            modelType:modelType
          }
        }
        this.axios(config).then((response) => {
          modelType==1?this.dialogModelList01 = response.data.data.rows:this.dialogModelList02 = response.data.data.rows
          if(this.paramsType=='1'&&response.data.data.total>0&&!tab){
            this.instockDetailedForm.articles[0].modelID = response.data.data.rows[0].id;// 创建时，设置第一个出库清单-耗材-耗材型号的初始值
            this.modelChange(response.data.data.rows[0].id,0);//创建时，设置第一个出库清单-耗材-耗材数量的最大值
          }
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查询用户列表
       * @return {[type]} [description]
       */
      getUserList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 9999
          }
        }
        this.axios(config).then((response) => {
          this.userList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查询教室列表
       * @return {[type]} [description]
       */
      getHouseList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_shelves/list`,
          data: {}
        }
        this.axios(config).then((response) => {
          this.housesList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据serialNum查询耗材列表
       * @return {[type]} [description]
       */
      getStoreList(index,val) {
        val==''?val=null:null;
        let data = {
          serialNum:val,
        }
        let config = {
          method: "post",
          url: `${this.common.basePath}/storehouse/list`,
          data: JSON.parse(JSON.stringify(data))
        }
        this.axios(config).then((response) => {
          this.instockDetailedForm.articles[index].modelList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 重置
       * @return {[type]} [description]
       */
      reset(val){
        this.instockDetailedForm = {
          // approver: Number(sessionStorage.getItem('Access-Key')),// 出库人
          applyType: val,//出库类型
          description:null,// 出库备注description
          applyPhone:null,
          articles: [ // 出库清单
            {
              amount:1,// 出库数量 
              inStockAmount:0,//可用库存
              materialType:[],// 耗材类型数组
              modelID:this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null,// 设备耗材型号id
              identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
              activeName:'first',// 耗材与设备的tab切换
              modelList:[],//通过序列号搜索得到的设备列表
            },
          ]
        };

        //重置时，设置出库清单-耗材-耗材数量的最大值
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/detail?id=${this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null}`,
          data: {}
        }
        this.axios(config).then((response) => {
          this.instockDetailedForm.articles[0].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

        //重置时，给联系电话赋值
        let config_ = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: sessionStorage.getItem("Access-Key")
          },
        }
        this.axios(config_).then((response) => {
          this.instockDetailedForm.applyPhone = response.data.data.phone_num?response.data.data.phone_num:this.instockDetailedForm.applyPhone; 
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

      },

      /**
       * 创建出库清单, 保存成功后清空表单信息
       * @return {[type]} [description]
       */
      createInstockDetailedForm() {

        let data = this.instockDetailedForm
        let that = this
        let flag = true;
        data.articles.forEach( function(element, index) {

          delete element.inStockAmount
          // delete element.materialType
          // delete element.activeName
          if(that.instockDetailedForm.applyType==1){
            delete element.identifier
            flag = true
          }else{
            element.amount = 1;
            if(element.modelList.length==0){
              that.$message.error('出库清单未筛选出需出库的设备！')
              flag = false
              return;
            }else{
              element.modelID = element.modelList[0].materialModel 
            }
          }
          // delete element.modelList
        });
        // console.log(data)

        let config = {
          method: "post",
          url: `${this.common.basePath}/materialApply/add` ,
          data: data
        }
        flag ? this._createInstockDetailedFormRequest(config) :''
      },
      _createInstockDetailedFormRequest(config){
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            // console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 清空表单信息
              // this.reset(1);
              this.paramsPage == '1' ? this.$router.push({name: "Out"}) : this.$router.push({name: "MyOut"});
            }).catch((errorMsg) => {
              this.reset(1);
              this.$message.error(errorMsg)
            })
          } else {
            return false;
          }
        })
      },

      /**
       * 编辑出库清单, 保存成功后返回仓库列表
       * @return {[type]} [description]
       */
      editInstockDetailedForm() {

        let data = this.instockDetailedForm
        let that = this
        let flag = true;
        data.articles.forEach( function(element, index) {

          delete element.inStockAmount
          // delete element.materialType
          // delete element.activeName
          if(that.instockDetailedForm.applyType==1){
            delete element.identifier
            flag = true
          }else{
            element.amount = 1;
            if(element.modelList.length==0){
              that.$message.error('出库清单未筛选出需报废/维修申请的设备！')
              flag = false
              return;
            }else{
              element.modelID = element.modelList[0].materialModel 
            }
          }
          // delete element.modelList
        });
        // console.log(data)

        let config = {
          method: "post",
          url: `${this.common.basePath}/materialApply/update` ,
          data: data
        }
        flag ? this._editInstockDetailedFormRequest(config) :''
      },
      _editInstockDetailedFormRequest(config){
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            // console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 返回出库列表
              this.paramsPage == '1' ? this.$router.push({name: "Out"}) : this.$router.push({name: "MyOut"});
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
            
          } else {
            return false;
          }
        })
      },

      /**
       * 同意出库清单, 保存成功后返回仓库列表
       * @return {[type]} [description]
       */
      agreeInstockDetailedForm() {
        let data = this.instockDetailedForm
        let that = this
        let flag = true;
        data.articles.forEach( function(element, index) {

          delete element.inStockAmount
          // delete element.materialType
          // delete element.activeName
          if(that.instockDetailedForm.applyType==1){
            delete element.identifier
            flag = true
          }else{
            element.amount = 1;
            if(element.modelList.length==0){
              that.$message.error('出库清单未筛选出需报废/维修申请的设备！')
              flag = false
              return;
            }else{
              element.modelID = element.modelList[0].materialModel 
            }
          }
          // delete element.modelList
        });
        // console.log(data)

        let config = {
          method: "post",
          url: `${this.common.basePath}/materialApply/agree` ,
          data: data
        }

        flag ? this._agreeInstockDetailedFormRequest(config) :''
      },
      _agreeInstockDetailedFormRequest(config){
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 返回出库列表
              this.paramsPage == '1' ? this.$router.push({name: "Out"}) : this.$router.push({name: "MyOut"});
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
            
          } else {
            return false;
          }
        })
      },

      /**
       * 弹出同意或者拒绝的弹框
       */
      dialog(type) {
        this.form = {
          reason: null,
          approverFiles:   null,
        };
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
        this.dialogVisible = true;
        this.dialogType = type;
      },
      submitForm(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.instockDetailedForm.reason = this.form.reason
            this.instockDetailedForm.approverFiles = this.form.approverFiles
            this.dialogType==1?this.agreeInstockDetailedForm():this.rejectInstockDetailedForm();
          } else {
            return false;
          }
        });
      },


      /**
       * 拒绝出库清单, 保存成功后返回仓库列表
       * @return {[type]} [description]
       */
      rejectInstockDetailedForm() {

        let data = this.instockDetailedForm

        let config = {
          method: "post",
          url: `${this.common.basePath}/materialApply/reject`,
          data: {id:data.id}
        }
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            // console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 返回出库列表
              this.paramsPage == '1' ? this.$router.push({name: "Out"}) : this.$router.push({name: "MyOut"});
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
            
          } else {
            return false;
          }
        })
      },

    }
  };
</script>