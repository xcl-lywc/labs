<template>
  <div id="wapper">
    <!-- <div class="header-wrap">
      <img class="header-img" alt="天津市和平区" src="../assets/img/logo.png" @click="$router.push({name: 'Dashboard'})">
      
      <h1 class="header-title"><span class="fl main-title">智能实验室平台</span><span class="fl sub-title"></span></h1>
      用户管理
      <div class="user-management">
        下拉菜单
        <el-dropdown class="fl" trigger="click">
          <span class="el-dropdown-link username-style">
            用户名<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="personal">个人资料</el-dropdown-item>
            <el-dropdown-item  command="avatar">修改头像</el-dropdown-item>
            <el-dropdown-item  command="help">帮助</el-dropdown-item>
            <el-dropdown-item  command="exchange">切换导航</el-dropdown-item>
            <el-dropdown-item  command="resetPass">重置密码</el-dropdown-item>
            <el-dropdown-item divided  command="signOutLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        用户头像
        <img :src="'/pics'+picture" alt="头像" class="head-image fl" @click="modifyAvatar" :onerror="headimg"/>
        <img src="../assets/img/a8.jpg" alt="" class="head-image fl" @click="modifyAvatar"/>
      </div>
    </div> -->
    <!-- 页面头部(不包含导航) -->
    <div class="header-wrap">
      <div>
        <img src="../assets/img/logo.jpg" alt="" class="logo-img">
        <h1 class="title-in-header">智能实验室平台</h1>
      </div>
      <!-- 左侧按钮组 -->
      <div class="left-button-icon">
        <!-- <i class="el-icon-question instructions" @click="$router.push({name: 'InstructionsPage'})" title="说明书"></i> -->
        <!-- &nbsp;&nbsp;&nbsp; -->
        <!-- <el-button @click="dialogVisible = true" title="新建反馈">新建反馈</el-button> -->
        <el-button class="el-icon-button" circle @click="$router.push({name: 'InstructionsPage'})" title="说明书"><i class="fa fa-book"></i></el-button>
        <el-button class="el-icon-button" circle @click="dialogVisible = true" title="反馈/报错"><i class="el-icon-question"></i></el-button>
      </div>
      <div class="mid-button-icon" v-if="userBaseInfo">
        <el-dropdown class="el-icon-button" @command="dropdownClicked">
          <span class="el-dropdown-link">
            <!-- <el-button circle title="用户信息"><i class="fa fa-user-circle"></i></el-button> -->
            <el-avatar :size="40" :src="common.filePath + userBaseInfo.head_img" class="marr5 fl">
              <img v-if="userBaseInfo.sex===1" src="../assets/img/male.png" height="40" width="40"/>
              <img v-else-if="userBaseInfo.sex===2" src="../assets/img/female.png" height="40" width="40"/>
              <img v-else src="../assets/img/male.png"/>
            </el-avatar>
            <el-link :underline="false" class="fl user_name">{{userBaseInfo.user_name}}</el-link>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="base_info">基本信息</el-dropdown-item>
            <el-dropdown-item command="info">修改信息</el-dropdown-item>
            <el-dropdown-item command="pass">更改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- 右侧按钮组 -->
      <div class="right-button-group">
        <!-- <el-button class="el-icon-button" circle @click="$router.push({name: 'Dashboard'})" title="返回首页"><i class="fa fa-home"></i></el-button> -->
        <el-button class="el-icon-button" circle @click="$router.push({name: 'Login'})" title="前往登录"><i class="fa fa-sign-in"></i></el-button>
        <el-button class="el-icon-button" circle @click="changeMode" title="切换导航"><i class="fa fa-exchange"></i></el-button>
      </div>
    </div>
    <!-- 页面主体 -->
    <transition name="el-zoom-in-bottom">
    <el-row v-loading="loading" class="content-wrap-row">
      <!-- 水平方向导航 -->
      <transition name="el-zoom-in-top">
        <nav-bar v-if="navMode == 'horizontal'" :showType="navMode" :resource="resourceList"></nav-bar>
      </transition>
      <!-- 竖直方向导航 -->
      <transition name="el-zoom-in-bottom">
      <el-col v-if="navMode == 'vertical'" :span="3" class="nav-bar-vertical nav-bg">
        <!-- 通过时间来触发刷新 -->
        <nav-bar :showType="navMode" :resource="resourceList"></nav-bar>
      </el-col>
      </transition>
      <!-- 页面主体 -->
      <el-col :span="navMode == 'vertical' ? 21 : 24" :class="{'content-vertical': navMode == 'vertical'}">
        <div class="content-wrap" ref="contentWrap" :class="{'vertical-box': navMode == 'vertical', 'horizontal-box': navMode == 'horizontal'}">
          <router-view v-loading="mainLoading" v-if="dataReady"></router-view>
        </div>
      </el-col>
    </el-row>
    </transition>
    <!-- 新建反馈Dialog -->
    <el-dialog
      title="新建反馈信息"
      :visible.sync="dialogVisible"
      width="800px"
      center>
      <build-feedback :dialogVisible="dialogVisible" @changeDialogVisible="changeDialogVisible"></build-feedback>
    </el-dialog>
    <!-- 编辑当前用户信息Dialog -->
    <el-dialog
      :title="editPassword ? '修改密码' : '修改用户信息'"
      :visible.sync="personDialogVisible"
      :width="editPassword ? '500px' : '800px'"
      center>
      <el-form ref="personForm" :model="personForm" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="工号/学号：" prop="account"><span>{{ personForm.account }}</span></el-form-item>
            <el-form-item v-if="!editPassword" label="姓名：" prop="user_name"><el-input v-model="personForm.user_name"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="头像：" prop="head_img">
              <!-- <upload-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :avatar="personForm.head_img" :size="'mini'"></upload-avatar> -->
              <crop-avatar :fileTypes="['png', 'jpg']" @uploadSuccess="uploadAvatarSuccess" :size="'mini'" :avatar="personForm.head_img"></crop-avatar>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级：" prop="grade_num" v-if="!editPassword"><el-input v-model="personForm.grade_num" :type="typeof(personForm.grade_num)==='number'?'number':''"><template slot="append">届</template></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级：" prop="class_num" v-if="!editPassword"><el-input v-model="personForm.class_num" :type="typeof(personForm.class_num)==='number'?'number':''"><template slot="append">班</template></el-input></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="editPassword" label="原密码：" prop="oldPassword"><el-input type="password" :show-password="true" v-model="personForm.oldPassword" palcehoder="请同时输入原密码和新密码才能正确提交"></el-input></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="editPassword" label="新密码：" prop="newPassword"><el-input type="password" :show-password="true" v-model="personForm.newPassword" palcehoder="请同时输入原密码和新密码才能正确提交"></el-input></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="editPassword" label="确认密码：" prop="newPasswordAgain"><el-input type="password" :show-password="true" v-model="personForm.newPasswordAgain" palcehoder="请再次输入新密码"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="性别：" prop="sex">
              <el-select v-model="personForm.sex" class="fill-width">
                <el-option :value="1" label="男"></el-option>
                <el-option :value="2" label="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="入校时间：" prop="admission_time">
              <el-date-picker v-model="personForm.admission_time" class="fill-width" value-format="timestamp" placeholder="请选择入学时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="facultyTreeData && !editPassword" label="院系：" prop="faculties_ids">
              <el-cascader :options="facultyTreeData" :props="facultyProps" v-model="personForm.faculties_ids" change-on-select class="fill-width text-info"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="手机：" prop="phone_num"><el-input-number v-model="personForm.phone_num" class="fill-width text-left-penetrate" :min="0" :controls="false"></el-input-number></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="!editPassword" label="邮箱：" prop="mail"><el-input type="email" v-model="personForm.mail"></el-input></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介：" prop="sim_desc" v-if="!editPassword"><el-input rows="5" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="personForm.sim_desc"></el-input></el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">  
        <el-button @click="personDialogVisible = false">取消</el-button>
        <!-- <el-button type="primary" @click="() => { editPassword ? editPassword = false : editPassword = true}"><span>{{editPassword ? "隐藏修改密码" : "显示修改密码"}}</span></el-button> -->
        <el-button type="primary" @click="submitPersonForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 基本信息Dialog -->
    <el-dialog
      title="基本信息"
      :visible.sync="baseDialogVisible"
      width="800px"
      center>
      <el-form label-width="100px" class="show-detail-form" v-if="userBaseInfo">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item label="工号/学号：" prop="account"><span>{{ userBaseInfo.account }}</span></el-form-item>
              <el-form-item label="姓名：" prop="user_name"><span>{{ userBaseInfo.user_name }}</span></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="头像：" prop="head_img">
                <el-avatar v-if="userBaseInfo.head_img||userBaseInfo.head_img===''" shape="square" :size="50" :src="common.filePath + userBaseInfo.head_img">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                </el-avatar>
                <span v-else>未上传头像</span>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级：" prop="grade_num"><span>{{ userBaseInfo.grade_num?userBaseInfo.grade_num+'届':'' }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级：" prop="class_num"><span>{{ userBaseInfo.class_num?userBaseInfo.class_num+'班':'' }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="sex">
              <i class="el-icon-male" v-if="userBaseInfo.sex===1"></i>
              <i class="el-icon-female" v-if="userBaseInfo.sex===2"></i>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入校时间：" prop="admission_time">
              <span>{{ common._convertDate(userBaseInfo.admission_time, "yyyy年MM月dd日") }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="facultyTreeData" label="院系：" prop="faculties_ids">
              <el-cascader disabled :options="facultyTreeData" :props="facultyProps" v-model="userBaseInfo.faculties_ids" change-on-select class="fill-width text-info"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机：" prop="phone_num"><span>{{ userBaseInfo.phone_num }}</span></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱：" prop="mail"><span>{{ userBaseInfo.mail }}</span></el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介：" prop="sim_desc"><el-input disabled type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="userBaseInfo.sim_desc"></el-input></el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import qs from "qs"
  import NavBar from "../components/NavBar.vue"
  import upload from "../components/Upload.vue"
  import UploadAvatar from "../components/UploadAvatar.vue"
  import CropAvatar from "../components/CropAvatar.vue"
  import BuildFeedback from '../views/maintenanceSystem/Feedback.vue';  //新建反馈
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          if (this.resetPasswordForm.confirmPassword !== '') {
            this.$refs.resetPasswordForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetPasswordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          callback();
        }
      };
      // 验证原密码
      let checkPassword = (rule, value, callback) => {
        let self = this
        if (!value) {
          callback(new Error('原密码不能为空'));
        } else {
          self.checkPassword(value).then(_ => {callback()}).catch(e => {callback(new Error(e))})
        }
      };
      // 验证新密码(原密码输错或未输入 则新密码无法提交)
      let checkNewPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('新密码不能为空'));
        } else if (!this.personForm.oldPassword) {
          callback(new Error('您未输入原密码'));
        } else if (value == this.personForm.password) {
          callback(new Error('新密码与原密码相同'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上'));
        } else {
          callback();
        }
      };
      let checkNewPasswordAgain = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码不能为空'));
        } else if (value != this.personForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      };
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
        dataReady:     false,
        loading:       false,
        mainLoading:   false,
        navMode:       "vertical",
        resourceList:  [], //权限数组 
        dialogVisible: false,//是否弹出新建反馈信息弹框

        personDialogVisible: false,
        facultyTreeData: null,
        facultyProps: {
          children: 'childrens',
          label: 'faculty',
          value: 'id'
        },
        editPassword: false, // 默认不操作密码功能
        personForm: { // 人员(新增/编辑)表单
          head_img:         null,
          user_name:        null,
          account:          null,
          sex:              null,
          admission_time:   null,
          faculties_ids:    [],
          phone_num:        undefined,
          mail:             null,
          oldPassword:      null,
          newPassword:      null,
          newPasswordAgain: null,
          grade_num:        null,
          class_num:        null,
          sim_desc:         null,
        },
        rules: {
          user_name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          account: [
            { required: true, message: '请输入工号/学号', trigger: 'blur' },
          ],
          oldPassword: [
            { required: true, validator: checkPassword, trigger: 'blur'}
          ],
          faculties_ids: [
            { required: true, message: '请选择院系', trigger: 'change' },
          ],
          newPassword: [
            { required: true, validator: checkNewPassword, trigger: 'blur' },
          ],
          newPasswordAgain: [
            { required: true, validator: checkNewPasswordAgain, trigger: 'blur' },
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
        },

        userBaseInfo:null,
        baseDialogVisible:false,
      };
    },
    components: {
      "nav-bar":        NavBar,
      "build-feedback": BuildFeedback,
      "upload":         upload,
      'upload-avatar':  UploadAvatar,
      'crop-avatar':    CropAvatar,
    },
    watch: {
      "navMode": {
        handler (newV, oldV) {

        },
        deep: true,
      },
      "$route": {
        handler (to, from) {
          this.mainLoading = true
          this.$nextTick(() => {
            this.mainLoading = false
          })
        },
        deep: true
      }
    },
    created () {
      if(!sessionStorage.getItem('Authority')) {
        this.$message.error("登录失效, 请重新登录!")
        setTimeout(_ => {
          this.$router.push({name: "Login"})
        }, 2000)
      } else {
        this.getStandardTree().then(_ => {
          this.dataReady = true
          this.initFacultyTree()
        }).catch(err => {

        })
      }
    },
    mounted() {
      this.getUserBaseInfo();
    },
    methods: {
      checkPassword (value) {
        let p = new Promise((resolve, reject) => {
          let config = {
            url: `${this.common.basePath}/user/check`,
            method: "get",
            params: {
              id: JSON.parse(sessionStorage.getItem("Access-Key")),
              password: value
            }
          }
          this.axios(config).then((r) => {
            resolve(true)
          }).catch((e) => {
            reject(e)
          })
        })
        return p
      },
      reLogin () {
        let config = {
          url: `${this.common.basePath}/login/in`,
          method: "post",
          data: qs.stringify({
            account: JSON.parse(sessionStorage.getItem("Access-Account")),
            pass: '123456'
          })
        }
        this.axios(config).then((r) => {
          sessionStorage.setItem('Access-Token',JSON.stringify(r.headers['access-token']));
          sessionStorage.setItem('Access-Key',JSON.stringify(r.data.data.userId));
          sessionStorage.setItem('Access-Account',JSON.stringify(r.data.data.account));
          sessionStorage.setItem('Authority',JSON.stringify(r.data.data.webList));
          this.$router.go(0)
        }).catch((e) => {
        })
      },
      changeMode () {
        this.loading = true
        if(this.navMode == "horizontal") {
          this.navMode = "vertical"
					this.loading = false
					sessionStorage.setItem("navMode","vertical")
        } else {
          this.navMode = "horizontal"
					this.loading = false
					sessionStorage.setItem("navMode","horizontal")
        }
        // this.$message.success(this.navMode == "horizontal" ? "切换为横向导航" : "已切换为纵向导航")
        setTimeout (() => {
          this.loading = false
        }, 500)
      },
      /**
       * 获取设备规格分类树, 并保存至session
       * @return {[type]} [description]
       */
      getStandardTree() {
        let self = this
        self.pageLoading = true

        let config = {
          method: "get",
          url: `${this.common.basePath}/spec/tree/public`
        }
        let p = new Promise((resolve, reject) => {
          self.axios(config).then((response) => {
            sessionStorage.setItem('typeTree', JSON.stringify(response.data.data))
            self.$store.commit('setTypeTree', response.data.data)
            resolve(response.data.data)
          }).catch((errorMsg) => {
            self.pageLoading = false
            self.$message.error(errorMsg)
            reject("查询设备规格出错")
          })
        })

        return p
      },
      /**
       * 获取院系树
       * @return {[type]} [description]
       */
      initFacultyTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/faculty/tree/public`
        }
        this.axios(config).then((response) => {
          this.facultyTreeData = response.data.data || []
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })        
      },
      /**
       *触发子组件 新建反馈信息弹框消失 的事件
       */
      changeDialogVisible(data){
        this.dialogVisible = data;//改变了父组件的值
      },
      dropdownClicked(command) {
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: sessionStorage.getItem("Access-Key")
          },
        }
        this.axios(config).then((response) => {
          this.personForm = response.data.data
          response.data.data.faculties_ids?'':this.personForm.faculties_ids = [];
          this.$nextTick(_ => {
            if(this.$refs.personForm){
              this.$refs.personForm.clearValidate()
            }
          })
          command == "info" ? this.editPassword = false : null
          command == "pass" ? this.editPassword = true : null
          command == "base_info" ? this.baseDialogVisible = true : this.personDialogVisible = true
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })
      
      },
      getUserBaseInfo(){
        let config = {
          method: "get",
          url: `${this.common.basePath}/user/one/user`,
          params: {
            id: sessionStorage.getItem("Access-Key")
          },
        }
        this.axios(config).then((response) => {
          this.userBaseInfo = response.data.data; 
        }).catch((errorMsg) => {
          this.$message.error(errorMsg)
        })

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
          method: this.editPassword ? "patch" : "post",
          url:    this.editPassword ? `${this.common.basePath}/user/up/password/${this.personForm.id}` : `${this.common.basePath}/user/one/up_user`,
          data:   this.editPassword ? {password : this.personForm.newPassword } : this.personForm,
        }

        this.$refs.personForm.validate((valid) => {
          if(valid) {
            if(!this.editPassword) {
              config.data.faculty = this.personForm.faculties_ids[this.personForm.faculties_ids.length - 1]
              delete config.data.faculties_ids
            }

            this.axios(config).then((response) => {
              this.$message.success(this.editPassword ? "修改密码成功, 请重新登录" : response.data.meta.message)
              if(this.editPassword) { // 修改密码后 移除所有保存的内容 强制退出
                sessionStorage.removeItem("Access-Account")
                sessionStorage.removeItem("Access-Key")
                sessionStorage.removeItem("Access-Token")
                sessionStorage.removeItem("Authority")
                this.$router.push({name: "Login"})
              }
              this.getUserBaseInfo();
              this.personDialogVisible = false
            }).catch((errorMsg) => {
              this.dialogPersonVisible = false
              this.$message.error(errorMsg)
            })
          } else {
            this.$message.error("请检查表单填写是否正确")
          }
        })
      },
    },
  }
</script>

<style scoped lang="less">
  #wapper {
    background-color: rgb(255,255,255);
    background-size: 800px;
    background-position: -200px;
  }
  .content-wrap {
    width: 100%;
    overflow-y: hidden;
    background: #efefef;
  }
  .nav-bar-vertical {
    width: 240px!important;
  }
  .content-vertical {
    width: calc( 100% - 240px )!important;
  }
  .content-wrap.vertical-box {
    height: calc( 100vh - 60px );
  }
  .content-wrap.horizontal-box {
    height: calc( 100vh - 128px );
  }
</style>
