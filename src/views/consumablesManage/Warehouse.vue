<!-- 耗材仓库 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>耗材仓库</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Warehouse-list', true)">
           <!-- 搜索表单 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px" @submit.native.prevent>
            <el-row>
              <el-col :span="8">
                <el-form-item label="教室：" prop="classId">
                  <el-select v-model="searchForm.classId" placeholder="请选择该教室" class="fill-width" filterable>
                    <el-option v-for="(item, index) in classList" :value="item.id" :label="item.identifier" :key="`${index}教室`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthority('Warehouse-typeTree', true) && typeTree.length > 0">
                <el-form-item label="耗材类型：" prop="materialType">
                  <el-cascader :options="typeTree" :props="typeTreeProps" v-model="searchForm.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'searchForm')}" filterable></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthority('Warehouse-modelList', true)">
                <el-form-item label="耗材型号：" prop="materialModel">
                  <el-select v-model="searchForm.materialModel" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="searchForm.materialType.length <= 0" filterable>
                    <el-option v-for="(item, index) in modelList" :value="item.id" :label="item.materialModel" :key="`${index}型号`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getDeviceList('init')" :disabled="!common.checkAuthority('Warehouse-query', true)">搜索</el-button>
                  <el-button type="default" @click="clearForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
           <!-- 表格数据 -->
          <el-table
            :data="tableData.rows"
            v-loading="tableLoading"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55">
            </el-table-column>
            <el-table-column label="耗材类型" prop="materialTypeName" show-overflow-tooltip width=""></el-table-column>
            <el-table-column label="耗材型号" prop="materialModelName" width="" show-overflow-tooltip></el-table-column>
            <el-table-column label="型号类型" prop="modelType" width="100">
              <template slot-scope="scope">
                <el-tag v-if='scope.row.modelType===1'>耗材</el-tag>
                <el-tag  v-if='scope.row.modelType===2' type="success">设备</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="教室" prop="address" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备编号" prop="identifier" width="" show-overflow-tooltip></el-table-column>
            <el-table-column label="设备序列号" prop="serialNum" width="" show-overflow-tooltip></el-table-column>
            <el-table-column label="数量" prop="amount" width="100"></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag v-if='scope.row.curStatus===1' type="success">在库</el-tag>
                <el-tag  v-if='scope.row.curStatus===2' type="warning">出库</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="320">
              <template slot-scope="scope">
                <el-button type="default" size="mini" :disabled="!common.checkAuthority('Warehouse-qrcode', true)" @click="$store.commit('exchangeShowStatus_', scope.row)">二维码</el-button>
                <el-button type="default" size="mini" @click="showDetailDialog(scope.row)">查 看</el-button>
                <el-button type="primary" size="mini" @click="editDevice(scope.row)" :disabled="!common.checkAuthority('Warehouse-edit', true)">编 辑</el-button>
                <!-- <el-button type="success" @click="addRecord(scope.row)" size="mini" :disabled="!common.checkAuthority('Record-add', true)">新增记录</el-button> -->
                <el-button type="danger" size="mini" @click="deleteMaterial(scope.row,'single')" :disabled="!common.checkAuthority('Warehouse-delete', true)">删 除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('Warehouse-list', true)">
        <div>
          <!-- <el-button type="primary" @click="addInstock" size="mini" :disabled="!common.checkAuthority('Warehouse-add', true)">入库</el-button> -->
          <el-button type="primary" @click="addDevice" size="mini" :disabled="!common.checkAuthority('Warehouse-add', true)">添加耗材</el-button>
          <el-button type="danger" @click="deleteMaterial(null,'multiple')" size="mini" :disabled="isDisabaledDelBtn()">批量删除</el-button>
          <el-popover
            class="pop-button"
            placement="top"
            width="50px"
            trigger="click">
            <p>请选择尺寸</p>
            <el-button type="primary" @click="downloadQrcode(3)" size="mini">小尺寸</el-button>
            <el-button type="primary" @click="downloadQrcode(7)" size="mini">大尺寸</el-button>
            
            <el-button slot="reference" :disabled="selection.length <= 0 || !common.checkAuthority('Warehouse-qrcode-download', true)" type="default" size="mini">批量导出二维码</el-button>
          </el-popover>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.total"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange"
          >
        </el-pagination>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>
    </div>

    <el-dialog title="新增耗材" :visible.sync="dialogDeviceVisible" width="60vw">
      <el-form :model="deviceForm" ref="deviceForm" label-width="100px" :rules="deviceRules">
        <el-form-item label="耗材类型：">
          <el-cascader :options="typeTree" :props="typeTreeProps" v-model="deviceForm.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'deviceForm')}"></el-cascader>
        </el-form-item>
        <el-form-item label="耗材型号：" prop="materialModel">
          <el-select v-model="deviceForm.materialModel" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="deviceForm.materialType.length <= 0">
            <el-option v-for="(item, index) in dialogModelList" :value="item.id" :label="item.materialModel" :key="`${index}型号`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耗材数量：" prop="amount"><el-input-number v-model="deviceForm.amount" :min="0" class="fill-width"></el-input-number></el-form-item>
        <el-form-item label="备注：" prop="description"><el-input type="textarea" v-model="deviceForm.description"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeviceVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('deviceForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑耗材信息" :visible.sync="dialogDeviceVisible_" width="60vw">
      <el-form :model="deviceForm" ref="deviceForm" label-width="100px" :rules="deviceRules">
        <el-form-item label="耗材类型：">
          <el-cascader :options="typeTree" :props="typeTreeProps" v-model="deviceForm.materialType" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'deviceForm')}"></el-cascader>
        </el-form-item>
        <el-form-item label="耗材型号：" prop="materialModel">
          <el-select v-model="deviceForm.materialModel" class="fill-width" placeholder="请先选择类型后再选择型号" :disabled="deviceForm.materialType.length <= 0">
            <el-option v-for="(item, index) in dialogModelList" :value="item.id" :label="item.materialModel" :key="`${index}型号`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耗材数量：" prop="amount"><el-input-number v-model="deviceForm.amount" :min="0" class="fill-width"></el-input-number></el-form-item>
        <el-form-item label="备注：" prop="description"><el-input type="textarea" v-model="deviceForm.description"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeviceVisible_ = false">取 消</el-button>
        <el-button type="primary" @click="submitForm_('deviceForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增记录" :visible.sync="dialogRecordVisible" width="60vw">
      <el-form :model="recordForm" ref="recordForm" label-width="100px" :rules="recordRules">
        <el-form-item label="器材使用者：" prop="consumer">
          <el-select v-model="recordForm.consumer" class="fill-width" placeholder="请选择该器材使用者">
            <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}使用者`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耗材数量：" prop="amount"><el-input-number v-model="recordForm.amount" :min="0" class="fill-width"></el-input-number></el-form-item>
        <el-form-item label="类型：" prop="recordType">
          <el-select v-model="recordForm.recordType" class="fill-width" placeholder="请选择记录类型">
            <el-option v-for="(item, index) in recordList" :value="item.id" :label="item.name" :key="`${index}类型`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原因：" prop="reason"><el-input type="textarea" v-model="recordForm.reason"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRecordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRecordForm('recordForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="新增入库申请" :visible.sync="dialogInstockVisible" width="60vw">
      <el-form :model="instockForm" ref="instockForm" label-width="100px" :rules="instockRules">
        <el-form-item label="处理人：" prop="consumer">
          <el-select v-model="instockForm.consumer" class="fill-width" placeholder="请选择处理人" @change="getInstockApplyList();">
            <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}-处理人`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="耗材数量：" prop="amount"><el-input-number v-model="instockForm.amount" :min="0" class="fill-width"></el-input-number></el-form-item>
        <el-form-item label="原因：" prop="reason"><el-input type="textarea" v-model="instockForm.reason"></el-input></el-form-item>
        <el-form-item label="入库清单：" prop="reason">
          <el-table
            :data="instockApplyList.rows"
            @expand-change = 'outTableExpandChangeEvent'
            style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="instockDetailedList.rows"
                  style="width: 100%">
                  <el-table-column
                    label="商品 ID"
                    prop="id">
                  </el-table-column>
                  <el-table-column
                    label="商品名称"
                    prop="name">
                  </el-table-column>
                  <el-table-column
                    label="描述"
                    prop="desc">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              label="商品 ID"
              prop="id">
            </el-table-column>
            <el-table-column
              label="商品名称"
              prop="name">
            </el-table-column>
            <el-table-column
              label="描述"
              prop="desc">
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInstockVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitInstockForm('instockForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="耗材详情" :visible.sync="dialogDetailVisible" width="50vw">
        <el-form :model="detailData" label-width="120px" label-position="left">
          <el-form-item label="耗材类型："><span>{{detailData.materialTypeName}}</span></el-form-item>
          <el-form-item label="耗材型号："><span>{{detailData.materialModelName}}</span></el-form-item>
          <el-form-item label="型号类型：">
            <el-tag v-if='detailData.modelType===1'>耗材</el-tag>
            <el-tag  v-if='detailData.modelType===2' type="success">设备</el-tag>
          </el-form-item>
          <el-form-item label="教室："><span>{{detailData.address}}</span></el-form-item>
          <el-form-item label="设备序列号："><span>{{detailData.serialNum}}</span></el-form-item>
          <el-form-item label="数量："><span>{{detailData.amount}}</span></el-form-item>
          <el-form-item label="创建人："><span>{{detailData.creatorName}}</span></el-form-item>
          <el-form-item label="创建时间："><span>{{common._convertDate(detailData.createTime,'yyyy/MM/dd')}}</span></el-form-item>
          <el-form-item label="备注："><span>{{detailData.description}}</span></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogDetailVisible = false">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableLoading:false,
        //搜索条件
        typeTree: [],// 类型树
        typeTreeProps: {
          label: 'materialType',
          value: 'id',
          children: 'childrens'
        },
        modelList: null, //型号列表 在选择类型树后查询
        searchForm: {
          materialType: [], //类型数组
          materialModel: null,
          classId: null,
        },
        pageNum: 1,
        pageSize: 10,

        //耗材列表
        tableData: {
          rows: [],
          total: 0,
        },
        selection: [],
        getRowKeys(row) {//耗材列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
          return row.id;
        },
        tempDevice: null, //当前操作的设备对象

        // 新增耗材、编辑耗材信息
        dialogDeviceVisible: false,
        dialogDeviceVisible_:false,
        dialogModelList: null, // 对话框中的型号列表
        deviceForm: {
          materialType:[],// 类型数组
          materialModel: null,
          amount: 0,
          description: null,
          classId: null,
          // "identifier": "string",
          // "serialNum": "string",
          // "shelvesId": 0
        },
        deviceRules: {
          materialModel: [{
            required: true, message: "请选择", trigger: "change"
          }],
          amount: [{
            required: true, message: "请选择", trigger: "blur"
          }],
        },
        classList:[],

        // 新增记录
        dialogRecordVisible: false,
        recordForm: {
          amount: 0,
          consumer: null,
          recordType: 1,
          reason: null,
        },
        userList:[],
        recordList: [{name:'消耗记录',id:1},{name:'入库记录',id:2}], // 记录类型
        recordRules: {
          amount: [{
            required: true, message: "请选择", trigger: "blur"
          }],
          consumer: [{
            required: true, message: "请选择", trigger: "change"
          }],
          recordType: [{
            required: true, message: "请选择", trigger: "change"
          }],
        },

        // 新增入库申请
        dialogInstockVisible:false,
        instockForm: {
          amount: 0,
          consumer: null,
          reason: null,
        },
        userList:[],
        instockRules: {
          amount: [{
            required: true, message: "请选择", trigger: "blur"
          }],
          consumer: [{
            required: true, message: "请选择", trigger: "change"
          }],
        },
        instockApplyList:{rows:[],total:0},// 入库申请列表
        instockDetailedList:{rows:[],total:0},// 入库清单

        //耗材详情弹框
        dialogDetailVisible: false,
        detailData: {}

      }
    },
    created() {
      let config = {method: "post",url: `${this.common.basePath}/material_type/tree`,data: {}};
      let self = this;
      this.axios(config).then((response) => {this.typeTree = response.data.data}).catch((errorMsg) => {this.$message.error(errorMsg)});
      // console.log(this.$store.state.authority)
      console.log(this.common.checkAuthority('Warehouse-list', true))
    },
    mounted() {
      if(this.common.checkAuthority('Warehouse-list', true)) {
        this.getDeviceList("init")
        this.getUserList();
        this.getClassList();
      }
    },
    methods: {

      /**
       * 下载二维码文件
       * @param  {[type]} size [description]
       * @return {[type]}      [description]
       */
      downloadQrcode(size) {
        let params = {
            ids: this.selection.map(item => {
              return item.id
            }).join(","),
            flag: size
          }
        this.axios.get(`${this.common.basePath}/storehouse/qr`,{responseType: "blob",params:params}).then((response) => {
          this.common._fileBold(response);
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击类型树 将最终选择的类型进行型号查询
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      cascaderChanged(val, formName) {
        let target = null
        if (formName == "searchForm") {
          this[formName].materialModel = null
          target = "modelList"
        } else if (formName == "deviceForm") {
          this[formName].materialModel = null
          target = "dialogModelList"
        }
        this.getModelList(val[val.length - 1], target)
      },
      /**
       * 根据类型Id获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id, target) {
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            materialType: id,
          }
        }
        this.axios(config).then((response) => {
          this[target] = response.data.data.rows
          if(this.$refs.deviceForm) {
            this.$refs.deviceForm.resetFields()
          }
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
       /**
       * 清空 还原搜索表单
       * @return {[type]} [description]
       */
      clearForm(formName) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
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
      getClassList() {
        let config = {
          method: "get",
          url: `${this.common.basePath}/class/list`,
          params: {
            pageNum: 1,
            pageSize: 9999
          }
        }
        this.axios(config).then((response) => {
          this.classList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 查询入库申请列表
       * @return {[type]} [description]
       */
      getInstockApplyList() {

        let config = {
          method: "post",
          url: `${this.common.basePath}/material_instock/select_apply`,
          data: {
            pageNum: 1,
            pageSize: 10,
            consumer: this.instockForm.consumer,
            // creator: 2,
          }
        }
        this.axios(config).then((response) => {
          this.instockApplyList = response.data.data

        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      outTableExpandChangeEvent(row, expandedRows){
        console.log(row,expandedRows)
        this.getInstockDetailedList(row.id)
      },
      /*
       * 获取对应申请的入库清单
       */
      getInstockDetailedList(instockId){
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_info/select`,
          data: {instockId:instockId}
        }
        this.axios(config).then((response) => {
          this.instockDetailedList = response.data.data
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 根据搜索条件查询耗材列表
       * @return {[type]} [description]
       */
      getDeviceList(init) {
        this.tableLoading = true

        let data = this.searchForm
        if(init == "init") { // 需要初始化查询
          this.pageNum = 1
          this.pageSize = 10
        }
        data.pageNum  = this.pageNum
        data.pageSize = this.pageSize

        let config = {
          method: "post",
          url: `${this.common.basePath}/storehouse/list`,
          data: JSON.parse(JSON.stringify(data))
        }

        
        if(this.searchForm.materialType && this.searchForm.materialType.length > 0) {
          config.data.materialType = this.searchForm.materialType[this.searchForm.materialType.length - 1]
        }else{
          delete config.data.materialType
        }

        this.axios(config).then((response) => {
          this.tableData = response.data.data
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 耗材列表查询的分页
       * @param  {[type]}                 val [description]
       * @return {[type]}                     [description]
       */
      pageSizeChange(val) {
        this.pageSize = val
        this.getDeviceList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getDeviceList()
      },
      /**
       * 新增耗材
       */
      addDevice() {
        this.$message('暂无此功能！')
        return;
        this.dialogDeviceVisible = true
        this.deviceForm = {
          materialType:[],// 类型数组
          materialModel: null,
          amount: 0,
          description: null,
        }
        this.$nextTick(_ => {
          this.$refs.deviceForm.clearValidate()
        })
      },
      /**
       * 提交新增耗材表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/storehouse/add`,
              data: {
                materialModel: this.deviceForm.materialModel,
                amount: this.deviceForm.amount,
                description: this.deviceForm.description,
                // "serialNum": "string",
                // "shelvesId": 0
              }
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogDeviceVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确！")
            return false
          }
        })
      },
      /**
       * 编辑耗材信息
       */
      editDevice(data){
        this.$message('暂无此功能！')
        return;
        let config = {
          method: "post",
          url: `${this.common.basePath}/material_model/list`,
          data: {
            materialType: data.materialType,
          }
        }
        this.axios(config).then((response) => {
          this.dialogModelList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
        this.dialogDeviceVisible_ = true
        this.deviceForm = JSON.parse(JSON.stringify({materialType:[],id:data.id,materialModel:data.materialModel,amount:data.amount,description:data.description}))
      },
      /**
       * 提交编辑耗材信息表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm_(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/material/update`,
              data: {
                id:this.deviceForm.id,
                materialModel: this.deviceForm.materialModel,
                amount: this.deviceForm.amount,
                description: this.deviceForm.description,
              }
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogDeviceVisible_ = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确！")
            return false
          }
        })
      },
      /**
       * 新增记录
       */
      addRecord(data){
        this.dialogRecordVisible = true;
        this.recordForm = {
          amount: 0,
          consumer: null,
          recordType: null,
          reason: null,
        }
        this.recordForm.materialId = data.id;
        this.$nextTick(_ => {
          this.$refs.recordForm.clearValidate()
        })
      },
      /**
       * 提交新增记录的表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitRecordForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: this.recordForm.recordType===1?`${this.common.basePath}/material_record/consume/add`:`${this.common.basePath}/material_record/storage/add`,
              data: {
                materialId: this.recordForm.materialId,
                amount: this.recordForm.recordType===1?~this.recordForm.amount:this.recordForm.amount,
                consumer: this.recordForm.consumer,
                reason: this.recordForm.reason,
              }
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogRecordVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确！")
            return false
          }
        })
      },
      /**
       * 新增入库
       */
      addInstock(data){
        this.dialogInstockVisible = true;
        this.instockForm = {
          amount: 0,
          consumer: null,
          reason: null,
        }
        this.$nextTick(_ => {
          this.$refs.instockForm.clearValidate()
        })
      },

      /**
       * 提交新增入库的表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitInstockForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/material_instock/create_apply`,
              data: {
                // amount: this.instockForm.amount,
                consumer: this.instockForm.consumer,
                reason: this.instockForm.reason,
              }
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogInstockVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确！")
            return false
          }
        })
      },
      /**
       * 显示详情
       * @param  {[type]} id [description]
       * @return {[type]}    [description]
       */
      showDetailDialog(row) {
        this.detailData = JSON.parse(JSON.stringify(row))
        this.dialogDetailVisible = true;
      },
      /**
       * 删除耗材
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      deleteMaterial(row,type) {
        this.$message('暂无此功能！')
        return;
        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {

          let config = {
            method: "post",
            url: `${this.common.basePath}/material/delete`,
            data: type==='single'?[row.id]:[]
          }

          if(type!='single'){
            this.selection.forEach( function(element, index) {
              config.data.push(element.id)
            });
          }
          
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.getDeviceList()
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      /**
       * 耗材列表 多选的值变化
       * @param  {Array} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        this.selection = val
      },
      /*
        是否禁用删除按钮
       */
      isDisabaledDelBtn(){
        if(!this.common.checkAuthority('Warehouse-delete',true) === false){//有权限
          if(this.selection.length!=0){//选中需要删除的教室
            return false;
          }else{//未选中需要删除的教室
            return true;
          }
        }else{//无权限
          return true;
        }
      },
    }
  }
</script>
<style lang="less">
  .pop-button {
    margin-left: 10px;
  }
</style>