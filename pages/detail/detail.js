const wxParser = require('../../wxParser/index')

Page( {
    onLoad: function(options) {
        var that = this
        var id = options.id

        wx.request({
            url: 'https://www.dapenti.com/blog/readapp2.asp?name=xilei&id=' + id,
            method: 'GET',
            success: function(res) {
                var body = res.data.replace(/(\t|\n)/g, '').
                                    replace(/<!.+?>/g, '').
                                    replace(/<(meta|html).+?>/g, '').
                                    replace(/<(title|script|style|ins)[\s\S]+?(title|script|style|ins)>/g, '').
                                    replace(/<(.+?)(\s.+)?>\s+?(&\w+;?|<br.+?>)?\s+?<\/\1>/g, '').trim()

                var title = ''
                var matchs = body.match(/<h2>【.+】(.+)<\/h2>/)
                if (matchs.length > 0) {
                    title = matchs[1]
                }
                wx.setNavigationBarTitle({
                    title: title
                })

                wxParser.parse({
                    bind: 'richText',
                    html: body,
                    target: that,
                    enablePreviewImage: true,
                    tapLink: (url) => {
                        wx.setClipboardData({
                            data: url,
                            success: function(res) {
                                wx.showToast({
                                    title: '链接已复制',
                                    icon: 'succes',
                                    duration: 1000,
                                    mask: true
                                })
                            }
                        })
                    }
                })
            },
            fail: function(err) {
                wx.showToast({
                    title: `文章加载失败，${err.errMsg}`,
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
            },
        })
    },
})
