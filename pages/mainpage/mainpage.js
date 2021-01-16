// miniprogram/pages/mainPage/mainPage.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		posterUrl: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		wx.getSystemInfo({
			success: (result) => {
				if(result.screenHeight>800){
					wx.reLaunch({
						url: '/pages/alertPage/alertPage'
					})
				}
				if (result.theme == 'light') {
					this.setData({
						posterUrl: '/images/tatueHarmonyDay.png'
					})
				} else {
					this.setData({
						posterUrl: '/images/tatueHarmonyNight.png'
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
					posterUrl: '/images/tatueHarmonyDay.png'
				})
			} else {
				this.setData({
					posterUrl: '/images/tatueHarmonyNight.png'
				})
			}
		})
	},
})
