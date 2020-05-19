// pages/shopCart/components/oneItem/OneItem.js
// popupSaleAttr 销售属性弹窗 this.triggerEvent('handleCheck', { data: 1 })
const utils = require('../../../../utils/util.js')
import {getNextPlusQuantity} from '../../utils'

//函数延迟
function delay(fn, wait) {
  let _self = fn,
    timer,
    args;
  return function () {
    let _me = this;
    args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, wait || 500);
  }
}

const _formatDate = function (time) {
  if (isNaN(Number(time))) return "";
  if (time.toString().length == 10) {
    time = new Date(time * 1000);
  } else {
    time = new Date(time);
  }
  return {
    year: time.getFullYear(),
    month: utils.timeUtils.toTwoDigit(time.getMonth() + 1),
    date: utils.timeUtils.toTwoDigit(time.getDate()),
    hour: utils.timeUtils.toTwoDigit(time.getHours()),
    minute: utils.timeUtils.toTwoDigit(time.getMinutes()),
    second: utils.timeUtils.toTwoDigit(time.getSeconds())
  }
}

const _cnFormat = function (time) {
  let dateObj = _formatDate(time);
  if (!dateObj) {
    return "";
  }
  let { year, month, date, hour, minute } = dateObj;
  return `${month}月${date}日${hour}:${minute}`
}

