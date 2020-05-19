var RequestManager = require('./RequestHelper.js');
const app = getApp();
const payUrl = app.globalData.ctxPathPay

// 获取订单详情信息
function getOrderDetailData(params, callback, failueBack) {
  RequestManager.RequestGet(payUrl + '/order/front/queryOrder/getDetailOrderInfo', params, function (res) {callback(res)}, function (err) {failueBack(err)})
}

// 获取网关信息支付-接口返回result.data
function getGateWayPay(params, successCallBack, failCallBack, completeCallBack) {
  RequestManager.RequestPost(payUrl + '/order/front/order/payOrder', params, function (data) {
    if(data.code=='200'){
      wx.showLoading({
        title: '加载中',
      })
      let wxpa = {
        ...data.body.data,
        success: function (res) { successCallBack(res) },
        fail: function (res) { failCallBack(res) },
        complete: function (res) { wx.hideLoading(); completeCallBack(res) }
      }

      wx.requestPayment(wxpa)
    }else{
      wx.showToast({ title: data.message, icon: 'none' })
    }

  }, function (res) {
    wx.showToast({ title: res.data.error.description || '服务端异常', icon: 'none'})
  }, false)
}

module.exports = {
  getOrderDetailData,
  getGateWayPay
}
