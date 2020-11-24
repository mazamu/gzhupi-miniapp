// components/rateStar.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		rateObject: {
			type: [Number, String],
			default: 0
		},
		readonly: {
			type: Boolean,
			default: false
		},
		score: {
			type: Number,
			default: 0,
			observer: function() {
				this.refresh()
      }
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		grayScore: 5,
		redScore: 0,
	},
	lifetimes: {
		attached: function () {
			// 在组件实例进入页面节点树时执行
			this.refresh()
		}
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		//重新渲染组件
		refresh()
		{
			if (this.data.readonly) {
				var _redScore = Math.floor(this.data.score)
				var _halfScore=0;
				if (this.data.score - _redScore > 0) {
					 _halfScore = 1
				}
				var _grayScore = 5 - _redScore - _halfScore
				this.setData({
					redScore: _redScore,
					halfScore: _halfScore,
					grayScore: _grayScore
				})
			}
		},

		giveScore(e) {
			if (this.data.readonly) {
				return;
			}
			var redIndex = e.currentTarget.dataset.redindex;
			var greyIndex = e.currentTarget.dataset.greyindex;

			var m_redScore = this.data.redScore;
			var m_grayScore = this.data.greyScore;

			if (greyIndex != undefined) {
				m_redScore += greyIndex + 1;
				m_grayScore = 5 - m_redScore;
			}
			if (redIndex != undefined) {
				m_redScore = redIndex + 1;
				m_grayScore = 5 - m_redScore;
			}

			this.setData({
				redScore: m_redScore,
				grayScore: m_grayScore
			})

			this.triggerEvent('change', {
				value: this.data.redScore,
				rateObj: this.properties.rateObject
			})
		},
	}
})