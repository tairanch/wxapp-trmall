// 商品相关
const { RequestPromise } = require('../../utils/RequestHelper.js');

/**
 * 获取商品营销相关信息
 * @param itemId
 * @returns {Promise<any>|*}
 */
const getCommissionDetail = (item_id) => {
  return RequestPromise({
    method: 'GET',
    url: '/item/commissionDetail',
    params: {
      item_id
    }
  })
}


module.exports = {
  getCommissionDetail
}
