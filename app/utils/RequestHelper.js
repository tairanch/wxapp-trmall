const util = require('./util.js');
const { reLaunchLogin } = require('./routerHop.js');
const { didSilentLoad } = require('./login')

//get请求
function RequestGet(url, params, callBack, failueBack, hidenToast, globalData=null, showMessage=true) {
  if (!hidenToast) {
    wx.showLoading({
      title: '加载中',
    })
  }
  wx.request({
    url: url + "?" + paramsHandle(params),
    method: 'GET',
    header: setHeader(globalData),
    success: function(res) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
      resulHandle(res, callBack, failueBack, globalData, showMessage)
    },
    fail: function(res) {
      if (failueBack) {
        failueBack(res)
      }
    },
    complete: function(res) {
      !hidenToast && wx.hideLoading()
    }
  })
}

// post请求
function RequestPost(url, params, callBack, failueBack, hidenToast, globalData=null, showMessage=true) {
  if (!hidenToast) {
    wx.showLoading({
      title: '加载中',
    })
  }
  wx.request({
    url: url,
    data: paramsHandlePost(params),
    method: 'POST',
    header: setHeader(globalData),
    success: function (res) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh()
      resulHandle(res, callBack, failueBack, globalData, showMessage)

    },
    fail: function (res) {
      if (failueBack) {
        failueBack(res)
      }
    },
    complete: function(res) {
      !hidenToast && wx.hideLoading()
    }
  })
}
// 请求参数处理
function paramsHandle(params) {
  return Object.keys(params).map(key => {
    return key + '=' + encodeURIComponent(params[key])
  }).join('&')
}

function paramsHandlePost(params) {
  return params
}

//请求头配置
function setHeader(globalData) {
  const _globalData = globalData ? globalData: getApp().globalData
  const header = {
    // "content-type": "application/x-www-form-urlencoded",
    "X-Channel": "TrMall",
    "X-Platform-Type": "TRXCX",
    "X-Platform-From": "TrMall",
    "X-Device-Info": "UserAgent",
    "Cookie": "token=" + _globalData.globtoken,
    "Authorization": _globalData.globtoken
  }

  if (_globalData.addSpecHead == 'wxbind'){
    header.Authorization = 'Bearer'
  }
  return header
}
// 请求结果处理
function resulHandle(result, callBack, failueBack, globalData, showMessage=true) {
  const _globalData = globalData ? globalData: getApp().globalData
  if(result.data.code == 401) { // 未登入，需要跳转到登入
    const currentPage = getCurrentPages() && getCurrentPages().length ? getCurrentPages()[getCurrentPages().length - 1]:'' // 获取当前页面
    if(currentPage) {
      didSilentLoad({
        redirect_uri: `/${currentPage.route}`,
        isTab: currentPage.data.isTab,
        isMini: true,
        success: () => {
          wx.redirectTo({
            url: `/${currentPage.route}`
          })
        }
      }, RequestHelper)
    } else {
      reLaunchLogin({
        redirect_uri: `/pages/login/login`
      })
    }
  } else {
    if (result.data.code == 0) {
      if (callBack) {
        callBack(result.data)
      }
    } else if (result.statusCode && result.statusCode == 200) {
      // 短信验证接口返回
      if (callBack) {
        callBack(result.data)
      }
    } else if (result.data.code == 20018) //AccessToken 不合法
    {
      if (!_globalData.accessTokenlegal) {
        return
      }
      _globalData.accessTokenlegal = false
      wx.login({
        success: res => {
          _globalData.login.code = res.code
          wx.setStorage({
            key: "login",
            data: _globalData.login
          })
          wx.navigateTo({
            url: '/pages/login/login',
            success: function() {
              _globalData.accessTokenlegal = true
            }
          })

        }
      })
    } else {
      if (failueBack) {
        failueBack(result)
      }
      if (showMessage && result.data.message) {
        util.MessageToast(result.data.message)
      }
    }
  }
}

/**
 * 接口请求，参数为对象类型
 * @param method: GET or POST
 * @param url: 接口
 * @param baseUrl: 接口域名 默认 globalData.ctxPath
 * @param params: 请求参数
 * @param success: 请求成功的回调
 * @param fail: 请求失败的回调
 * @param hidenToast: 是否隐藏加载条
 * @param globalData: getApp().globalData 用于app.js文件里获取globalData
 * @param showMessage: 是否展示提示框
 * @constructor
 */
function RequestHelper({method='GET', url='', baseUrl='', params={}, success, fail, hidenToast=true, globalData=null, showMessage=true}) {
  if(method) {
    const _baseUrl = baseUrl ? baseUrl : getApp().globalData.ctxPath;
    url = `${_baseUrl}${url}`
    if(method.toUpperCase() === 'GET') {
      RequestGet(url, params, success, fail, hidenToast, globalData, showMessage)
      return
    }
    if(method.toUpperCase() === 'POST') {
      RequestPost(url, params, success, fail, hidenToast, globalData, showMessage)
      return
    }
  }
  return;
}

/**
 * promise封装request, 参数同RequestHelper, 用于泰然城服务端的接口请求
 * @param method
 * @param url
 * @param baseUrl
 * @param params
 * @param success
 * @param fail
 * @param hidenToast
 * @param globalData
 * @param showMessage
 * @returns {Promise<any>}
 * @constructor
 */
function RequestPromise({method='GET', url='', baseUrl='', params={}, success, fail, hidenToast=true, globalData=null, showMessage=true}) {
  return new Promise((resolve, reject) => {
    RequestHelper({
      method,
      url,
      baseUrl,
      params,
      success: (result) => {
        if(success) {
          success(result)
          resolve(result)
        } else {
          if(result && result.code === 0) {
            resolve(result.data)
          } else if(result && result.message){
            reject(result.message)
          } else {
            reject()
          }
        }
      },
      fail: (err) => {
        const message = err && err.data && err.data.message || ''
        if(fail) {
          fail(message || err)
        } else {
          reject(message || err)
        }
      },
      hidenToast,
      globalData,
      showMessage
    })
  })
}

module.exports = {
  RequestGet: RequestGet,
  RequestPost: RequestPost,
  RequestHelper,
  RequestPromise
}
