// miniprogram/pages/mainpage/mainpage.js
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
				if (result.theme == 'light') {
					this.setData({
						posterurl: '../../images/haibao_day.png'
					})
				} else {
					this.setData({
						posterurl: '../../images/haibao_night.png'
					})
				}
			},
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		wx.onThemeChange((result) => {
			if (result.theme == 'light') {
				this.setData({
					posterurl: '../../images/haibao_day.jpg'
				})
			} else {
				this.setData({
					posterurl: '../../images/haibao_night.jpg'
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})