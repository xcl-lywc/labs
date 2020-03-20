<template>
  <div class="content-wrap-box">
    <el-card class="title-card">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>门户页面</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>
    
    <div class="router-view-wrap" v-loading="pageLoading">
      <!-- 页面主要内容 -->
      <el-button :disabled="!common.checkAuthority('HomeSetting-EditHomeText', true)" @click="showAnchorDialog">编辑首页文本</el-button>
      <div class="router-view-content">
        <el-row :gutter="10" v-if="common.checkAuthority('HomeSetting-list', true)">
          <el-col :span="11">
            <h3 class="text-info text-bold text-title">
              中心简介
              <el-button :disabled="!common.checkAuthority('HomeSetting-add', true)" type="primary" @click="addItem('carouselData')" size="mini" class="fr">添 加</el-button>
            </h3>
            <div v-if="carouselData && carouselData.length > 0">
            <el-card v-for="(item, index) in carouselData" :key="`中心简介${index}`" class="carousel-card-list">
              <img :src="item.img" class="item-img">
              <p>{{ item.label }}</p>
              <p>{{ item.url }}</p>
              <div>
                <span class="text-info"> 当前序列: {{ index + 1 }} </span>
                <el-button :disabled="!common.checkAuthority('HomeSetting-sort', true) || index == 0" type="primary" size="mini" @click="moveIndex('carouselData', index, 'up')">上移</el-button>
                <el-button :disabled="!common.checkAuthority('HomeSetting-sort', true) || index >= carouselData.length - 1" type="primary" size="mini" @click="moveIndex('carouselData', index,'down')">下移</el-button>
                <el-button :disabled="!common.checkAuthority('HomeSetting-edit', true)" type="primary" size="mini" @click="editItem('carouselData', item, index)">编 辑</el-button>
                <el-button :disabled="!common.checkAuthority('HomeSetting-delete', true)" type="danger" size="mini" @click="deleteItem('carouselData', index)">删 除</el-button>
              </div>
            </el-card>
            </div>
            <p v-else class="text-center text-info"> 当前没有轮播数据 </p>
          </el-col>
          <el-col :span="11" :offset="2">
            
            <h3 class="text-info text-bold text-title">
              Events
              <el-button :disabled="!common.checkAuthority('HomeSetting-add', true)" type="primary" @click="addItem('carouselEventData')" size="mini" class="fr">添 加</el-button>
            </h3>
            <div v-if="carouselEventData && carouselEventData.length > 0">
              <el-card v-for="(item, index) in carouselEventData" :key="`Events${index}`" class="carousel-card-list">
                <img :src="item.img" class="item-img">
                <p>{{ item.label }}</p>
                <p>{{ item.url }}</p>
                <div>
                  <span class="text-info"> 当前序列: {{ index + 1 }} </span>
                  <el-button :disabled="!common.checkAuthority('HomeSetting-sort', true) || index == 0" type="primary" size="mini" @click="moveIndex('carouselEventData', index, 'up')">上移</el-button>
                  <el-button :disabled="!common.checkAuthority('HomeSetting-sort', true) || index >= carouselEventData.length - 1" type="primary" size="mini" @click="moveIndex('carouselEventData', index, 'down')">下移</el-button>
                  <el-button :disabled="!common.checkAuthority('HomeSetting-edit', true)" type="primary" size="mini" @click="editItem('carouselEventData', item, index)">编 辑</el-button>
                  <el-button :disabled="!common.checkAuthority('HomeSetting-delete', true)" type="danger" size="mini" @click="deleteItem('carouselEventData', index)">删 除</el-button>
                </div>
              </el-card>
            </div>
            <p v-else class="text-center text-info"> 当前没有轮播数据 </p>
          </el-col>
        </el-row>
        <div v-else class="text-center text-info"> 你无权查看此内容 </div>
      </div>
      <!-- 页面底部 -->
      <div class="router-view-bottom"><div></div></div>
    </div>
    
    <el-dialog :title="operateType == 'new' ? '新增' : '编辑'" :visible.sync="dialogVisible" width="80vw">
      <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="图片：" prop="img"><img v-if="dialogForm.img" :src="dialogForm.img" height="300"></img><upload @uploadSuccess="uploadSuccess" :fileTypes="['jpg', 'jpeg', 'png']"/></el-form-item>
        <el-form-item label="文本：" prop="label"><el-input v-model="dialogForm.label"></el-input></el-form-item>
        <el-form-item label="链接：" prop="url"><el-input v-model="dialogForm.url"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData(tempList)">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="文本" :visible.sync="dialogAnchorVisible" width="80vw">
      <!-- <el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="100px">
        <el-form-item label="图片：" prop="img"><img v-if="dialogForm.img" :src="dialogForm.img" height="300"></img><upload @uploadSuccess="uploadSuccess" :fileTypes="['jpg', 'jpeg', 'png']"/></el-form-item>
        <el-form-item label="文本：" prop="label"><el-input v-model="dialogForm.label"></el-input></el-form-item>
        <el-form-item label="链接：" prop="url"><el-input v-model="dialogForm.url"></el-input></el-form-item>
      </el-form> -->
      <el-row :gutter="20">
        <el-col :span="8">
        <el-button type="primary" class="fill-width" @click="addAnchorPoint">添加段落</el-button>
          <!-- <el-tree :data="anchorPointList" ref="anchorPointTree" v-if="anchorPointList && anchorPointList.length > 0">
            <span slot-scope="{ node, data }" class="tree-node" >
              <span >{{ node.label }}</span>
              <span>
                <i class="text-primary fa fa-pencil-square-o"></i>
                <i class="text-danger fa fa-trash"></i>
              </span>
            </span>
          </el-tree> -->
          <ul>
            <li v-for="(item, index) in anchorPointList" @click="treeNodeClicked(item, index)"><span :class="{'text-primary': activeAnchorPoint == index }"> {{ item.label }} </span></li>
          </ul>
        </el-col>
        <el-col :span="16">
          <el-form ref="anchorPointForm" :model="anchorPointForm" v-if="anchorPointForm.text">
            <el-form-item label="段落名"><el-input type="text" v-model="anchorPointForm.label"></el-input></el-form-item>
            <el-form-item label="段落文本"><el-input type="textarea" v-model="anchorPointForm.text" rows="20"></el-input></el-form-item>
          </el-form>
          <div v-else class="text-center text-info">请选择段落, 编辑后请点击保存修改</div>
        </el-col>
      </el-row>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteAnchor" :disabled="!anchorPointForm.text" type="danger">删除当前段落</el-button>
        <el-button @click="saveAnchor" :disabled="!anchorPointForm.text" type="primary">保存修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import upload from "../../components/Upload.vue"
  export default {
    data() {
      return {
        pageLoading: false,
        operateType: "new", //新增 "new" 编辑"edit" 删除"delete" 操作序列"index"
        dialogVisible: false,
        dialogForm: {
          img: null,
          label: null,
          url: null
        },
        tempIndex: 0, //当前操作的序列(编辑状态下)
        tempList: null, // 当前操作的列表(与上者在同一时间触发改变值)
        carouselData: [],
        carouselEventData: [],
        rules: {
          img: [{required: true, message: "请上传图片", trigger: "change"}],
          label: [{required: true, message: "请输入显示标题", trigger: "blur"}],
          url: [{required: true, message: "请输出正确的链接地址", trigger: "blur"}]
        },

        dialogAnchorVisible: false,
        anchorPointList: [//锚点数组
          
        ], 
        activeAnchorPoint: null, // 当前选中的锚点
        anchorPointForm: {
          label: null,
          text: null
        }
      };
    },
    components: {
      upload
    },
    computed: {
      
    },
    mounted () {
      if(this.common.checkAuthority('HomeSetting-list', true)){
        this.getCaresoulList('carouselData')
        this.getCaresoulList('carouselEventData')
      }
    },
    watch: {
      "carouselData": {
        handler(newV, oldV) {
         
        },
        deep: true
      }
    },
    methods: {
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
       * 操作当前项的顺序
       * @param  {[type]} index [description]
       * @param  {[type]} type  [description]
       * @return {[type]}       [description]
       */
      moveIndex (formName, index, type) {
        this.operateType = "index"
        let current = JSON.parse(JSON.stringify(this[formName][index]))
        this[formName].splice(index, 1)

        if(type == "up") {
          this[formName].splice(index-1, 0, current)
        } else if (type == "down") {
          this[formName].splice(index+1, 0, current)
        }
        let newData = JSON.parse(JSON.stringify(this[formName]))

        this.submitData(formName)
      },
      /**
       * 新增一项
       * @param  {[type]} item [description]
       * @return {[type]}      [description]
       */
      addItem (formName) {
        this.operateType = "new"
        this.dialogVisible = true
        this.tempList = formName
        this.dialogForm = {
          img: null,
          label: null,
          url: null
        }
        if(this.$refs.dialogForm) {
          this.$refs.dialogForm.clearValidate()
        }
      },
      /**
       * 点击编辑当前项
       * @param  {[type]} item [description]
       * @param  {[type]} index [description]
       * @return {[type]}      [description]
       */
      editItem (formName, item, index) {
        this.operateType = "edit"
        this.tempIndex = index
        this.tempList = formName
        this.dialogVisible = true
        this.dialogForm = JSON.parse(JSON.stringify(item))
        if(this.$refs.dialogForm) {
          this.$refs.dialogForm.clearValidate()
        }
      },
      /**
       * 删除当前项
       * @param  {[type]} index 序号
       * @return {[type]}       [description]
       */
      deleteItem (formName, index) {
        this.operateType = "delete"
        this.$confirm("当前删除的内容将无法找回", "确认删除", {
          type: "warning"
        }).then(_ => {
          this[formName].splice(index, 1)
          this.submitData(formName)
        }).catch(error => {})
      },
      uploadSuccess (data) {
        this.dialogForm.img = `${this.common.filePath}${data.path}`
      },
      /**
       * 将当前状态的数据提交 无论新增编辑删除
       * @return {[type]} [description]
       */
      submitData (formName) {
        let validte = false
        if(this.operateType != "delete" && this.operateType != "index") {
          this.$refs.dialogForm.validate(valid => {
            if(valid) {
              validte = true
              if(this.operateType == "new") {//将表单的内容写入
                this[formName].push(JSON.parse(JSON.stringify(this.dialogForm)))
              } else if(this.operateType == "edit") {
                this[formName][this.tempIndex] = JSON.parse(JSON.stringify(this.dialogForm))
              }
            } else {
              validte = false
              this.$message.error("请检查表单填写是否正确")
            }
          })
        } else {
          validte = true
        }

        if(validte) {
          this.pageLoading = true
          let config = {
            url: `${this.common.basePath}/home`,
            method: "post",
            data: {
              config: JSON.stringify(this[formName]),
              type: formName == "carouselData" ? 1 : 2
            }
          }

          this.axios(config).then(response => {
            this.getCaresoulList(formName)
            this.$message.success(response.data.meta.message)
            this.dialogVisible = false
            this.pageLoading = false
          }).catch(error => {
            this.$message.error(error)
            this.pageLoading = false
          })
        }
      },
      /**
       * 点击 显示编辑文本对话框
       * @return {[type]} [description]
       */
      showAnchorDialog() {
        this.dialogAnchorVisible = true
        this.initAnchorPoint(true)
      },
      /**
       * 添加段落, 添加后立即保存到后台
       */
      addAnchorPoint() {
        this.$prompt('<span><i class="required-label"></i>段落名</span>', '添加段落', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          inputValidator: (value) => {
            if(value) {
              return true
            } else {
              this.$message.error("请检查必填项")
              return false
            }
          },
          inputErrorMessage: "请输入段落名"
        }).then(({value}) => {
          this.anchorPointList.push({
            label: value,
            text: "这是初始文本..."
          })
        }).catch(error => {
        });
      },
      
      allowDrop(draggingNode, dropNode, type) {
        if(type != "inner") {
          return true
        } else {
          return false
        }
      },
      /**
       * 初始获取列表(树)数据, 并初始化form
       * @return {[type]} [description]
       */
      initAnchorPoint(init) {
        
        let config = {
          url: `${this.common.basePath}/home/current`,
          method: "get",
          params: {
            type: 3
          }
        }
        this.axios(config).then(response => {
          this.anchorPointList = JSON.parse(response.data.data) || []
          init ? this.activeAnchorPoint = null : null
        }).catch(error => {
          this.$message.error(error)
        })
        if(init) {
          this.anchorPointForm = {
            label: null,
            text: null,
          }
        } 
        
      },
      /**
       * 点击节点 将对应的text写入
       * @param  {[type]} data [description]
       * @param  {[type]} node [description]
       * @return {[type]}      [description]
       */
      treeNodeClicked(item, index) {
        console.log(index)
        this.activeAnchorPoint = index
        this.anchorPointForm = item
      },
      /**
       * 删除当前段落 重置右侧form 并保存当前状态
       * @return {[type]} [description]
       */
      deleteAnchor() {
        let self = this
        console.log(self.activeAnchorPoint)
        self.$confirm('删除当前段落后将重新请求数据, 确定删除吗?', '删除段落', {
          type: "warning",
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          self.anchorPointList.splice(self.activeAnchorPoint, 1)
          let config = {
            url: `${this.common.basePath}/home`,
            method: "post",
            data: {
              config: JSON.stringify(this.anchorPointList),
              type: 3
            }
          }
          this.axios(config).then(response => {
            this.$message.success(response.data.meta.message)
            this.initAnchorPoint(true)
          }).catch(error => {
            this.$message.error(error)
          })
          
        }).catch(error => {
        });
      },
      /**
       * 编辑完本段落后 点击保存 
       * @return {[type]} [description]
       */
      saveAnchor() {

        //let index = this.$refs.anchorPointTree.getCurrentNode().$treeNodeId - 1
        this.anchorPointList[this.activeAnchorPoint] = this.anchorPointForm
        
        let config = {
          url: `${this.common.basePath}/home`,
          method: "post",
          data: {
            config: JSON.stringify(this.anchorPointList),
            type: 3
          }
        }
        this.axios(config).then(response => {
          this.$message.success(response.data.meta.message)
          this.initAnchorPoint(false)
        }).catch(error => {
          this.$message.error(error)
        })
      },
    }
  };
</script>
<style lang="less">
  .carousel-card-list {
    margin-bottom: 15px;
  }
  .text-info.text-bold.text-title {
    height: 32px;
    line-height: 32px;
  }
  .item-img {
    max-width: 100%;
    max-height: 300px;
  }
  .tree-node {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 26px;
  }
</style>