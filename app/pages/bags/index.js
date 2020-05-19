//该页面用于存放内嵌网页
var app = getApp();
var ctxPath = app.globalData.webPath;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    web_src: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;    
    let _tourl = '/shopCart'
    let _token = "?token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
    let _url = ctxPath + _tourl + _token
    that.setData({
      web_src: _url
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (options) {
    let that = this
    let return_url = encodeURIComponent(options.webViewUrl)
    var paths = 'pages/sharepage/sharepage?sharesssUrl=' + return_url
    return {
      title: '泰然城分享',
      path: paths,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
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
    app.data.webviewIsShowed = true; 
    // 修改webviewIsShowed的值，标记已经显示过web-view页了
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

  }
})