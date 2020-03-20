module.exports = {
  lintOnSave: false,
  outputDir: "dist",
  assetsDir: "assets",
  devServer: {
    proxy: {
      '^/public': {
        target: 'http://192.168.31.9:10010',
        secure: false
      },
      '/api': {
        target: 'http://192.168.31.9:18082',
        ws:true, // 为true表示可以给webscoket使用
        pathRewrite: {'^/api' : ''}, //重定向
        secure: false
      },
      '/ms': {//维护系统的api代理
        target: 'http://192.168.31.9:8081',
        pathRewrite: {'^/ms' : ''}, //重定向
        secure: false
      }, 
    }
  }
}