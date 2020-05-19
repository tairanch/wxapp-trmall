//该页面用于存放内嵌网页
var app = getApp();
var ctxPath = app.globalData.webPath;
var ctxPathFunds = app.globalData.ctxPathFunds;

var RequestManager = require('../../utils/RequestHelper.js');
var common = require('../../utils/common.js');
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    web_src: '',
    share_title: '', // 分享的标题
    share_url: '', // 分享的图片
    getmessagesUrl:null,  //分享方法调用的url
    systemInfo: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.getSystem()
    // type 0 待付款 1 待发货 2 待收货 3 带评价 4 退货
    // type list0 我的拼团 list1 我的收藏 list2 卡券包 lis3 e卡管理 list4 联系客服
    // type ecardred E卡管理 - 红包分享
    let _tourl = ''
    switch (options.type) {
      case '0':
        _tourl = '/tradeList/0'
        break;
      case '1':
        _tourl = '/tradeList/1'
        break;
      case '2':
        _tourl = '/tradeList/2'
        break;
      case '3':
        _tourl = '/tradeList/3'
        break;
      case '4':
        _tourl = '/tradeList/4'
        break;
      case '5':
        _tourl = '/afterSale/list'
        break;

      case 'list0':
        _tourl = '/groupList/0'
        break;
      case 'list1':
        _tourl = '/myCollection?page=1'
        break;
      case 'list2':
        _tourl = '/couponList'
        break;
      case 'list3':
        _tourl = '/fund_h5/#/ecard/index'
        break;
      case 'list4':
        _tourl = '/customerService'
        break;
      case 'list5':
        _tourl = '/redList'
        break;
      case 'listuser':
        _tourl = '/userInfo'
        break;

      case 'itemdetails':
        _tourl = '/item?item_id=' + options.itemid
        break;

      case 'hotshare': // 来自热门分享, 传递 comUcerterId
        _tourl = `/item?item_id=${options.itemId}&comUcerterId=${options.comUcerterId}`
        break;

      case 'search':
        options.text = encodeURIComponent(options.text)
        options.link = encodeURIComponent(options.link)
        _tourl = `/search?text=${options.text}&link=${options.link}`
        break;

      case 'searchResult':
        _tourl = `/searchResult?promotion_id=${options.promotion_id || ''}&coupon_id=${options.coupon_id}`
        break;
      case 'searchResultFromVip':
        _tourl = `/searchResult?service=${options.service}&brand=${options.brand}`;
        break;

      case 'orderConfirm':
        _tourl = `/orderConfirm?mode=${options.mode}&buy_type=${options.buy_type}&cartToken=${options.cartToken}`
        break;

      // 开通vip跳转到收银台中转页
      case 'vipCashier':
        // 支付成功跳转到 vipResult 页面
        _tourl = `/cashier?tid=${options.order_no}&successUrl=wxappVipResult&backUrl=${app.globalData.webPath}/wxappTransit?turn=backVip&inviter=${options.inviter}`
        break;

      case 'storeHome':
        _tourl = `/store/home?shop=${options.shop_id}`
        break;

      case 'backtowx':
        _tourl = that.parseQueryString(decodeURIComponent(options.backtowx))
        break;

      case 'bags':
        _tourl = "/shopCart"
        break;

      default:
        break;
    }
    let _url = options.type == 'list3' ? ctxPathFunds + _tourl : ctxPath + _tourl
    if (_tourl.indexOf('?') != -1){
      let _token = "&token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
      _url = _url + _token
    }else{
      let _token = "?token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
      _url = _url + _token
    }
    if (options.type == 'backtowx'){
      let _token = "?token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
      if (_tourl.indexOf('?') != -1){
        if (_tourl.indexOf('=') != -1){
          _token = "&token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
       }else{
          _token = "token=" + app.globalData.globtoken + "&openid=" + app.globalData.globOpenID + "&mini=trMall"
       }
      }
      _url = _tourl + _token
    }
    // E卡红包分享页面 begin
    if (options.type == 'ecardred') {
      _url = decodeURIComponent(options.url)
      this.setData({
        share_url: options.shareUrl,
        share_title: options.mainTitle
      })
    }
    // E卡红包分享页面 end
    // 收银台跳转页面 begin
    if (options.type == 'payresult') {
      _url = decodeURIComponent(options.url)
    }
    // 收银台跳转页面 end
    console.log(_url)
    that.setData({
      web_src: _url
    })
  },

  getSystem:function(){
    let that = this
    let _systeminfo = 'android' //手机系统
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform == "devtools") {
          _systeminfo =  'PC'
        } else if (res.platform == "ios") {
          _systeminfo = 'IOS'
        } else if (res.platform == "android") {
          _systeminfo = 'android'
        }
        that.setData({
          systemInfo: _systeminfo,
        })
      }
    })
  },
  parseQueryString: function (url, delComUcerterId = false) {
    let _this = this
    var obj = {};
    var keyvalue = [];
    var key = "", value = "";
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var _host = url.substring(0, url.indexOf("?") + 1)
    for (var i in paraString) {
      keyvalue = paraString[i].split("=");
      key = keyvalue[0];
      value = keyvalue[1];
      obj[key] = value;
    }
    obj.openid = app.globalData.globOpenID
    obj.token = app.globalData.globtoken
    obj.mini = "true"
    delComUcerterId && (obj.comUcerterId = '')
    delete obj.openid
    delete obj.token
    delete obj.mini
    delComUcerterId && (delete obj.comUcerterId)
    return _host + _this.paramsHandle(obj);
  },
  paramsHandle: function (params) {
    return Object.keys(params).map(key => {
      return key + '=' + encodeURIComponent(params[key])
    }).join('&')
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function (options) {
    let that = this
    let _baseurl = that.data.systemInfo == 'IOS' ? that.data.getmessagesUrl : options.webViewUrl
    _baseurl = that.parseQueryString(decodeURIComponent(_baseurl), true)
    let return_url = encodeURIComponent(_baseurl)
    let share_title =  this.data.webInfo ? (this.data.webInfo.title || '泰然城分享') : '泰然城分享'
    let image_url = this.data.webInfo ? (this.data.webInfo.imageUrl || '') : ''
    // 如果分享的页面是发送红包的页面，则设置 return_url
    if (options.webViewUrl.indexOf('/ecard/red/detail') != -1) {
      return_url = this.data.share_url
      share_title = this.data.share_title
      image_url = '../../image/receiving.png'
    }
    var paths = 'pages/sharepage/sharepage?sharesssUrl=' + return_url
    return {
      title: share_title,
      path: paths,
      imageUrl: image_url,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "转发成功",
          icon: 'success',
          duration: 2000
        })
        that.setData({
          share_url: return_url ,   //再次赋值分享内嵌网页的路径
          web_src: _baseurl
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  bindmessage (e) {//接收web-view传递的参数
    if (e && e.detail && e.detail.data){
      let data = e.detail.data.slice(-1)[0]
      this.setData({//存储状态
        getmessagesUrl: data.url || '',
        webInfo: data.info || null
      })
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

  }
})
