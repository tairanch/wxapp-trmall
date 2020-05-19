/**
 * Created by mengai on 2019/5/10.
 *
 * 个人中心 - 相关接口
 */


import AppRequest, { paramsHandle } from './AppRequest';
import { trxcxPath, user_center_host } from './AppConfig';


export default class MineTask {

    /**
     * 【用户中心接口，使用`ucenter.trc.com`域名】
     *
     * 获取用户基本信息
     */
    static getUserInfo(needPhone, successCallBack, failureCallBack, completeCallBack) {

        let url = `${user_center_host}/foundation-user/user`;

        wx.request({
            url: url,
            data: { needPhone: needPhone },
            method: 'GET',
            header: { 'Authorization': "Bearer " + getApp().globalData.globtoken },
            success: function (result) {
                if (result && result.statusCode == 200) {
                    let data = result.data;
                    if (data && data.code == 200) {
                        successCallBack && successCallBack(data.body);
                        return;
                    }
                }
                failureCallBack && failureCallBack(result.data)
            },
            fail: function (error) {
                failureCallBack && failureCallBack(error)
            },
            complete: function (resp) {
                completeCallBack && completeCallBack(resp)
            }
        });
    };

    /**
     * 获取佣金明细列表接口
     */
    static getUserCommissionList(created_time, type, page, successCallBack, failureCallBack, completeCallBack) {

        let url = `${trxcxPath}/commission/getUserCommissionList`;
        let params = {
            created_time,
            type,
            page
        };
        AppRequest.getRequest(
            url,
            params,
            (result) => {
                successCallBack && successCallBack(result);
            },
            (error) => {
                failureCallBack && failureCallBack(error);
            },
            (res) => {
                completeCallBack && completeCallBack(res);
            }
        );
    };


}