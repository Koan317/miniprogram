// miniprogram/pages/big5duty/big5duty_report/big5duty_report.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		score: 0,
		type: '',
		report: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			score: options.score,
			type: options.type
		})
		const db = wx.cloud.database() //读写云数据库

		switch (options.type) {
			/**
			 * ------------------------大五尽责------------------------
			 */
			case 'big5duty':
				if (options.score < 31) { //低分区间
					db.collection('big5').doc('e8d6c0cd5fc25ad60001d81003216a6e').get({
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
					db.collection('big5').doc('f22b28525fc25aea005cbc365b276816').get({
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
					db.collection('big5').doc('f22b28525fc25b4d005cbc387d38512a').get({
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
				break;
				/**
				 * ------------------------大五情绪------------------------
				 */
			case 'big5stability':
				if (options.score < 55) { //低分区间
					db.collection('big5').doc('b3a8af275fc26e82002fcc1d559f6ee6').get({
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
				} else if (options.score > 76) { //高分区间
					db.collection('big5').doc('b3a8af275fc26ef0002fcc234ec15066').get({
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
					db.collection('big5').doc('f22b28525fc26edd005cc02538d94bbe').get({
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
				break;
		}
	},
})
