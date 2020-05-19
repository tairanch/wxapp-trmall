const { reLaunchLogin } = require('./routerHop')
const app = getApp();

function getCodePromise (){
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          resolve(res.code)
        } else {
          wx.showToast({
            title: '获取用户登录态失败',
            icon: 'none'
          })
          reject('获取用户登录态失败')
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '获取用户登录态失败',
          icon: 'none'
        })
        reject(res)
      }
    })
  })
}

// 获取用户信息
function getUserInfoPromise () {
  return new Promise((resolve, reject) => {
    wx.getSetting({  // 查看是否授权
      success(res) {
        if (res.authSetting['scope.userInfo']) { // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: res => {
              resolve(res)
            }
          })
        } else {
          reject('用户未授权')
        }
      },
      fail:res=>{
        wx.showToast({
          title: res,
          icon: 'none'
        })
        reject(res)
      }
    })
  })
}

/**
 * 自动登入(静默登入)
 * @param data 来自wx.getUserInfo
 * @param code 来自wx.getCode
 * wx.getCode 需要在 wx.getUserInfo 之前调用
 * @param redirect_uri 重定向地址
 * @param isMini 跳转到小程序
 * @param isTab  跳转到导航页
 * @RequestHelper 请求接口封装的方法
 * @returns {Promise<any>}
 */
function didHasLoadPromise(opts = {data:'', code:'', redirect_uri:null, isTab:'', isMini: true}, RequestHelper){
  const {data, code, redirect_uri, isTab, isMini} = opts
  const params = {
    mpIV: data.iv,
    mpEncryptedData: data.encryptedData,
    appId: getApp().globalData.baseAppId,
    code: code,
    returnBy: 'JSON',
    platform: "MINI_PROGRAM_2"
  }
  return new Promise((resolve, reject) => {
    if(RequestHelper) {
      RequestHelper({
        url: '/foundation-user/login/wechat',
        baseUrl: getApp().globalData.UCUrl,
        params: params,
        success: function (res) {
          if (res.code == 200 && res.body !== null) { // 登入成功
            let _token = res.body.token
            if (_token !== null) {                    // 注册过，留在当前页面
              getApp().globalData.globtoken = res.body.token
              getApp().globalData.globOpenID = res.body.extraInfo.openId
              getApp().globalData.haslogin = true
              getApp().globalData.userInfo.isNew = res.body.isNew
              resolve()
            } else {                                 // 没有注册过
              loadFailPromise(redirect_uri, isMini, isTab)
            }
          } else {                                   // 登入失败
            loadFailPromise(redirect_uri, isMini, isTab)
          }
        },
        fail: function () { // 登入失败
          loadFailPromise(redirect_uri, isMini, isTab)
        }
      })
    }
  })
}

/**
 * 登入失败
 * @param redirect_uri 重定向地址
 * @param isMini 跳转到小程序
 * @param isTab  跳转到导航页
 */
function loadFailPromise(redirect_uri, isMini, isTab) {
  if(redirect_uri && isMini){               // 登入失败
    reLaunchLogin({
      redirect_uri: redirect_uri,
      isTab: isTab,
      isMini: true
    })
  } else {
    wx.reLaunch({
      url: '/pages/login/login'
    })
  }
}

/**
 * 判断登入，并且静默登入
 * @param redirect_uri 重定向地址
 * @param isMini 跳转到小程序
 * @param isTab  跳转到导航页
 * @RequestHelper 请求接口封装的方法
 * @param success 静默登入成功后的回调函数
 * @param fail
 */
function didSilentLoad(opts = { redirect_uri:null, isTab:'', isMini: true, success, fail}, RequestHelper) {
  const {redirect_uri, isTab, isMini, success, fail} = opts
  let _code = null;
  getCodePromise()
    .then((code) => {             // 获取code
      _code = code
      return getUserInfoPromise() // 获取用户信息
    })
    .then((data) => {
      if(!data) {
        // 没有获取到用户信息，跳转到登入页面
        reLaunchLogin({
          redirect_uri: redirect_uri,
          isTab: isTab,
          isMini: isMini
        })
      }
      return didHasLoadPromise({
        data,
        code: _code,
        redirect_uri: redirect_uri,
        isMini,
        isTab
      }, RequestHelper)
    })
    .then(() => {
      if(typeof success === 'function'){
        success()
      }
    })
    .catch((err) => {
      if(fail && typeof fail === 'function') {
        fail()
      } else {
        reLaunchLogin({
          redirect_uri: redirect_uri,
          isTab: isTab,
          isMini: isMini
        })
      }
    })
}

module.exports = {
  getCodePromise,
  getUserInfoPromise,
  didHasLoadPromise,
  didSilentLoad
}