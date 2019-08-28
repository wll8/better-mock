module.exports = {
  title: 'Better-Mock',
  description: 'Mock.js plus',
  themeConfig: {
    nav: [
      { text: '文档', link: '/document/' },
      { text: '更新日志', link: '/changelog/' },
      { text: 'Github', link: 'http://github.com/lavyun/better-mock' }
    ],
    sidebar: {
      '/document/': [
        ['/document/', '介绍'],
        ['/document/start', '开始 & 安装'],
        ['/document/syntax-specification', '语法规范'],
        ['/document/mock/', 'Mock.mock()'],
        ['/document/setup/', 'Mock.setup()'],
        {
          title: 'Mock.Random',
          children: [
            ['/document/random/basic', 'basic'],
            ['/document/random/date', 'date'],
            ['/document/random/image', 'image'],
            ['/document/random/color', 'color'],
            ['/document/random/text', 'text'],
            ['/document/random/name', 'name'],
            ['/document/random/web', 'web'],
            ['/document/random/address', 'address'],
            ['/document/random/helper', 'helper'],
            ['/document/random/miscellaneous', 'miscellaneous']
          ]
        },
        ['/document/valid/', 'Mock.valid()'],
        ['/document/toJSONSchema/', 'Mock.toJSONSchema()']
      ]
    }
  }
}