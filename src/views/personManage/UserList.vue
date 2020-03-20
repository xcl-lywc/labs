<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item> 
      </el-breadcrumb>
    </el-card>
    <div class="router-view-wrap">
      <!-- 页面主要内容 -->
      <div class="router-view-content">
        <!-- 搜索表单 -->
        <div v-if="common.checkAuthority('UserList-list', true)">
          <el-form ref="searchForm" :model="searchForm" label-width="120px">
            <el-row>
              <el-col :span="8" v-if="common.checkAuthorityTree('Faculty-tree')">
                <el-form-item v-if="facultyTreeData" label="系别：">
                  <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="facultyChoosed" change-on-select class="fill-width" placeholder="请选择系别"></el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="common.checkAuthorityTree('RoleList-listRole')">
                <el-form-item label="角色：">
                  <el-select v-model="searchForm.roles" class="fill-width" placeholder="请选择角色">
                    <el-option :value="item.id" :label="item.role_name" v-for="(item, index) in roleListData" :key="`角色${index}`"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工号/学号：">
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
                  <el-date-picker v-model="searchForm.admission_time" class="fill-width" value-format="timestamp" placeholder="请选择入校时间"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="年级：" prop="grade_num">
                  <el-input v-model="searchForm.grade_num" type="number"><template slot="append">届</template></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" @click="getUserList('init')">搜索</el-button>
                  <el-button type="default" @click="clearSearchForm">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table
            v-loading="tableLoading"
            :data="tableData.rows"
            :row-key="getRowKeys"
            ref="personMultipleTable"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column label="姓名" prop="user_name" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别" width="100"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
            <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
            <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
            <el-table-column label="年级" width="100">
              <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
            </el-table-column>
            <el-table-column label="班级" width="80">
              <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
            </el-table-column>
            <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" prop="mail" width="250" show-overflow-tooltip></el-table-column>transferPersonStatus
            <el-table-column label="状态" width="150"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
            <el-table-column label="操作" width="320" fixed="right">
              <template slot-scope="scope">
                <el-button type="default" size="mini" :disabled="!common.checkAuthority('UserList-detail', true)" @click="showUserDetail(scope.row)">查看</el-button>
                <el-button type="primary" size="mini" :disabled="!common.checkAuthority('UserList-edit', true)" @click="showPersonDialog('edit', scope.row)">编辑</el-button>
                <el-button type="warning" size="mini" :disabled="!common.checkAuthority('UserList-reset', true)" @click="validateUser(scope.row)">重置密码</el-button>
                <el-button type="danger" size="mini" :disabled="!common.checkAuthority('UserList-delete', true)" @click="deleteUser(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div v-if="common.checkAuthority('UserList-list', true)" class="router-view-bottom">
        <div>
          <el-button :disabled="multipleSelection.length <= 0 || !common.checkAuthority('UserList-editStatus', true)" type="primary" size="mini" @click="multiUpdateClicked('cur_status')">编辑状态</el-button>
          <el-button :disabled="multipleSelection.length <= 0 || !common.checkAuthority('UserList-transe', true) || !common.checkAuthorityTree('Faculty-tree')" type="primary" size="mini" @click="multiUpdateClicked('faculty')">转院系</el-button>
          <el-button :disabled="multipleSelection.length <= 0 || !common.checkAuthority('UserList-setTime', true)" type="primary" size="mini" @click="multiUpdateClicked('admissionTime')">设定入学时间</el-button>
          <el-button type="success" size="mini" :disabled="!common.checkAuthority('UserList-import', true)" @click="pageNum=1;importType('judge')">导入人员</el-button>
          <el-button type="success" size="mini" :disabled="!common.checkAuthority('UserList-add', true)" @click="showPersonDialog('add')">添加人员</el-button>
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
      <div v-else class="router-view-bottom"></div>
      <!-- 人员详情dialog -->
      <el-dialog :visible.sync="dialogDetailVisible" title="用户信息">
        <el-form>
          <el-form-item label="头像：" v-if="personForm.head_img"><img height="100" :src="common.filePath + personForm.head_img"></img></el-form-item>
          <el-form-item label="姓名：">{{tempUserDetail.user_name}}</el-form-item>
          <el-form-item label="性别：">{{common.transferGender(tempUserDetail.sex)}}</el-form-item>
          <el-form-item label="年级：">{{tempUserDetail.grade_num}}届</el-form-item>
          <el-form-item label="班级：">{{tempUserDetail.class_name}}班</el-form-item>
          <el-form-item label="入校时间：">{{common._convertDate(tempUserDetail.admission_time, "yyyy年MM月dd日")}}</el-form-item>
          <el-form-item label="账号：">{{tempUserDetail.account}}</el-form-item>
          <el-form-item label="院系：">{{tempUserDetail.faculties_name}}</el-form-item>
          <el-form-item label="手机：">{{tempUserDetail.phone_num}}</el-form-item>
          <el-form-item label="邮箱：">{{tempUserDetail.mail}}</el-form-item>
        </el-form>
      </el-dialog>

      <!-- 编辑院系dialog -->
      <el-dialog :visible.sync="dialogEditVisible" :title="title[tempType]">
        <el-form ref="editForm" :model="editForm" label-width="100px">
          <el-form-item v-if="tempType == 'cur_status'" label="状态：">
            <el-select v-model="editForm.cur_status" class="fill-width" placeholder="请选择状态">
              <el-option :value="item.value" :label="item.label" v-for="(item, index) in common.personStatus" :key="`人员状态${index}`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="tempType == 'faculty'" label="院系：">
            <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="editForm.faculties_ids" change-on-select class="fill-width"></el-cascader>
          </el-form-item>
          <el-form-item v-if="tempType == 'admissionTime'" label="入学时间：">
            <el-date-picker v-model="editForm.admissionTime" class="fill-width" value-format="timestamp" placeholder="请选择入学时间"></el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 导入人员dialog -->
      <el-dialog :visible.sync="dialogImportVisible" title="导入人员">
        <el-form ref="importForm" :model="importForm" label-width="90px" :rules="importRules">
          <el-form-item label="角色：" prop="role_id">
            <el-select v-model="importForm.role_id" class="fill-width" placeholder="请先选择角色后再上传文件">
              <el-option :value="item.id" :label="item.role_name" v-for="(item, index) in roleListData" :key="`角色导入${index}`"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文件：" prop="file">
            <el-tag v-if="importForm.file" ><a :href="`${common.publicBasePath}${tag.path}`" target="_blank">{{importForm.file.name}}</a></el-tag>
            <upload :isDisabled="!importForm.role_id" url="/user/import/user" :data="{role_id: importForm.role_id}" buttonText="上传人员表格并提交" :fileTypes="['xls', 'xlsx']" @uploadSuccess="uploadSuccess" :showSuccessNotice="true"></upload>
            <el-button type="text" @click="downloadTemplate" icon="el-icon-download">下载模版</el-button>
          </el-form-item>
        </el-form>
        <!-- <span slot="footer" class="dialog-footer">  
          <el-button @click="dialogTabVisible = true">tab</el-button>
        </span> -->
      </el-dialog>
      
      <!-- 处理数据dialog（处理用户的校正、冲突以及查看错误用户信息） -->
      <el-dialog :visible.sync="dialogTabVisible" title="处理用户数据" width="1250px" @close="delcache"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
          <el-tab-pane label="错误导入" name="3">
            <span>系统获取表格信息检测到数据缺失、数据格式错误或者无法处理的异常，请查证下面的信息，补全修改后保存。</span>
            <el-table
              :data="importTableData.rows"
              stripe
              min-height='500'
              style="width: 100%">
              <el-table-column label="姓名" prop="user_name" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column label="性别" width="100"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
              <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
              <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
              <el-table-column label="年级" width="100">
                <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
              </el-table-column>
              <el-table-column label="班级" width="90">
                <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
              </el-table-column>
              <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="邮箱" prop="mail" width="100" show-overflow-tooltip></el-table-column>transferPersonStatus
              <el-table-column label="状态" width="150"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
              <el-table-column label="信息" width="150" prop="message"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="重复导入" name="2">
            <span>当前用户列表已有以下用户；请检查用户信息是否发生变化，如果变化，请替换；如果未发生变化，请保留；如果不确定，可以不处理，待与用户核对信息后，根据实际情况处理。</span>
            <el-table
              :data="importTableData.rows"
              stripe
              style="width: 100%">
              <el-table-column type="expand" label="#">
                <template slot-scope="props">
                  <p class="conflicting-title">{{props.row.user_name}}<span>的冲突数据列表：</span></p>
                  <el-table
                    :data="props.row.conflictingUsers"
                    border
                    row-class-name="warning-row"
                    style="width: 100%">
                    <el-table-column label="序号" type="index" width="55" fixed></el-table-column>
                    <el-table-column label="姓名" prop="user_name" width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column label="性别" width="80"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
                    <el-table-column label="工号/学号" prop="account" width="100"></el-table-column>
                    <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
                    <el-table-column label="年级" width="100">
                      <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
                    </el-table-column>
                    <el-table-column label="班级" width="80">
                      <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
                    </el-table-column>
                    <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column label="邮箱" prop="mail" width="100" show-overflow-tooltip></el-table-column>transferPersonStatus
                    <el-table-column label="状态" width="100"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
                    <el-table-column label="信息" width="150" prop="message"></el-table-column>
                    <el-table-column label="操作" width="80" fixed="right">
                      <template slot-scope="scope">
                        <!-- <el-button type="default" size="mini" :disabled="!common.checkAuthority('UserList-detail', true)" @click="showUserDetail(scope.row)">查看</el-button> -->
                        <el-button type="success" size="mini" @click="resolved(scope.row,props.row.id)">替 换</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column label="姓名" prop="user_name" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column label="性别" width="80"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
              <el-table-column label="工号/学号" prop="account" width="100"></el-table-column>
              <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
              <el-table-column label="年级" width="100">
                <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
              </el-table-column>
              <el-table-column label="班级" width="80">
                <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
              </el-table-column>
              <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="邮箱" prop="mail" width="100" show-overflow-tooltip></el-table-column>transferPersonStatus
              <el-table-column label="状态" width="100"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
              <el-table-column label="信息" width="150" prop="message"></el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <!-- <el-button type="default" size="mini" :disabled="!common.checkAuthority('UserList-detail', true)" @click="showUserDetail(scope.row)">查看</el-button> -->
                  <el-button type="primary" size="mini" @click="resolved(scope.row,scope.row.id)">保 留</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="待导入" name="1">
            <span>请注意检查学号、邮件等信息格式是否错误。</span>
            <el-table
              :data="importTableData.rows"
              stripe
              style="width: 100%"
              ref="personImportMultipleTable"
              :row-key="getRowImportKeys"
              @selection-change="handleSelectionImportChange">
              <el-table-column type="selection" width="55" fixed :reserve-selection="true"></el-table-column>
              <el-table-column label="姓名" prop="user_name" width="100" show-overflow-tooltip></el-table-column>
              <el-table-column label="性别" width="80"><template slot-scope="scope">{{common.transferGender(scope.row.sex)}}</template></el-table-column>
              <el-table-column label="工号/学号" prop="account" width="150"></el-table-column>
              <el-table-column label="院系" prop="faculties_name" width="150"></el-table-column>
              <el-table-column label="年级" width="100">
                <template slot-scope="scope">{{!scope.row.grade_num ? "" : `${scope.row.grade_num}届`}}</template>
              </el-table-column>
              <el-table-column label="班级" width="80">
                <template slot-scope="scope">{{!scope.row.class_num ? "" : `${scope.row.class_num}班`}}</template>
              </el-table-column>
              <el-table-column label="手机" prop="phone_num" width="120" show-overflow-tooltip></el-table-column>
              <el-table-column label="邮箱" prop="mail" width="100" show-overflow-tooltip></el-table-column>transferPersonStatus
              <el-table-column label="状态" width="120"><template slot-scope="scope">{{common.transferPersonStatus(scope.row.cur_status)}}</template></el-table-column>
              <el-table-column label="信息" width="150" prop="message"></el-table-column>
              <el-table-column label="操作" width="100" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="showPersonDialog('correcting-edit', scope.row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="keep" class="mart10" :disabled="this.adjustData.length===0?true:false">批量保存</el-button>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">  
          <!-- 分页 -->
          <el-pagination
            background
            layout="total, sizes, prev, pager, next"
            :current-page="pageNum"
            :page-size="pageSize"
            :total="importTableData.total"
            @size-change="pageSizeImportChange"
            @current-change="pageCurrentImportChange">
          </el-pagination>
        </span>
      </el-dialog>

      <!-- 人员新增(编辑)dialog -->
      <el-dialog :visible.sync="dialogPersonVisible" title="用户" width="800px">
        <el-form ref="personForm" :model="personForm" :rules="rules" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名：" prop="user_name"><el-input v-model="personForm.user_name"></el-input></el-form-item>
              <el-form-item label="工号/学号：" prop="account"><el-input v-model="personForm.account" :disabled="operateType == 'edit'"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="头像：" prop="head_img">
                <!-- <upload-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :avatar="personForm.head_img" :size="'mini'"></upload-avatar> -->
                <crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="personForm.head_img"></crop-avatar>
              </el-form-item>
            </el-col> 
            <el-col :span="12">
              <el-form-item label="年级：" prop="grade_num">
                <el-input v-model="personForm.grade_num" :type="typeof(personForm.grade_num)==='number'?'number':''"><template slot="append">届</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="班级：" prop="class_num">
                <el-input v-model="personForm.class_num" :type="typeof(personForm.class_num)==='number'?'number':''"><template slot="append">班</template></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别：" prop="sex">
                <el-select v-model="personForm.sex" class="fill-width">
                  <el-option :value="1" label="男"></el-option>
                  <el-option :value="2" label="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="入校时间：" prop="admission_time">
                <el-date-picker v-model="personForm.admission_time" class="fill-width" value-format="timestamp" placeholder="请选择入学时间"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item v-if="common.checkAuthorityTree('Faculty-tree')" label="院系：" prop="faculties_ids">
                <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="personForm.faculties_ids" change-on-select class="fill-width"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机：" prop="phone_num"><el-input-number v-model="personForm.phone_num" class="fill-width text-left-penetrate" :min="0" :controls="false"></el-input-number></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" prop="mail"><el-input type="email" v-model="personForm.mail"></el-input></el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="简介：" prop="sim_desc"><el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="personForm.sim_desc"></el-input></el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">  
          <el-button @click="dialogPersonVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPersonForm">确 定</el-button>
        </span>
      </el-dialog>

      
    </div>
  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  import UploadAvatar from "../../components/UploadAvatar.vue"
  import CropAvatar from "../../components/CropAvatar.vue"
  export default {
    components: {
      upload,
      UploadAvatar,
      CropAvatar
    },
    data () {
      // 验证手机号码
      let checkPhoneNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码'));
        } else {
          if(/^1[34578]\d{9}$/.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确的手机号码'));
          }
        }
      };
      return {
        //用户列表 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
        getRowKeys(row) {
          return row.id;
        },
        //处理信息dialog的外层校正表格 获取row的key值(vue + element-ui Table 的数据多选 多页选择数据回显，分页记录保存选中的数据)
        getRowImportKeys(row) {
          return row.num;
        },

        roleListData: [],

        searchForm: {},
        facultyChoosed: [],

        pageNum: 1,
        pageSize: 10,

        tableLoading: false,
        tableData: {
          rows: [],
          total: 0
        },
        multipleSelection: [],
        dialogDetailVisible: false,
        tempUserDetail: 0,

        title: {
          cur_status: "编辑状态",
          faculty: "转院系",
          admissionTime: "设定入学时间",
        },
        tempType: "cur_status", //点击操作后出现对应的操作区
        dialogEditVisible: false,
        editForm: { //编辑院系表单
          cur_status: null,
          faculties_ids: [],
          admissionTime: null,
        },
        facultyTreeData: null,
        facultyProps: {
          children: 'childrens',
          label: 'faculty',
          value: 'id'
        },

        dialogImportVisible: false,
        importForm: {
          role_id: null,
          file: null
        },
        importRules: {
          role_id: [
            { required: true, message: '请选择用户', trigger: 'change' },
          ],
          file: [
            { required: true, message: '请上传文件', trigger: 'change' },
          ],
        },
        uploadUrl: "/user/import",
        fileList: [],

        dialogTabVisible:false,
        activeTabName:'3',
        importUserType:3,
        importTableData: {
          rows: [],
          total: 0
        },
        adjustData:[],//需校正的数据

        operateType: "new",

        dialogPersonVisible: false,

        personForm: { // 人员(新增/编辑)表单
          head_img:       null,
          user_name:      null,
          account:        null,
          sex:            null,
          admission_time: null,
          faculties_ids:  [],
          phone_num:      undefined,
          mail:           null,
          grade_num:      null,
          class_num:      null,
          sim_desc:       null,
        },
        rules: {
          user_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          account: [
            { required: true, message: '请输入工号/学号', trigger: 'blur' },
          ],
          faculties_ids: [
            { required: true, message: '请选择院系', trigger: 'change' },
          ],
          phone_num: [
            { required: true, validator: checkPhoneNum, trigger: 'blur' },
          ],
          mail: [
            { type: "email", message: '请输入正确的邮箱地址', trigger: 'blur' },
          ],
          sim_desc: [
            { validator: (rule, value, callback) => {this.common.wordNumberValid(rule, value, callback, 'textarea')}, trigger: 'blur' },
          ],
          
        }
      }
    },
    mounted() {
      if (this.common.checkAuthority('UserList-list', true)) {
        this.initRoleList()
        // if(this.common.checkAuthorityTree('Faculty-tree')) {
          this.initFacultyTree()
        // }
        this.getUserList("init")
      }
    },
    methods: {
      /**
       * 下载用户信息导入模版
       * @author chuanlin.Xiao
       * @date   2019-11-08T15:37:26+0800
       * @return {[type]}                      [description]
       */
      downloadTemplate(){
        this.axios.get(`${this.common.basePath}/home/import/template`,{responseType: "blob",params:{}}).then((response) => {
          this.common._fileBold(response);
          this.$message.success('下载成功')
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      },

      /**
       * 获取角色列表
       * @return {[type]} [description]
       */
      initRoleList() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/roles/list/public`
        }
        this.axios(config).then((response) => {
          this.roleListData = response.data.data
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
       * 根据搜索条件查询用户列表
       * @return {[type]} [description]
       */
      getUserList(init) {
        this.tableLoading = true

        if(init == "init") { // 需要初始化查询
          this.$refs.personMultipleTable.clearSelection();
          this.pageNum = 1
          this.pageSize = 10
        }

        let data = this.searchForm
        data.pageNum = this.pageNum
        data.pageSize = this.pageSize
        if(this.facultyChoosed.length > 0) {
          data.faculty = this.facultyChoosed[this.facultyChoosed.length - 1]
        }
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/list`,
          data: data
        }
        config.data.grade_num===''?delete config.data.grade_num:'';

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
      clearSearchForm() {
        this.searchForm     = {}
        this.facultyChoosed = []
      },
      showUserDetail(row) {
        this.tempUserDetail = row
        this.dialogDetailVisible = true
      },
      /**
       * 删除用户
       * @param  {[type]} row [description]
       * @return {[type]}     [description]
       */
      deleteUser(row) {
        let config = {
          method: "delete",
          url: `${this.common.basePath}/user/delete`,
          data: {
            user_id: [row.id]
          }
        }

        this.$confirm("当前删除的内容将无法找回", "确认删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(_ => {
          this.tableLoading = true
          this.axios(config).then((response) => {
            this.$message.success(response.data.meta.message)
            this.getUserList("init")
            this.$nextTick(_ => {
              this.tableLoading = false
            })
          }).catch((errorMsg) => {
            this.tableLoading = false
            this.$message.error(errorMsg)
          })
        }).catch(_ => {})
      },
      validateUser(row) {
        this.$prompt('<span><i class="required-label"></i>请输入当前用户的密码</span>', '重置密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          inputValidator: (value) => {
            if(value) {
              return true
            } else {
              this.$message.error("请检查表单填写是否正确")
              return false
            }
          },
          inputErrorMessage: "请输入密码"
        }).then(({value}) => {
          let config = {
            method: "get",
            url: `${this.common.basePath}/user/check`,
            params: {
              id: JSON.parse(sessionStorage.getItem("Access-Key")) || null,
              password: value
            }
          }
          this.axios(config).then((response) => {
            this.resetPassword(row)
          }).catch((errorMsg) => {
            this.$message.error(errorMsg)
          })
        }).catch((error) => {});
      },
      /**
       * 重置用户的密码
       * @return {[type]} [description]
       */
      resetPassword(row) {
        this.tableLoading = true
        
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/reset/password`,
          params: {
            user_id: row.id
          }
        }

        this.axios(config).then((response) => {
          this.$message.success("重置成功")
          this.getUserList("init")
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },
      /**
       * 点击某一项树节点 根据不同的类型进行回调
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      handleNodeClick(node, data) {
        this.activeNode = node.id
      },
      pageSizeChange(val) {
        this.pageSize = val
        this.getUserList()
      },
      pageCurrentChange(val) {
        this.pageNum = val
        this.getUserList()
      },
      handleSelectionChange(rows) {
        this.multipleSelection = rows;
      },
      /**
       * 批量操作
       * @param  {[type]} type [description]
       * @return {[type]}      [description]
       */
      multiUpdateClicked(type) {
        this.dialogEditVisible = true
        this.tempType = type
        this.editForm = {
          cur_status: null,
          faculties_ids: [],
          admissionTime: null
        }
      },
      submitForm(formName) {
        let config = {
          method: "patch",
          url: `${this.common.basePath}/user/update/status`,
          data: this[formName]
        }
        config.data.user_id = this.multipleSelection.map(item => { return item.id })
        config.data.faculty = this[formName].faculties_ids[this[formName].faculties_ids.length - 1]
        delete config.data.faculties_ids
        
        this.tableLoading = true
        this.axios(config).then((response) => {
          this.dialogEditVisible = false
          this.$message.success(response.data.meta.message)
          this.getUserList("init")
          this.$nextTick(_ => {
            this.tableLoading = false
          })
        }).catch((errorMsg) => {
          this.dialogEditVisible = false
          this.tableLoading = false
          this.$message.error(errorMsg)
        })
      },

      /**
       *人员导入之前判断是否有异常用户数据
       *role_id为null，展示导入功能dialog；不为null时，展示处理数据dialog
       *judge 判断；refresh 刷新、请求
       */
      importType(type){
        if(type=='judge'){
          this.axios.get(`${this.common.basePath}/user/import/cache`,{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType}}).then((response) => {
            if(response.data.data.role_id){
              this.dialogTabVisible=true;
              this.$refs.personImportMultipleTable ? this.$refs.personImportMultipleTable.clearSelection():'';
              this.importTableData.rows = response.data.data.rows;
              this.importTableData.total = response.data.data.total;             
            }else{
              this.showImport();
            }
          }).catch((error) => {
            this.$message.error(error);  
          });
        }else if(type=='refresh'){
          this.axios.get(`${this.common.basePath}/user/import/cache`,{params:{pageNum:this.pageNum,pageSize:this.pageSize,type:this.importUserType}}).then((response) => {
            this.importTableData.rows = response.data.data.rows;
            this.importTableData.total = response.data.data.total;
          }).catch((error) => {
            this.$message.error(error);  
          });
        }
        
      },
      /*
       *打开处理数据dialog
       */
      openDataDialog(){
        
      },
      /**
       * 展示导入功能dialog
       * @return {[type]} [description]
       */
      showImport() {
        this.dialogImportVisible = true
        this.$nextTick(_ => {
          this.$refs.importForm.resetFields()
        })
        
      },
      /**
       * 导入人员成功的函数
       */
      uploadSuccess(response) {
        // console.log(response)
        //this.importForm.file = response
        this.getUserList();
        this.dialogImportVisible = false;
        this.importType("judge");
      },
      /**
       * 处理数据dialog的tab切换
       */
      handleTabClick(tab){
        console.log(tab.name)
        if(tab.name==='1'){
          this.$refs.personImportMultipleTable.clearSelection();
          this.pageNum=1;
          this.importUserType = 1;
          this.importType("refresh");
        }else if(tab.name==='2'){
          this.pageNum=1;
          this.importUserType = 2;
          this.importType("refresh");
        }else if(tab.name==='3'){
          this.pageNum=1;
          this.importUserType = 3;
          this.importType("refresh");
        }
      },
      /**
       * 处理数据dialog的外层表格分页功能
       */
      pageSizeImportChange(val) {
        this.pageSize = val
        this.importType("refresh")
      },
      pageCurrentImportChange(val) {
        this.pageNum = val
        this.importType("refresh")
      },
      /**
       *解决冲突数据
       *
       */
      resolved(val,id){ 
        let arr  = [];
        let form = val;
        form.conflictingUsers = null;
        form.id = id;
        arr.push(form)
        this.axios.post(`${this.common.basePath}/user/import/add`,arr).then((response) => {
          this.$message.success('成功解决！');  
          this.importType("refresh");
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       *校正用户多选功能
       */
      handleSelectionImportChange(val) {
        console.log(val)
        this.adjustData = val;
      },
      /*
       *批量保存 校正用户
       */
      keep(){
        this.axios.post(`${this.common.basePath}/user/import/add`,this.adjustData).then((response) => {
          this.$message.success('校正成功！');  
          this.importType("refresh");
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /*
       *清除人员信息的高速缓存
       */
      delcache(){ 
        this.$confirm('是否清除人员信息的高速缓存？', '提示', {
          confirmButtonText: '清除',
          cancelButtonText: '暂不清除',
          type: 'warning'
        }).then(() => {
          
          this.axios.get(`${this.common.basePath}/user/import/delcache`,{params:{}}).then((response) => {
            this.getUserList();
            this.$message({
              type: 'success',
              message: '清除缓存成功!'
            });
          }).catch((error) => {
            this.$message.error(error);  
          });
        }).catch(() => {this.getUserList();});
        
      },

      /**
       * 点击 新增人员 / 编辑 按钮
       * @param  {[type]} type [description]
       * @param  {[type]} row  [description]
       * @return {[type]}      [description]
       */
      showPersonDialog(type, row) {
        this.dialogPersonVisible = true
        this.operateType = type
        
        if(type == "add") {//添加
          this.$nextTick(_ => {
            if (this.$refs.personForm) {
              this.$refs.personForm.resetFields()
            }
          })
        } else if(type == "correcting-edit"){//校正编辑
          row.faculties_ids = [];
          this.personForm = JSON.parse(JSON.stringify(row))
        }else {//编辑
          this.getPersonDetail(row.id).then(_ => {
            this.$nextTick(_ => {
              this.$refs.personForm.clearValidate()
            })
          }).catch(_ => {})
          
        }
      },
      getPersonDetail(id) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: id
          },
        }
        let p = new Promise((resolve, reject) => {
          this.axios(config).then((response) => {
            this.personForm = response.data.data
            response.data.data.faculties_ids?'':this.personForm.faculties_ids = [];
            resolve(response.data.meta.message)
          }).catch((errorMsg) => {
            reject(errorMsg)
            this.$message.error(errorMsg)
          })
        })
        return p
      },
      uploadAvatarSuccess(val) {
        this.personForm.head_img = val.path
      },
      /**
       * 点击提交人员信息 (新增/编辑)
       * @return {[type]} [description]
       */
      submitPersonForm() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/add/student`,
          data: this.personForm,
        }

        if(this.operateType == "edit") {
          config.url = `${this.common.basePath}/user/one/up_user`
        }

        if(this.operateType == "correcting-edit") {
          config.url = `${this.common.basePath}/user/cache/update`
        }


        this.$refs.personForm.validate((valid) => {
          if(valid) {
            config.data.faculty = this.personForm.faculties_ids[this.personForm.faculties_ids.length - 1]
            delete config.data.faculties_ids
            
            this.operateType != "correcting-edit"?this.tableLoading = true:'';

            this.axios(config).then((response) => {
              this.dialogPersonVisible = false
              this.$message.success(response.data.meta.message)
              this.operateType != "correcting-edit"?this.getUserList("init"):this.importType("refresh");
              this.$nextTick(_ => {
                this.operateType != "correcting-edit"?this.tableLoading = false:'';
              })
            }).catch((errorMsg) => {
              this.dialogPersonVisible = false
              this.operateType != "correcting-edit"?this.tableLoading = false:'';
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
      submitExcel() {
        let config = {
          method: "post",
          url: `${this.common.basePath}/user/import/user`,
          data: this.importForm,
        }
        this.$refs.importForm.validate((valid) => {
          if(valid) {
            this.axios(config).then((response) => {
            }).catch((errorMsg) => {
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
        
      },
    }
  }
</script>

<style lang="less">
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .conflicting-title{
    color:#FF9800;
    span{
      color:#333;
    }
  }
</style>