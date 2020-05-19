// pages/conponent/searchCom/searchCom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type: Object,
      value:{},
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
    // 搜索跳转
    searchResult: function (e) {
      let { text, link, defaultWord } = e.currentTarget.dataset.data
      // link = encodeURIComponent(link)
      if (defaultWord){
        text=""
      }
      wx.navigateTo({
        url: `/pages/wxpage/wxpage?type=search&text=${text}&link=${link}`
      })
    }
  }
})