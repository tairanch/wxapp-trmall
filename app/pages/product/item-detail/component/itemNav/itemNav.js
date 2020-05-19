Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		navIndex:{
			type:Number,
			value:0
		},
        opacity:{
		    type:Number,
            value:0
        }
	},

	/**
	 * 组件的初始数据
	 */
	data: {
        nav:['商品','详情']
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
        navClickEvent({currentTarget:{dataset}}) {
			let _index = dataset.index  > 0 ? 1 : 0
			this.triggerEvent('navClickEvent', {index:_index})
		},
	}
})
