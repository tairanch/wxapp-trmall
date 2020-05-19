// pages/mine/verifyOK/verifyOK.js

import AppService from '../../../AppService/index';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        nameText:'',
        cardIdText:'',
        haveVerifyInfo: false,
        id_card_info: null, // 上个页面传过来编辑的身份证信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.hideShareMenu();

        this._getUserIdCardInfo();
    },

    // 获取用户实名状态
    _getUserIdCardInfo: function() {
        let that = this;
        AppService.OtherTask.getUserIdCardInfo(
            null,
            (result) => {
                if (result.hasOwnProperty('data') && result.data && result.data.hasOwnProperty('has_certify_info')) {
                    let rst = result.data.has_certify_info;
                    if (rst) {
                        // 已经实名认证
                        let id_info = result.data.id_card_info;

                        that.setData({
                            haveVerifyInfo: true, // 有实名信息
                            id_card_info: id_info,
                            nameText: id_info.name,
                            cardIdText: id_info.id_number,
                        });
                    } else {
                        // 未实名认证
                        that.setData({
                            haveVerifyInfo: false,   // 没有实名信息
                        })
                    }
                }
            }, (error) => {

            }
        )
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})