// miniprogram/pages/big5duty/big5duty.js
const app=getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '',//用户ID
		question: [],//题目
		questionLen:0,//问题个数
		result:[],//测试结果
		resultid:''//结果ID
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (app.globalData.openid) {
			this.setData({
				openid: app.globalData.openid
			})
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		const db = wx.cloud.database()
		// 查询当前用户所有的 counters
		db.collection('big5duty').doc('qA2Namne2pJkUS2YQFjRNV6kPvQr9LbenOfqzlkr3qaepWMA').get({
			success: res => {
				this.setData({
					//question: JSON.stringify(res.data.Quiz, null, 2)
					question:res.data.Quiz,
					questionLen:res.data.Quiz.length
				})
				console.log('[数据库] [查询记录] 成功: ', res.data._id)
			},
			fail: err => {
				console.error('[数据库] [查询记录] 失败：', err)
			}
		})
	},

	onSubmit: function(e){
		var questionLen = e.detail.value.questionLen
		var radioList=e.detail.value
		for(var i=0;i<questionLen;i++){
			console.log(radioList.anwser1)
			if(radioList[i]==""){
				wx.showToast({
					title: '请完成测试再提交',
				})
				return false
			}
		}
		const db = wx.cloud.database()
		db.collection('big5results').add({
			data: {
				openId:app.openid,
				result:e.detail.value
			},
			success: res => {
				// 在返回结果中会包含新创建的记录的 _id
				this.setData({
					result:[],
					resultid:res._id
				})
				wx.showToast({
					title: '提交成功'
				})
				console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
			},
			fail: err => {
				wx.showToast({
					icon: 'none',
					title: '提交失败'
				})
				console.error('[数据库] [新增记录] 失败：', err)
			}
		})
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