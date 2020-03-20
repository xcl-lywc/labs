<template>
  <div>
    <!-- 页面主要内容 -->
    <div class="router-view-content">
      <h3>考勤表</h3><hr/>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="学号" prop="number"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="第一次考勤" prop="name"></el-table-column>
        <el-table-column label="第二次考勤" prop="name"></el-table-column>
        <el-table-column label="第三次考勤" prop="name"></el-table-column>
        <el-table-column label="第四次考勤" prop="name"></el-table-column>
        <el-table-column label="得分" prop="name"></el-table-column>
      </el-table>
      <div class="margin-block">
        <el-button type="primary">编辑</el-button>
        <el-button type="default">导入</el-button>
      </div>
    </div>
    <!-- 页面底部 -->
    <div class="router-view-bottom">
      <!-- 分页 -->
      <el-pagination
        class="fill-width"
        background
        layout="prev, pager, next"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        searchForm: {},
        bookForm:   {},
        tableData:  [{
          name: ""
        },
        {
          name: ""
        },
        {
          name: ""
        }]
      }
    },
    methods: {
      goToDetail () {
        this.$router.push({name: "LessonListDetail", params: {id: 1}})
      }
    }
  }
</script>
<style lang="less">
  
</style>