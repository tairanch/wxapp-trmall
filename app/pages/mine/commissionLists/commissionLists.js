// pages/mine/commissionLists/commissionLists.js
const app = getApp()
import AppService from '../../../AppService/index';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentServerDate: '', //当前服务器时间
        dataList: [],
        selectedOptions: {}, // 顶部选项值
        currentPageIndex: '1', // 分页当前页码
        canLoadMore: true, // 是否能加载更多
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            selectedOptions: {
                currentDate: '',
                currentTypeObj: {
                    "type": "0",
                    "name": "全部"
                }
            }
        });

        wx.hideShareMenu();
        this._getUserCommissionList('', this.data.selectedOptions.currentTypeObj.type, this.data.currentPageIndex);
    },

    formatTime: function () {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;

        if (month < 10) {
            month = '0'+month;
        }

        return [year, month].join('-');
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

    // 获取佣金明细列表接口
    _getUserCommissionList: function (created_time, type, page) {
        let that = this;
        wx.showLoading({
            title: '加载中',
        });
        AppService.MineTask.getUserCommissionList(
            created_time,
            type,
            page,
            (result)=>{
                wx.hideLoading();
                if (result && result.code == 0) {
                    let list = result.data.data;

                    if (page == 1) {
                        let current_month = result.data.current_month;

                        that.setData({
                            currentServerDate:current_month
                        });
                    }

                    if (that.data.currentPageIndex == 1) {
                        // 如果是第一页
                        if (list && list.length > 0) {
                            // 加载第一页数据
                            that.setData({
                                dataList: that._mapDatas([], list),
                                canLoadMore: true
                            });
                            that.data.currentPageIndex = (Number(that.data.currentPageIndex) + 1).toString();
                        } else {
                            that.setData({
                                dataList:[],
                                canLoadMore: false
                            })
                        }
                    } else {
                        // 不是第一页
                        if (list && list.length > 0) {
                            // 加载更多数据
                            that.setData({
                                dataList: that._mapDatas(that.data.dataList, list),
                                canLoadMore: true
                            });
                            that.data.currentPageIndex = (Number(that.data.currentPageIndex) + 1).toString();
                        } else {
                            that.setData({
                                canLoadMore: false
                            })
                        }
                    }
                }
            }, (error)=>{
                wx.hideLoading();
            }
        )
    },

    // 数据匹配
    _mapDatas: function(oldArr = [], newArr = []) {

        newArr.forEach(function(oldData, i) {
            var index = -1;
            var alreadyExists = oldArr.some(function(newData, j) {

                if (oldData.created_at.substring(0, 7) === newData.created_at.substring(0, 7)) {
                    index = j;
                    return true;
                }
            });
            if (!alreadyExists) {
                oldArr.push({
                    created_at: oldData.created_at.substring(0, 7),
                    month_unPocket_settlement: oldData.month_unPocket_settlement,
                    month_Pocket_settlement: oldData.month_Pocket_settlement,
                    res: [oldData]
                });
            } else {
                oldArr[index].res.push(oldData);
            }
        });
        return oldArr;
    },

    // 点击佣金说明按钮，跳转佣金说明页面
    onTipsBtnClick: function () {
        wx.navigateTo({
            url: '/pages/mine/commissionExplain/commissionExplain',
        })
    },

    // 选择日期回调
    onSelectDateChange: function (e) {
        let currentDate = e.detail.currentDate;
        let currentTypeObj = e.detail.currentTypeObj;

        this.setData({
            selectedOptions: e.detail
        });

        this.data.currentPageIndex = '1';
        this._getUserCommissionList(currentDate, currentTypeObj.type, this.data.currentPageIndex)
    },

    // 选择加载类型回调
    onSelectDetailTypeChange: function (e) {
        let currentDate = e.detail.currentDate;
        let currentTypeObj = e.detail.currentTypeObj;

        this.setData({
            selectedOptions: e.detail
        });

        this.data.currentPageIndex = '1';
        this._getUserCommissionList(currentDate, currentTypeObj.type, this.data.currentPageIndex)
    },

    // 点击拷贝按钮
    copyBtnClick: function (e) {
        let order_id = e.currentTarget.dataset.order_id;
        wx.setClipboardData({
            data: order_id,
            success: function() {
                wx.showToast({
                    icon: 'none',
                    title: '内容已复制',
                })
            }
        })
    },

    // 点击cell
    onCellClick: function (e) {
        let selectedItem = e.currentTarget.dataset.selected_item;

        wx.navigateTo({
            url: '/pages/mine/marketingDetail/marketingDetail?relate_id='+selectedItem.relate_id,
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
        this._getUserCommissionList(this.data.selectedOptions.currentDate, this.data.selectedOptions.currentTypeObj.type, this.data.currentPageIndex)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
