const { updateVipUser } = require('../../api/vip/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerShow: true,
    popupBtns: [
      {text: '确定', className: 'pop-btn1'},
      {text: '取消', className: 'pop-btn2'}
    ],
    showPopup: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
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
    this.getOnUnload = true;  // 是否执行onUnload生命周期
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if(this.getOnUnload) {  // 默认返回到个人中心
      wx.reLaunch({
        url: '/pages/mine/index'
      })
    }
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

  },

  /**
   * 去首页
   */
  turnHome: function() {
    this.getOnUnload = false;
    wx.reLaunch({
      url: getApp().getHomePage()
    })
  },

  /**
   * 去vip页
   */
  turnVipPage: function() {
    this.getOnUnload = false;
    wx.navigateTo({
      url: '/pages/vipPage/vipPage'
    })
  },

  /**
   * 确定生日
   */
  birthSure: function (e) {
    const birthDay = e.detail.birthDay;
    updateVipUser('birthday', birthDay).then(() =>{
      this.setData({
        inputInviter: this._inputInviter
      }, () => {
        wx.showToast({ title: '提交成功', icon: 'none'});
        this.setData({
          pickerShow: false,
          showPopup: true
        }, () => {
          this.setData({
            showPopup: true
          })
        })
      })
    }).catch((err) => {
      wx.showToast({ title: err || '提交失败', icon: 'none'});
    })
  },

  /**
   * 确定弹窗
   */
  sureBtn: function () {
    this.setData({
      showPopup: false
    })
  },
  /**
   * 取消弹窗
   */
  cancelBtn: function () {
    this.setData({
      showPopup: false,
      pickerShow: true
    }, () => {
      this.setData({
        pickerShow: true
      })
    })
  },
  btnEvent: function (event) {
    const { detail } = event
    if(detail.index === 1) { // 取消按钮
      this.cancelBtn()
    } else {                 // 确定按钮
      this.sureBtn()
    }
  }
})