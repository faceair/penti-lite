Page({
    data: {
        winWidth: 0,
        winHeight: 0,

        hidden: false,
        articles: [],
        currentPage: 0
    },

    onLoad: function (options) {
        var that = this

        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                })
            }
        })

        this.nextPage()
    },

    nextPage: function (e) {
        var that = this


        that.setData({
            hidden: false
        })

        var nextPage = this.data.currentPage + 1

        wx.request({
            url: 'https://appb.dapenti.com/index.php?s=/home/api/tugua/p/' + nextPage + '/limit/30',
            method: 'GET',
            success: function(res) {
                var data = res.data.data

                for (var i = 0; i < data.length; i++) {
                    var link = data[i]['link']
                    var title = data[i]['title']
                    var pubDate = data[i]['pubDate']

                    if (pubDate == '1970-01-01 08:00:00') {
                        var matchs = title.match(/(\d{4})(\d{2})(\d{2})/)
                        if (matchs.length > 0) {
                            pubDate = `${matchs[1]}-${matchs[2]}-${matchs[3]} 12:00:00`
                        }
                    }

                    var id = 0
                    var matchs = link.match(/(\d+)/)
                    if (matchs.length > 0) {
                        id = matchs[1]
                    }

                    data[i] = {
                        id: id,
                        title: title.replace(/【.+】/, ''),
                        pubDate: pubDate,
                        imgUrl: data[i]['imgurl'],
                    }
                }

                that.setData({
                    hidden: true,
                    articles: that.data.articles.concat(data),
                    currentPage: nextPage,
                })
            }
        })
    },

    showTip: function() {
        wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 500,
            mask: true
        })
    },
})
