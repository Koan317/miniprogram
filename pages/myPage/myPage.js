// miniprogram/pages/myPage/myPage.js
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		resId: '',
		isLogin: false,
		daysColor: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {//极点日历
		const dbSelect = wx.cloud.database()
		dbSelect.collection('login').where({
			_openid: app.openid,
		}).get({
			success: res => {
				var dataLength = res.data.length
				var dayData = res.data
				var dateMap = []
				for (let i = 0; i < dataLength; i++) {
					var newDate = {
						//year: dayData[i].signInYear,
						month: 'current',
						day: dayData[i].signInDay,
						color: 'white',
						background: '#AAD4F5'
					}
					dateMap[i] = newDate
				}
				this.setData({
					daysColor: dateMap
				})
			},
			fail: err => {

			}
		})
	},

	onLogin() { //签到，其中getMonth()方法返回值范围是0-11
		wx.showLoading({
			title: '正在签到',
			mask: true
		})
		var date = new Date()
		const dbSelect = wx.cloud.database()
		const dbInsert = wx.cloud.database()

		if (!this.data.isSignIn) { //如果此次会话中没签过到
			/**
			 * 此分支选项可优化云数据库的调取
			 * 减少云数据库调取次数
			 * 将闲得蛋疼的点签到没完的用户的操作全部放在本地进行
			 */
			dbSelect.collection('login').where({
				_openid: app.openid,
				signInYear: date.getFullYear(),
				signInMonth: date.getMonth() + 1,
				signInDay: date.getDate()
			}).get({
				success: res => {
					if (!res.data.length) { //如果当天没有记录
						dbInsert.collection('login').add({
							data: {
								openId: app.openid,
								signInYear: date.getFullYear(),
								signInMonth: date.getMonth() + 1,
								signInDay: date.getDate(),
								signInHour: date.getHours(),
								signInMin: date.getMinutes(),
								signInSec: date.getSeconds()
							},
							success: res => {
								wx.hideLoading()
								wx.showToast({
									title: '签到成功'
								})
							},
							fail: err => {
								wx.hideLoading()
								wx.showToast({
									icon: 'none',
									title: '签到失败'
								})
								console.error('[login] [新增记录] 失败：', err)
							}
						})
					} else { //如果当天有记录
						wx.hideLoading()
						wx.showToast({
							title: '今日已签到',
							icon: 'none'
						})
					}
					this.setData({
						isLogin: true
					})
				},
				fail: err => {
					wx.hideLoading()
					wx.showToast({
						icon: 'none',
						title: '网络错误，请稍后再试'
					})
					console.error('[login] [查询记录] 失败：', err)
				}
			})
		} else { //如果此次会话中已经签过到
			wx.hideLoading()
			wx.showToast({
				title: '今日已签到',
				icon: 'none'
			})
		}
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {
		this.setData({
			isLogin: false
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.setData({
			isLogin: false
		})
	}
})
