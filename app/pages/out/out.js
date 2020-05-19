// pages/out.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    orignUrl: '',
    systemInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getSystem()
    let _tourl = decodeURIComponent(options.url), _token
    if (_tourl.indexOf('?') != -1) {
      _token = "&token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
    } else {
      _token = "?token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
    }
    _tourl = _tourl + _token
    this.setData({
      url: _tourl,
      orignUrl: decodeURIComponent(options.url)
    });
  },
  getSystem: function () {
    let _systeminfo = 'android' //手机系统
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform == "devtools") {
          _systeminfo = 'PC'
        } else if (res.platform == "ios") {
          _systeminfo = 'IOS'
        } else if (res.platform == "android") {
          _systeminfo = 'android'
        }
        this.setData({
          systemInfo: _systeminfo,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    const _baseurl = this.data.orignUrl; // 分享出去的不需要带token
    let return_url = encodeURIComponent(_baseurl)
    let share_title =  this.data.webInfo ? (this.data.webInfo.title || '泰然城分享') : '泰然城分享'
    let image_url = this.data.webInfo ? (this.data.webInfo.imageUrl || '') : ''
    // 如果分享的页面是发送红包的页面，则设置 return_url
    if (options.webViewUrl.indexOf('/ecard/red/detail') != -1) {
      return_url = this.data.share_url
      share_title = this.data.share_title
      image_url = '../../image/receiving.png'
    }
    const paths = 'pages/sharepage/sharepage?sharesssUrl=' + return_url
    return {
      title: share_title,
      path: paths,
      imageUrl: image_url,
      success:  (res) => {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
        this.setData({
          share_url: return_url,    //再次赋值分享内嵌网页的路径
          url: _baseurl
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  bindmessage(e) {//接收web-view传递的参数
    if (e && e.detail && e.detail.data){
      let data = e.detail.data.slice(-1)[0]
      this.setData({//存储状态
        getmessagesUrl: data.url || '',
        webInfo: data.info || null
      })
    }
  },
})