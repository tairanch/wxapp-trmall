// pages/pa ge/page.js
let RequestManager = require('../../../utils/RequestHelper.js');
let app = getApp();
let ctxPath = app.globalData.ctxPath;
let pageApi = {
    getInviteCustomerList: { url: ctxPath + '/commission/getInviteCustomerList', method: "RequestGet" },
    getOrderCustomerList: { url: ctxPath + '/commission/getOrderCustomerList', method: "RequestGet" },
};

let storeAjax = "" // 用于减少请求
let isbottom = false //是否已经请求全部
Page({
    /**
     * 页面的初始数据
     */
    data: {
        dcpTitle: '我的客户',
        navData: ['邀请用户','下单用户'],
        currentTab: 0,
        scrollTop:0,
        page: 1,
        apiUrl:"getInviteCustomerList",
        dataLists: [],
        baseimg:'/image/mine/phone-shape-icon.png'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _totalObj = JSON.parse(options.totalObj)
        let _navData = []
        let _invite_total = '邀请客户(' +  _totalObj.invite_total + ")"
        let _order_total = '下单客户(' +  _totalObj.order_total + ")"
            _navData.push(_invite_total);
            _navData.push(_order_total);
        this.setData({
          navData: _navData
        })
        if (app.globalData.haslogin == false){

        }
        if (options.btnType === "orderType") {
          this.handleSwitch('1');
        }else{
          // this.requestList('加载数据中');
          this.handleSwitch('0');
        }
    },

    /**
   * 点击切换导航
   */
  onSwitchNav(event) {
    let cur = event.currentTarget.dataset.current;
    this.handleSwitch(cur);
  },

  /**
   * 滚动swiper
   */
  onSwitchTab(event) {
    let cur = event.detail.current;
    this.handleSwitch(cur);
  },

  /**
   * 处理页面切换
   */
  handleSwitch(cur){
    isbottom = false
    if (cur === this.data.currentTab) {
        // 本身不请求
        return
    }
    let _apiUrl = "getInviteCustomerList'"
    if (cur == 0) {
      _apiUrl = 'getInviteCustomerList'
    } else if (cur == 1) {
      _apiUrl = 'getOrderCustomerList'
    } else {
      _apiUrl = 'getInviteCustomerList'
    }
    this.setData({
        currentTab: cur,
        scrollTop:0,
        apiUrl:_apiUrl,
        page:1
    });
    // this.data.page = 1;
    this.requestList('加载数据中');
  },

  /**
   * 获取数据列表
   */
  requestList(msg) {
    let that = this;
    // wx.showLoading({
    //   title: msg,
    // });
    let _newurl = that.data.apiUrl + that.data.page;
    if (storeAjax == _newurl) {
        wx.hideLoading();
        return
    }else{
        storeAjax = _newurl
    }
    let api = pageApi[that.data.apiUrl];
    RequestManager[api.method](api.url, {
      page: that.data.page,
      page_size: 20
    }, function (res) {
      let data = res.data;
      wx.hideLoading();
      if (data.length <= 0) {
        isbottom = true
        if (that.data.page === 1) {
          that.setData({
            dataLists: []
          });
        }
        // else{
        //   wx.showToast({
        //     title: '没有更多数据了...',
        //     icon: 'none',
        //     duration: 1000,
        //   });
        // }
      } else {
        isbottom = false
        storeAjax = ""
        let contentlistTem = that.data.dataLists;
        if (that.data.page === 1) {
          contentlistTem = [];
          that.setData({
            dataLists: contentlistTem.concat(data)
          });
        } else {
          that.setData({
            dataLists: contentlistTem.concat(data)
          });
        }
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    }, function (err) {
      console.log(err);
    }, true);
  },

  /**
   * 上拉刷新
   */
  refreshTop() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.data.page = 1;
    this.requestList('正在刷新数据');
  },

  /**
   * 下拉加载
   */
  reactBottom() {
    if (!isbottom) {
      this.setData({
        page: this.data.page + 1
      });
      this.requestList('加载更多数据');
    }
  },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})
