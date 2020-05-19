// pages/pay/pay.js
//获取应用实例
var payApi = require('../../utils/payApi.js');
const { clearInviterInfo } = require('../../utils/vip.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payId: '', // 支付订单ID
    orgId: '', // 机构ID
    successUrl: '', // success跳转地址
    errorUrl: '', // closed跳转地址
    orderDetail: {}, // 订单详情
    wechatPlatform: '',
    backUrl: '', //返回地址
    flag: false, //是否点击支付完成
    toFlag: true //是否因状态判断发生跳转
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 为了下次可以返回，将 shouldPayRedirect 设置为true
    getApp().globalData.shouldPayRedirect = true
    this.setData({
      payId: options.payId,
      orgId: options.orgId,
      successUrl: options.successUrl,
      errorUrl: options.errorUrl,
      wechatPlatform: options.wechatPlatform,
      backUrl: options.backUrl
    })
    // 请求获取订单信息
    // this.getOrderDetail(options)
  },

  onShow: function() {
    // console.log('show',this.data.flag)
    // 初始化
    this.setData({
      toFlag: true
    })
    // 请求获取订单信息
    this.getOrderDetail({
      orgId: this.data.orgId,
      orderId: this.data.payId
    })
  },
  onHide: function() {
    // 唯有发生点击支付完成的隐藏,下一次因状态判断不发生跳转
    if (this.data.flag) {
      this.setData({
        toFlag: false
      })
    }
    // console.log('hide',this.data.toFlag)
  },
  /**
   * 返回上一个页面触发onUnload,添加判断条件，订单不支持E卡支付或者处于混合支付过程中
   */
  onUnload: function() {
    let paymentRoutings = this.data.orderDetail.paymentRoutings
    let flag = false;
    paymentRoutings.map(channel => {
      if (channel.instId == 'ecard') {
        flag = true
      }
    })

    if ((!flag && this.data.orderDetail.lastPayAmount) || (flag && this.data.orderDetail.lastPayAmount && this.data.orderDetail.lastPayAmount != this.data.orderDetail.order.orderAmount)) {
      if(getApp().globalData.shouldPayRedirect){
            wx.redirectTo({ //关闭当前页面，跳转到应用内的某个页面，缺点：会闪烁一下小程序空白页
                url: '../wxpage/wxpage?type=payresult&url=' + this.data.backUrl
            })
        }
    }

    // 为了下次可以返回，将 shouldPayRedirect 重置为true
    getApp().globalData.shouldPayRedirect = true
  },

  /**
   * 获取订单信息
   */
  getOrderDetail: function(params) {
    let _this = this
    payApi.getOrderDetailData(params, function(data) {
      if (data.code == '200') {
        if (data.body.order.orderStatus == 2) {
          // console.log('自动完成',_this.data.toFlag)
          if (_this.data.toFlag) {
            _this.navigateToRes(_this.data.successUrl)
          }
        } else if (data.body.order.orderStatus == 3 || data.body.order.orderStatus == 4) {
          _this.navigateToRes(_this.data.errorUrl)
        }
        // 设置data
        _this.setData({
          orderDetail: data.body
        })
      } else {
        wx.showToast({
          title: data.message,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 点击确认支付
   */
  payBtnClick: function() {
    let params = {
      orgOrderId: this.data.orderDetail.order.orgOrderId,
      orgId: this.data.orgId,
      tradeChannel: 'wxpay',
      payType: 'MINA',
      ucWechatPlatform: this.data.wechatPlatform,
      minaAppId: "wx7fab1b5cbd37a27c"
    }
    let _this = this
    payApi.getGateWayPay(params,
      // success
      function(res) {
        _this.setData({
          flag: true
        })
        clearInviterInfo();
        // console.log('手动完成', _this.data.flag)
        _this.navigateToRes(_this.data.successUrl) // 跳转成功页面
      },
      // fail
      function (res) {
        // _this.navigateToRes(_this.data.errorUrl) // 跳转失败页面
      },
      // complete
      function (res) {

      }
    )
  },

  /**
   * 跳转页面
   */
  navigateToRes: function (url) {
    if(url === 'wxappVipResult') {  // 跳转到vip开通成功页面
      getApp().globalData.shouldPayRedirect = false; // 不执行onUnload
      wx.redirectTo({
        url: '/pages/vipResult/vipResult'
      })
    } else {
      wx.navigateTo({
        url: '../wxpage/wxpage?type=payresult&url=' + url
      })
    }
  }
})
