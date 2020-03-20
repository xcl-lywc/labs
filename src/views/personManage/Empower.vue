<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>授权管理</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <div v-if="common.checkAuthority('Empower-list', true)">
          <!-- 搜索表单 -->
          <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="角色：">
                  <el-select v-model="searchForm.role" class="fill-width" placeholder="请选择角色">
                    <el-option :value="item.id" :label="item.role_name" v-for="(item, index) in roleListData" :key="`角色${index}`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthorityTree('Faculty-tree')">
                <el-form-item v-if="facultyTreeData" label="系别：">
                  <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="facultyChoosed" change-on-select class="fill-width" placeholder="请选择系别"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工号/学号：" >
                  <el-input class="fill-width" v-model="searchForm.account" placeholder="请输入学号"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="姓名：">
                  <el-input class="fill-width" v-model="searchForm.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="入校时间：">
                  <el-date-picker v-model="searchForm.timeRange" type="daterange" class="fill-width" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年级：" prop="grade_num">
                  <el-input v-model="searchForm.grade_num" type="number"><template slot="append">届</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getUserList(1, 'tableData', 'searchForm', true)">搜索</el-button>
                  <el-button type="default" @click="clearSearchForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table v-loading="tableLoading" :data="tableData.rows">
            <el-table-column label="姓名" prop="name" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别" width="80"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
            <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
            <el-table-column label="院系" prop="faculty" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="年级" width="100">
              <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
            </el-table-column>
            <el-table-column label="班级" width="80">
              <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
            </el-table-column>
            <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" prop="mail" width="250" show-overflow-tooltip></el-table-column>transferPersonStatus
            <el-table-column label="状态"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" :disabled="!common.checkAuthority('Empower-deletePower', true)" @click="deleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
    
      <!-- 页面底部 -->
      <div class="router-view-bottom" v-if="common.checkAuthority('Empower-list', true)">
        <div>
          <el-button type="primary" size="mini" :disabled="!common.checkAuthority('Empower-addPower', true)" @click="addPower">添加授权</el-button>
        </div>
        <!-- 分页 -->
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :current-page="pageNum"
          :page-size="pageSize"
          :total="tableData.total"
          @size-change="pageSizeChange"
          @current-change="pageCurrentChange">
        </el-pagination>
      </div>
      <div v-else class="router-view-bottom"><div></div></div>

      <!-- 添加授权dialog -->
      <el-dialog :visible.sync="dialogEmpowerVisible" :title="`添加 ${activeRoleName} 的授权`" width="80vw">
        <el-form ref="dialogSearchForm" :model="dialogSearchForm" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item v-if="facultyTreeData" label="系别：">
                <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="dialogFacultyChoosed" change-on-select class="fill-width" placeholder="请选择系别"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工号/学号：" >
                <el-input class="fill-width" v-model="dialogSearchForm.account" placeholder="请输入学号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="姓名：">
                <el-input class="fill-width" v-model="dialogSearchForm.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="入校时间：">
                <el-date-picker v-model="dialogSearchForm.timeRange" type="daterange" class="fill-width" value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label=" ">
                <el-button type="primary" @click="getUserList(2, 'dialogTableData' ,'dialogSearchForm', true)">搜索</el-button>
                <el-button type="default" @click="clearSearchForm('dialogSearchForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <hr/><h3 class="text-info">待选人员</h3>
        <el-table
          v-loading="dialogTableLoading"
          :data="dialogTableData.rows">
          <!-- <el-table-column type="selection" width="55"> -->
          </el-table-column>
          <el-table-column label="姓名" prop="name" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
          <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
          <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
          <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="邮箱" prop="mail" width="150" show-overflow-tooltip></el-table-column>transferPersonStatus
          <el-table-column label="状态"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addToChoosed(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="text-right">
          <el-pagination
            background
            layout="total, prev, pager, next"
            :current-page="dialogPageNum"
            :page-size="dialogPageSize"
            :total="dialogTableData.total"
            @current-change="dialogPageCurrentChange">
          </el-pagination>
        </div>
        <hr/><h3 class="text-info">已选人员</h3>
        <el-table
          v-loading="tableLoading"
          :data="hasChoosed"
          >
          <!-- @selection-change="handleSelectionChange" -->
          <!-- <el-table-column type="selection" width="55"> -->
          </el-table-column>
          <el-table-column label="姓名" prop="name" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
          <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
          <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
          <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="邮箱" prop="mail" width="150" show-overflow-tooltip></el-table-column>transferPersonStatus
          <el-table-column label="状态"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="removeFromChoosed(scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEmpowerVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEmpower" :disabled="!hasChoosed.length > 0" :loading="tableLoading">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import qs from "qs"
  export default {
    components: {
    },
    data () {
      return {
        roleListData: [],

        searchForm: {
          role: null,
          timeRange: []
        },
        activeRole: null,
        facultyChoosed: [],

        facultyTreeData: null,
        facultyProps: {
          children: 'childrens',
          label: 'faculty',
          value: 'id'
        },

        //人员列表的分页
        pageNum: 1,
        pageSize: 10,

        tableLoading: false,
        tableData: {
          rows: [],
          total: 0
        },
        multipleSelection: [],


        dialogEmpowerVisible: false,
        dialogTableLoading: false,
        dialogSearchForm: {
          timeRange: []
        },
        dialogFacultyChoosed: [],
        dialogTableData: [], // 对话框中(待选)人员表格数据
        hasChoosed: [],      // 对话框中已选人员表格数据(重复点击相同待选人员时, 提示不可重复添加)

        // 待选人员列表的分页
        dialogPageNum: 1,
        dialogPageSize: 5,
        // 已选人员列表的分页
        hasChoosedPageNum: 1,
        hasChoosedPageSize: 10,
        
        // title: {
        //   cur_status: "编辑状态",
        //   faculty: "转院系",
        //   admissionTime: "设定入学时间",
        // },
        // tempType: "cur_status", //点击操作后出现对应的操作区
        // dialogEditVisible: false,
        // editForm: { //编辑表单
        //   cur_status: null,
        //   facultys: [],
        //   admissionTime: null,
        // },
        

        // dialogImportVisible: false,
        // uploadUrl: "/user/import",
        // fileList: [],

        // operateType: "new",
        // dialogPersonVisible: false,
        // personForm: {
        //   user_name:      null,
        //   account:        null,
        //   sex:            null,
        //   admission_time: null,
        //   facultys:       [],
        //   phone_num:      undefined,
        //   mail:           null,
        // },
        rules: {
          user_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          account: [
            { required: true, message: '请输入工号/学号', trigger: 'blur' },
          ],
          facultys: [
            { required: true, message: '请选择院系', trigger: 'change' },
          ],
        }
      }
    },
    computed: {
      activeRoleName () {
        let name = null
        this.roleListData.forEach(item => {
          if(item.id == this.activeRole) {
            name = item.role_name
          }
        })
        return name
      }
    },
    watch: {
      "searchForm.role": {
        handler(newV, oldV) {
          if(newV) {
            this.activeRole = newV
          }
        },
        deep: true
      }
    },
    mounted() {
      this.initRoleList()
      this.initFacultyTree()
    },
    methods: {
      /**
       * 根据已选中的角色获取人员列表
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      initRoleList(role, type) {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/roles/list`
        }
        this.axios(config).then((response) => {
          this.roleListData    = response.data.data
          this.activeRole      = response.data.data[0].id
          this.searchForm.role = response.data.data[0].id
          this.getUserList(1, "tableData", "searchForm", true)
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 获取院系树
       * @return {[type]} [description]
       */
      initFacultyTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/faculty/tree`
        }
        this.axios(config).then((response) => {
          this.facultyTreeData   = response.data.data
          this.activeNode = response.data.data[0].id
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据条件查询用户列表
       * @param  {string} init             是否初始化查询 "init"表示初始化查询
       * @param  {[type]} type             查询类型 1包含此角色 2不包含
       * @param  {[type]} target           数据赋值目标的名称
       * @param  {[type]} searchFormTarget 对应搜索表单的名称
       * @return {[type]}        [description]
       */
      getUserList(type, target, searchFormTarget, init) {
        
        let data = JSON.parse(JSON.stringify(this[searchFormTarget]))
        
        if(target == "tableData") {
          this.tableLoading = true
          if(init) { // 需要初始化查询
            this.pageNum = 1
            this.pageSize = 10
          }
          data.pageNum = this.pageNum
          data.pageSize = this.pageSize

          if(this.facultyChoosed.length > 0) {
            data.faculty = this.facultyChoosed[this.facultyChoosed.length - 1]
          }

        } else if (target == "dialogTableData") {
          this.dialogTableLoading = true
          if(init) { // 需要初始化查询
            this.dialogPageNum = 1
            this.dialogPageSize = 5
          }
          data.pageNum = this.dialogPageNum
          data.pageSize = this.dialogPageSize

          if(this.dialogFacultyChoosed.length > 0) {
            data.faculty = this.dialogFacultyChoosed[this.dialogFacultyChoosed.length - 1]
          }
          data.role = this.activeRole
        }

        if (data.timeRange.length > 0) {
          data.sTime = data.timeRange[0]
          data.eTime = data.timeRange[1]
          delete data.timeRange
        }

        data.type = type

        let config = {
          method: "get",
          url: `${this.common.basePath}/authorize/user`,
          params: data
        }

        this.axios(config).then((response) => {
          this[target] = response.data.data
          this.$nextTick(_ => {
            this.tableLoading = false
            this.dialogTableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.dialogTableLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 根据表单名还原表单
       * @return {[type]} [description]
       */
      clearSearchForm(formName) {
        if(formName == "searchForm") {
          this[formName] = {
            role: this.roleListData[0].id,
            timeRange: []
          }
          this.activeRole = this.roleListData[0].id
          this.facultyChoosed = []
        } else {
          this[formName] = {
            timeRange: []
          }
          this.dialogFacultyChoosed = []
        }
      },
      /**
       * 删除用户
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      deleteUser(row) {
        let config = {
          method: "delete",
          url: `${this.common.basePath}/authorize/remove`,
          params: {
            ids: [row.userRoleId].join(","),
          }
        }

        this.$confirm("删除后需要重新添加", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.tableLoading = true
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.getUserList(1, "tableData", "searchForm", true)
            this.$nextTick(_ => {
              this.tableLoading = false
            })
          }).catch((errorMsg) => {
            this.tableLoading = false
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      addPower () {
        if(!this.activeRole) {
          this.$message.error("请先选择角色")
        } else { //清空数据
          this.dialogSearchForm = {
            timeRange: []
          }
          this.dialogFacultyChoosed = []
          this.dialogTableData = {
            total: 0,
            rows: []
          }
          this.hasChoosed = []
          this.dialogEmpowerVisible = true
        }
      },
      /**
       * 页面主体部分的分页
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      pageSizeChange(val) {
        this.pageSize = val
        this.getUserList(1, "tableData", "searchForm")
      },
      /**
       * 页面主体部分的分页
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      pageCurrentChange(val) {
        this.pageNum = val
        this.getUserList(1, "tableData", "searchForm")
      },
      /**
       * 勾选多选功能的checkbox
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /**
       * 批量操作
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      multiUpdateClicked(type) {

        // this.dialogEditVisible = true
        // this.tempType = type

        // this.editForm = {
        //   cur_status: null,
        //   facultys: [],
        //   admissionTime: null
        // }
      },
      /**
       * 对话框中待选人员的分页
       * @param  {[type]} val [description]
       * @return {[type]}     [description]
       */
      dialogPageCurrentChange(val) {
        this.dialogPageNum = val
        this.getUserList(2, "dialogTableData", "dialogSearchForm")
      },
      /**
       * 将当前点击的用户添加到下方已选人员表格中 需要判断是否重复
       * @param {[type]} row [description]
       */
      addToChoosed(row) {
        if(this.hasChoosed.length <= 0) { // 当前序列中没有人
          this.hasChoosed.push(row)
        } else if(this.hasChoosed.map(item => { return item.id }).join(",").indexOf(row.id.toString()) == -1) { // 当前序列中没有此人
          this.hasChoosed.push(row)
        } else {
          this.$message.error("该人员已在下方列表 , 请核对")
        }
      },
      /**
       * 将当前点击的用户从下方已选人员表格中移除 (遍历匹配id进行删除)
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      removeFromChoosed (row) {
        // let newAray = JSON.parse(JSON.stringify(this.hasChoosed))
        // this.hasChoosed.forEach((item, index) => {
        //   if(item.id == row.id) {
        //     newAray.splice(index, 1)
        //   }
        // })
        // this.hasChoosed
        
        let length = JSON.parse(JSON.stringify(this.hasChoosed)).length
        for( var i = 0; i < length; i++) {
          if(this.hasChoosed[i].id == row.id) {
            this.hasChoosed.splice(i, 1)
            return false //删除后退出全部循环
          }
        }

        console.log(this.hasChoosed)
      },
      /**
       * 将当前选择的用户进行提交
       * @param  {[type]} formName [description]
       * @return {[type]}          [description]
       */
      submitEmpower(formName) {
        this.tableLoading = true

        let config = {
          method: "post",
          url: `${this.common.basePath}/authorize/add`,
          data: qs.stringify({
            role: this.activeRole,
            ids: this.hasChoosed.map(item => { return item.id}).join(",")
          })
        }

        this.axios(config).then((response) => {
          this.dialogEmpowerVisible = false
          this.$message.success(response.data.meta.message)
          this.getUserList(1, "tableData", "searchForm", true)
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },
    }
  }
</script>

<style lang="less">
  
</style>