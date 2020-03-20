import vue from 'vue';
import { MessageBox } from 'element-ui';
import router from '.././router'
import store from '.././store'
import qs from "qs"
const Vue = new vue({router, store}); //注册router, 实例中调用

export default {
  basePath:       `${window.location.origin}/api`,
  msBasePath:     `${window.location.origin}/ms`,
  publicBasePath: `${window.location.origin}`,
  filePath:       `${window.location.origin}`,
  webSocketSever: `${window.location.host}/api/websocket`, 
  ws:              {}, //webSocket对象
  noticeNum:       null, //提醒消息个数 
  elementPagination: {     //elementUi中的分页所需数据
    pageSizes: [10, 20, 30],
    pageSizeDefault: 10,   //初始条数
    pageNumDefault:1,      //初始页码
  },
  startInterval: false, //是否开始重复查询
  emailReg:      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  mobileReg:     /^1[34578]\d{9}$/,
  curStatus: [ //设备状态
    {
      label:'全部',
      id: null
    },
    {
      label:'在库',
      id: 1
    },
    {
      label:'借出',
      id: 2
    },
    {
      label:'维修',
      id: 10
    },
    {
      label:'报废',
      id: 20
    },
  ],
  //借还状态
  borrowStatus: [
    {
      label:'全部',
      id: null
    },
    {
      label:'已借出',
      id: 1
    },
    {
      label:'已归还',
      id: 10
    },
    {
      label:'已报废',
      id: 20
    },
  ],
  //维修状态
  repairStatus: [
    {
      label:'全部',
      id: null
    },
    {
      label:'维修中',
      id: 1
    },
    {
      label:'维修完成',
      id: 10
    },
    {
      label:'已报废',
      id: 20
    },
  ],
  personStatus: [ //人员状态
    {
      label:'在籍',
      value: 1
    },
    {
      label:'已毕业',
      value: 2
    },
    {
      label:'已退休',
      value: 3
    },
    {
      label:'已离校',
      value: 4
    },
  ],
  result: null,
  resultBoolean: false,
  buttonLoading: false,
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
      }
    } else {
      delete node.childrens
    }
  },
  /**
   * 获取字典
   * @param  {number} name   字典表id
   * @return {array}  查询返回的树结构
   */
  getDictionaryData (id) {
    let self = this
    let cofig = {
      method: "get",
      url:    `${this.basePath}/contrast/all/tree`,
      params: {
        typeId: id
      }
    }

    let promise = new Promise ((resolve, reject) => {
      Vue.axios(cofig)
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        Vue.$message.error(error)
        reject([])
      })
    })
    
    return promise
  },
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '无';
  },
  /*
   * 根据状态码显示项目当前状态
   */
  showStatusText(status){
    switch(status){
      case 1:
        return {name: '补充材料阶段', stageColor: 'stageColor1'};
        break;
      case 2:
        return {name: '项目受理阶段', stageColor: 'stageColor2'};
        break;
      case 3:
        return {name: '专家预审阶段', stageColor: 'stageColor3'};
        break;
      case 4:
        return {name: '专家评审阶段', stageColor: 'stageColor4'};
        break;
      case 5:
        return {name: '网信会议阶段', stageColor: 'stageColor5'};
        break;
      case 6:
        return {name: '提交财政意见阶段', stageColor: 'stageColor6'};
        break;
      case 7:
        return {name: '审核财政意见阶段', stageColor: 'stageColor7'};
        break;
      case 8:
        return {name: '项目实施阶段', stageColor: 'stageColor8'};
        break;
      case 9:
        return {name: '已完结', stageColor: 'stageColor9'};
      case 19:
        return {name: '已关闭', stageColor: 'stageColor19'};
        break;
      default:
        return {name: '全部', stageColor: 'stageColor-none'};
        break;
    };
  },
  /*
   * 项目状态数据
   */
  projectStatusData(){
    return [
      {id: 1, name: '补充材料阶段'},
      {id: 2, name: '项目受理阶段'},
      {id: 3, name: '专家预审阶段'},
      {id: 4, name: '专家评审阶段'},
      {id: 5, name: '网信会议阶段'},
      {id: 6, name: '提交财政意见阶段'},
      {id: 7, name: '审核财政意见阶段'},
      {id: 8, name: '项目实施阶段'},
      {id: 9, name: '已完结'},
      {id: 19, name: '已关闭'}
    ]
  },
  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  },
  /*
   * 根据Id来显示对应的中文（对照表）
   */
  _controlTable(id){
    let data = JSON.parse(sessionStorage.getItem('controlTable')), name ;
    if(!data) return '无';
    
    data.forEach( (item) => {
      if(id == item.id){
        name = item.name
      } 
    });
    return name ? name : '无';
  },
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
  /*
   * 性别
   */
  transferGender(sex){
    return sex == 1 ? '男' : '女'
  },
  resultWeek(time){
    let week = new Date(time).getDay();
    return week;
  },
  /*
   * 设备状态转换文字
   */
  transferDeviceStatus(status){
    let string = ""
    switch(status) {
      case 1:
        string = "在库";
        break;
      case 2:
        string = "借出";
        break;
      case 10:
        string = "维修";
        break;
      case 20:
        string = "报废";
        break;
      default:
        string = "该状态未定义";
        break;
    }
    return string
  },
  /*
   * 人员状态转换文字
   */
  transferPersonStatus(status){
    let string = ""
    switch(status) {
      case 1:
        string = "在籍";
        break;
      case 2:
        string = "已毕业";
        break;
      case 10:
        string = "已退休";
        break;
      case 20:
        string = "已离校";
        break;
      default:
        string = "该状态未定义";
        break;
    }
    return string
  },
  /*
   * 借还状态转换文字
   */
  transferBorrowStatus(status){
    let string = ""
    switch(status) {
      case 1:
        string = "已借出";
        break;
      case 10:
        string = "已归还";
        break;
      case 20:
        string = "已报废";
        break;
      default:
        string = "该状态未定义";
        break;
    }
    return string
  },
  /*
   * 维修状态转换文字
   */
  transferRepairStatus(status){
    let string = ""
    switch(status) {
      case 1:
        string = "维修中";
        break;
      case 10:
        string = "维修完成";
        break;
      case 20:
        string = "已报废";
        break;
      default:
        string = "该状态未定义";
        break;
    }
    return string
  },
  /*
   * 角色类型
   */
  roleType(){
    return [
      {value: 1, label: '课程组长'},
      {value: 2, label: '任课教师'},
      {value: 3, label: '学生'},
      {value: 4, label: '助教'} 
    ];
  },
  /**
   * 设备入库
   * @param  {[type]} row [description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
  returnDevice(row, url) {
    let p = new Promise((resolve, reject) => {
      Vue.$confirm('确认入库?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
      .then(() => {
        let config = {
          url: `${this.basePath}${url}`,
          method: "patch",
          data: qs.stringify({
            id: [row.id].toString(0),
            de_id: [row.de_id].toString(0),
            user_id: parseInt(sessionStorage.getItem("Access-Key"))
          })
        }
        Vue.axios(config).then(response => {
          Vue.$message.success("成功");
          resolve("成功")
        }).catch(error => {
          Vue.$message.error(error);
          reject("入库失败")
        })
      })
      .catch(() => {
      });
    })
    return p
  },
  /**
   * 设备报废
   * @return {[type]} [description]
   */
  scrapDevice(row, type) {
    let p = new Promise((resolve, reject) => {
      Vue.$prompt('<span><i class="required-label"></i>报废原因</span>', '报废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        inputValidator: (value) => {
          if(value) {
            return true
          } else {
            Vue.$message.error("请检查必填项")
            return false
          }
        },
        inputErrorMessage: "请输入报废原因"
      }).then(({value}) => {
        let config = {
          method: "post",
          url: `${this.basePath}/scrap/add`,
          data: { 
            reason: value,
            de_id: [row.de_id],
            user_id: JSON.parse(sessionStorage.getItem("Access-Key")) || null,
            type: type
          }
        }
        if(value) {
          Vue.axios(config).then((response) => {
            Vue.$message.success(response.data.meta.message)
            resolve("成功")
          }).catch((errorMsg) => {
            Vue.$message.error(errorMsg)
            reject("报废失败")
          })
        } else {
          reject("报废失败")
        }
      }).catch((error) => {
      });
    })
    return p   
  },
  /**
   * 展示二维码
   * @param  {[type]} row [description]
   * @return {[type]}     [description]
   */
  showQRCode(row) {
    // const h = Vue.$createElement;
    // Vue.$msgbox({
    //   title: '二维码',
    //   message: h('qrcode', {value: row.code}),
    //   confirmButtonText: '确定',
    // })
    Vue.store.state.dialogQRcodeVisible = true
    // Vue.store.state.QRcodeValue = row.code
  },
  /**
   * 在权限树中查找权限 有返回此节点 无返回null
   * @param  {string} code        权限code
   * @param  {string} typeBoolean 返回的数据格式 默认false 成功返回节点对象 失败时返回null 为true时返回布尔
   * @return {[type]}             [description]
   */
  checkAuthority (code, typeBoolean) {
    let self = this
    let result        = null
    let resultBoolean = false
    let codeList = Vue.$store.state.authority
    if(!codeList) return false;
    codeList.forEach((item, index) => {
      if(code == item.code && item.type != 1) {
        if(item.holdOn) {
          resultBoolean = true
        }
        result = item
      }
    })
    let string = codeList.map(item => { return item.code }).join(",")
    //匹配如未成功 则重新查询是否已注册此权限 未注册则不进行控制(仅处理返回resultBoolean的情况)
    if(string.indexOf(code) == -1) {
      resultBoolean = true
    }

    return typeBoolean ? resultBoolean : result
  },
  /**
   * 跨页面级别访问权限
   * @param  {string} code        权限code
   * @return {[type]}      [description]
   */
  checkAuthorityTree (code) {
    let result = false
    let authorityTree = JSON.parse(sessionStorage.getItem("Authority"))
    authorityTree.forEach(item => {
      item.mate.forEach(itemInner => {
        if(code == itemInner.code && itemInner.holdOn){
          result = true
        }
      })
    })
    return result
  },
  /**
   * 遍历树(递归遍历), 删除空白的childrens
   * @param  {object}   node         根节点(单个对象, 多个树需要重复调用)
   * @return none
   */
  // traverseTree (node) {
  //   let self = this
  //   if (!node) {
  //     return;
  //   }
  //   if (node.children && node.children.length > 0) {
  //     var i = 0;
  //     for (i = 0; i < node.children.length; i++) {
  //       console.log(node.children[i])
  //       self.traverseTree(node.children[i]);
        
  //     }
  //   }
  // },
  /**
   * 根据日期字符串获取星期几
   * @param dateString 日期字符串（如：2016-12-29），为空时为用户电脑当前日期
   * @returns {String}
   */
  getWeek(dateString){  
    var date; 
    date = new Date(dateString)  
    return "星期" + "日一二三四五六".charAt(date.getDay());
  },
  /*
   * 文本验证字符
   * @params {object} rule 文本详细信息
   * @params {string} value 文本的值
   * @params {object} callback 回调函数
   * @params {string} type  文本类型 single为单行(20)，textarea为多行(128)
   */
  wordNumberValid(rule, value, callback, type){  
    if(value){
      if(type == 'single'){
        if(value.length > 20){
          return callback(new Error('最大字数不能超过20个字'));
        }
        return callback();
      }else{
        if(value.length > 128){
          return callback(new Error('最大字数不能超过128个字'));
        }
        return callback();
      } 
    }
    return callback();
  },
  returnConfig () {
    let config = {
      'Access-Token': null,
      'Access-Key': null,
      'nonce': null,
      'Time-Stamp': null,
      'secret': null,
      'type': null,
    }
    try {
      if(sessionStorage.getItem("Access-Token")) {
        config['Access-Token'] = JSON.parse(sessionStorage.getItem("Access-Token") || null);
      }
      if(sessionStorage.getItem("Access-Key")) {
        config['Access-Key'] = JSON.parse(sessionStorage.getItem("Access-Key") || null);
      }
    } catch(e) {
      this.$message.error("获取Access-Token 或 Access-Key 有误, 上传文件失败!")
      return false
    }
    config['nonce']      = Math.floor(Math.random()*10000000000000000) // 随机数0-10000000000000000
    config['Time-Stamp'] = (new Date()).valueOf() // 当前时间戳
    config['secret']     = "labmiss" // 口令
    config['type']       = "PC"      // 口令

    let object = {
      'nonce':      config.nonce,
      'Time-Stamp': config['Time-Stamp'],
      'secret':     config.secret,
      'Access-Key': config['Access-Key'],
    }

    let array = []
    for ( let k in object ) {
      array.push(k)
    }

    array.sort()
    let FinalArray = [] //组合完成并排序后的数组
    array.forEach( (item, index) => {
      FinalArray.push(object[item])
    })
    config['sign'] = window.md5Js(FinalArray.join(""))// 写入sign
    
    return config
  },
  /*
   * blod 下载附件
   */
  _fileBold(response) {
    let fileName = decodeURI(response.headers['content-disposition'].substring(20, response.headers['content-disposition'].length));
    let url = window.URL.createObjectURL(new Blob([response.data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  },
  /**
   * 拼接参数为字符串
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  splicingParams(params){
    
    if(!params) return '';

    let temp = '';
    Object.keys(params).map((key)=>{
        temp += key + '=' + params[key] +'&';  
    })
    temp = temp.substring(temp.length-1,1);

    return temp; 
  },
  /*
  * 习题选项
  */
  exerciseOptions(index){
    switch(index){
      case 1:
        return 'A';
        break;
      case 2:
        return 'B';
        break;
      case 3:
        return 'C';
        break;
      case 4:
        return 'D';
        break;
      case 5:
        return 'E';
        break;
      case 6:
        return 'F';
        break;
      case 7:
        return 'G';
        break;
      case 8:
        return 'H';
        break;
      case 9:
        return 'I';
        break;
      case 11:
        return 'J';
        break;
      case 12:
        return 'K';
        break;
      case 13:
        return 'L';
        break;
      case 14:
        return 'M';
        break;
      case 15:
        return 'N';
        break;
      case 16:
        return 'O';
        break;
      case 17:
        return 'P';
        break;
      case 18:
        return 'Q';
        break;
      case 20:
        return 'R';
        break;
    };
  },
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}