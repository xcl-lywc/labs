<!-- 入库单 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/consumables/record' }">入库</el-breadcrumb-item>
        <el-breadcrumb-item>入库单</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <el-row class="padding-row" v-if="true">
          <el-col v-if="true" :span="24"> 
            <el-form :model="instockDetailedForm" ref="instockDetailedForm" label-width="120px" :rules="instockDetailedRules" class="instockDetailedForm">
              <el-form-item label="入库类型：" prop="inStockType">
                <el-select v-model="instockDetailedForm.inStockType" class="fill-width" placeholder="请选择"  :disabled="paramsType=='2'" @change="onChange">
                  <el-option v-for="(item, index) in inStockTypeList" :value="item.id" :label="item.name" :key="`${index}-入库类型`"></el-option>
                </el-select>
                <span class="text-info">（维修入库只有设备的入库清单）</span>
              </el-form-item>
              <el-form-item label="入库人：" prop="consumer">
                <el-select v-model="instockDetailedForm.consumer" class="fill-width" placeholder="请选择" filterable>
                  <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}-入库人`"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库原因：" prop="reason"><el-input type="textarea" v-model="instockDetailedForm.reason"></el-input></el-form-item>
              <el-form-item label="入库清单：" prop="materialInStockInfos" class="is-required">
                <el-row :gutter="20">
                  <div v-for="(item,index) in instockDetailedForm.materialInStockInfos" :key="`${index}-入库清单`">
                    <el-col :span="24">
                      <el-card shadow="" class="marb10" style="position:relative">
                        <i type="danger"  @click="delete_materialInStockInfos(index)" class="el-icon-delete text-danger cursor-pointer" style="position:absolute;right:10px;top:10px;font-size:20px"></i>
                        <el-tabs v-model="item.activeName" @tab-click="handleClick($event,item,index)">
                          <el-tab-pane label="耗材" name="first"  :disabled="paramsType=='2'||instockDetailedForm.inStockType==3">
                            <el-form-item label="耗材类型：" prop="materialType" class='marb10'>
                              <el-cascader :options="typeTree" :props="typeTreeProps" v-model="item.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'modelForm01',index)}" filterable></el-cascader>
                            </el-form-item>
                            <el-form-item label="耗材型号：" prop="modelId" :rules="[{ required: false, message: '请选择', trigger: 'blur' },]" class="is-required">
                              <el-select v-model="item.modelId" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="item.materialType.length <= 0" @change="modelChange($event,index)" filterable>
                                <el-option v-for="(item_, index_) in dialogModelList01" :value="item_.id" :label="item_.materialModel" :key="`${index_}-型号`"></el-option>
                              </el-select>
                              <span class="text-info">（若需改变；先选择设备耗材类型，再选择耗材型号）</span>
                            </el-form-item>
                          </el-tab-pane>
                          <el-tab-pane label="设备" name="second" :disabled="paramsType=='2'||instockDetailedForm.inStockType==3">
                            <el-form-item  v-if="instockDetailedForm.inStockType==3||instockDetailedForm.inStockType==2" label="设备编号：" prop="identifier" class="is-required" placeholder="请输入设备编号，查询设备"><el-input v-model="item.identifier" @blur="blur($event,index)"></el-input></el-form-item>
                            <el-form-item label="耗材类型：" prop="materialType" class='marb10' v-if="instockDetailedForm.inStockType==1">
                              <el-cascader :options="typeTree" :props="typeTreeProps" v-model="item.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'modelForm02',index)}" :disabled="instockDetailedForm.inStockType==3||instockDetailedForm.inStockType==2" filterable></el-cascader>
                            </el-form-item>
                            <el-form-item label="耗材型号：" prop="modelId" :rules="[{ required: false, message: '请选择', trigger: 'change' },]" class="is-required" v-if="instockDetailedForm.inStockType==1">
                              <el-select v-model="item.modelId" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="item.materialType.length <= 0 || instockDetailedForm.inStockType==3||instockDetailedForm.inStockType==2" @change="modelChange($event,index)" filterable>
                                <el-option v-for="(item_, index_) in dialogModelList02" :value="item_.id" :label="item_.materialModel" :key="`${index_}-型号`"></el-option>
                              </el-select>
                              <span class="text-info" v-if="instockDetailedForm.inStockType==1">（若需改变；先选择设备耗材类型，再选择耗材型号）</span>
                            </el-form-item>
                            <el-form-item label="设备：" prop="" v-if="instockDetailedForm.inStockType==2||instockDetailedForm.inStockType==3" class='marb10'>
                              <el-form-item label="耗材类型：" prop="materialType" class='marb10'>
                                <el-cascader :options="typeTree" :props="typeTreeProps" v-model="item.materialType" class="fill-width" disabled></el-cascader>
                              </el-form-item>
                              <el-form-item label="耗材型号：" prop="modelId">
                                <el-select v-model="item.modelId" class="fill-width" disabled>
                                  <el-option v-for="(item_, index_) in dialogModelList02" :value="item_.id" :label="item_.materialModel" :key="`${index_}-型号`"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-form-item>
                            <el-form-item  v-if="instockDetailedForm.inStockType==1" label="设备序列号：" prop="serialNum"><el-input v-model="item.serialNum"></el-input></el-form-item>
                          </el-tab-pane>
                        </el-tabs>
                        <el-form-item label="仓库：" prop="materialInStockInfoHasStorehouses" class="is-required">
                          <el-row :gutter="20">                          
                            <div v-for="(itemChild,indexChild) in item.materialInStockInfoHasStorehouses">
                              <el-col :span='10'>
                                <el-card shadow="" class="marb5" style='position:relative'>
                                  <i v-if="item.activeName=='first'" class="el-icon-delete text-danger cursor-pointer" style="position:absolute;top:5px;right:5px" @click="delete_materialInStockInfoHasStorehouses(index,indexChild)"></i>
                                  <el-form-item label="教室：" prop="shelvesId" label-width="70px" :rules="[{ required: false, message: '请选择', trigger: 'blur' },]" class="is-required">
                                    <el-select v-model="itemChild.shelvesId" class="fill-width" placeholder="请选择" filterable>
                                      <el-option v-for="(itemChild_, itemIndex_) in housesList" :value="itemChild_.id" :label="itemChild_.className" :key="`${itemIndex_}-子仓库`"></el-option>
                                    </el-select>
                                  </el-form-item>
                                  <el-form-item label="数量：" prop="amount" label-width="70px" :rules="[{ required: false, message: '请输入', trigger: 'blur' },]" class="is-required">
                                    <!-- :max="item.inStockAmount - sum(index,indexChild)" -->
                                    <el-input-number v-model="itemChild.amount" :min="0"  class="fill-width" :disabled="item.activeName=='second'"></el-input-number>
                                  </el-form-item>
                                </el-card>
                              </el-col>
                            </div> 
                            <el-col :span='10' v-if="item.activeName=='first'">
                              <el-button type="warning" size="mini" icon="el-icon-plus" class="mart10" @click="add_materialInStockInfoHasStorehouses(index)">添加仓库</el-button>
                              <!-- <span class="text-info">（仓库的数量之和需小于或等于可用库存数量）</span> -->
                            </el-col> 
                          </el-row>
                        </el-form-item>
                      </el-card>
                    </el-col>
                  </div>
                  <el-col :span='24'>
                    <el-button type="warning" icon="el-icon-plus" class="mart10" @click="add_materialInStockInfos()"  size="mini">添加清单</el-button>
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
        <el-button type="primary" size="" class="fr" @click='paramsType=="1"?createInstockDetailedForm():editInstockDetailedForm();' icon="el-icon-document-checked">{{paramsType=='1'?'保 存':'确认修改'}}</el-button>
        <el-button type="" size="" class="fr marr10" @click='reset(1);'>重 置</el-button>
        <el-button type="warning" size="" class="fr marr10" @click='$router.go(-1);'>返 回</el-button>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>
    </div>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        paramsType:        this.$route.params.type,
        paramsId:          this.$route.params.id,
        pageLoading:false,
        userList:[],
        typeTree: [],// 耗材类型树
        typeTreeProps: {// 耗材类型树配置
          label: 'materialType',
          value: 'id',
          children: 'childrens'
        },
        dialogModelList01: null, // 入库清单对话框中的耗材型号列表(耗材)
        dialogModelList02: null, // 入库清单对话框中的耗材型号列表(设备)
        housesList:[],
        modelForm:{},

        // 入库单弹框
        dialogInstockDetailedVisible:false,
        instockDetailedForm: {
          inStockType:1,//入库类型
          consumer: null,// 入库人
          reason:null,// 入库原因
          materialInStockInfos: [ // 入库清单
            {
              materialType:[],// 耗材类型数组
              modelId:null,// 设备耗材型号id
              serialNum:null,
              identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
              activeName:'first',// 耗材与设备的tab切换
              inStockAmount:0,//可用库存
              materialInStockInfoHasStorehouses:[ // 仓库列表
                {
                  shelvesId:null,// 子仓库id
                  amount:1// 数量
                }
              ]
            },
          ]
        },
        instockDetailedRules: {
          consumer: [{
            required: true, message: "请选择", trigger: "change"
          }],
          inStockType: [{
            required: true, message: "请选择", trigger: "change"
          }],
          reason: [
            { required: false, message: '请输入要求', trigger: 'blur' },
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' }
          ],
          
        },
        inStockTypeList:[{name:'入库',id:1},{name:'借出归还',id:2},{name:'维修入库',id:3}],
        
      };
    },
    computed: {
      
    },
    created () {
      // this.instockDetailedForm.consumer = Number(sessionStorage.getItem('Access-Key'));
      this.getUserList();
      this.getTypeTree();
      this.getHouseList();
    },
    mounted () {
      this.paramsType=='2'?this.getInstockDetailedInfo():'';
      this.paramsType=='1'?this.getModelAllList(1,false):'';
      // this.paramsType=='1'?this.getModelAllList(2,true):'';
    },
    methods: {
      
      
      blur(val,index){
        console.log(val.target.value)
        if(val.target.value == null||val.target.value==''){
          return;
        } else{
          let config = {method: "post",url: `${this.common.basePath}/storehouse/detail?serialNum=${val.target.value}`,data: {serialNum:val.target.value}}
          this.axios(config).then((response) => {
            if(response.data.data&&response.data.data.curStatus==2){
              this.instockDetailedForm.materialInStockInfos[index].modelId = response.data.data.materialModel;
              this.instockDetailedForm.materialInStockInfos[index].materialType = response.data.data.materialTypeCode.split('-').map(Number);
            }else{
              this.instockDetailedForm.materialInStockInfos[index].identifier = null;
              this.instockDetailedForm.materialInStockInfos[index].modelId = null;
              this.instockDetailedForm.materialInStockInfos[index].materialType = [];
              this.$message.error('未查询到设备或者该设备不可用！！')
            }
            
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }
          
        
      },
      /**
       * 入库类型下拉项的onchange事件
       */
      onChange(val){
        this.instockDetailedForm.inStockType = val;
        this.reset(val)
        
        if(val==3){
          this.instockDetailedForm.materialInStockInfos[0].activeName = 'second';
          if(!this.dialogModelList02){
            
            let config = {method: "post",url: `${this.common.basePath}/material_model/list`,data: {modelType:2}}
            this.axios(config).then((response) => {
              this.dialogModelList02 = response.data.data.rows
              this.instockDetailedForm.materialInStockInfos[0].modelId = response.data.data.rows[0].id
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          }else{
            this.instockDetailedForm.materialInStockInfos[0].modelId = this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:null
          }
        }else{

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
          this.instockDetailedForm.materialInStockInfos[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 累加求和
       */
      sum(index,indexChild){
        let array = this.instockDetailedForm.materialInStockInfos[index].materialInStockInfoHasStorehouses;
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
          url: `${this.common.basePath}/material_instock/select_detail`,
          params: {
            id:this.paramsId
          }
        }
        let that = this;
        that.getModelAllList(1,true)
        that.getModelAllList(2,true)
        this.axios(config).then((response) => {
          let formdata = response.data.data
          formdata.materialInStockInfos.forEach( function(element, index) {

            element.activeName = element.modelType==1?'first':'second'
            // element.materialType = [element.materialType]
            element.materialType = element.materialTypeCode.split('-').map(Number)
            that.modelChange(element.modelId,index)
            
          });
          this.instockDetailedForm = formdata
          console.log('编辑回显信息：',formdata)
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 切换耗材与设备，重置清单，重置耗材类型与型号下拉菜单
       */
      handleClick(tab,item,index){
        console.log('tab切换：',tab.name,item,index)
        if(this.paramsType=='2'){
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
        
        let obj = {
          shelvesId:this.housesList.length>0?this.housesList[0].id:null,// 子仓库id
          amount:1// 数量
        }
        this.instockDetailedForm.materialInStockInfos[index].materialInStockInfoHasStorehouses = [obj]
        
        this.instockDetailedForm.materialInStockInfos[index].materialType = []
        if(tab.name=='first'){
          this.instockDetailedForm.materialInStockInfos[index].modelId = this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null

          //切换入库清单项，设置入库清单-耗材-耗材数量的最大值
          let config = {
            method: "post",
            url: `${this.common.basePath}/material_model/detail?id=${this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null}`,
            data: {}
          }
          this.axios(config).then((response) => {
            this.instockDetailedForm.materialInStockInfos[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }else{
          if(!this.dialogModelList02){
            let config = {method: "post",url: `${this.common.basePath}/material_model/list`,data: {modelType:2}}
            this.axios(config).then((response) => {
              this.instockDetailedForm.materialInStockInfos[index].modelId = response.data.data.rows[0].id

              //切换入库清单项，设置入库清单-耗材-耗材数量的最大值
              let config = {
                method: "post",
                url: `${this.common.basePath}/material_model/detail?id=${response.data.data.rows[0].id}`,
                data: {}
              }
              this.axios(config).then((response) => {
                this.instockDetailedForm.materialInStockInfos[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
              }).catch((errorMsg) => {
                this.$message.error(errorMsg)
              })

            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          }else{
            this.instockDetailedForm.materialInStockInfos[index].modelId = this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:null

            //切换入库清单项，设置入库清单-耗材-耗材数量的最大值
            let config = {
              method: "post",
              url: `${this.common.basePath}/material_model/detail?id=${this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:null}`,
              data: {}
            }
            this.axios(config).then((response) => {
              this.instockDetailedForm.materialInStockInfos[index].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          }
        }
        this.instockDetailedForm.materialInStockInfos[index].serialNum = null
        this.instockDetailedForm.materialInStockInfos[index].identifier = null
        this.instockDetailedForm.materialInStockInfos[index].activeName = tab.name
      },
      /**
       * 添加入库清单项
       */
      add_materialInStockInfos(){
        let obj = {
          materialType:[],// 耗材类型数组
          modelId:this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:'',// 设备耗材型号id
          identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
          serialNum:null,
          activeName:this.instockDetailedForm.inStockType==3?'second':'first',// 耗材与设备的tab切换
          inStockAmount:0,//可用库存
          materialInStockInfoHasStorehouses:[ // 仓库列表
            {
              shelvesId:this.housesList&&this.housesList.length>0?this.housesList[0].id:null,// 子仓库id
              amount:1// 数量
            }
          ]
        };
        if(this.instockDetailedForm.inStockType==3){
          obj.modelId = this.dialogModelList02&&this.dialogModelList02.length>0?this.dialogModelList02[0].id:''
        }

        //添加入库清单项，设置入库清单-耗材-耗材数量的最大值
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/detail?id=${obj.modelId}`,
          data: {}
        }
        this.axios(config).then((response) => {
          obj.inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

        this.instockDetailedForm.materialInStockInfos.push(obj);
      },
      /**
       * 删除入库清单项
       */
      delete_materialInStockInfos(index){
        this.instockDetailedForm.materialInStockInfos.splice(index,1);
      },
      /**
       * 添加仓库项（子仓库）
       */
      add_materialInStockInfoHasStorehouses(index){
        let obj = {
          shelvesId:this.housesList&&this.housesList.length>0?this.housesList[0].id:null,// 子仓库id
          amount:1// 数量
        }
        this.instockDetailedForm.materialInStockInfos[index].materialInStockInfoHasStorehouses.push(obj);
      },
      /**
       * 删除仓库项（子仓库）
       */
      delete_materialInStockInfoHasStorehouses(index,indexChild){
        this.instockDetailedForm.materialInStockInfos[index].materialInStockInfoHasStorehouses.splice(indexChild,1);
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
        this.instockDetailedForm.materialInStockInfos[index].modelId = null;//先设置该型号id为null，防止dialogModelList01/dialogModelList02为null时，耗材型号label显示为id的情况
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
            this.instockDetailedForm.materialInStockInfos[0].modelId = response.data.data.rows[0].id;// 创建时，设置第一个入库清单-耗材-耗材型号的初始值
            this.modelChange(response.data.data.rows[0].id,0);//创建时，设置第一个入库清单-耗材-耗材数量的最大值
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
          if(response.data.data.total>0&&this.paramsType=='1'){//  创建时，设置第一个入库清单-仓库-子仓库的教室的初始值
            this.instockDetailedForm.materialInStockInfos[0].materialInStockInfoHasStorehouses[0].shelvesId = response.data.data.rows[0].id
          }
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 重置
       * @return {[type]} [description]
       */
      reset(val){
        this.instockDetailedForm.inStockType = val;
        this.instockDetailedForm = {
          inStockType:val,//入库类型
          consumer: null,// 入库人
          reason:null,// 入库原因
          materialInStockInfos: [ // 入库清单
            {
              materialType:[],// 耗材类型数组
              modelId:this.dialogModelList01&&this.dialogModelList01.length>0?this.dialogModelList01[0].id:null,// 设备耗材型号id
              identifier:null,// 设备耗材型号类型为耗材（modelType为1）时，不传serialNum
              serialNum:null,
              activeName:this.instockDetailedForm.inStockType==3?'second':'first',// 耗材与设备的tab切换
              materialInStockInfoHasStorehouses:[ // 仓库列表
                {
                  shelvesId:this.housesList&&this.housesList.length>0?this.housesList[0].id:null,// 子仓库id
                  amount:1// 数量
                }
              ]
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
          this.instockDetailedForm.materialInStockInfos[0].inStockAmount = response.data.data.inStockAmount?response.data.data.inStockAmount:0;
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 创建入库清单, 保存成功后清空表单信息
       * @return {[type]} [description]
       */
      createInstockDetailedForm() {

        let data = this.instockDetailedForm
        let flag = true;
        let that = this;

        if(data.inStockType!=1){
          data.materialInStockInfos.forEach( function(element, index) {
            if(!element.identifier&&element.activeName=='second'){
              that.$message.error('入库清单未筛选出需借出归还/维修入库的设备！')
              flag = false;
              return;
            }
          });
        }

        data.materialInStockInfos.forEach( function(element, index) {
          delete element.inStockAmount
          // delete element.materialType
          // delete element.activeName
        });

        let config = {
          method: "post",
          url: this.instockDetailedForm.inStockType==1?`${this.common.basePath}/storehouse/in-stock/add`:`${this.common.basePath}/storehouse/in-stock/return` ,
          data: data
        }
        
        flag ? this._createInstockDetailedFormRequest(config) :''
        
      },
      _createInstockDetailedFormRequest(config){
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 清空表单信息
              // this.reset(1);
              this.$router.push({name: "Record"});
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
       * 编辑入库清单, 保存成功后返回仓库列表
       * @return {[type]} [description]
       */
      editInstockDetailedForm() {

        let data = this.instockDetailedForm
        let flag = true;
        let that = this;

        if(data.inStockType!=1){
          data.materialInStockInfos.forEach( function(element, index) {
            if(!element.identifier&&element.activeName=='second'){
              that.$message.error('入库清单未筛选出需借出归还/维修入库的设备！')
              flag = false;
              return;
            }
          });
        }

        data.materialInStockInfos.forEach( function(element, index) {
          delete element.inStockAmount
          // delete element.materialType
          // delete element.activeName
        });

        let config = {
          method: "post",
          url: `${this.common.basePath}/storehouse/in-stock/update` ,
          data: data
        }

        flag ? this._editInstockDetailedForm(config) :''
        
      },
      _editInstockDetailedForm(config){
        this.$refs.instockDetailedForm.validate(valid => {
          if(valid) {
            console.log(config.data)
            this.axios(config).then((response) => {
              this.$message.success(response.data.meta.message)
              // 返回入库列表
              this.$router.push({name: "Record"});
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
            
          } else {
            return false;
          }
        })
      }
    }
  };
</script>