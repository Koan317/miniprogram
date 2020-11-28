// miniprogram/pages/big5duty/big5duty_report/big5duty_report.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		score: 0,
		report: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			score: options.score
		})
		const db = wx.cloud.database() //读写云数据库
		wx.showToast(options.score)
		if (options.score < 31) { //低分区间
			db.collection('big5duty').doc('915cc8ab5fc1254d0047985b70e8a591').get({
				success: res => {
					this.setData({
						report: res.data.Quiz
					})
					console.log('[数据库] [查询记录] 成功: ', res.data._id)
				},
				fail: err => {
					console.error('[数据库] [查询记录] 失败：', err)
				}
			})
		} else if (options.score > 40) { //高分区间
			db.collection('big5duty').doc('4fb129165fc1258f007569a8685a4e2a').get({
				success: res => {
					this.setData({
						report: res.data.Quiz
					})
					console.log('[数据库] [查询记录] 成功: ', res.data._id)
				},
				fail: err => {
					console.error('[数据库] [查询记录] 失败：', err)
				}
			})
		} else { //否则是中分区间
			db.collection('big5duty').doc('4fb129165fc1256d007569a7251976f2').get({
				success: res => {
					this.setData({
						report: res.data.Quiz
					})
					console.log('[数据库] [查询记录] 成功: ', res.data._id)
				},
				fail: err => {
					console.error('[数据库] [查询记录] 失败：', err)
				}
			})
		}
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