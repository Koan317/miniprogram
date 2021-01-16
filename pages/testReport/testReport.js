// miniprogram/pages/testReport/testReport.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		scoreDis: true,
		score: 0,
		type: '',
		report: '',
		scoreList: '',
		nickName: ''
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
			case 'big5Duty':
				if (options.score < 31) { //低分区间
					db.collection('questions').doc('e8d6c0cd5fc25ad60001d81003216a6e').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				} else if (options.score > 40) { //高分区间
					db.collection('questions').doc('f22b28525fc25aea005cbc365b276816').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				} else { //否则是中分区间
					db.collection('questions').doc('f22b28525fc25b4d005cbc387d38512a').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				}
				break
			/**
			 * ------------------------大五情绪------------------------
			 */
			case 'big5Stability':
				if (options.score < 55) { //低分区间
					db.collection('questions').doc('b3a8af275fc26e82002fcc1d559f6ee6').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				} else if (options.score > 76) { //高分区间
					db.collection('questions').doc('b3a8af275fc26ef0002fcc234ec15066').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				} else { //否则是中分区间
					db.collection('questions').doc('f22b28525fc26edd005cc02538d94bbe').get({
						success: res => {
							this.setData({
								report: res.data.Quiz
							})
						},
						fail: err => {
							console.error('[questions] [查询记录] 失败：', err)
						}
					})
				}
				break
			/**
			 * ------------------------獭兔合拍------------------------
			 */
			case 'tatueHarmony':
				if (options.score == -1) {
					this.setData({
						scoreDis: false,
						report: 'Type:tatueHarmony;Score:' + options.scoreList + ';NickName:' + options.nickName
					})
				} else {
					this.setData({
						scoreDis: false,
						report: '{"Q":"你与' + options.nickName + '的匹配分是' + options.score + '分。<br>' + options.unharm + '<br>' + options.harm + '"}'
					})
				}
				break;
		}
	},
})
