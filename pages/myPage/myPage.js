// miniprogram/pages/myPage/myPage.js
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		logged: false,
		resId: '',
		isSignIn: false,
		daysColor: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function () {
		const dbselect = wx.cloud.database()
		dbselect.collection('signin').where({
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

	onSignIn() { //签到，其中getMonth()方法返回值范围是0-11
		wx.showLoading({
			title: '正在签到',
			mask: true
		})
		var date = new Date()
		const dbselect = wx.cloud.database()
		const dbinsert = wx.cloud.database()

		if (!this.data.isSignIn) { //如果此次会话中没签过到
			/**
			 * 此分支选项可优化云数据库的调取
			 * 减少云数据库调取次数
			 * 将闲得蛋疼的点签到没完的用户的操作全部放在本地进行
			 */
			dbselect.collection('signin').where({
				_openid: app.openid,
				signInYear: date.getFullYear(),
				signInMonth: date.getMonth() + 1,
				signInDay: date.getDate()
			}).get({
				success: res => {
					if (!res.data.length) { //如果当天没有记录
						dbinsert.collection('signin').add({
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
								// 在返回结果中会包含新创建的记录的 _id
								this.setData({
									resId: res._id,
								})
								wx.hideLoading()
								wx.showToast({
									title: '签到成功'
								})
								console.log('签到成功，记录 _id:', res._id)
							},
							fail: err => {
								wx.hideLoading()
								wx.showToast({
									icon: 'none',
									title: '签到失败'
								})
								console.error('[数据库] [新增记录] 失败:', err)
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
						isSignIn: true
					})
				},
				fail: err => {
					wx.hideLoading()
					wx.showToast({
						icon: 'none',
						title: '网络错误，请稍后再试'
					})
					console.error('[数据库] [新增记录] 失败：', err)
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
			isSignIn: false
		})
	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {
		this.setData({
			isSignIn: false
		})
	}
})
