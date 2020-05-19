//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {
    
  },
  onShow() {
    //如果已经显示过web-view页了，则执行后退操作，否则就跳到web-view页
    // if (!app.data.webviewIsShowed) {
      wx.navigateTo({
        url: '/pages/bags/index'
      })
  }
})
