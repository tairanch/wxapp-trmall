const app = getApp();
const trmallAppID = 'wx7fab1b5cbd37a27c';   // 泰然城小程序appId
const MD5 = require('./md5.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function ToastSuccess(text){
  wx.showToast({
    title: text,
    icon: 'success',
    duration: 500
  })
}
function MessageToast(text)
{
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 2000
  })
}
// 检测是否绑定用户
function checkBindStatus(){
  // console.log("checkBindStatus")
  // console.log(app.globalData.login)
  if (app.globalData.login.accessToken)
  {
    return true;
  }
  wx.navigateTo({
    url: '../mine/index',
  })
  return false;
}
// 检查是否绑定用户 不自动体搜转登录界面
function checkLanding(){
  if (app.globalData.login.accessToken) {
    return true;
  }
  return false;
}
// md5加密
function md5(str)
{
  return MD5.hex_md5(str)
}

//大图 中图 小图 微图
let addImageSuffix=(url, size)=> {
  return url = (/image.tairanmall.com\//.test(url)) ? url + size + ".jpg" : url
};

const timeUtils = {
  //获取格式化时间
  formatDate(time) {
    if (isNaN(Number(time))) return "";
    time = new Date(time * 1000);
    return {
      year: time.getFullYear(),
      month: this.toTwoDigit(time.getMonth() + 1),
      date: this.toTwoDigit(time.getDate()),
      hour: this.toTwoDigit(time.getHours()),
      minute: this.toTwoDigit(time.getMinutes()),
      second: this.toTwoDigit(time.getSeconds())
    }
  },
  toTwoDigit(num) {
    return num < 10 ? "0" + num : num;
  },
  //时间格式化
  timeFormat(time) {
    let dateObj = this.formatDate(time);
    if (!dateObj) {
      return "";
    }
    let { year, month, date } = dateObj;
    return year + "." + month + "." + date;
  },
  //具体时间格式化
  detailFormat(time) {
    let dateObj = this.formatDate(time);
    if (!dateObj) {
      return "";
    }
    let { year, month, date, hour, minute, second } = dateObj;
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
  },
  //格式化中文时间
  cnFormat(time) {
    let dateObj = this.formatDate(time);
    if (!dateObj) {
      return "";
    }
    let { month, date, hour, minute } = dateObj;
    return `${month}月${date}日${hour}:${minute}`

  },

};
/**
 * 获取底部导航序号
 * @param route 当前路由地址
 */
const getBottomBarIndex = function(route) {
  const bottomIcons = getApp().globalData.BottomIcons
  let bottomIndex = null
  if(bottomIcons) {
    bottomIcons.some((icon, index) => {
      const { link_type, link_val } = icon
      switch (+link_type) {  // 1: 组件页面, 2: h5链接, 3: 小程序路径
        case 1:
          if(route === 'pages/configpage/index') {
            bottomIndex = index
          }
          break;
        case 2:
          if(route === 'pages/h5wxpage/index') {
            bottomIndex = index
          }
          break;
        case 3:
          if(link_val[0] === '/') {
            if(link_val === `/${route}`){
              bottomIndex = index
            }
          } else {
            if(link_val === `${route}`){
              bottomIndex = index
            }
          }
          break;
        default:
          break;
      }
      if(bottomIndex !== null) {
        return true
      } else {
        return false
      }
    })
  }
  return bottomIndex
}

/**
 * 解析地址查询参数
 * @path
 */
function getPathQuery(path) {
  let params = {}
  let queryString = path.split('?')[1]
  if (queryString) {
    queryString
      .split('&')
      .forEach(item => {
        let [key, val] = item.split('=');
        val = val ? val : true;
        if (params.hasOwnProperty(key)) {
          params[key] = [].concat(params[key], val)
        } else {
          params[key] = val
        }
      })
  }
  return params
}

/**
 * 打开小程序（泰然城小程序或第三方小程序）
 * @param appId
 * @param path
 */
const navigateToMiniProgram = function({appId, path}) {
  if(appId === trmallAppID) {    // 泰然城小程序
    if(path.charAt(0) != '/' ) { // path 需要为相对路径
      path = `/${path}`
    }
    wx.navigateTo({
      url: path
    })
  } else {                       // 其他小程序
    const extraData = getPathQuery(path)
    wx.navigateToMiniProgram({
      appId: appId,
      path:  path,
      extraData: extraData
    })
  }
}

/**
 * 跳转到门店小程序
 * @param path        打开的页面路径  'page/index/index?id=123'
 * @param extraData   需要传递给目标小程序的数据  { foo: 'bar'}
 */
const navigateToMiniStore = function(path, extraData='') {
  if(path.charAt(0) === '/') {
    path = path.slice(1)
  }
  wx.navigateToMiniProgram({
    appId: 'wxff130f20113777d2',
    path:  path,
    extraData: extraData
  })
}

const errTost = (err) => {
  const message = (err && err.data && err.data.message) ? err.data.message : '小泰发生错误，请稍后再试'
  wx.showToast({
    title: message,
    icon: 'none'
  })
}

module.exports = {
  formatTime: formatTime,
  ToastSuccess: ToastSuccess,
  checkBindStatus: checkBindStatus,
  checkLanding:checkLanding,
  MessageToast: MessageToast,
  md5: md5,
  addImageSuffix: addImageSuffix,
  timeUtils: timeUtils,
  getBottomBarIndex: getBottomBarIndex,
  navigateToMiniProgram: navigateToMiniProgram,
  navigateToMiniStore,
  errTost
}
