// pages/h5wxpage/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    web_src: '',
    route: ''   // 页面路由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    if(options && options.url) {
      let _token
      if (decodeURIComponent(options.url).indexOf('?') != -1){
        _token = "&token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
      }else{
        _token = "?token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
      }
      this.setData({
        route: this.route,
        web_src: decodeURIComponent(options.url) + _token
      })
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
  onShareAppMessage: function () {

  }
})