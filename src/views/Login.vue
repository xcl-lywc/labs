<template>
  <!--登录 -->
  <div>
    <div class="background-wrap">
      <div class="login-background">
        <!-- <vue-particles
          color="#fff"
          :particleOpacity="0.7"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="4"
          linesColor="#fff"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push">
        </vue-particles> -->
      </div>
    </div>
    <!-- <img id="title-img" src="../assets/img/文字_image.png" alt="1"> -->
      <div class="login-box">
        <div class="box-title">
          欢迎登录
        </div>
        <div class="box-form">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
            <el-form-item prop="account">
              <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="请输入工号/学号/邮箱">
                <i slot="prefix" class="el-input__icon fa fa-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input type="password" v-model="ruleForm.pass" auto-complete="off" placeholder="请输入密码" show-password>
                <i slot="prefix" class="el-input__icon fa fa-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="checked" class="fl" @change="rememberClick"><span class="text-dark-blue">记住密码</span></el-checkbox>
              <el-button type="text" class="text-dark-blue fr" @click="$router.push({name: 'Dashboard'})">返回门户页</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="primary">
              {{buttonLoading ? '登录中' : '登录'}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div></div>
      </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  import { request } from '../plugins/request.js'
  import VueParticles from 'vue-particles/src/vue-particles/vue-particles.vue'
  export default {
    data() {
      var validatepass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validateaccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      return {
        checked: false,
        buttonLoading: false,
        ruleForm: {
          pass: '',
          account: '',
        },
        rules: {
          pass: [
            { validator: validatepass, trigger: 'blur' }
          ],
          account: [
            { validator: validateaccount, trigger: 'blur' }
          ],
        },
      };
    },
    components: {
      "vue-particles": VueParticles
    },
    created () {
      let self = this
      self.common.startInterval = false
    },
    mounted () {
      var self = this;
      //self.initCanvas()
      self._remember();
      //按下回车键登录
      document.onkeydown = function(event){
        if(self.$route.name == "Login") {
          if(event.keyCode === 13){
            self.login();
          }
        }
      };
    },
    methods: {
      initCanvas () {
        var canvas = document.getElementById('canvas');

        var ctx = canvas.getContext("2d");
        ctx.fillStyle="#FF0000";
        ctx.fillRect(0,0,150,75);
      },
      //登录按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.login();
          } else {
            //alert('您还未填写账号或密码!!!');
            this.$message.warning('您还未填写账号或密码!!!', 20);
            return false;
          }
        });
      },
      //登录
      login: function() {
        var self = this;
        self.buttonLoading = true;
        let config = {
          url: `${this.common.basePath}/login/in`,
          method: "post",
          data: qs.stringify(this.ruleForm)
        }
        this.axios(config).then((r) => {
          self.buttonLoading = false;
          //判断是否同有课程列表或者设备列表 有则进入对应的页面 若都没有则不允许进入后台
          let target = null
          r.data.data.webList.forEach(item => {
            if(item.code == "DeviceList" && item.holdOn) {
              target = item.code
            } else if(item.code == "LessonList" && item.holdOn) {
              target = item.code
            }
          })
          
          if(target) {
            self.$router.push({name: target})
          } else {
            this.$message.error("当前账号对应角色授权异常, 请联系管理员")
          }
          
          sessionStorage.setItem('Access-Token',JSON.stringify(r.headers['access-token']));
          sessionStorage.setItem('Access-Key',JSON.stringify(r.data.data.userId));
          sessionStorage.setItem('Access-Account',JSON.stringify(r.data.data.account));
          sessionStorage.setItem('Authority',JSON.stringify(r.data.data.webList));
        }).catch((e) => {
          self.buttonLoading = false;
          self.$message.error(e)
        })
      },
      goToPage (data) {
        let self  = this
        let targetRole = data.roleIds[0] || null
        if(targetRole == 6 || targetRole == 5) {
          switch(targetRole) {
            case 5: //网信办
              self.$router.push({name: 'Dashboard'});
              break;
            case 6: //公安局
              self.$router.push({name: 'Dashboard'});
              break
          }
        } else {
          self.$router.push({name: 'Dashboard'});
        }
        
      },
      /*
       * 查询字典数据
       */
      _getDictionary(){
        return new Promise( (resolve, reject) => {
          this.axios.get(this.common.basePath + '/contrast/choice/list', '').then(function (response){
            resolve(response)
          }).catch(function (error) {
            reject(error)
          });
        });
      },
      //重置按钮
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //点击按钮记住账号密码
      rememberClick() {
        console.log(this.checked)
        this.checked? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
        localStorage.setItem("account", this.ruleForm.account);
        localStorage.setItem("pass", this.ruleForm.pass);
      },
      //记住账号密码
      _remember: function() {
          if(localStorage.getItem("remember") === "true") { 
              if(localStorage.getItem("account") && localStorage.getItem("pass")) {
                  this.ruleForm.account = localStorage.getItem("account");
                  this.ruleForm.pass = localStorage.getItem("pass");
                  this.checked = true;
              }
          }
      },
      //跳转注册页面
      skipReg(){
        this.$router.push({path: '/reg'});
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;
  @keyframes scaleBackground {
    0% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
    50% {transform:scale(1.08, 1.08);background-image: url("../assets/img/2.jpg");}
    100% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
  }
  .background-wrap {
    overflow: hidden;
    .login-background {
      width: 100vw;
      height: 100vh;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  #title-img {
    position: absolute;
    width: 28vw;
    left: 10vw;
    top: 50%;
    margin-top: -158px;
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .login-box {
    position: absolute;
    top: 50%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    opacity: 0.9;
    -webkit-box-sizing: border-box;
    background-color: #d4d4d496;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #171717b8;
    .box-title{
      color: @darkBlue;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid @darkBlue;
    }
    .box-form{
      padding: 0 15px;
      .head-img{
        margin-left: 35%;
        border-radius: 50%;
        width: 80px;
      }
    }
    .box-footer{
      cursor: pointer;
      color: royalblue;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
<style lang="less">
  #particles-js{
    width: 100vw;
    height: 99.5vh;
    position: absolute;
    top: 0;
  }
  #canvas {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .login-box {
    .el-form-item__content {
      padding-left: 0;
    }
  }
</style>