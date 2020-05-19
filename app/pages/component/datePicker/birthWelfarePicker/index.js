// 生日福利组件
Component({
  options: {
    styleIsolation: 'apply-shared'   // 页面 wxss 样式将影响到自定义组件
  },
  properties: {},

  data: {},
  methods: {
    // 点击确定按钮
    birthSure() {
      this.triggerEvent('birthTap', {
        birthDay: this.birthDay
      })
    },
    // 获取日期
    getDateValue(e) {
      const value = e.detail.value
      this.birthDay = `${value[0]}-${value[1]}-${value[2]}`
    }
  }
});