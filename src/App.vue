<template>
  <div id="app">
    <!-- 根据需要显示不同的布局情况 -->
    <component :is="layout"></component>
    <el-dialog title="设备二维码" :visible.sync="$store.state.dialogQRcodeVisible" width="300px">
      <qrcode class="qrcode-canvas-wrap" :value="$store.state.QRcodeValue"></qrcode>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$store.commit('exchangeShowStatus', false)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import BlankLayout from "./layout/BlankLayout.vue";
  import NavLayout from "./layout/NavLayout.vue"
  import qrcode from "qrcode.vue"

  export default {
    props: {
      layout: {
        type: String,
        default: "nav-layout"
      }
    },
    watch: {
      "$route": {
        handler (to, from) {
          //跳转到新页面时, 清空vuex的权限内容, 重新比对
          this.$store.commit("setAuthority", null)
          this.checkThisPageAuthority()
          // console.log(this.$store.state.authority)
          if(from.path) {
            sessionStorage.setItem("historyName", from.name)
          }
        },
        deep: true
      }
    },
    components: {
      "qrcode":       qrcode,
      "nav-layout":   NavLayout,                                    
      "blank-layout": BlankLayout
    },
		data() {
      return {
      };
    },
		mounted() {
		},
    methods: {
      /**
       * 根据当前页面查询对应是否有权限控制
       * @return {[type]} [description]
       */
      checkThisPageAuthority() {
        let self = this
        try {
          let tree = JSON.parse(sessionStorage.getItem("Authority"))
          if(tree) {
            tree.forEach((item, index) => {
              // self.traverseTree(item)
              if (item.code == self.$route.name) { //当匹配到对应权限时 更新vuex
                self.$store.commit("setAuthority", item.mate)
              }
              // console.log(item.code, self.$route.name)
            })
          }
        } catch(error) {
          if(!(this.$route.name == "Login" || this.$route.name == "Dashboard")) {
            this.$message.error("登录验证失效, 请重新登录")
            this.$router.push({name: "Login"})
          }
        }
      },
      /**
       * 遍历树(递归遍历), 删除空白的childrens
       * @param  {object}   node         根节点(单个对象, 多个树需要重复调用)
       * @return none
       */
      traverseTree (node) {
        if (!node) {
          return;
        }
        if (node.childrens && node.childrens.length > 0) {
          var i = 0;
          for (i = 0; i < node.childrens.length; i++) {
            this.traverseTree(node.childrens[i]);
            console.log(node.childrens[i])
          }
        }
      },
    }
  }
</script>
<style>
  .qrcode-canvas-wrap>canvas {
    width: 260px!important;
    height: 260px!important;
  }
</style>
