// 购物袋相关的工具函数

/**
 * 返回点击增加按钮后的商品数量
 * @param minimumQuantityRule 商品数量规则
 * @param quantity            当前商品数量
 */
function getNextPlusQuantity (minimumQuantityRule = null, quantity) {
  let _quantity = +quantity
  let nextPlusQuantity = _quantity + 1
  if (minimumQuantityRule) {
    let { type, amount } = minimumQuantityRule;
    amount = +amount
    if (type == 10) {              // 最小数量
      if (_quantity < amount)  {     // 当前数量比最小起订量小
        nextPlusQuantity = amount;
      }
    }
    if (type == 20) {              // 最小包装
      const remainder =  _quantity % amount;
      if (remainder === 0) {        // 当前数量是amount的倍数
        nextPlusQuantity = _quantity + amount;
      } else {                      // 当前数量不是amount的倍数，则设置成最近的最大倍数
        nextPlusQuantity = Math.ceil(_quantity / amount) * amount;
      }
    }
  }
  return nextPlusQuantity
}
exports.getNextPlusQuantity = getNextPlusQuantity