// miniprogram/pages/big5duty/big5duty.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		openid: '', //用户ID
		question: [], //题目
		questionLen: 0, //问题个数
		result: [], //测试结果
		resultid: '', //结果ID
		score:0//最后得分
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (_options) {
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
					question: res.data.Quiz,
					questionLen: res.data.Quiz.length
				})
				console.log('[数据库] [查询记录] 成功: ', res.data._id)
			},
			fail: err => {
				console.error('[数据库] [查询记录] 失败：', err)
			}
		})
	},

	onSubmit: function (e) {
		var resultjson=e.detail.value
		var radiolist = new Map()//Map
		for (let i of Object.keys(resultjson)) {
			radiolist.set(i, parseInt(resultjson[i]))
		}
		//console.log('radiolist:',radiolist)
		var big5score = 0
		var reversept = new Array(12).fill(0)
		reversept[2] = reversept[5] = reversept[8] = reversept[10] = 1
		for (let i=0;i<12;i++) {//记分
			if (reversept[i] == 1) {
				big5score += (-(radiolist.get(String(i + 1)) - 6))
			} else {
				big5score += radiolist.get(String(i + 1))
			}
		}
		const db = wx.cloud.database()
		wx.showLoading({
			title: '提交中',
			mask:true
		})
		db.collection('big5results').add({
			data: {
				openId: app.openid,
				big5score: big5score,
				result: e.detail.value
			},
			success: res => {
				// 在返回结果中会包含新创建的记录的 _id
				this.setData({
					result: [],
					resultid: res._id,
					score:big5score
				})
				wx.hideLoading()
				wx.showToast({
					title: '得分'+big5score+'分',
					duration:2000,
					success:function(){setTimeout(() => {
						wx.navigateBack({
							delta:1
						})
					}, 2000);}
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