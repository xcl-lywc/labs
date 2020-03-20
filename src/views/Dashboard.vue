<template>
  <div class="dashboard">
    <header>
      <img class="home-logo" src="../assets/img/logo.png">
      <h1 class="home-title text-center">通信与信息系统实验中心</h1>
      <el-button type="default" size="mini" class="home-button-group" @click="enterBackStage"><span>进入后台</span></el-button>
      <img src="../assets/img/barl.png" class="fill-width">
    </header>
    <!-- 顶部导航 -->
    <nav class="nav-top">
      <el-menu
        id="dashboard-nav"
        :default-active="navActive"
        mode="horizontal"
        background-color="transparent"
        text-color="#fff"
        @select="chooseNav"
        active-text-color="#ffd04b">
        <el-menu-item index="home">首页</el-menu-item>
        <el-menu-item v-show="navData.length > 0" :index="`${item.id}`" v-for="(item, index) in navData" :key="`导航${index}`">{{ item.name }}</el-menu-item>
      </el-menu>
    </nav>
    <!-- 不包含二级导航的部分(首页) -->
    <div v-if="navActive == 'home'" class="home-page">
      <el-row :gutter="10">
        <el-col :span="18" class="no-padding-left">
          <el-carousel v-if="carouselData.length && carouselData.length > 0" :interval="4000" height="300px">
            <el-carousel-item v-for="item in carouselData" :key="item.img">
              <img :src="item.img" @click="goToLink(item)" class="carousel-img hover-cursor">
              <p class="link hover-cursor" @click="goToLink(item)" :title="item.label">{{ item.label }}</p>
            </el-carousel-item>
          </el-carousel>
          <p v-else class="text-center text-info"> 请至后台 > 设置 > 门户页面 中添加</p>
        </el-col>
        <el-col :span="6">
          <h3 class="home-page-title"><span>Events</span></h3>
          <ul class="left-ul max-height" v-if="carouselEventData.length && carouselEventData.length > 0">
            <li class="text-left" v-for="(item, index) in carouselEventData" :key="`events${index}`" :title="item.label" @click="goToLink(item)">{{item.label}}</li>
          </ul>
          <p v-else class="text-center text-info"> 请至后台 > 设置 > 门户页面 中添加</p>
        </el-col>
      </el-row>
      
      
      <!-- <h3 class="home-page-title"><span>Events</span></h3>
      <el-carousel    :interval="4000" height="300px">
        <el-carousel-item v-for="item in carouselEventData" :key="item.img">
          <img :src="item.img" @click="goToLink(item)" class="carousel-img hover-cursor">
          <p class="link hover-cursor" @click="goToLink(item)">{{ item.label }}</p>
        </el-carousel-item>
      </el-carousel>
      <p v-else class="text-center text-info"> 请至后台 > 设置 > 门户页面 中添加轮播</p> -->

      <el-row  :gutter="10">
        <el-col :span="18">
          <div v-for="(item, index) in anchorPointList" :key="`${index}段落`">
            <h4 class="home-page-title"><a :name="`${index}`">{{ item.label }}</a></h4>
            <p class="padl10 text-indent">{{ item.text }}</p>
          </div>
        </el-col>
        <el-col :span="6">
          <transition>
            <div class="anchor-ul-wrap" :class="{'fixed': showList}">
              <h4 class="home-page-title no-padding-top"><span>目录</span></h4>
              <ul class="left-ul" v-if="anchorPointList.length && anchorPointList.length > 0">
                <li v-for="(item, index) in anchorPointList" :key="`段落目录${index}`" :title="item.label">
                  <a class="anchor-point text-left" :href="`#${index}`">{{ item.label }}</a>
                </li>
              </ul>
            </div>
          </transition>
        </el-col>
      </el-row>
    </div>
    <!-- 包含二级导航的部分 -->
    <div v-else class="dashboard-fill-height">
      <el-row v-if="secondNav.length > 0">
        <el-col :span="4" v-if="secondNav && secondNav.length">
          <ul class="left-ul mar10">
            <li :class="{'text-primary': activeSecond == `${item.id}`}"  class="text-left" v-for="(item, index) in secondNav" :key="`左侧列表${index}`" @click="leftNavClicked(item)" :title="item.name">{{item.name}}</li>
          </ul>
        </el-col>
        <el-col :span="secondNav && secondNav.length > 0 ? 20 : 24">
          <div class="right-content">
            <list v-if="showType == 'list'" @goToDetail="goToDetail" :id="activeSecond" :navData="secondNav"></list>
            <detail v-if="showType == 'detail' && activeArticle" @backToList="backToList" :showButton="showButton" :id="activeArticle"></detail>
            <div v-else-if="showType != 'list'" class="text-center text-info"> 该分类仅展示单个文章 , 请至后台 > 设置 > 文章设置中添加 </div>
          </div>
        </el-col>
      </el-row>
      <div v-else class="text-info text-center"> 没有数据 </div>
    </div>
    <div class="bottom">
      <p><span>今日访问量：{{current_count}}</span> &nbsp;&nbsp;|&nbsp;&nbsp; <span>历史访问量：{{total_count}}</span></p>
      <p>© 电子科技大学通信与信息系统实验中心</p>
      <p class="text-info">清水河校区: 成都市高新区（西区）西源大道2006号 邮编:611731<br/>
      沙河校区: 成都市建设北路二段四号 邮编:610054
      </p>
    </div>
  </div>
