// miniprogram/pages/alertPage/alertPage.js
Page({
	data: {
		flag404: false
	},

	onLoad: function (option) {
		if (option.flag == '404') {
			this.setData({
				flag404: true
			})
		}
	}
})
