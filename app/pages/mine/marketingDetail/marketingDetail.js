// pages/pa ge/page.js
const RequestManager = require('../../../utils/RequestHelper.js')
const app = getApp()
const ctxPath = app.globalData.ctxPath
const pageApi = {
    getShareBonusInfo: { url: `${ctxPath}/commission/getShareBonusInfo`, method: "RequestGet" }
}

Page({
    /**
     * 页面的初始数据
     */
    data: {
        spec_white:false,
        typeicon:'',
        copyimg:'/image/mine/copy.png',
        dcpTitle: '订单返利详情',
        copy_data_title: ['订单编号：', '创建时间：', '支付时间：', '确认收货时间：', '入账时间：','取消入账时间：'],
        copy_data_value:[],
        back_data_title:[],
        back_data_value:[],
        accounted_bonus:"",
        has_manual:false,     //是否调整佣金
        datainfo:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let _share_bonus_id = options.relate_id
        this.getShareBonusInfo(_share_bonus_id);
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

    getShareBonusInfo(share_bonus_id){ //佣金详情页接口
        let _this = this
        const api = pageApi.getShareBonusInfo
        RequestManager[api.method](api.url, {
            share_bonus_id: share_bonus_id
        }, (res) => {
            if (res.code === 0) {
                let _data = res.data
                let _copy_data_value = []
                _copy_data_value[0] = _data.order_info.order_shop_no || ""
                _copy_data_value[1] = _data.order_info.created_at || ""
                _copy_data_value[2] = _data.order_info.paid_at || ""
                _copy_data_value[3] = _data.order_info.received_at || ""
                _copy_data_value[4] = _data.order_info.pocket_at || ""
                _copy_data_value[5] = _data.order_info.cancel_at || ""

                let _back_data_value = []
                _back_data_value[0] = _data.bonus_info.evaluated_bonus || "" //预估佣金
                _back_data_value[1] = _data.bonus_info.refund_amount || ""   //退款
                _back_data_value[2] = _data.bonus_info.deduct_bonus || ""    //佣金扣除

                let _has_manual = _data.bonus_info.has_manual || false    //有没有人工调整
                let _has_refund = _data.bonus_info.has_refund || false    //有没有发生退款

                let _back_data_title = ['预估佣金','退款','佣金扣除']
                if (!_has_refund) {
                    // 未有退款 退款字段删除
                    _back_data_title.splice(1,2)
                    _back_data_value.splice(1,2)
                }

                if (_has_manual && !_has_refund) {
                    _back_data_title.push('佣金扣除')
                    _back_data_value.push(_data.bonus_info.deduct_bonus || "")
                }

                // 入账状态 icon
                let _typeicon = _data.order_info.order_status === '已入账' ?  '/image/mine/success.png' : (_data.order_info.order_status === '待入账' ? "/image/icon/waiting.png" : "/image/icon/false.png")
                let _spec_white = _data.order_info.order_status === '取消入账'

                let _accounted_bonus = _data.bonus_info.accounted_bonus || ""
                _this.setData({
                    datainfo:_data,
                    copy_data_value: _copy_data_value,
                    back_data_value: _back_data_value,
                    accounted_bonus: _accounted_bonus,
                    back_data_title: _back_data_title,
                    has_manual: _has_manual,
                    typeicon: _typeicon,
                    spec_white: _spec_white
                })
                
            }
        }, (err) => {

        })
    },
    copyText(e){
        let _value = e.currentTarget.dataset.value
        wx.setClipboardData({
            data: _value,
            success: function (res) {
                wx.showToast({
                    title: '内容已复制',
                    icon: 'none'
                })
            }
        })
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
