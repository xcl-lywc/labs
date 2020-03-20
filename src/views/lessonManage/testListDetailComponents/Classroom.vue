<template>
  <div>
    <!-- 页面主要内容 -->
    <div class="router-view-content">
      <h3>教室查询</h3><hr/>
      <!-- 搜索表单 -->
      <el-form ref="searchForm" :model="searchForm" :inline="true" label-width="120px">
        <el-form-item label="实验室：">
          <el-select v-model="searchForm.lesson">
            <el-option value="1" label="课程1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课人数：">
          <el-select v-model="searchForm.lesson">
            <el-option value="1" label="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
        </el-form-item>
      </el-form>
      <!-- 卡片 -->
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="节次" prop="number"></el-table-column>
        <el-table-column label="周日" prop="name"></el-table-column>
        <el-table-column label="周一" prop="name"></el-table-column>
        <el-table-column label="周二" prop="name"></el-table-column>
        <el-table-column label="周三" prop="name"></el-table-column>
        <el-table-column label="周四" prop="name"></el-table-column>
        <el-table-column label="周五" prop="name"></el-table-column>
        <el-table-column label="周六" prop="name"></el-table-column>
      </el-table>
      <div class="margin-block">
        <el-button type="default">上周</el-button>
        <el-button type="default">下周</el-button>
      </div>

      <h3>预约教室</h3><hr/>
      <el-form ref="bookForm" :model="bookForm" :inline="true" label-width="120px">
        <el-form-item label="截止时间：">
            <el-date-picker v-model="searchForm.time"></el-date-picker>
        </el-form-item>
        <el-form-item label="预约节次：">
          <el-select v-model="searchForm.lesson">
            <el-option value="1" label="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约节次：">
          <el-radio-group v-model="searchForm.lesson3">
            <el-radio value="1" label="3"></el-radio>
            <el-radio value="3" label="4"></el-radio>
            <el-radio value="2" label="5"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">预约</el-button>
        </el-form-item>
      </el-form>
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
          name: "颜色"
        },
        {
          name: "颜色"
        },
        {
          name: "颜色"
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