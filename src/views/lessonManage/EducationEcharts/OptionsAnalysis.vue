<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
// const debounce = require('debounce');

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '240px'
    },
    data:{
    	type:Array,
    	default:null
    }
  },
  watch: {
    data(newValue, oldValue) {//监听数据变化
       console.log(newValue, oldValue)
  　　　　this.newData = newValue;
       this.initChart()
  　　},
    screenWidth(newValue, oldValue) {//监听屏幕宽度变化
  　　　 this.screenWidth = newValue;
      console.log('pie',newValue, oldValue)
      this.initChart();
  　　},
  },
  data() {
    return {
      chart: null,
      screenWidth:document.body.clientWidth,//屏幕宽度
      newData:[],
    }
  },
  mounted() {
    //初始化echarts
    this.initChart();
		//自适应浏览器大小
    window.addEventListener('resize', this.__resizeHanlder);
  },
	created(){
    // 获取屏幕宽度
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.screenWidth = window.screenWidth
      })()
    };
		// this.__resizeHanlder = debounce(() => {if (this.chart) {this.chart.resize()}}, 100) 
	},
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  methods: {
		
		/* 
		 初始化echarts实例
		 */
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.chart.resize(this.$el, {width:(this.screenWidth/4-60)+'px',});//设置初始echrts宽度
  		//获取所需数据
      var yAxisArr = [];
      var seriesArr = [];
      this.newData.forEach( function(element, index) {
        seriesArr.push(element.value)
        yAxisArr.push(element.name)
      });
			//饼状图数据配置
			this.chart.setOption({
        title: {
          text: '',
          subtext: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.1]
        },
        yAxis: {
          type: 'category',
          data: yAxisArr
        },
        series: [
          {
            name: '数量',
            type: 'bar',
            data: seriesArr,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            itemStyle: {
              normal: {
                color: function(params) { 
                    var colorList = ['#B74AE5','#16A085','#BA4A00','#53a8ff','#67c23a','#e6a23c','#f56c6c','#909399']; 
                    return colorList[params.dataIndex] 
                }
              },
            },
          },
        ]
			});
    },
		
  }
}
</script>
