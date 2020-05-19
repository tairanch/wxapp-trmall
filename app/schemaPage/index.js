// 小程序码页面中转
// scene格式必须通过 getSchemaScene 处理（ schemaPage/schemaUtils ）

const { keyToPage } = require('./schemaUtils.js');
const { getEncodeCommissionUcenterId } = require('../api/user/index.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let scene = options.scene;
    if(scene) {
      try {
        scene = decodeURIComponent(scene);
        scene = scene.split(',');
        if(scene && scene.length > 0) {
          const page = keyToPage[scene[0]];
          if(page) {
            switch (scene[0]) {
              case 'hotshare': // 来自热门分享，需要跳转到h5商品详情页面
                const phone = scene[1];
                const itemId = scene[2];
                this.turnCommissionUcenterItemPage(phone, itemId)
                break;
              default:
                wx.reLaunch({
                  url: getApp().getHomePage()
                })
                break;
            }
          } else {
            // 如果没有找到key对应的page, 说明直接传递了page地址
            wx.redirectTo({
              url: scene[0]
            })
          }
        } else {
          this.turnHomePage()
        }
      } catch (e) {
        console.warn(e)
        // 解析出错则回到首页
        this.turnHomePage()
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

  },

  turnHomePage: function () {
    wx.reLaunch({
      url: getApp().getHomePage()
    })
  },

  /**
   * 通过phone获取CommissionUcenterId(用于热门分享营销关系), 并跳转到商品详情页
   * @param phone   手机号
   * @param itemId  商品id
   */
  turnCommissionUcenterItemPage: function (phone, itemId) {
    getEncodeCommissionUcenterId(phone).then(res => {
      if(res) {
        const comUcerterId = res.commission_ucenter_id;
        wx.redirectTo({
          url: `/pages/wxpage/wxpage?type=hotshare&comUcerterId=${comUcerterId}&itemId=${itemId}`
        })
      }
    }).catch((e) => {
      console.warn(e)
      this.turnHomePage()
    })
  }
})