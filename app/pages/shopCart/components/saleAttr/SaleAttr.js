// pages/shopCart/components/saleAttr/SaleAttr.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    img: {
      type: String,
      observer: function (newVal, oldVal, changedPath) {
        this.initData()
      }
    },
    data: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        this.initData()
      }
    },
    cart_id: {
      type: Number
    },
    select: {
      type: Object,
      observer: function (newVal, oldVal, changedPath) {
        this.initData()
      }
    },
    sku_id: {
      type: String,
      observer: function (newVal, oldVal, changedPath) {
        this.initData()
      }
    }
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      this.initData()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    image: '',
    price: '',
    skus: '',
    specs:'',
    allAttr: '',
    selectedSpecs: {},
    attrItemList: [],  //属性列表
    selectSaleAttr: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSure() {
      this.setData({
        show: false
      }, () => {
        this.triggerEvent('close')
      });
    },
    submitSku() {
      let { data, cart_id } = this.properties
      let { selectedSpecs } = this.data
      let _data = JSON.parse(JSON.stringify(data))
      let { skus } = _data
      let sku_id = ''
      let isempty = false
      skus.every((s) => {
        let isSku = true
        let originSkusArr = s['select_spec_id'].split("_");
        for(const key in selectedSpecs) {
          const v = selectedSpecs[key];
          if (!v && v !== 0 && v !== '0') {
            isempty = true;
            break;
          } else {
            if (originSkusArr.indexOf(("" + v)) == -1) {
              isSku = false;
            }
          }
        }
        if (isempty) {
          return false
        }
        if (isSku) {
          sku_id = s.sku_id
        }
        return true
      })
      if (isempty) {
        wx.showToast({
          title: '请选择完整',
          icon: 'none'
        })
      } else {
        this.triggerEvent('replaceSku', {
          cart_id,
          sku_id
        })
      }
    },
    initData() { // 初始化数据
      const specs = this.properties.data && this.properties.data.specs ? this.properties.data.specs : null
      const { select } = this.properties
      let selectedSpecs = {}
      specs.map((sp) => {
        let { spec_id } = sp
        selectedSpecs[spec_id] = select[spec_id] !== undefined ? select[spec_id] : ""
      })
      this.setData({
        selectedSpecs
      }, () => {
        this.updateView(selectedSpecs)
      })
    },
    updateView(selectedSpecs) {  // 更新数据
      let { data, img } = this.properties
      let allAttr = []
      let _data = JSON.parse(JSON.stringify(data))
      let { skus, specs } = _data
      let selectSaleAttr = []
      let price = ""
      if (skus) {
        skus.map((s) => {
          const { select_spec_id, store } = s
          if (select_spec_id && store > 0) {
            allAttr.push(select_spec_id.split('_'))
          }
          let _select_spec_id = s['select_spec_id'].split("_");
          let getPrice = true;

          for(const key in selectedSpecs) {
            const v = selectedSpecs[key];
            if (_select_spec_id.indexOf(("" + v)) <= -1) {
              getPrice = false
            }
          }

          if (getPrice) {
            price = s['price']
          }
        })
      }
      specs.map((sp) => {
        let { values, spec_id } = sp
        values.map((v) => {
          if (v.spec_value_id == selectedSpecs[spec_id]) {
            selectSaleAttr.push(v.text)
            if (v.image) {
              img = v.image
            }
          }
        })
      })
      let attrItemList = specs
      this.setData({
        show: true,
        image: img,
        skus,
        specs,
        allAttr,
        price,
        selectSaleAttr,
        attrItemList
      })
    },
    selectSingleAttr(event) {
      const detail = event.detail
      const { spec_id, spec_value_id, is_selected } = detail
      const { selectedSpecs } = this.data
      selectedSpecs[spec_id] = is_selected ? "" : spec_value_id
      this.setData({
        selectedSpecs
      }, () => {
        this.updateView(selectedSpecs)
      })
    },
    attrSelect(event) { //选择属性
      let detail = event.detail
      this.triggerEvent('saleAttrSelect', detail)
    }
  }
})
