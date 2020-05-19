import {groupSellPrice} from '../../../data'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
      detail:{
          type:Object,
          value:{}
      },
      promotion:{
          type:Object,
          value:{}
      },
      sellPrice:{
          type:String,
          value:""
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
    share_img:'/image/common/share-img.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    turnPoster() {
      const item_id = this.data.detail ? this.data.detail.item_id: ''
      wx.navigateTo({
        url: `/pages/product/shareMiddlePage/shareMiddlePage?item_id=${item_id}&sellPrice=${this.properties.sellPrice}&groupSellPrice=${groupSellPrice}`
      })
    }
  }

})
