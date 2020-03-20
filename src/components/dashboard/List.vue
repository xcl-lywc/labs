<template>
  <div v-loading="listLoading" id="home-list">
    <el-table
      :data="tableData"
      :show-header="false">
      <el-table-column
        label="标题">
        <template slot-scope="scope" fixed="right"><el-button type="text" @click="checkDetail(scope.row)"> {{ scope.row.article_name }} </el-button></template>
      </el-table-column>
      <el-table-column
        label="作者"
        width="180">
        <template slot-scope="scope">{{common._convertDate(scope.row.create_time, "yyyy年MM月dd日")}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      required: true,
      type: String
    },
    navData: {
      required: true,
      type: Array
    }
  },
  watch: {
    id: {
      handler (newV, oldV) {
        this.getArticleList(newV)
      },
      deep: true
    }
  },
  data() {
    return {
      tableData: [],
      listLoading: false,
    }
  },
  mounted() {
    this.getArticleList(this.id)
  },
  methods: {
    checkDetail (row) {
      this.$emit("goToDetail", row)
    },
    getArticleList(id) {
      if(id) {
        this.listLoading = true
        let config = {
          method: "get",
          url: `${this.common.basePath}/article`,
          params: {
            type: id
          }
        }
        this.axios(config).then((response) => {
          this.tableData = response.data.data.rows
          this.listLoading = false
        }).catch((errorMsg) => {
          this.listLoading = false
          this.$message.error(errorMsg)
        })
      }
    }
  }

}
</script>

<style lang="less">
  #home-list{
    .el-table {
      border-bottom: none;
      .el-table__row{
        background: #FCE6B7;
        td {
          border-bottom: 1px solid #cccccc;
       }
      }
    }
  }
  
</style>