</template>
<script>
  import qs     from "qs"; //需要传表单时, 引用此包
  import list   from "../components/dashboard/List.vue";
  import detail from "../components/dashboard/Detail.vue";
  export default {
    components: {
      list,
      detail
    },
    watch: {
      // navActive: { //点击到后续菜单时 将次级菜单赋予初始值
      //   handler(newV, oldV) {
      //     if(newV != "home") {
      //       this.activeSecond = this.secondNav[0].id
      //     }
      //   },
      //   deep: true
      // }
    },
    data () {
      return {
        carouselData: [],
        carouselEventData: [],

        navActive: "home", //string型 number => string
        navData: [],
        secondNav: [],
        activeSecond: "",  //二级导航选中
        showType: null,  //"list" 显示列表 "detail" 显示详情
        showButton: true, // 是否需要显示返回列表 默认显示
        activeArticle: null, // 当前选中的文章
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        showList: false, //是否滚动到一定的高度 右侧目录变为跟随移动
        anchorPointList: [],

        current_count:0,//今日访问量
        total_count:0,//历史访问量
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
      this.initArticleTree()
      this.getCaresoulList("carouselData")
      this.getCaresoulList("carouselEventData")
      this.getAnchorList()
      this.initPV();
    },
    methods: {
      /**
       * 门户页面初始化或者刷新时调用
       * 刷新用户访问量
       */
      initPV(){  
        this.axios.post(`${this.common.basePath}/home/count`).then((response) => {
          // this.attendanceSheetData = this._listAddCheckedKey(response.data.data);
          this.getPV();
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 获取用户访问量
       */
      getPV(){  
        this.axios.get(`${this.common.basePath}/home/count`).then((response) => {
          this.current_count = response.data.data.current_count;
          this.total_count = response.data.data.total_count;
        }).catch((error) => {
          this.$message.error(error);  
        });
      },
      /**
       * 滚动监听
       * @return {[type]} [description]
       */
      handleScroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop && scrollTop > 530) {
          this.showList = true
        } else {
          this.showList = false
        }
      },
      getAnchorList() {
        let config = {
          url: `${this.common.basePath}/home/current`,
          method: "get",
          params: {
            type: "3"
          }
        }
        this.axios(config).then(response => {
          this.anchorPointList = JSON.parse(response.data.data) || []
        }).catch(error => {
          this.$message.error(error)
        })
      },
      /**
       * 获取轮播列表数据
       * @return {[type]} [description]
       */
      getCaresoulList(formName) {
        let config = {
          url: `${this.common.basePath}/home/current`,
          method: "get",
          params: {
            type: formName == "carouselData" ? 1 : 2
          }
          
        }

        this.axios(config).then(response => {
          this[formName] = JSON.parse(response.data.data) || []
          this.pageLoading = false
        }).catch(error => {
          this.$message.error(error)
          this.pageLoading = false
        })
      },
      /**
       * 获取文章分类树
       * @return {[type]} [description]
       */
      initArticleTree() {
        this.pageLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/article_type/tree`
        }
        this.axios(config).then((response) => {
          this.navData = response.data.data
          this.pageLoading = false
        }).catch((errorMsg) => {
          this.pageLoading = false
          this.$message.error(errorMsg)
        })
      },
      
      enterBackStage() {
        let self = this
        try {
          let webList = JSON.parse(sessionStorage.getItem("Authority"))
          if(!webList) {
            throw({message: "请登录", code: 400})
          }
          let target = null
          webList.forEach(item => {
            if(item.code == "DeviceList" && item.holdOn) {
              target = item.code
            } else if(item.code == "LessonList" && item.holdOn) {
              target = item.code
            }
          })
          
          if(target) {
            self.$router.push({name: target})
          } else {
            self.$message.error("当前账号对应角色授权异常, 请联系管理员")
          }
        } catch (error) {
          // self.$message.error(error.message)
          if(error.code == 400) {
            self.$router.push({name: "Login"})
          }
        }
      },
      /**
       * 点击导航 将其二级导航写入 为空则不写入 第一级若为单独文章 直接查看详情
       * @param  {[type]} key     [description]
       * @param  {[type]} keyPath [description]
       * @return {[type]}         [description]
       */
      chooseNav (key, keyPath) {
        let self = this
        self.navActive = key
        
        self.navData.forEach((item, index) => {
          if(item.id == key) {
            self.secondNav = item.childrens || [] // 写入二级分类

            if(self.secondNav.length > 0) {
              self.activeSecond = `${self.secondNav[0].id}`

              if(self.secondNav[0].type == 1) {
                self.showType = 'list'
                self.showButton = true
              } else {
                self.getFirstArticleId().then(_ => {
                  self.showType = 'detail'
                  self.showButton = false
                }).catch(err => {
                  self.showType = 'detail'
                  self.showButton = false
                })
              }
            } else {
              self.activeSecond = ""
            }
          }
        })
      },
      /**
       * 查询当前分类下第一个文章的id
       * @return {[type]} [description]
       */
      getFirstArticleId() {
        let p = new Promise((resolve, reject) => {
          let config = {
            method: "get",
            url: `${this.common.basePath}/article`,
            params: {
              type: this.activeSecond
            }
          }

          this.axios(config).then((response) => {
            if(response.data.data.rows.length > 0) {
              this.activeArticle = response.data.data.rows[0].id
              resolve("成功")
            } else {
              this.activeArticle = null
              reject("失败")
            }
          }).catch((errorMsg) => {
            reject(this.$message.error(errorMsg))
          })
        })
        
        return p
      },
      /**
       * 点击左侧导航 自动返回列表 根据类型变换
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      leftNavClicked(item) {
        this.activeSecond = `${item.id}`
        if(item.type == 1) {
          this.showButton = true
          this.showType = "list"
        } else {
          this.getFirstArticleId().then(_ => {
            this.showType = 'detail'
            this.showButton = false
          }).catch(err => {
            this.showType = 'detail'
            this.showButton = false
          })
        }
      },
      /**
       * 显示详情
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      goToDetail (data) {
        this.activeArticle = data.id
        this.showType = "detail"
      },
      /**
       * 返回列表
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      backToList (data) {
        this.showType = "list"
      },
      /**
       * 跳转到对应地址 简单验证URL完整性
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      goToLink (item) {
        if (item.url.indexOf("http://") != -1 || item.url.indexOf("https://") != -1) {
          window.location.href = item.url
        } else {
          window.location.href = `http://${item.url}`
        }
        
      },
    }
  }
</script>

<style scoped lang="less">
  .nav-top {

  }
  .link {
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin: 0;
    padding: 0 10px;
    bottom: 0;
    color: #fff;
    background: rgba(0, 0, 0, 0.5)
  }
  .max-height {
    max-height: 247px;
    overflow-y: auto;
  }
  .anchor-title a {
    padding: 20px 0;
  }
  .anchor-ul-wrap {
    &.fixed {
      top: 10px;
      position: fixed;
    }
    width: calc( 950px * 0.25 - 10px);
    .anchor-point {
      text-decoration: none;
      display: inline-block;
      height: 40px;
      width: 100%;
      color: #303030;
    }
  }
  
</style>