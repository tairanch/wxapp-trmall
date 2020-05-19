/**
 * app的常量配置文件
 * Created by 焦亚 on 2019/4/12.
 */


const app = getApp();

// 每个小程序独有的appId (微信后台生成)
export const wxAppId = 'wx7fab1b5cbd37a27c';


// 登录的目标应用的appId (用户中心接口使用此id，此id并非微信appId)
export const baseAppId = 'uc6c7f06e54ac77f87';


// ------------------接口域名------------------

// 名片小程序域名
export const trxcxPath = app.globalData.ctxPath;

// 名片小程序host
export const trxcxHost = app.globalData.ctxHost;

// 用户中心域名
export const user_center_host = app.globalData.UCUrl;

// 小程序支付域名
export const ctxPathPay = app.globalData.ctxPathPay;

// 商城域名
export const tairanmall = 'https://api-m.tairanmall.com';


//------------------网络请求header相关配置------------------

// X-Channel
export const x_channel = "TrMall";

// X-Platform-From
export const x_platform_from = "TrMall";

// X-Platform-Type
export const x_platform_type = "TRXCX";

// X-Device-Info
export const x_device_info = "UserAgent";



//------------------缓存相关配置------------------

// 本地token缓存key
export const app_token_storage_key = 'trcmalltoken';


//------------------dcp相关配置------------------

// 渠道码
// export const dcp_channelCode = 've3dC41i';

// 安全访问的凭证
export const dec_auth = '93c55350e179a3676c905723e112b440';

// 发短信服务id【线上环境】
export const message_serveId = 'CS_cWaOV8wj';

// 发短信服务id【测试环境】// TODO 上线前要改为线上环境
// export const message_serveId = 'CS_XJsBNhTu';








