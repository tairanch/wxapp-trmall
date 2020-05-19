// pages/component/popup/modal-popup/index.js
Component({
  options: {
    styleIsolation: 'apply-shared',   // 页面 wxss 样式将影响到自定义组件
    multipleSlots: true               // 使用多slot
  },
  /**
   * 组件的属性列表
   */
  properties: {
    modalClass: {  // 最外层class名称
      type: String,
      value: ''
    },
    footerClass: {  // 底部class名称
      type: String,
      value: ''
    },
    btns: {        // 底部按钮
      type: Array,
      value: [
        {text: '确定', className: 'btn1'},
        {text: '取消', className: 'btn2'}
      ]
    },
    useFooter: {  // 是否使用自定义底部
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
    /**
     * 按钮点击
     */
    triggerBtns(event) {
      this.triggerEvent('btnEvent', {
        index: event.currentTarget.dataset.index
      })
    }
  }
})
