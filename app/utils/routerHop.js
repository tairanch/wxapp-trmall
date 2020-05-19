// 路由跳转相关方法
const getBaseUrl = ({url, isTab, isMini, redirect_uri}) => {
  return `${url}?isTab=${isTab}&isMini=${isMini}&redirect_uri=${redirect_uri}`
}

/**
 * 跳转到登入页面 重定向
 * @param redirect_uri 回调路径
 * @param isMini       是否是小程序页面
 * @param isTab        是否是导航页面
 */
const redirectToLogin = ({redirect_uri, isMini=true, isTab=false}) => {
  const baseUrl = getBaseUrl({
    url: '/pages/login/login',
    isTab,
    isMini,
    redirect_uri,
  })
  wx.redirectTo({
    url: baseUrl
  })
}

/**
 * 跳转到登入页面 关闭所有页面
 * @param redirect_uri
 * @param isMini
 * @param isTab
 */
const reLaunchLogin = ({redirect_uri, isMini=true, isTab=false}) => {
  const baseUrl = getBaseUrl({
    url: '/pages/login/login',
    isTab,
    isMini,
    redirect_uri,
  })
  wx.reLaunch({
    url: baseUrl
  })
}

/**
 * 跳转到授权页面
 * @param redirect_uri 回调路径
 * @param isMini       是否是小程序页面
 * @param isTab        是否是导航页面
 * @param query        redirect_uri携带的参数（当页面是小程序页面时）
 */
const redirectToBeforelogin = ({redirect_uri, isMini=true, isTab=false, query=''}) => {
  const baseUrl = getBaseUrl({
    url: '/pages/beforelogin/index',
    isTab,
    isMini,
    redirect_uri,
  })
  wx.redirectTo({
    url: query ? `${baseUrl}&query=${query}` :baseUrl
  })
}


module.exports = {
  redirectToLogin,
  reLaunchLogin,
  redirectToBeforelogin
}

