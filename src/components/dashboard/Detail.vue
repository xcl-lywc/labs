<template>
  <div v-loading="detailLoading" id="dashboard-article-detail" >
    <!-- <div><el-button type="primary" v-if="showButton" size="mini" class="fr" @click="back">返回列表</el-button></div> -->
    <div v-if="detailData" class="content-area">
      <h3 class="article-title text-center" v-if="showButton">{{ detailData.article_name }}</h3>
      <!-- <p class="text-center text-info">创建者 : {{ detailData.authorName || '空'}}</p> -->
      <div class="article-content-html marb10">
        <p v-html="detailData.article_content" class=""></p>
      </div>
      <!-- <p class="text-right text-info bottom-time">时间: <span>{{ common._convertDate(new Date(detailData.create_time), "yyyy年MM月dd日") }}</span></p> -->
    </div>
    <div v-else class="text-info text-center">未查询到文章数据</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      required: true,
      type: Number
    },
    showButton: {
      type: Boolean,
      default: true,
    }
  },
  watch: {
    id: {
      handler (newV, oldV) {
        this.getArticleDetail(newV)
      },
      deep: true
    }
  },
  data() {
    return {
      detailData: null,
      detailLoading: false,
    }
  },
  mounted(){
    this.getArticleDetail(this.id)
  },
  methods: {
    back () {
      this.$emit("backToList", "data")
    },
    /**
     * 查看文章详情
     * @param  {object} row 表格中row对象
     * @return {[type]}     [description]
     */
    getArticleDetail(id) {
      this.detailLoading = true
      let config = {
        method: "get",
        url: `${this.common.basePath}/article/${id}`,
      }
      this.axios(config).then((response) => {
        this.detailData = response.data.data
        this.detailLoading = false
      }).catch((errorMsg) => {
        this.$message.error(errorMsg)
        this.detailLoading = false
      })
    },
  }

}
</script>

<style lang="less">
  #dashboard-article-detail {
    position: relative;
    .article-title {
      font-size: 24px;
      font-weight: 200;
    }
    .content-area {
      min-height: calc(100vh - 325px)
    }
    .article-content-html img {
      max-width: 100%;
    }
    .bottom-time {
      width: 100%;
      position: absolute;
      bottom: -10px;
    }
  }
</style>
