// pages/component/twoLinesCom/twoLinesCom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: ''
    },
    fromPopular: {  // 是否来自热门分享页面
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goItemPage: function(e) {
      let {
        item_id,
        status
      } = e.currentTarget.dataset.item
      if (status == 10||status == 40 || status == 50) {
        return
      }
      if(this.properties.fromPopular) {
        wx.navigateTo({
          url: '/pages/product/item-detail/index?itemId=' + item_id
        })
      } else {
        wx.navigateTo({
          url: '/pages/wxpage/wxpage?type=itemdetails&itemid=' + item_id
        })
      }
    },
    goMore: function(e) {
      console.log(e)
      wx.reLaunch({
        url: '../group/index'
      })
    },

  }
})