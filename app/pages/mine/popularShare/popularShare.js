//index.js
//获取应用实例
const app = getApp()
const common = require('../../../utils/common.js')
const util = require('../../../utils/util.js');
const {getCodePromise, getUserInfoPromise, didHasLoadPromise} = require('../../../utils/login.js');
const RequestManager = require('.././../../utils/RequestHelper.js');

Page({
  // 页面初始数据
  data: {
    isTab: true, // 是导航页
    homePageData: [],
    searchData:{},
    update:false,
    trcGuideShow:false,
    imgShowArr: [],
    itemHeight: 260,
    arrHeight: [],
    route: ''   // 页面路由
  },

  getRect: function () {
    let that = this;
    that.imgInit(that.data.itemHeight);
    that.arrHeightInit();//初始化每张图片的位置
  },
  arrHeightInit: function () {
    for (let i = 0; i < this.data.imgShowArr.length; i++) {
      this.data.arrHeight[i] = Math.floor(i / 2) * this.data.itemHeight + 55
    }
  },
  imgInit: function (itemHeight) {
    //获取页面打开未滚动时整屏显示的行数，每行2个图片*2 ，先加载
    let index = parseFloat(app.globalData.winHeight / itemHeight);
    for (let i = 0; i < index * 2 && i < this.data.imgShowArr.length; i++) {
      this.data.imgShowArr[i] = true;
    }
    this.setData({ imgShowArr: this.data.imgShowArr })
  },

  // 广告位方法
  advertisingClick: function (e) {
    const data = e.currentTarget.dataset.data
    if(data && data.link) {
      if(data.appid) {
        util.navigateToMiniProgram({
          appId: data.appid,
          path: data.link
        })
      } else {
        wx.navigateTo({
          url: '/pages/out/out?url=' + encodeURIComponent(e.currentTarget.dataset.data.link),  //路径必须跟app.json一致
          success: function () {
          },
          fail: function () { },         //失败后的回调；
          complete: function () { }      //结束后的回调(成功，失败都会执行)
        })
      }
    }
  },

  changeTrcGuideStatus:function(){
    this.setData({
      trcGuideShow: false
    })
  },

  downloadTrcAPP:function(){
    wx.navigateTo({
      url: '/pages/out/out?url=' + encodeURIComponent('https://m.tairanmall.com/guide'),  //路径必须跟app.json一致
      success: function () {
      },
      fail: function () { },         //失败后的回调；
      complete: function () { }      //结束后的回调(成功，失败都会执行)
    })
  },

  /**
   * 判断是否登入
   * @private
   */
  didHasLoad: function(cb) {
    let _code = null;
    getCodePromise()
      .then((code) => {           // 获取code
      _code = code
      return getUserInfoPromise() // 获取用户信息
    })
      .then((data) => {
        if(!data) {
          // 没有获取到用户信息，跳转到登入页面
          wx.reLaunch({
            url: `/pages/login/login?redirect_uri=${'/pages/mine/popularShare/popularShare'}&isTab=false&isMini=true`,
          })
        }
        return didHasLoadPromise({
          data,
          code: _code,
          redirect_uri: '/pages/mine/popularShare/popularShare'
        }, RequestManager.RequestHelper)
      })
      .then(() => {
        cb()
      })
      .catch((err) => {
        console.log('err：', err)
        // 登入失败，跳转到登入页面
        wx.reLaunch({
          url: `/pages/login/login?redirect_uri=${'/pages/mine/popularShare/popularShare'}&isTab=false&isMini=true`,
        })
    })

  },

  onLoad: function () {
    wx.hideShareMenu();
    this.didHasLoad(() => {
      //小程序注册完成后，加载页面，触发onLoad方法
      this.getPageData((res) => {
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        // type=60 处理类目楼层数据
        res.data.map((item, i) => {
          if (item.type == 60) {
            item.data.item_list.map((value, k) => {
              if (value.item_id == item.data.img_bottom_item_id) {
                item.data.item_list.splice(k + 1, 0, { image: item.data.img_bottom_url, link: item.data.img_bottom_link,insertImg:true });
              }
            })
          }

          if (item.type == 10) { //搜索
            common.getSearchDefaultWord((searchData) => {
              let newdata = {};
              newdata.text = searchData.data.word || "搜索： 商品 分类 品牌 国家";
              newdata.link = searchData.data.link || "";
              if (!searchData.data.word){
                newdata.defaultWord=true;
              }
              this.setData({
                searchData: newdata
              })
            })
          }
          if (item.type == 50) {
            item.data.item_list.map((value, i)=>{
              this.data.imgShowArr.push(false)
            })
          }
        })
        this.setData({
          homePageData: res.data,
          update:true,
          imgShowArr: this.data.imgShowArr
        })

        this.getRect();
      })
      this.setData({
        route: this.route
      })
    })
  },
  onReady: function () { //首次显示页面，会触发onReady方法，渲染页面元素和样式，一个页面只会调用一次

  },
  onShow: function () { //页面载入后触发onShow方法，显示页面

  },

  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.onLoad();
  },
  //页面滚动
  onPageScroll: function (e) {
    for (let i = 0; i < this.data.arrHeight.length; i++) {
      if (this.data.arrHeight[i] < e.scrollTop + app.globalData.winHeight) {
        if (this.data.imgShowArr[i] == false) {
          this.data.imgShowArr[i] = true;
        }
      }
    }
    this.setData({ imgShowArr: this.data.imgShowArr })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    return {
      title: '泰然城分享',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  /**
   * 获取页面数据
   * @param callBack
   */
  getPageData(callBack) {
    RequestManager.RequestGet(app.globalData.ctxPath+'/module/getCommissionHomeModuleList',{}, function (res) {
      callBack(res);
    }, null, true)
  },

  /**
   * 返回首页
   */
  back() {
    wx.reLaunch({
      url: getApp().getHomePage()
    })
  }
})