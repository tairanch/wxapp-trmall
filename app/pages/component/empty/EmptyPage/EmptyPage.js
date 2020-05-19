// pages/component/empty/EmptyPage/EmptyPage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    msg: { 
      type: String
    },
    btnText: {
      type: String
    },
    link: {
      type: String
    },
    turnTab: { // 是否跳到tabbar
      type: Boolean,
      value: false
    },
    imgUrl: {
      type: String,
      value: './img/item-none-page.png'
    },
    imgWidth: {
      type: String,
      value: "125px"
    },
    imgHeight: {
      type: String,
      value: "100px"
    },
    noBtn: {
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
    turnLink(){
      if (this.properties.turnTab){
        wx.reLaunch({
          url: this.properties.link
        })
      } else {
        wx.navigateTo({
          url: this.properties.link
        })
      }
    }
  }
})
