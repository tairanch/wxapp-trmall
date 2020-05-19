const updateManager = wx.getUpdateManager()
const RequestManager = require('./utils/RequestHelper.js');
const bottomDefault = require('./config/router')

// 重写page
const miniPage = Page;
Page = (opt) => {
  const pageShow = opt.onShow ? opt.onShow: null
  opt.onShow = function () {                                           // 重写onshow
    if(getApp().globalData.isMaintenance && !opt.data.isMaintenance) { // 维护中
      wx.redirectTo({
        url: '/pages/maintenance/index?url=' + getApp().globalData.maintenanceUrl
      })
    } else {
      pageShow && pageShow.call(this)
    }
  }
  return miniPage(opt);
}

App({
  data: {
    webviewIsShowed: false // 用来标记lots页面是否已经显示过了
  },

  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    try {
      const res = wx.getSystemInfoSync()
      this.globalData.winHeight = res.windowHeight,
      this.globalData.winWidth = res.windowWidth
    } catch (e) {
      // Do something when catch error
    }
  },

  onShow: function() {
    this.getMaintenancePage()
    this.getBottomIcons()
    this.getUpdate()
  },

  onHide(){
    this.data.webviewIsShowed = false;  // 小程序退出时，将变量置为初始值
  },

  /**
   * 是否在维护中
   */
  getMaintenancePage() {
    wx.request({
      url: this.globalData.vbuybuyPath + '/api/MaintenancePage',
      method: 'GET',
      success: (res) => {
        const _res = res.data
        if(_res.code === 0 && _res.data && _res.data.status == 1) {  // 维护中
          this.globalData.isMaintenance = true
          this.globalData.maintenanceUrl = encodeURIComponent(_res.data.maintenance)
          wx.redirectTo({
            url: '/pages/maintenance/index?url=' + this.globalData.maintenanceUrl
          })
        } else {
          this.getNotMaintenancePage()
        }
      },
      fail: (res) => {
        this.getNotMaintenancePage()
      },
      complete: () => {}
    })
  },
  getNotMaintenancePage(){
    if(this.globalData.isMaintenance) {
      wx.reLaunch({
        url: this.getHomePage()
      })
    }
    this.globalData.isMaintenance = false
    this.globalData.maintenanceUrl = null
  },


  /**
   * 设置底部导航
   */
  getBottomIcons() {
    return new Promise((resolve, reject) => {
      let _bottomIcons = []
      RequestManager.RequestGet(
        this.globalData.ctxPath + '/bottomIcon/getBottomIcons',
        {},
        (res) => {
          if(res && res.code === 0 && res.data && res.data.length > 0) {
            this.globalData.BottomIcons = res.data.map((bottom) => {
              const {index, title, status, text_color, selected_text_color, icon, selected_icon, link_type, link_val} = bottom
              return {index, title, status, text_color, selected_text_color, icon, selected_icon, link_type, link_val}
            })
            _bottomIcons = this.globalData.BottomIcons;
          } else {
            _bottomIcons = this.setBottomIconsDefault()
          }
          resolve(_bottomIcons)
        },
        () => {
          _bottomIcons = this.setBottomIconsDefault()
          resolve(_bottomIcons)
        },
        true, this.globalData, false)
    })

  },
  /**
   * 获取首页地址
   */
  getHomePage() {
    let homePage = '/pages/mall/index'
    const firstBottomIcon = this.globalData.BottomIcons.filter((bottom) => {
      return bottom.status == 1
    })[0]
    const {link_type, link_val} = firstBottomIcon
    switch (+link_type) { // 1: 组件页面, 2: h5链接, 3: 小程序路径
      case 1:
        this.globalData.configPageId = link_val
        homePage = '/pages/configpage/index?channel_id=' + link_val
        break;
      case 2:
        homePage = '/pages/h5wxpage/index?url=' + encodeURIComponent(link_val)
        break;
      case 3:
        if(link_val[0] === '/') {
          homePage = link_val
        } else {
          homePage = '/' + link_val
        }
        break;
      default:
        break;
    }
    return homePage
  },
  /**
   * 设置底部默认配置
   */
  setBottomIconsDefault() {
    this.globalData.BottomIcons = bottomDefault
    return bottomDefault
  },
  /**
   * 更检查是否有更新
   */
  getUpdate(){
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  globalData: {
    UCGEE: '/ucenter/gateway/foundation-captcha',         // 用户中心极验 前缀
    baseAppId: "uc6c7f06e54ac77f87",                      // 存储的appid
    UCUrl:"https://ucenter.trc.com/gateway",              // 用户中心域名
    ctxPathPay: "https://pay.tairanmall.com",
    ctxPathFunds: "https://funds.tairanmall.com",
    ctxPath: "https://wxapp.tairanmall.com/trxcx", // 泰然城接口前缀地址
    ctxHost: "https://wxapp.tairanmall.com", // 泰然城接口host，不带后缀
    webPath: "https://wxapp.tairanmall.com",  // H5地址
    vbuybuyPath: "https://mtns.vbuybuy.com",  // 工具后台地址
    vipcenter: "https://wxapp.tairanmall.com/vipcenter",  // 会员中心接口前缀地址
    haslogin: false,
    userInfo: {},
    userDetailInfo: null,
    addSpecHead: false,
    globOpenID: null,
    globtoken: null,
    globInent: '',
    globShareUrl:null,
    accessTokenlegal: true, // 防止accessToken不合法被重复刷新
    login: {
      accessToken: null,
      code: null
    },
    webviewIsShowed:false,   // 购物袋首页问题
    winHeight:0,
    isMaintenance: false,     // 是否在维护中
    maintenanceUrl: null,     // 维护页地址
    BottomIcons: [],       // 底部配置
    bottomActiveIdx: 0,      // 当前tab
    configPageId: null,      // 底部组件配置页面参数
    h5PageUrl: null,          // 底部h5页面链接
    shouldPayRedirect: true,   // 收银台页面onUnload生命周期，是否需要执行wx.redirectTo
    vipInviter: '',            // 扫码或填写的vip邀请码
    vipPageStartTime: '',      // 扫码进入VIP开通页或填写邀请码的时间(24h缓存)
    isInviterFromInput: false  // vip邀请码是否来自用户填写，来自用户填写的话，登入时候需要删除
  }
})
