// 因为生成二维码的接口，scene的长度最长为32个字符
// 所以需要建立key与页面的对应关系表
const keyToPage = {
  'hotshare': '/pages/wxpage/wxpage'
}

/**
 * 生成分享中转页需要的格式
 * @param pageKey: String  跳转的页面key or 页面地址
 * @param pageData: Array  页面地址传参
 * @returns {string}
 */
const getSchemaScene = (pageKey, pageData) => {
  if(!pageKey) {
    return '';
  }
  let scene = pageKey
  if(keyToPage[pageKey]) {
    if(pageData && Array.isArray(pageData)) {
      for(let data of pageData) {
        scene += `,${data}`
      }
    }
  } else {
    // 如果没有找到key对应的page, 则说明直接传递了page地址
    if(pageKey.charAt(0) != '/' ) { // path 需要为相对路径
      scene = `/${pageKey}`
    }
  }
  if(scene.length > 32) {
    console.error(`${scene}长度过长(Error from schemaPage/schemaUtils.js)`)
  } else {
    return scene
  }
}



module.exports = {
  keyToPage,
  getSchemaScene

}