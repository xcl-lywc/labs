/*********************导航组件***********************/
  Author: Mingzhang.Zhao
  Date:   2018-04-22
/************************************************/
<template>
  <!-- <el-menu
    id="nav"
    :class="{'vertical-nav': showType == 'vertical'}"
    :default-active="getActiveIndex()"
    :mode="showType"
    background-color="rgba(255,255,255,0.6)"
		popper-class="popper-class"
    text-color="#1f3140"
    active-text-color="#1e90f0"
    @select="navClicked"
		unique-opened
		collapse-transition
		style="">
    <el-submenu v-for="item in navArray" :key="item.path" :index="item.path" :show-timeout="10" :hide-timeout="10">
      <template slot="title"><i class="nav-icon" :class="item.navIcon"></i>{{ item.navName }}</template>
      <el-menu-item v-for="itemInner in item.children" :key="item.path + '/' +itemInner.path" :index="item.path + '/' +itemInner.path">
        {{ itemInner.navName }}
      </el-menu-item>
    </el-submenu>
  </el-menu> -->
  <el-menu
  id="nav"
  :default-active="activeNav"
  class="no-border-right"
  :class="{'vertical-nav': showType == 'vertical'}"
  :mode="showType"
  background-color="#fff"
  unique-opened
  text-color="#606266"
  @select="navClicked"
  active-text-color="#409EFF">
    <el-submenu index="1" v-if="checkAuthority('LessonManageIndex')">
      <template slot="title"><i class="fa fa-book"></i>&nbsp;课程管理</template>
      <el-menu-item v-if="checkSecondAuthority('LessonSystem')" index="LessonSystem">课程体系</el-menu-item> 
      <el-menu-item v-if="checkSecondAuthority('LessonList')" index="LessonList">课程</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('TestList')" index="TestList">实验</el-menu-item> 
      <el-menu-item v-if="checkSecondAuthority('CourseCount')" index="CourseCount">课程安排</el-menu-item>
      <!-- <el-menu-item index="1-6">课程评价</el-menu-item> -->
    </el-submenu>
    <el-submenu index="3" v-if="checkAuthority('LabManageIndex')">
      <template slot="title"><i class="fa fa-cubes"></i>&nbsp;实验室管理</template>
      <el-menu-item v-if="checkSecondAuthority('LabList')" index="LabList">实验室</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('ClassroomList')" index="ClassroomList">教室</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('WorkList')" index="WorkList">教室工单</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('ClassOccupy')" index="ClassOccupy">教室占用</el-menu-item> 
    </el-submenu>
    <el-submenu index="4" v-if="checkAuthority('DeviceManageIndex')">
      <template slot="title"><i class="fa fa-flask"></i>&nbsp;设备管理</template>
      <el-menu-item v-if="checkSecondAuthority('Standard')" index="Standard">设备规格</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('DeviceList')" index="DeviceList">实验设备</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Rent')" index="Rent">设备借还</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Repair')" index="Repair">设备维修</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Scrap')" index="Scrap">设备报废</el-menu-item>
    </el-submenu>
    <el-submenu index="9" v-if="checkAuthority('ConsumablesManageIndex')">
      <template slot="title"><i class="fa fa-gavel"></i>&nbsp;耗材管理</template>
      <el-menu-item v-if="checkSecondAuthority('Consume')" index="Consume">设备耗材</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Warehouse')" index="Warehouse">耗材仓库</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Record')" index="Record">入库</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Out')" index="Out">出库</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('MyOut')" index="MyOut">我的申请</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('MyDevice')" index="MyDevice">我的设备</el-menu-item>
    </el-submenu>
    <el-submenu index="5" v-if="checkAuthority('PersonManageIndex')">
      <template slot="title"><i class="fa fa-group"></i>&nbsp;人员管理</template>
      <el-menu-item v-if="checkSecondAuthority('RoleList')" index="RoleList">角色管理</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Authority')" index="Authority">权限管理</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('UserList')" index="UserList">用户管理</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Faculty')" index="Faculty">院系管理</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Empower')" index="Empower">授权管理</el-menu-item>
    </el-submenu>
    <el-submenu index="6" v-if="checkAuthority('EptManageIndex')">
      <template slot="title"><i class="fa fa-tasks"></i>&nbsp;实验管理</template> 
      <el-menu-item v-if="checkSecondAuthority('ReportScore')" index="ReportScore">报告评分</el-menu-item> 
      <el-menu-item v-if="checkSecondAuthority('ExerciseScore')" index="ExerciseScore">习题评分</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('ReportTaskList')" index="ReportTaskList">提交报告</el-menu-item> 
      <el-menu-item v-if="checkSecondAuthority('ExperimentalExercises')" index="ExperimentalExercises">实验习题</el-menu-item> 
      <el-menu-item v-if="checkSecondAuthority('ExperimentalQuestionnaire')" index="ExperimentalQuestionnaire">问卷调查</el-menu-item> 
    </el-submenu>
    <el-submenu index="7" v-if="checkAuthority('LogManageIndex')">
      <template slot="title"><i class="fa fa-align-left"></i>&nbsp;系统管理</template>
      <el-menu-item v-if="checkSecondAuthority('User')" index="User">用户日志</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('Security')" index="Security">安全日志</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('System')" index="System">系统日志</el-menu-item>
    </el-submenu>
    <el-submenu index="8" v-if="checkAuthority('SettingsIndex')">
      <template slot="title"><i class="fa fa-gear"></i>&nbsp;设置</template>
      <el-menu-item v-if="checkSecondAuthority('HomeSetting')" index="HomeSetting">门户页面</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('ArticleSetting')" index="ArticleSetting">文章设置</el-menu-item>
      <el-menu-item v-if="checkSecondAuthority('SchoolYear')" index="SchoolYear">学年学期</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import lunar from "../plugins/lunar.js";
  export default {
    data () {
      return {
        navArray:              [],
        activeNav:             this.$route.name || '',
        pageAuthority:         null,
        pageAuthorityCodeList: [],
      }
    },
    props: {
      showType: { // 显示的type类型
        required: true,
        type: String,
        default: "vertical"
      },
      resource: { // 触发刷新的资源
        required: true,
        default: "vertical"
      }
    },
    watch: {
    },
    created () {
      this.setPageAuthority()
    },
    mounted () {
    },
    methods: {
      /**
       * 构建页面显示的权限
       * @return {[type]} [description]
       */
      setPageAuthority() {
        let self = this
        try{
          JSON.parse(sessionStorage.getItem("Authority")).forEach((item, index) => {
            if(item.code == "PageAuthority"){
              self.pageAuthority = item.mate
            }
          })
        } catch (error) {
          self.pageAuthority = null
        }
        //重组一个只有权限code的数组 用于判断是否本导航被权限所控制(是否包含)
        this.pageAuthorityCodeList = this.pageAuthority.map(item => {
          return item.code
        })
        // // 删除空的数据 组成新的数组(不使用forEach 为保证循环次数为原数组的长度)
        // for(var i = 0; i < this.pageAuthorityCodeList.length; i++) {
        //   if(!this.pageAuthorityCodeList[i]) {
        //     this.pageAuthorityCodeList.splice(i--, 1);
        //   }
        // }
        // console.log(this.pageAuthorityCodeList)
      },
      checkAuthority (code) {
        let flag = false
        //找到此权限 并且holdOn为true 验证通过
        this.pageAuthority.forEach((item, index) => {
          if(code == item.code && item.holdOn) {
            flag = true
          }
        })
        // 上述验证失败时 查询此权限是否被控制 未被控制时依然为true
        if(this.pageAuthorityCodeList.join(",").indexOf(code) == -1) {
          flag = true
        }
        return flag
      },
      /**
       * 检查二级目录是否有权限
       * @param  {[type]} code [description]
       * @return {[type]}      [description]
       */
      checkSecondAuthority(code) {
        let Authority = null
        let secondAuthority = false
        try{
          JSON.parse(sessionStorage.getItem("Authority")).forEach((item, index) => {
            if(item.code == code) {
              secondAuthority = item.holdOn
            }
          })
        } catch (error) {
          secondAuthority = false
        }
        return secondAuthority
      },
      navClicked (path, pathArray) {
        let target = this
        if(path.indexOf("-") == -1) {
          this.$router.push({name: path})
          this.activeNav = path
        } else {
          this.$message.warning("该功能暂未开放", 100)
        }
      },
    }
  }
</script>
