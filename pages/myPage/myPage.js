// miniprogram/pages/myPage/myPage.js
const app=getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
		logged: false,
		resId:'',
		isSignIn:false
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

	onSignIn(){
		var date=new Date()
		//var isSignIn
		const db = wx.cloud.database()

		db.collection('signin').where({
			signInDate:date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(),
			_openid:app.openid
		}).get({
			success:signHistory=>{
				if(signHistory.data.length){
					console.log('今日已签到')
					wx.showToast({
						title: '今日已签到'
					})
					this.setData({
						isSignIn:true
					})
				}
			}
		})
		console.log(this.data.isSignIn)
		if(!this.data.isSignIn){
			db.collection('signin').add({
				data: {
					openId:app.openid,
					signInDate:date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(),
					signInTime:date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
				},
				success: signInres => {
					// 在返回结果中会包含新创建的记录的 _id
					this.setData({
						resId:signInres._id,
					})
					wx.showToast({
						title: '签到成功'
					})
					console.log('签到成功，记录 _id: ', signInres._id)
				},
				fail: err => {
					wx.showToast({
						icon: 'none',
						title: '签到失败'
					})
					console.error('[数据库] [新增记录] 失败：', err)
				}
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