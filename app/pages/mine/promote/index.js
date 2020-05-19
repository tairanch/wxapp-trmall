// pages/mine/mine/index.js
var common = require('../../../utils/common.js');
const app = getApp();

import AppService from '../../../AppService/index';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardList: [],
        // 获取用户基本统计数据
        assetInfo:{},
        nickName:'',
        avatar:'',
        haveVerifyInfo: true, // 是否有认证信息， 有： 显示编辑； 无： 显示去认证
        showModelView: false, // 是否显示实名认证蒙层
        id_card_info: null, // 已经实名认证的信息
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.hideShareMenu();
    },

    onShow: function() {

        this._getUserInfo();

        // 获取用户实名状态
        this._getUserIdCardInfo();

        // 获取用户基本统计数据
        this._getUserCommissionBasicStaticsData();
    },

    // 获取用户信息
    _getUserInfo: function () {

        AppService.MineTask.getUserInfo(
            true,
            (result) => {

                let nickName = '';
                let avatar = '';

                if (result.nickname && result.nickname.length > 0) {
                    nickName = result.nickname;
                } else if (result.phone && result.phone.length > 0){
                    nickName = result.phone;
                } else {
                    nickName = app.globalData.userInfo.nickName;
                }


                if (result.avatar && result.avatar.length > 0) {
                    avatar = result.avatar;
                } else {
                    avatar = app.globalData.userInfo.avatarUrl;
                }


                this.setData({
                    nickName: nickName,
                    avatar: avatar
                })

            }, (error) => {

            }
        );
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
                        that.setData({
                            showModelView: false, // 不显示弹框
                            haveVerifyInfo: true, // 有实名信息
                        });

                        // 已经实名认证，可以修改
                        that.data.id_card_info = result.data.id_card_info;
                    } else {
                        // 未实名认证
                        that.setData({
                            showModelView: true,     // 显示弹框
                            haveVerifyInfo: false,   // 没有实名信息
                        })
                    }
                }
            }, (error) => {

            }
        )
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function onShareAppMessage(options) {

        let that = this;
        let info = options.target.dataset;

        if (options.from === 'button') {
            // 来自页面内转发按钮
        }

        let share_title = `您好，我是泰然城的${info.professional} ${info.name}。请收下我的名片`;
        let image_url = info.shareimage;
        let paths = `pages/myCard/myCard?scene=${info.cardid}`;
        return {
            title: share_title,
            path: paths,
            imageUrl: image_url?image_url:'',
            success: function success(res) {
            },
            fail: function fail(res) {
            }
        };
    },

    // 获取用户基本统计数据
    _getUserCommissionBasicStaticsData:function() {

        let that = this;
        AppService.NameCardTask.getUserCommissionBasicStaticsData(
            (result)=>{
                if (result && result.code == 0) {
                    let _data = result.data;
                    that.setData({
                        assetInfo: _data
                    });
                }
            }, (error)=>{

            }
        );
    },

    // 点击关闭蒙层按钮
    closeBtnClick: function () {
        this.setData({
            showModelView:false
        })
    },

    // 佣金明细
    currentMonthTotalBtnClick: function(e) {

        let income = e.currentTarget.dataset.income;

        if ((!income || income <= 0) && !this.data.haveVerifyInfo) {
            // 如果没有实名认证，且有余额，就弹实名认证框
            this.setData({
                showModelView: true
            });
            return;
        }

        wx.navigateTo({
            url: '/pages/mine/commissionLists/commissionLists',
        })
    },

    // 提现
    cashOutBtnClick: function () {
        wx.navigateTo({
            url: '/pages/mine/balance/balance',
        })
    },

    // 去认证
    gotoAuthBtnClick: function () {
        wx.navigateTo({
            url: '/pages/mine/verifyName/verifyName',
        })
    },

    // 去查看
    gotoLookBtnClick: function () {

        let params = this.data.id_card_info ? JSON.stringify(this.data.id_card_info) : null;

        let url = '/pages/mine/verifyOK/verifyOK';

        if (params) {

            params = encodeURIComponent(params);

            url = url + '?id_card_info=' + params;
        }
        wx.navigateTo({
            url: url,
        })
    },

    // 我的客户
    myClientBtnClick: function (e) {
        let btnType = e.currentTarget.dataset.btntype;

        let totalObj = {
            invite_total: this.data.assetInfo.invite_total,
            order_total: this.data.assetInfo.order_total,
        };
        totalObj = JSON.stringify(totalObj);

        wx.navigateTo({
            url: '/pages/mine/myClients/myClients?btnType='+btnType+'&totalObj='+totalObj,
        })
    },

    // 热门分享
    hotShareBtnClick: function () {
        wx.navigateTo({
            url: "/pages/mine/popularShare/popularShare",
        })
    },

    // 分享
    onShareTap: function() {

    },

    /**
    *跳转到热门分享列表
    */
    turnPopular: function () {
      wx.navigateTo({
        url: '/pages/mine/popularShare/popularShare'
      })
    }

});
