// miniprogram/pages/mainpage/mainpage.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		posterurl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.getSystemInfo({
			success: (result) => {
				if(result.screenHeight>800){
					wx.reLaunch({
						url: '/pages/alertPage/alertPage'
					})
				}
				if (result.theme == 'light') {
					this.setData({
						posterurl: '/images/haibao_day.png'
					})
				} else {
					this.setData({
						posterurl: '/images/haibao_night.png'
					})
				}
			},
		})
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.onThemeChange((result) => {
			if (result.theme == 'light') {
				this.setData({
					posterurl: '/images/haibao_day.png'
				})
			} else {
				this.setData({
					posterurl: '/images/haibao_night.png'
				})
			}
		})
	},
})
