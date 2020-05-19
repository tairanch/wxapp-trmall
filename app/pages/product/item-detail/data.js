let groupSellPrice = '';  // 拼团价格

function changeGroupSellPrice(price, item_type) {
  if(item_type === 'GroupBuy') {
    groupSellPrice = price
  } else {
    groupSellPrice = ''
  }

}

export {
  groupSellPrice,
  changeGroupSellPrice
}