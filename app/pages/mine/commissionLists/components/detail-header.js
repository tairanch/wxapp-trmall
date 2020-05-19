// pages/mine/commissionLists/components/detail-header.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        currentMouth: {
            type: String,
            value:'',
            observer: function (newVal, oldVal, changedPath) {
                this.setData({
                    dateMax:newVal,
                    defaultDateStr: newVal,
                })
            }
        },
        defaultDetailType: {
            type: String,
            value: '0',
            observer: function (newVal, oldVal, changedPath) {

                let curObj = null;
                for (let i=0; i < this.data.detailTypeArr.length; i++) {
                    let typeItem = this.data.detailTypeArr[i];
                    if (typeItem.type == newVal) {
                        curObj = typeItem
                        break
                    }
                }

                this.setData({
                    currentTypeObject: curObj
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        is_date_alert_show: false,
        is_type_alert_show: false,
        defaultDateStr:'',
        dateStr: '选择日期',
        dateMax:'2022-12',
        currentTypeObject: {
            type: '0',
            name: '全部'
        },
        detailTypeArr: [
            {
                type: '0',
                name: '全部'
            },
            {
                type: '1',
                name: '待入账'
            },
            {
                type: '2',
                name: '已入账'
            },
            {
                type: '3',
                name: '取消入账'
            }
        ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

        selectDateBtnClick: function () {
            this._showDateOpposite();
        },

        selectTypeBtnClick: function () {
            this._showDetailTypeOpposite();
        },

        tipsBtnClick: function () {
            // 佣金说明
            // 点击跳转佣金说明页面
            this.triggerEvent('tipsBtnClick');
        },

        // 日期选择器
        bindDateChange: function (e) {
            let date = e.detail.value;

            this.setData({
                defaultDateStr: date,
                dateStr: date
            });
            this._showDateOpposite();

            // 向父页面传递日期参数
            let myEventDetail = {
                currentDate: date,
                currentTypeObj: this.data.currentTypeObject
            };
            this.triggerEvent('selectDateChange', myEventDetail);
        },

        // 详情类型选择器
        bindDetailTypeChange: function (e) {
            let detailIndex = e.detail.value;

            let selectedTypeItem = this.data.detailTypeArr[detailIndex];

            this.setData({
                currentTypeObject: selectedTypeItem
            });
            this._showDetailTypeOpposite();

            // 向父页面传递日期参数
            let myEventDetail = {
                currentDate: this.data.dateStr == "选择日期" ? "" : this.data.dateStr,
                currentTypeObj: selectedTypeItem
            };
            this.triggerEvent('selectDetailTypeChange', myEventDetail);

        },

        // 日期取消选择
        bindDateCancel: function () {
            this._showDateOpposite();
        },

        // 类型取消选择
        bindDetailTypeCancel: function () {
            this._showDetailTypeOpposite();
        },


        // 对日期picker隐藏or显示取反
        _showDateOpposite: function () {
            this.setData({
                is_date_alert_show: !this.data.is_date_alert_show
            })
        },

        // 对类型picker隐藏or显示取反
        _showDetailTypeOpposite: function () {
            this.setData({
                is_type_alert_show: !this.data.is_type_alert_show
            })
        }

    }
})
