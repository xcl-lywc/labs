<!-- 实验设备 -->
<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>实验设备</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <div v-if="common.checkAuthority('DeviceList-list', true)">
          <el-form ref="searchForm" :model="searchForm" label-width="120px" @submit.native.prevent>
            <el-row>
              <el-col :span="8" v-if="common.checkAuthority('DeviceList-standardTree') && typeTree.length > 0">
                <el-form-item label="设备规格：" prop="types">
                  <el-cascader :options="typeTree" :props="typeTreeProps" v-model="searchForm.types" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'searchForm')}"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthority('DeviceList-typeList')">
                <el-form-item label="设备型号：" prop="model_id">
                  <el-select v-model="searchForm.model_id" class="fill-width" placeholder="请先选择规格后再选择型号" :disabled="searchForm.types.length <= 0">
                    <el-option v-for="(item, index) in modelList" :value="item.id" :label="item.model_name" :key="`${index}型号`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="编号：" prop="identifier">
                  <el-input class="fill-width" v-model="searchForm.identifier"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="设备状态：" prop="cur_status">
                  <el-select v-model="searchForm.cur_status" class="fill-width">
                    <el-option v-for="(item, index) in common.curStatus" :value="item.id" :label="item.label" :key="`设备状态${index}`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getDeviceList('init')">搜索</el-button>
                  <el-button type="default" @click="clearForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table
            :data="tableData.rows"
            :row-key="getRowKeys"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              :reserve-selection="true"
              width="55">
            </el-table-column>
            <el-table-column label="编号" prop="identifier" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="序列号" prop="serial_num" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" prop="type_name" show-overflow-tooltip></el-table-column>
            <el-table-column label="型号" prop="model_name"></el-table-column>
            <el-table-column label="位置" prop="code"></el-table-column>
            <el-table-column label="管理员" prop="manager_name"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">{{ common.transferDeviceStatus(scope.row.cur_status)}}</template>
            </el-table-column>
            <el-table-column label="操作" width="480">
              <template slot-scope="scope">
                <el-button type="default" size="mini" :disabled="!common.checkAuthority('DeviceList-qrcode', true)" @click="$store.commit('exchangeShowStatus', scope.row)">二维码</el-button>
                <el-button type="default" size="mini" :disabled="!common.checkAuthority('DeviceList-series', true)" @click="editSeries(scope.row)">序列号</el-button>
                <el-button type="success" size="mini" :disabled="scope.row.cur_status > 1 || !common.checkAuthority('DeviceList-transe', true)" @click="transDevice(scope.row)">转移</el-button>
                <el-button type="primary" size="mini" :disabled="scope.row.cur_status >= 2 || !common.checkAuthority('DeviceList-borrow', true)" @click="borrowDevice(scope.row)">借出</el-button>
                <el-button type="warning" size="mini" :disabled="scope.row.cur_status >= 2 || !common.checkAuthority('DeviceList-repair', true)" @click="repairDevice(scope.row)">维修</el-button>
                <el-button type="danger" size="mini" :disabled="scope.row.cur_status >= 20 || !common.checkAuthority('DeviceList-scrap', true)" @click="scrapDevice(scope.row, '1')">报废</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('DeviceList-list', true)">
        <div>
          <el-button type="primary" @click="addDevice" size="mini" :disabled="!common.checkAuthority('DeviceList-add', true)">添加设备</el-button>
          <el-popover
            class="pop-button"
            placement="top"
            width="50px"
            trigger="click">
            <!-- <el-table :data="gridData">
              <el-table-column width="150" property="date" label="日期"></el-table-column>
              <el-table-column width="100" property="name" label="姓名"></el-table-column>
              <el-table-column width="300" property="address" label="地址"></el-table-column>
            </el-table> -->
            <p>请选择尺寸</p>
            <el-button type="primary" @click="downloadQrcode(3)" size="mini">小尺寸</el-button>
            <el-button type="primary" @click="downloadQrcode(7)" size="mini">大尺寸</el-button>

            <el-button slot="reference" :disabled="selection.length <= 0 || !common.checkAuthority('DeviceList-qrcode', true)" type="default" size="mini">批量导出二维码</el-button>
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

    <el-dialog title="添加设备" :visible.sync="dialogDeviceVisible" width="60vw">
      <el-form :model="deviceForm" ref="deviceForm" label-width="100px" :rules="deviceRules">
        <el-form-item label="设备管理员：">
          <el-select v-model="deviceForm.manager" class="fill-width" placeholder="请选择设备管理员">
            <el-option v-for="(item, index) in userDeviceList" :value="item.id" :label="item.user_name" :key="`${index}设备管理员列表`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格：">
          <el-cascader :options="typeTree" :props="typeTreeProps" v-model="deviceForm.types" change-on-select class="fill-width" @change="(val) => {cascaderChanged(val, 'deviceForm')}"></el-cascader>
        </el-form-item>
        <el-form-item label="型号：" prop="d_model_id">
          <el-select v-model="deviceForm.d_model_id" class="fill-width" placeholder="请先选择规格后再选择型号" :disabled="deviceForm.types.length <= 0">
            <el-option v-for="(item, index) in dialogModelList" :value="item.id" :label="item.model_name" :key="`${index}型号`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台数：" prop="size"><el-input-number v-model="deviceForm.size" :min="0" class="fill-width"></el-input-number></el-form-item>
        <el-form-item label="教室：" prop="class_room_id">
          <el-select v-model="deviceForm.class_room_id" class="fill-width" placeholder="请选择教室(可输入关键字筛选)" filterable>
            <el-option v-for="(item, index) in classroomList" :value="item.id" :label="item.identifier" :key="`${index}教室`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeviceVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('deviceForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="转移" :visible.sync="dialogTransVisible" width="30vw">
      <el-form :model="transForm" ref="transForm" :rules="transRules">
        <el-form-item label="教室：" prop="class_room_id">
          <el-select v-model="transForm.class_room_id" class="fill-width" placeholder="请选择教室(可输入关键字筛选)" filterable>
            <el-option v-for="(item, index) in classroomList" :value="item.id" :label="item.identifier" :key="`${index}教室`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTransVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitTransForm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="借出" :visible.sync="dialogBorrowVisible" width="30vw">
      <el-form :model="borrowForm" ref="borrowForm" :rules="borrowRules">
        <el-form-item label="借用人：" prop="lend_user">
          <el-select v-model="borrowForm.lend_user" class="fill-width" placeholder="请选择借用人" @change="getPersonTel">
            <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}用户列表`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系号码：" prop="telephone">
          <el-input v-model="borrowForm.telephone" class="fill-width" placeholder="请输入联系号码"></el-input>
        </el-form-item>
        <el-form-item label="照片：" prop="picture">
          <upload buttonText="点击上传" :fileTypes="['png', 'jpg']" @uploadSuccess="(response) => {uploadFileSuccess(response)}"/>
          <file-show :fileList="borrowForm.picture" :closable="true" @handleClose="handleClose"></file-show>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBorrowVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBorrowForm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="维修" :visible.sync="dialogRepairVisible" width="30vw">
      <el-form :model="repairForm" ref="repairForm" :rules="repairRules">
        <el-form-item label="报修人：" prop="user_id">
          <el-select v-model="repairForm.user_id" class="fill-width" placeholder="请选择报修人">
            <el-option v-for="(item, index) in userList" :value="item.id" :label="item.user_name" :key="`${index}用户列表2`"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="理由：">
          <el-input v-model="repairForm.reason" class="fill-width" placeholder="请输入报修原因">
          </el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRepairVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitRepairForm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="报废" :visible.sync="dialogScrapVisible" width="30vw">
      <el-form :model="scrapForm" ref="scrapForm" label-width="100px">
        <el-form-item label="理由：">
          <el-input v-model="scrapForm.reason" class="fill-width" placeholder="请输入报废原因">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogScrapVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitScrapForm()">确 定</el-button>
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
    data () {
      return {
        //设备列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
        getRowKeys(row) {
          return row.id;
        },

        typeTree: [],
        typeTreeProps: {
          label: 'd_name',
          value: 'id',
          children: 'children'
        },
        modelList: null, //型号列表 在选择规格树后查询
        dialogModelList: null, // 对话框中的型号列表
        userDeviceList:null,//设备管理员列表
        userList: null,  //用户列表 用于选择借用人、报废人、维修人
        labList: null,   //实验室列表 用于选择
        classroomList: null, //教室列表 用于选择

        searchForm: {
          types: [], //规格数组
          model_id: null,
          cur_status: null
        },
        pageNum: 1,
        pageSize: 10,
        tableData: {
          rows: [],
          total: 0,
        },
        selection: [],
        tempDevice: null, //当前操作的设备对象

        dialogDeviceVisible: false,
        deviceForm: {
          types: [],
          d_model_id: null,
          class_room_id: null
        },
        deviceRules: {
          manager: [{
            required: true, message: "请选择管理人", trigger: "change"
          }],
          size: [{
            required: true, message: "请选择型号", trigger: "change"
          }],
          d_model_id: [{
            required: true, message: "请选择型号", trigger: "change"
          }],
          class_room_id: [{
            required: true, message: "请选择教室", trigger: "change"
          }],
        },

        dialogBorrowVisible: false,
        borrowForm: {
          lend_user: null,
          telephone: null,
          picture:   [],
        },
        borrowRules: {
          lend_user: [
            { required: true, message: "请选择借用人", trigger: "change" }
          ],
          telephone: [
            { required: true, message: "请输入联系号码", trigger: "blur" }
          ],
          picture: [
            { required: true, message: "请上传照片", trigger: "change" }
          ],
        },

        dialogRepairVisible: false,
        repairForm: {
          user_id: null
        },
        repairRules: {
          user_id: [
            { required: true, message: "请选择报修人", trigger: "change" }
          ],
          // reason: [{
          //   required: true, message: "请填写理由", trigger: "change"
          // }]
        },

        dialogTransVisible: false,
        transForm: {
          class_room_id: null
        },
        transRules: {
          class_room_id: [
            { required: true, message: "请选择教室", trigger: "change" }
          ]
        },

        dialogScrapVisible: false,
        scrapForm: {
          reason: null
        },
        scrapRules: {
          reason: [
            { required: true, message: "请填写理由", trigger: "change" }
          ]
        },
      }
    },
    created() {
      this.typeTree = JSON.parse(sessionStorage.getItem("typeTree")) || []
      // console.log(this.$store.state.authority)
      // console.log(this.common.checkAuthority('DeviceList-add', true))
    },
    mounted() {
      if(this.common.checkAuthority('DeviceList-list', true)) {
        this.searchForm.cur_status = this.common.curStatus[1].id // 初始查询在库状态 即第二个状态
        this.getDeviceList("init")
        this.getUserList()
        this.getUserDeviceList();
        this.getClassroomList()
      }
    },
    methods: {
      /**
       * 根据搜索条件查询用户列表
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
          url: `${this.common.basePath}/device/list`,
          data: JSON.parse(JSON.stringify(data))
        }

        if(this.searchForm.types && this.searchForm.types.length > 0) {
          config.data.type_id = this.searchForm.types[this.searchForm.types.length - 1]
        }
        delete config.data.types

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
       * 点击规格树 将最终选择的规格进行型号查询
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      cascaderChanged(val, formName) {
        let target = null
        if (formName == "searchForm") {
          this[formName].model_id = null
          target = "modelList"
        } else if (formName == "deviceForm") {
          this[formName].d_model_id = null
          target = "dialogModelList"
        }
        this.getModelList(val[val.length - 1], target)
      },
      /**
       * 根据分类Id获取型号列表
       * @return {[type]} [description]
       */
      getModelList(id, target) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/spec/select/model/public`,
          params: {
            id: id
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
       * 根据搜索条件查询用户列表
       * @return {[type]} [description]
       */
      getUserList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 999
          }
        }
        this.axios(config).then((response) => {
          this.userList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据搜索条件查询设备管理员列表
       * @return {[type]} [description]
       */
      getUserDeviceList() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: {
            pageNum: 1,
            pageSize: 999,
            roles: 6
          }
        }
        this.axios(config).then((response) => {
          this.userDeviceList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据分类Id获取型号列表
       * @return {[type]} [description]
       */
      getLabList() {
        let config = {
          method: "get",
          url: `${this.common.basePath}/lab/list`,
          params: {
            pageNum: 1,
            pageSize: 999
          }
        }
        this.axios(config).then((response) => {
          this.labList = response.data.data.rows
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据分类Id获取型号列表
       * @return {[type]} [description]
       */
      getClassroomList() {
        let config = {
          method: "get",
          url: `${this.common.basePath}/class/list`,
          params: {
            pageNum: 1,
            pageSize: 999
          }
        }
        this.axios(config).then((response) => {
          this.classroomList = response.data.data.rows
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
       * 添加设备
       */
      addDevice() {
        this.dialogDeviceVisible = true
        this.deviceForm = {
          types: [],
          d_model_id: null,
          class_room_id: null
        }
        this.clearForm('deviceForm')
      },
      /**
       * 点击修改序列号
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      editSeries(row) {
        let self = this
        self.$prompt('<span><i class="required-label"></i>修改序列号</span>', '序列号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: row.serial_num,
          dangerouslyUseHTMLString: true,
          inputValidator: (value) => {
            if(value) {
              return true
            } else {
              self.$message.error("请检查必填项")
              return false
            }
          },
          inputErrorMessage: "请输入序列号"
        }).then(({value}) => {
          let config = {
            method: "put",
            url: `${self.common.basePath}/device/update`,
            data: { 
              id: row.de_id,
              serial_num: value,
            }
          }
          if(value) {
            self.axios(config).then((response) => {
              self.$message.success(response.data.meta.message)
              this.getDeviceList(false)
            }).catch((errorMsg) => {
              self.$message.error(errorMsg)
            })
          } else {
          }
        }).catch((error) => {
        });
      },
       /**
       * 点击借出按钮
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      borrowDevice(row) {
        this.borrowForm = {
          lend_user: null,
          telephone: null,
          picture:   [],
        },
        this.clearForm("borrowForm")
        this.borrowForm.de_id = [row.id]
        this.borrowForm.user_id = JSON.parse(sessionStorage.getItem("Access-Key")) || null
        this.dialogBorrowVisible = true
      },
      /**
       * 选择借出人时，获取该借出人手机号码
       * @author chuanlin.Xiao
       * @date   2019-11-14T14:02:37+0800
       * @return {[type]}                 [description]
       */
      getPersonTel(val){
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: val
          }
        }
        this.axios(config).then((response) => {
          this.borrowForm.telephone = response.data.data.phone_num
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
      /**
       * 照片上传成功
       * @return {[type]}          [description]
       */
      uploadFileSuccess(response) {
        this.borrowForm.picture.push(response);
        console.log(this.borrowForm.picture)
      },
      /**
       * 若需重传或者删除照片时，点击删除照片
       * @param  {[type]} tag [description]
       * @return {[type]}     [description]
       */
      handleClose(tag) {
        this.$confirm("是否删除该照片？", "提示", {
          comfirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.borrowForm.picture.splice(this.borrowForm.picture.indexOf(tag), 1);
          console.log(this.borrowForm.picture)
        }).catch(err => {})  
      },
      /**
       * 点击维修按钮(单个 或 批量)
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      repairDevice(row) {
        this.repairForm = {
          user_id: null,
          // reason: null
        },
        this.clearForm("repairForm")
        this.repairForm.de_id = [row.id]
        this.dialogRepairVisible = true
      },
      /**
       * 点击转移按钮
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      transDevice(row) {
        this.transForm = {
          class_room_id: null,
        },
        this.clearForm("transForm")
        this.transForm.id = row.id
        this.dialogTransVisible = true
      },
      /**
       * 点击报废按钮
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      scrapDevice(row, type) {
        // this.scrapForm = {
        //   reason: null,
        // },
        // this.clearForm("scrapForm")
        // this.scrapForm.de_id = [row.id]
        // this.scrapForm.user_id = JSON.parse(sessionStorage.getItem("Access-Key")) || null
        // this.dialogScrapVisible = true
        this.common.scrapDevice(row, type).then( _ => {
          this.getTableList()
        }).catch(_ => {

        })
      },
      /**
       * 提交表单
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/device/add/${this[formName].size}`,
              data: this[formName]
            }
            this.axios(config).then((response) => {
              this.getDeviceList("init")
              this.$message.success(response.data.meta.message)
              this.dialogDeviceVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
            return false
          }
        })
      },
      /**
       * 提交借出
       * @return {[type]} [description]
       */
      submitBorrowForm() {
        this.$refs.borrowForm.validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/br/add`,
              data: this.borrowForm
            }

            config.data.picture = JSON.stringify(config.data.picture)

            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogBorrowVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
            return false
          }
        })
      },
      /**
       * 提交维修
       * @return {[type]} [description]
       */
      submitRepairForm() {
        this.$refs.repairForm.validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/repair/add`,
              data: this.repairForm
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogRepairVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
            return false
          }
        })
      },
      /**
       * 提交维修
       * @return {[type]} [description]
       */
      submitTransForm() {
        this.$refs.transForm.validate((valid) => {
          if(valid) {
            let config = {
              method: "patch",
              url: `${this.common.basePath}/device/update`,
              data: this.transForm
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogTransVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
            return false
          }
        })
      },
      /**
       * 提交报废
       * @return {[type]} [description]
       */
      submitScrapForm() {
        this.$refs.scrapForm.validate((valid) => {
          if(valid) {
            let config = {
              method: "post",
              url: `${this.common.basePath}/scrap/add`,
              data: this.scrapForm
            }
            this.axios(config).then((response) => {
              this.getDeviceList()
              this.$message.success(response.data.meta.message)
              this.dialogScrapVisible = false
            }).catch((errorMsg) => {
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
            return false
          }
        })
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.getDeviceList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getDeviceList()
      },
      /**
       * 多选的值变化
       * @param  {Array} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        this.selection = val
      },
      /**
       * 下载二维码文件
       * @param  {[type]} size [description]
       * @return {[type]}      [description]
       */
      downloadQrcode(size) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/device/qr`,
          params: {
            ids: this.selection.map(item => {
              return item.id
            }).join(","),
            flag: size
          }
        }
        this.axios(config).then((response) => {
          // console.log(response)
          window.location = response.request.responseURL
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },
    }
  }
</script>
<style lang="less">
  .pop-button {
    margin-left: 10px;
  }
</style>