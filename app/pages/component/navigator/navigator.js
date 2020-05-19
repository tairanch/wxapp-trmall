// pages/component/navigator/navigator.js
const util = require('../../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    route:{
      type: String,
      observer: function (newVal, oldVal, changedPath) {
        const bottomIndex = util.getBottomBarIndex(newVal) // 获取当前导航序号
        if(bottomIndex !== null) {
          this.setData({
            activeIdx: bottomIndex
          })
        }
      }
    },
    isHomePage: {  // 是否是首页，是首页则请求底部导航接口
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      wx.hideTabBar() // 隐藏系统自带的导航栏
      if(this.properties.isHomePage) {
        getApp().getBottomIcons().then((bottomIcons) => {
          if(bottomIcons) {
            this.setData({
              navigatorList: bottomIcons.filter((bottom) => {
                return bottom.status == 1
              })
            })
          }
        })
      } else {
        this.setData({
          navigatorList: getApp().globalData.BottomIcons.filter((bottom) => {
            return bottom.status == 1
          })
        })
      }
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    navigatorList: [  // 菜单列表
      {
        id: 1,
        text: '首页'
      }
    ],
    activeIdx: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 判断如果跳转url与当前地址相同，true则不执行跳转
    judgeCurrentPage(url) {
      const currentPage = getCurrentPages() && getCurrentPages().length ? getCurrentPages()[getCurrentPages().length - 1]:'' // 获取当前页面
      if(currentPage && currentPage.route){
        if(`/${currentPage.route}` === url) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    turnTab(e) {  // 跳转
      const {linkval, linktype, tabindex} = e.currentTarget.dataset
      let url = null
      // 1: 组件页面, 2: h5链接, 3: 小程序路径
      switch (+linktype) {
        case 1:
          getApp().globalData.configPageId = linkval
          url = '/pages/configpage/index?channel_id=' + linkval
          break;
        case 2:
          url = '/pages/h5wxpage/index?url=' + encodeURIComponent(linkval)
          break;
        case 3:
          if(linkval[0] === '/') {
            url = linkval
          } else {
            url = '/' + linkval
          }
          break;
        default:
          break;
      }
      if(url && !this.judgeCurrentPage(url)) {
        wx.reLaunch({
          url: url
        })
      }
    }
  }
})
