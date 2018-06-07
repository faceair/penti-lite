Page({
    data: {
        articles: [],
    },

    onLoad: function (options) {
        this.onPullDownRefresh()
    },

    onPullDownRefresh: function(){
        var that = this

        wx.request({
            url: 'https://appb.dapenti.com/index.php?s=/home/api/tugua/p/1/limit/30',
            method: 'GET',
            success: function(res) {
                var articles = res.data.data

                for (var i = 0; i < articles.length; i++) {
                    var link = articles[i]['link']
                    var title = articles[i]['title']
                    var pubDate = articles[i]['pubDate']

                    if (pubDate == '1970-01-01 08:00:00') {
                        var matches = title.match(/(\d{4})(\d{2})(\d{2})/)
                        if (matches.length > 0) {
                            pubDate = `${matches[1]}-${matches[2]}-${matches[3]} 12:00:00`
                        }
                    }

                    var id = 0
                    var matches = link.match(/(\d+)/)
                    if (matches.length > 0) {
                        id = matches[1]
                    }

                    articles[i] = {
                        id: id,
                        title: title.replace(/【.+】/, ''),
                        pubDate: pubDate,
                        imgUrl: articles[i]['imgurl'],
                    }
                }

                that.setData({
                    articles: articles,
                })
            },
            fail: function(err) {
                wx.showToast({
                    title: `首页加载失败，${err.errMsg}`,
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
            },
            complete: function() {
                wx.stopPullDownRefresh()
            }
        })
    },
})
