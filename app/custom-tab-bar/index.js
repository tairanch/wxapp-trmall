// pages/component/navigator/navigator.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  attached() {
    this.setData({
      list: getApp().globalData.BottomIcons.filter((bottom) => {
        return bottom.status == 1
      })
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const {linkval, linktype, tabindex} = e.currentTarget.dataset
      // 1: 组件页面, 2: h5链接, 3: 小程序路径
      switch (+linktype) {
        case 1:
          getApp().globalData.configPageId = linkval
          wx.switchTab({
            url: '/pages/configpage/index?channel_id=' + linkval
          })
          break;
        case 2:
          wx.navigateTo({
            url: '/pages/h5wxpage/index?url=' + encodeURIComponent(linkval)
          })
          break;
        case 3:
          if(linkval[0] === '/') {
            wx.switchTab({
              url: linkval,
            })
          } else {
            wx.switchTab({
              url: '/' + linkval,
            })
          }
          break;
        default:
          break;
      }
      this.setData({
        selected: tabindex
      })
    }
  }
})
