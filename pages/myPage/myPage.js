// miniprogram/pages/myPage/myPage.js
const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		avatarUrl: './user-unlogin.png',
		userInfo: {},
		logged: false,
		resId: '',
		isSignIn: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!wx.cloud) {
			wx.redirectTo({
				url: '../chooseLib/chooseLib',
			})
			return
		}

		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							this.setData({
								avatarUrl: res.userInfo.avatarUrl,
								userInfo: res.userInfo
							})
						}
					})
				}
			}
		})

		function v(e) {
			if (!this.data.logged && e.detail.userInfo) {
				this.setData({
					logged: true,
					avatarUrl: e.detail.userInfo.avatarUrl,
					userInfo: e.detail.userInfo
				})
			}
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

	onSignIn() {//签到，其中getMonth()方法返回值范围是0-11
		wx.showLoading({
			title: '正在签到',
			mask:true
		})
		var date = new Date()
		const dbselect = wx.cloud.database()
		const dbinsert = wx.cloud.database()

		if(!this.data.isSignIn){//如果此次会话中没签过到
			/*此分支选项可优化云数据库的调取
			**减少云数据库调取次数
			**将闲得蛋疼的点签到没完的用户的操作全部放在本地进行
			*/
			dbselect.collection('signin').where({
				_openid: app.openid,
				signInDate: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate()
			}).get({
				success: res => {
					if(!res.data.length){//如果当天没有记录
						dbinsert.collection('signin').add({
							data: {
								openId: app.openid,
								signInDate: date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate(),
								signInTime: date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
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
					}	else{//如果当天有记录
						wx.hideLoading()
						wx.showToast({
							title: '今日已签到',
							icon:'none'
						})
						console.log('今日已签到,记录 _id:', res._id)
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
		}else{//如果此次会话中已经签过到
			wx.hideLoading()
			wx.showToast({
				title: '今日已签到',
				icon:'none'
			})
		} 
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