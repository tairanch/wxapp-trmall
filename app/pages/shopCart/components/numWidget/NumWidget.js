// pages/shopCart/components/numWidget/NumWidget.js
import {getNextPlusQuantity} from '../../utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    quantity: {  // 数量
      type: Number,
      observer: function(newVal, oldVal, changedPath) {
        const {minimumQuantityRule} = this.properties
        // 下一次的商品数量
        const nextPlusQuantity = getNextPlusQuantity(minimumQuantityRule, newVal);
        this.setData({
          nextPlusQuantity
        })
      }
    },
    buyLimit: {  // 限制数量
      type: Number,
      value: null
    },
    minLimit: {  // 最小购买数量
      type: Number,
      value: null
    },
    minimumQuantityRule: { // 商品数量规则
      type: Object,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        if(oldVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          const {quantity} = this.properties
          // 下一次的商品数量
          const nextPlusQuantity = getNextPlusQuantity(newVal, quantity);
          this.setData({
            nextPlusQuantity
          })
        }
      }
    },
    disable: {   // 是否可以改变数量
      type: Boolean
    }
  },

  lifetimes: {
    attached() {},
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    nextPlusQuantity: null, // 下一次的商品数量
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleNum(event) { // 输入数量改变
      let value = event.detail.value
      this.triggerEvent('handleNum', {
        val: value
      })
    },
    handleInputNum(event) { // 数量改变 api
      let value = event.detail.value
      this.triggerEvent('handleInputNum', {
        val: +value
      })
    },
    handleReduce() { //减少
      this.triggerEvent('handleReduce')
    },
    handlePlus() { //增加
      this.triggerEvent('handlePlus')
    }
  }
})
