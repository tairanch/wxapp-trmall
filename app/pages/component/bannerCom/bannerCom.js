// pages/conponent/bannerCom/bannerCom.js
const util = require('../../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Object,
      value:{}
    },
    autoplay:{
      type: Boolean,
      value: true
    },
    duration: {
      type: String,
      value: "500"
    },
    circular: {
      type: Boolean,
      value: false
    },
    current: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
   index:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bannerClick: function (e) {
      const data = e.currentTarget.dataset.data
      if(data.link) {
        if(data.appid) {   // 跳转到小程序
          util.navigateToMiniProgram({
            appId: data.appid,
            path: data.link
          })
        } else {
          wx.navigateTo({
            url: '/pages/out/out?url=' + encodeURIComponent(e.currentTarget.dataset.data.link),  //路径必须跟app.json一致
            success: function () {
            },
            fail: function () { },         //失败后的回调；
            complete: function () { }      //结束后的回调(成功，失败都会执行)
          })
        }
      }
    },
    swiperChange: function (e) {
      let self = this;
      self.setData({
        index: e.detail.current
      })
    }
  }
})
