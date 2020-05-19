const app = getApp()
var util = require('../../utils/util.js');
var RequestManager = require('../../utils/RequestHelper.js');
var Login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showhasgetinfo:false,
    redirect_uri:null,
    isTab: false,     // 是否来自导航页
    isMini: false,    // 是否是小程序
    query: '',        // url参数
    tarranimg: '../../image/logo.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    comUcerterId: '' // 邀请码信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _redirect_uri = options && options.redirect_uri && options.redirect_uri != 'null' ? options.redirect_uri : ''
    const isTab = options && ((options.isTab === 'true') || (options.isTab === true))  ? true: false;
    const isMini = options && ((options.isMini === 'true') || (options.isMini === true)) ? true: false;
    const query = options && options.query ? options && options.query: '';
    app.globalData.globShareUrl = _redirect_uri
    this.setData({
      redirect_uri: _redirect_uri,
      isTab,
      isMini,
      comUcerterId: options.comUcerterId || '',
      query
    })
    // this.checkUseInfo()
  },
  checkUseInfo: function () {
    var _this = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          Login.getCode((data)=>{
            Login.didHasLoad(data.ress, data.code, _this.data.redirect_uri, this.data.isTab, this.data.isMini)
          })
          _this.setData({
            showhasgetinfo:false
          })
        } else {
          app.globalData.haslogin = false
          _this.setData({
            showhasgetinfo: true
          })
        }
      },
      fail:res=>{
        console.log(res,'wrong')
      }
    })
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      Login.getCode((data) => {
        const {redirect_uri, isTab, isMini, query} = this.data
        Login.didHasLoad(data.ress, data.code, redirect_uri, isTab, isMini, this.data.comUcerterId)
      })
    }
  },
  onShow: function (){
    this.checkUseInfo()
  }
})