Component({
  externalClasses: ['item-class', 'info-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    edit: {  //是否编辑状态
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        if (oldVal && !newVal) {
          this.setData({ isOpen: false });
        } 
        if (oldVal && newVal) {
          this.setData({
            quantity: this.properties.itemData.quantity
          });
        }
      }
    },
    type: {
      type: String
    },
    promotionId: {
      type: Number
    },
    itemData: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal, changedPath) {
        if (!oldVal.quantity || (newVal.quantity !== oldVal.quantity)) {
          if(this.changeNumByInput) { // 通过input事件改变的数量，则initQuantity不变
            this.setData({
              quantity: newVal.quantity
            });
          } else {
            this.setData({
              quantity: newVal.quantity,
              initQuantity: newVal.quantity
            });
          }
        }
        // 商品数量规则重新计算
        const empty = {}
        const old_minimum_quantity_rule = oldVal && oldVal.minimum_quantity_rule ? oldVal.minimum_quantity_rule: empty;
        const new_minimum_quantity_rule = newVal && newVal.minimum_quantity_rule ? newVal.minimum_quantity_rule: empty;
        if(new_minimum_quantity_rule !== old_minimum_quantity_rule){ // 都不为空
          if(new_minimum_quantity_rule.type !== old_minimum_quantity_rule.type || new_minimum_quantity_rule.amount !== old_minimum_quantity_rule.amount) {
            // 有一项规则不一样就重新计算规则
            this.renderMinimumQuantity()
          }
        }

        // 库存重新计算
        const old_promotion_single = (oldVal && oldVal.promotion_single) || empty
        const old_store = (oldVal && oldVal.store) || empty
        const new_promotion_single = (newVal && newVal.promotion_single) || empty
        const new_store = (newVal && newVal.store) || empty
        if(old_promotion_single !== new_promotion_single || old_store !== new_store) {
          this.getStore()
        }
      }
    },
    scrollOpen: {  // 左滑打开状态
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal, changedPath) {
        if (!newVal && this.data.isOpen) {
         this.setData({
           isOpen: false
         })
        }
      }
    },
    isCheck: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    quantity: 1, // 数量
    initQuantity: '', // 初始数量
    isOpen: false,  // 操作打开状态
    store: null,   // 库存
    price: null,   //价格
    buyLimit: '',  // 限购数量
    realStore: '',
    disMove: false, // 禁止页面左滑
    isEnd: false,
    end_time: '',
    isStart: false,
    start_time: '',
    activitiTime: '', // 特卖时间
    timer: null,
    ctrlHeight: '', // ctrl高度
    minimumQuantity: '', // 商品数量条件提示
    minLimit:1     // 最小购买数量
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.initData()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {  
    // 独立的方法
    initData(val) {  // 初始化数据
      this.changeNumByInput = false; // 是否是通过input事件改变的数量
      this.setData({
        quantity: this.properties.itemData.quantity,
        initQuantity: this.properties.itemData.quantity
      })
    },
    initBuyLimit() { //初始化商品可购买最大数量
      const { itemData } = this.properties;
      let { promotion_single, store } = itemData;
      if (promotion_single && (promotion_single.type === 'FlashSale' || promotion_single.type === 'SecKill')) {
        if ((new Date(promotion_single.start_time.replace(/-/g, '/')).getTime() <= new Date().getTime()) && (new Date().getTime() <= new Date(promotion_single.end_time.replace(/-/g, '/')).getTime())) {
          store = promotion_single.store
        }
      }
      let buyLimit = store;
      if (promotion_single && promotion_single.user_buy_limit && promotion_single.user_buy_limit > 0) {
        buyLimit = promotion_single.user_buy_limit
      }
      if (buyLimit && parseFloat(buyLimit) > parseFloat(store)) {
        buyLimit = store
      }
      return buyLimit
    }, 
    getStore() { // 计算出store库存
      let { store, promotion_single } = this.properties.itemData
      if (promotion_single && (promotion_single.type === 'FlashSale' || promotion_single.type === 'SecKill')) {
        if ((new Date(promotion_single.start_time.replace(/-/g, '/')).getTime() <= new Date().getTime()) && (new Date().getTime() <= new Date(promotion_single.end_time.replace(/-/g, '/')).getTime())) {
          store = promotion_single.store
        }
      }
      this.setData({
        store: store || 0
      })
      return store
    },
    renderMinimumQuantity() {  // 计算商品数量条件
      let { minimum_quantity_rule} = this.properties.itemData;
      if(minimum_quantity_rule) { // 存在购买数量规则
        const { type, amount } = minimum_quantity_rule;
        if(type == 10) {          // 最小数量
          this.setData({
            minimumQuantity: `${amount}件起售`,
            minLimit: amount
          })
        }
        if(type == 20) {          // 最小包装
          this.setData({
            minimumQuantity: `${amount}倍购买`,
            minLimit: amount
          })
        }
      }
    },
    controlOpen(event) { // getIsOpen 获取打开状态
      this.setData({
        isOpen: event.detail.status
      }, () => {
        this.triggerEvent('scrollCtrl', {
          status: event.detail.status
        })
      })
      
    },
    startTough(event) {
      const query = this.createSelectorQuery()
      query.select('.one-item').boundingClientRect( (rect) => {
        const height = rect.height
        if (event.detail.status) { // 开始滑动
          this.setData({
            ctrlHeight: height
          }, () => {
            this.triggerEvent('scrollCtrl', { // 关闭所有左滑的按钮
              status: false
            })
          })
        }
      }).exec()
    },
    // 改变总状态的方法
    handleCheck(event) { //切换check
      this.triggerEvent('handleCheck', {
        cartId: this.properties.itemData.cart_id,
        itemId: this.properties.itemData.item_id
      })
    },
    /**
     * 判断是否满足商品起订量条件，先于库存判断
     * @param quantity     输入的商品数量
     * @param initQuantity 初始商品数量
     * @returns {*}
     */
    judgeNum(quantity){
      const {itemData} = this.properties;
      if(itemData && itemData.minimum_quantity_rule) { // 存在限购或者最小购买 10最小起订 20最小包装
        const { type, amount } = itemData.minimum_quantity_rule;
        if(type == 10) { // 最小数量
          if(quantity >= amount){
            return true
          } else {
            wx.showToast({
              title: `该商品${amount}件起售`,
              icon: 'none'
            })
            return false
          }
        }
        if(type == 20) { // 最小包装
          if((quantity % amount) === 0) { // 是amount的倍数
            return true
          } else {
            wx.showToast({
              title: `仅支持${amount}倍购买`,
              icon: 'none'
            })
            return false
          }
        }
      }
      return true
    },
    numValid(detail) {  // num检验
      let { itemData } = this.properties,
        { initQuantity } = this.data;
      let buyLimit = this.initBuyLimit() 
      let quantity = detail.val
      let min = this.data.minLimit;
      let max = detail["max"] || buyLimit || 999999999;
      if (!Number.isInteger(+quantity)) {
        wx.showToast({
          title: '请输入正确的数量哦',
          icon: 'none'
        })
        this.setData({
          quantity: initQuantity
        }, () => { this.updateItemNum(initQuantity) });
        return false
      }
      if(!this.judgeNum(quantity)) {
        this.setData({
          quantity: initQuantity
        }, () => { this.updateItemNum(initQuantity) });
        return false
      }
      if (quantity < min) {
        wx.showToast({
          title: `至少需要${min}件哦`,
          icon: 'none'
        })
        this.setData({
          quantity: initQuantity
        }, () => { this.updateItemNum(initQuantity) });
        return false
      }
      if (max && quantity > max) {
        wx.showToast({
          title: '已超出可购数量',
          icon: 'none'
        })
        this.setData({
          quantity: max
        }, () => {
          this.updateItemNum(max)
          this.numUpdate({
            cartId: this.properties.itemData.cart_id,
            num: max
          });
        });
        return false
      }
      return true
    },
    handleNum(e) { // input数量 change 变化，不调用接口
      this.changeNumByInput = true
      let detail = e.detail
      let value = +detail.val
      if (!Number.isInteger(value) && value !== "") {
        return;
      }
      const max = 999999999
      if (value <= max) {
        this.setData({
          quantity: value
        });
        this.updateItemNum(value)
      }
    },
    handleInputNum(e) { //  input数量 blur 变化， 调用接口
      this.changeNumByInput = false
      let detail = e.detail || {};
      let { itemData } = this.properties
      let quantity = detail.val
      if(this.numValid(detail)){
        this.numUpdate({
          cartId: itemData.cart_id,
          num: quantity
        });
      }
    },
    handleReduce() {  //  点击减少
      this.changeNumByInput = false
      let { itemData } = this.properties
      let { cart_id, minimum_quantity_rule, store } = itemData
      let { quantity, minLimit } = this.data;
      let step = 1;                     // 每次减少的数量
      if(minimum_quantity_rule){
        const { type, amount } = minimum_quantity_rule;
        if(type == 20) {              // 只需要判断最小包装
          const remainder =  quantity % amount;
          if(remainder === 0) {       // 当前数量是amount的倍数
            step = amount;
          } else {                    // 当前数量不是amount的倍数，则设置成最近的最小倍数
            step = quantity - Math.floor(quantity / amount) * amount;
          }
        }
      }
      let _quantity = quantity - step;
      if(_quantity >= store) {            // 大于等于库存则设置成库存
        _quantity = store
      } else {                            // 小于库存时
        if( _quantity < minLimit ) {      // 比最小购买量还小，则不能减少
          return;
        }
      }
      this.setData({ quantity: _quantity })
      this.updateItemNum(_quantity)
      this.numUpdate({
        cartId: cart_id,
        num: _quantity
      });
    },
    handlePlus (){  //点击增加
      this.changeNumByInput = false
      let { itemData } = this.properties
      let { cart_id, minimum_quantity_rule } = itemData
      let { quantity } = this.data;
      const buyLimit = this.initBuyLimit()
      const nextPlusQuantity = getNextPlusQuantity(minimum_quantity_rule, quantity);  // 增加后的数量
      if((buyLimit !== null && quantity >= buyLimit) || nextPlusQuantity > buyLimit) { // 不能增加
        return;
      }
      this.setData({ quantity: nextPlusQuantity })
      this.updateItemNum(nextPlusQuantity)
      this.numUpdate({
        cartId: cart_id,
        num: nextPlusQuantity
      });
    },    
    handleCollect(event) { //移入收藏夹
      let { itemData } = this.properties;
      this.triggerEvent('handleItemCollect', {
        cart_id: itemData.cart_id,
        promotionId: this.properties.promotionId
      })
    },
    handleDelete(event) {  //点击删除
      let { itemData } = this.properties;
      this.triggerEvent('handleItemDelete', {
        cart_id: itemData.cart_id,
        promotionId: this.properties.promotionId
      })
    },
    updateItemNum(num) {  // 单个商品 改变state, 不请求接口
      this.triggerEvent('handleItemNum', {
        cartId: this.properties.itemData.cart_id,
        num: num
      })
    },
    numUpdate(data) {     //  改变商品数量, 请求接口
      let timer = this.data.timer
      if (timer) {
        clearTimeout(timer);
      }
      this.setData({
        timer: setTimeout(() => {
          clearTimeout(timer);
          const cb = () => {
            this.setData({
              initQuantity: data.num
            })
          }
          this.triggerEvent('oneNumUpdate', {...data, cb})
        }, 500)
      })
    }, 
    popupSaleAttr(event) { // 销售属性弹窗
      if (!this.properties.edit) {
        return
      }
      const itemData = this.properties.itemData
      const image = itemData.image
      this.triggerEvent('popupSaleAttr', {
        item_id: itemData.item_id,
        img: image,
        sku_id: itemData.sku_id,
        cart_id: itemData.cart_id
      })
    },
    //  跳转详情
    goodetail(event) {
      if (this.properties.edit) return
      let _itemid = event.currentTarget.dataset.itemid
      wx.navigateTo({
        url: '../wxpage/wxpage?type=itemdetails&itemid=' + _itemid
      })
    }
  }
})
