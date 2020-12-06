// miniprogram/pages/scanNaviPage/scanNaviPage.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		url: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			url: '/pages/' + options.type + '/' + options.type
		})
	},

	onScan() {
		wx.scanCode({
			onlyFromCamera: false,
			scanType: 'qrCode',
			success: res => {
				if ((/Type:[a-zA-Z0-9]+;Score:[1-7]+/).test(res.result)) {
					var qrCodeStr = res.result.split(';')
					var type = qrCodeStr[0].substring(5)
					var score = qrCodeStr[1].substring(6)
					wx.navigateTo({
						url: '/pages/' + type + '/' + type + '?score=' + score
					})
				} else {
					wx.showToast({
						title: '当前二维码不属于獭兔业务',
						icon: 'none'
					})
				}
			},
			fail: res => {
				wx.showToast({
					title: '扫描失败',
					icon: 'none'
				})
			}
		})
	}
})
